let showOnlyReviewsBiblio = false;

function filterByReview(data) {
  const result = {};
  for (const category in data) {
    const reviewedItems = data[category].filter(item => item.review);
    if (reviewedItems.length > 0) result[category] = reviewedItems;
  }
  return result;
}

// Reconstruit les données biblio en respectant le filtre "reviews" ET la recherche en cours
// (comportement aligné sur les autres pages : trier/filtrer ne perd plus la recherche active)
function biblioData() {
  var base = showOnlyReviewsBiblio ? filterByReview(books) : books;
  var q = document.getElementById('search-biblio').value;
  return q ? filterData(base, q) : base;
}

// ── Chargement des données ──
let books, films, series, games, musique, journal;
try { books = booksData; } catch(e) { books = {}; }
try { films = filmsData; } catch(e) { films = {}; }
try { series = seriesData; } catch(e) { series = {}; }
try { games = gamesData; } catch(e) { games = []; }
try { musique = musicData; } catch(e) { musique = {}; }
try { journal = Array.isArray(journalData) ? journalData : []; } catch(e) { journal = []; }
let ecransSearchQuery = '';

// ── Tri utilitaire ──
function sortDataKeys(data) {
  return Object.keys(data).sort(function(a, b) {
    var aClean = a.replace(' [completed]', '');
    var bClean = b.replace(' [completed]', '');
    
    if (data[b].length !== data[a].length) return data[b].length - data[a].length;
    var aN = data[a].map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    var bN = data[b].map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    var aA = aN.length ? aN.reduce(function(x, y) { return x + y; }, 0) / aN.length : 0;
    var bA = bN.length ? bN.reduce(function(x, y) { return x + y; }, 0) / bN.length : 0;
    return bA - aA || aClean.localeCompare(bClean);
  });
}

function sortEntriesByNote(entries) {
  return entries.slice().sort(function(a, b) {
    if (a.note === null && b.note === null) return a.title.localeCompare(b.title);
    if (a.note === null) return 1; if (b.note === null) return -1;
    return b.note - a.note;
  });
}

// ── Dark Mode Toggle ──
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  if (body.classList.contains('dark-mode')) {
    toggleBtn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    toggleBtn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
});

// ── Protection HTML ──
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ── Helper pour le badge de format musique ──
function getMusicFormatBadge(item) {
  var format = item.format ? item.format.toLowerCase() : 'album';
  if (format === 'album' || format === 'ep' || format === 'single' || format === 'mixtape') {
    return '<span class="music-format-badge">' + format + '</span>';
  }
  return '';
}

// ── Helper pour les badges de Collection (Archived, Bought, Re-watch/read) ──
function getCollectionBadges(item) {
  var badges = '';
  // On vérifie tous les tags possibles de re-conso
  var hasRewatch = item.tags && (
    item.tags.indexOf('re-watched') !== -1 || 
    item.tags.indexOf('re-read') !== -1 || 
    item.tags.indexOf('réécoute') !== -1 ||
    item.tags.indexOf('rejoué') !== -1
  );
  var hasBought = item.tags && item.tags.indexOf('bought') !== -1;
  var hasAr = item.tags && item.tags.indexOf('archived') !== -1;

  if (hasRewatch || hasBought || hasAr) {
    badges = '<div class="anime-badges">';
    // L'icône de rewatch (la petite flèche qui tourne)
    if (hasRewatch) badges += '<span class="anime-badge" title="re-watched"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></span>';
    // L'icône archived (le petit livre)
    if (hasAr) badges += '<span class="anime-badge" title="archived"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a9 9 0 0 1 9 9z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="9" x2="13" y2="9"/><line x1="9" y1="17" x2="15" y2="17"/></svg></span>';
    // L'icône bought (le petit sac)
    if (hasBought) badges += '<span class="anime-badge" title="bought"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>';
    badges += '</div>';
  }
  return badges;
}

// ── Helper pour le badge Intégrale ──
function getCreatorHeader(name, count) {
  var isIntegral = name.indexOf('[completed]') !== -1;
  var cleanName = name.replace(' [completed]', '');
  var arrow = '<span class="creator-arrow">▼</span>';
  
  if (isIntegral) {
    return '<h2 class="integral-title creator-toggle">' + cleanName + " ( " + count + " )" + ' <span class="integral-badge">Intégrale</span>' + arrow + '</h2>';
  } else {
    return '<h2 class="creator-toggle">' + cleanName + " ( " + count + " )" + arrow + '</h2>';
  }
}

// ── Review popup ──
document.addEventListener('click', function(e) {
  if (!e.target.classList.contains('review-btn')) return;
  e.preventDefault();
  e.stopPropagation();
  var reviewData = e.target.nextElementSibling;
  var titleData = e.target.closest('.book-card').querySelector('.book-title');
  document.getElementById('review-popup-title').textContent = titleData ? titleData.textContent : '';
  document.getElementById('review-popup-text').textContent = reviewData ? reviewData.textContent : '';
  document.getElementById('review-popup').classList.add('visible');
});

document.getElementById('review-popup').addEventListener('click', function(e) {
  if (e.target.id === 'review-popup' || e.target.id === 'review-popup-close') {
    document.getElementById('review-popup').classList.remove('visible');
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.getElementById('review-popup').classList.remove('visible');
});

// ── Système d'étoiles (gère les demis et les notes vides) ──
function getStars(note) {
  if (!note) return '';
  let stars = '★'.repeat(Math.floor(note));
  if (note % 1 !== 0) stars += '½'; 
  stars += '☆'.repeat(5 - Math.ceil(note)); 
  return stars;
}

// ── Helper pour l'ancienne note ──
function getOldNote(item) {
  if (item.oldNote !== undefined && item.oldNote !== null) {
    return '<div class="old-note">anciennement ' + item.oldNote + '/5</div>';
  }
  return '';
}

document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.sidebar nav').classList.toggle('open');
});

// ── Navigation ──
function navigateTo(page) {
  document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`).classList.add('active');

  var currentPage = document.querySelector('.page.active');
  var nextPage = document.getElementById('page-' + page);
  
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.animation = 'none';
  });
  
  nextPage.classList.add('active');
  nextPage.offsetHeight;
  nextPage.style.animation = 'pageFadeIn 0.3s ease';
    nextPage.setAttribute('tabindex', '-1');
  nextPage.focus({ preventScroll: true });
  document.querySelector('.sidebar nav').classList.remove('open');

  window.scrollTo({ top: 0, behavior: 'instant' });
  document.querySelector('.content').scrollTo({ top: 0, behavior: 'instant' });

  localStorage.setItem('activePage', page);
  
  if (page === 'home') initHome();
  if (page === 'bibliographie') {
    document.getElementById('bibliographyContent').dataset.initialized = '';
    document.getElementById('search-biblio').value = '';
    generateBibliography();
  }
  if (page === 'ecrans') {
    ecransSearchQuery = '';
    document.getElementById('search-ecrans').value = '';
    updateEcransCounter();

      var activeSubEcran = document.querySelector('.sub-nav-link.active').dataset.subpage;
      setupEcransSort(activeSubEcran);

    generateFilms();
  }
  if (page === 'jeux') {
    document.getElementById('search-jeux').value = '';
    generateGames();
  }
  if (page === 'musique') {
    document.getElementById('search-musique').value = '';
    generateMusique();
  }
  if (page === 'anime') {
    document.getElementById('search-anime').value = '';
    generateAnime();
  }
  if (page === 'manga') {
    document.getElementById('search-manga').value = '';
    generateManga();
  }
  if (page === 'statistiques') generateStats();
  if (page === 'apropos') {
    updateTamagotchiUI();
    renderCurrently(); // <-- On ajoute ça
  }

  budgieOnNavigate(page); // perruches passives : arrivée / retour au nid
}

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

// ── Citations ──
const quotes = [
  { text: "Ce que la névrose fait à un homme, elle le dépossède de son être.", author: "Moi" },
  { text: "Lorsque l'homme crée une oeuvre, il s'offre à elle.", author: "Moi" },
  { text: "Le vague à l'âme nous enivre.", author: "Moi" },
  { text: "Perdre son temps, c'est la plus merveilleuse façon de le gagner.", author: "Bernard Montangero" },
  { text: "Dès l'aurore, dis-toi d'avance : je vais rencontrer un indiscret, un ingrat, un insolent, un fourbe, un envieux, un égoïste.", author: "Marc-Aurèle" },
  { text: "L'ignorant affirme, le savant doute, le sage réfléchit.", author: "Aristote" },
  { text: "Nous vivons avec des idées qui, si nous les éprouvions vraiment, devraient bouleverser toute notre vie. - Le Mythe de Sisyphe", author: "Albert Camus" },
  { text: "Le sentiment du droit, la satisfaction d'avoir raison, la joie de s'estimer soi-même, cher monsieur, sont des ressorts puissants pour nous tenir debout ou nous faire avancer. - La Chute", author: "Albert Camus" },
  { text: "N'attendez pas le Jugement dernier. Il a lieu tous les jours. - La Chute", author: "Albert Camus" },
  { text: "La bêtise insiste toujours, on s'en apercevrait si l'on ne pensait pas toujours à soi.", author: "Albert Camus" },
  { text: "Quand une démocratie est malade, le fascisme vient toujours à son chevet, mais ce n'est jamais pour prendre de ses nouvelles.", author: "Albert Camus" },
  { text: "Mal nommer les choses, c'est ajouter au malheur du monde !", author: "Albert Camus" },
  { text: "Du moment qu'on meurt, comment et quand, cela n'importe pas, c'était évident. - L'Étranger", author: "Albert Camus" },
  { text: "Le conflit est générateur d'intelligence.", author: "Nietzsche" },
  { text: "Car de son vague ennui le néant les enivre, Car le plus lourd fardeau, c'est d'exister sans vivre. - Les Châtiments", author: "Victor Hugo" },
  { text: "Voyez Claude Gueux. Cerveau bien fait, coeur bien fait, sans nul doute. Mais le sort le met dans une société si mal faite qu'il finit par tuer. Qui est réellement coupable ? Est ce lui ? Est ce nous ? - Claude Gueux", author: "Victor Hugo" },
  { text: "Vous vous querellez après pour savoir si les boutons de la garde nationale doivent être blancs ou jaunes... le gros du peuple souffre ! Que vous l'appeliez république ou monarchie, le peuple souffre. - Claude Gueux", author: "Victor Hugo" },
  { text: "Démontez moi cette vieille échelle boiteuse des crimes et des peines, et refaites là. Refaites votre pénalité, refaites vos codes, refaites vos prisons, refaites vos juges. - Claude Gueux", author: "Victor Hugo" },
  { text: "Avec la solde de vos quatre-vingts bourreaux, vous paierez six cents maîtres d'écoles. - Claude Gueux", author: "Victor Hugo" },
  { text: "Or de ces pauvres têtes mal conformées, le premier tort est à la nature sans doute, le second à l'éducation. - Claude Gueux", author: "Victor Hugo" },
  { text: "Donnez au peuple qui travaille et qui souffre... la croyance à un meilleur monde fait pour lui. Il sera tranquille, il sera patient. La patience est faite d'espérance. - Claude Gueux", author: "Victor Hugo" },
  { text: "Cette tête de l'homme du peuple, cultivez-la, défrichez-la, arrosez-la, fécondez-la, éclairez-la, moralisez-la, utilisez-la ; vous n'aurez pas besoin de la couper. - Claude Gueux", author: "Victor Hugo" },
  { text: "Il faut se prêter aux autres et se donner a soi-même.", author: "Montaigne" },
  { text: "La simplicité est la sophistication suprême.", author: "Léonard de Vinci" },
  { text: "Mes moeurs sont celles de la solitude, et non point des hommes.", author: "Chateaubriand" },
  { text: "Le monde est un grand bal ou chacun porte un masque.", author: "Vauvenargues" },
  { text: "La tendresse a des secondes qui battent plus lentement que les autres.", author: "Romain Gary" },
  { text: "Ce n'est pas en éteignant les autres que l'on brille plus.", author: "Frédéric Delavier" },
  { text: "En général une mère aime davantage elle-même dans son fils que son fils lui même.", author: "Frédéric Delavier" },
  { text: "Si l'amitié unit les hommes miséreux, bien souvent elle disparaît quand l'un d'eux réussit.", author: "Frédéric Delavier" },
  { text: "La photographie, c'est la vérité et le cinéma, c'est vingt-quatre fois la vérité par seconde. - Le Petit Soldat", author: "Jean-Luc Godard" },
  { text: "Laugh and the world laughs with you. Weep and you weep alone. - Oldboy", author: "Park Chan-wook" },
  { text: "C'est un poète, c'est-à-dire qu'il est indispensable mais je ne sais pas à quoi. - Le Testament d'Orphée", author: "Jean Cocteau" },
  { text: "Vous passez votre temps à vous efforcer d'être, c'est ce qui vous empêche de vivre. - Le Testament d'Orphée", author: "Jean Cocteau" },
  { text: "Vous êtes accusé d'innocence, c'est à dire d'atteinte à la justice en étant capable et coupable de tous les crimes au lieu de l'être d'un seul... - Le Testament d'Orphée", author: "Jean Cocteau" },
  { text: "La commission rogatoire vous condamne préventivement à la peine de vivre. - Le Testament d'Orphée", author: "Jean Cocteau" },
  { text: "Nous ne pouvons être condamnés à pire, à juger les autres, à être des juges. - Le Testament d'Orphée", author: "Jean Cocteau" },
  { text: "Sans la désobéissance que feraient les enfants et les artistes. - Le Testament d'Orphée", author: "Jean Cocteau" },
  { text: "C'est seulement à cause de leur stupidité qu'ils peuvent être aussi sûr d'eux. - Le Procès", author: "Kafka" },
  { text: "Il y a des moments où je suis convaincu que je suis inapte à toute relation humaine.", author: "Kafka" },
  { text: "J'ai passé ma vie à me défendre de l'envie d'y mettre fin.", author: "Kafka" },
  { text: "J'ai eu honte de moi quand j'ai réalisé que la vie était une fête costumée, et que j'y ai assisté avec mon vrai visage.", author: "Kafka" },
  { text: "Raconter tout au long comment j'ai manqué ma vie en me déshabituant de vivre, en rageant sans cesse dans mon sous-sol, non vraiment, ce n'est pas intéressant. - Sous-sol", author: "Dostoïevski" },
  { text: "La vie réelle à laquelle je n'étais pas habitué, m'oppressait tellement que j'en étouffais. - Sous-sol", author: "Dostoïevski" },
  { text: "Isole-toi autant que tu veux pour devenir plus fort, même si tu vois que la solitude est un enfer insupportable, elle vaut beaucoup mieux que les multiples masques des humains.", author: "Dostoïevski" },
  { text: "Des années d'amour ont été effacées par la haine d'une seule minute.", author: "Edgar Allan Poe" },
  { text: "La personne qui saisit chaque occasion de s'en prendre aux autres est souvent qualifiée à tort de sadique. En réalité, cette personne est un masochiste mal orienté qui travaille à sa propre destruction...", author: "Anton Lavey" },
  { text: "Dans les démocraties, chaque génération est un peuple nouveau.", author: "Tocqueville" },
  { text: "Mon Dieu ! mon Dieu ! je vais mourir... Ce coeur avide et capable d'amour va bientôt cesser de battre... Est-il possible qu'il se taise à jamais sans avoir une seule fois connu le bonheur. - Le Journal d'un homme de trop", author: "Ivan Turgenev" },
  { text: "Non, le vrai chercheur, celui qui a vraiment le désir de trouver, ne devrait embrasser aucune doctrine. - Siddhartha", author: "Hermann Hesse" },
  { text: "Vous qui entrez, laissez toute espérance. - L'Enfer, Chant III", author: "Dante" },
  { text: "Can you remember who you were, before the world told you who you should be?", author: "Charles Bukowski" },
  { text: "La valeur de l'homme ne réside pas dans la vérité qu'il possède, ou qu'il croit posséder, mais dans la peine sincère qu'il assume en la cherchant...", author: "Gotthold Ephraim Lessing" },
  { text: "Nous assistons à ce spectacle infâme, des hommes perdus de dettes et de crimes dont on proclame l'innocence, tandis qu'on frappe l'honneur même... Quand une société en est là, elle tombe en décomposition. - J'accuse!", author: "Emile Zola" },
  { text: "Quand on enferme la vérité sous terre, elle s'y amasse, elle y prend une force telle d'explosion, que, le jour où elle éclate, elle fait tout sauter avec elle. - J'accuse!", author: "Emile Zola" },
  { text: "Je n'ai qu'une passion, celle de la lumière, au nom de l'humanité qui a tant souffert et qui a droit au bonheur. - J'accuse!", author: "Emile Zola" },
  { text: "Qu'ai-je fais ici bas ? J'étais fait pour vivre, et je meurs sans avoir vécu. - Les Rêveries du promeneur solitaire", author: "Jean-Jacques Rousseau" },
  { text: "Les petites privations s'endurent sans peine quand le coeur est mieux traité que le corps. - Les Rêveries du promeneur solitaire", author: "Jean-Jacques Rousseau" },
  { text: "La religion est l'opium du peuple. - Critique de la philosophie du droit de Hegel", author: "Karl Marx" },
  { text: "Ne nous suicidons pas tout de suite, il y a encore quelqu'un à décevoir.", author: "Cioran" },
  { text: "Ce qui distingue l'homme de l'animal c'est la raison ; confiné dans le présent, il se reporte vers le passé et songe à l'avenir : de là sa prudence, ses soucis, ses appréhensions fréquentes. - Essai sur les femmes", author: "Schopenhauer" },
  { text: "Annihilation has no terrors for me, because I have already tried it before I was born... - The Autobiography of Mark Twain", author: "Mark Twain" },
  { text: "Ne plus rien vouloir. Attendre jusqu'à ce qu'il n'y ait plus rien à attendre. [...] Ce sera devant toi, au fil du temps, une vie immobile, sans crise, sans désordre... - Un homme qui dort", author: "Georges Perec" },
  { text: "Tu n'as rien appris, sinon que la solitude n'apprend rien, que l'indifférence n'apprend rien: c'était un leurre, une illusion fascinante et piégée... - Un homme qui dort", author: "Georges Perec" },
  { text: "Notre être tout entier n'est qu'une lutte contre les forces obscures qui sont en nous. Vivre c'est faire la guerre dans notre coeur et notre âme. Écrire, c'est de juger soi-meme.", author: "Henrik Ibsen" },
  { text: "La plupart des gens préfèrent s'accrocher à des idées et des principes. Ils ont secrètement peur de l'incertain et de l'inconnu. Ils remplacent la curiosité par la conviction.", author: "Robert Greene" },
  { text: "C'est un garçon sans importance collective, c'est tout juste un individu. - La Nausée", author: "Jean-Paul Sartre" },
  { text: "L'absurde naît de cette confrontation entre l'appel humain et le silence déraisonnable du monde.", author: "Albert Camus" },
  { text: "J'étais un enfant, ce monstre que les adultes fabriquent avec leurs regrets.", author: "Sartre" },
  { text: "L'ironie est le premier signe que la conscience prend conscience d'elle même.", author: "Fernando Pessoa" },
  { text: "On peut douter de tout sauf de la mort.", author: "Cioran" },
  { text: "La science peut seule éveiller dans les âmes, à défaut du soleil, l'astre de la raison.", author: "Lucrece" },
  { text: "La justice sans la force est impuissante, la force sans la justice est tyrannique.", author: "Blaise Pascal" }
];

// ── Moteur de recherche ──
function filterData(data, query) {
  if (!query) return data; 
  const normalize = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[''`']/g, "");
  const q = normalize(query);
  
  // Si c'est une liste plate (comme les jeux), on filtre directement dedans
  if (Array.isArray(data)) {
    return data.filter(item => {
      const matchTitle = normalize(item.title).includes(q);
      const matchEngTitle = item.englishTitle != null && normalize(item.englishTitle).includes(q);
      return matchTitle || matchEngTitle;
    });
  }

  // Sinon, on filtre par catégorie (comme avant)
  const result = {};
  for (const category in data) {
    const matchCategory = normalize(category).includes(q);
    const filteredItems = data[category].filter(item => {
      const matchTitle = normalize(item.title).includes(q);
      const matchEngTitle = item.englishTitle != null && normalize(item.englishTitle).includes(q);
      return matchTitle || matchEngTitle || matchCategory;
    });
    if (filteredItems.length > 0) result[category] = filteredItems;
  }
  return result;
}

// ── Generate Bibliography ──
function generateBibliography(data = books, isSearch = false) {
  const container = document.getElementById('bibliographyContent');

  // --- FILTRES & BARRE COLLECTION BIBLIO ---
  var bF = document.getElementById('biblio-filters');
  if (bF) {
    bF.innerHTML = '';
    var collCounts = { 're-read': 0, 'bought': 0, 'archived': 0 };
    var hasReview = false;
    for (var aut in books) {
      books[aut].forEach(function(b) {
        if (b.review) hasReview = true;
        if (b.tags) b.tags.forEach(function(t) { if (collCounts[t] !== undefined) collCounts[t]++; });
      });
    }
    var topRow = document.createElement('div');
    topRow.style.cssText = 'display: flex; gap: 8px; justify-content: center; margin-bottom: 10px;';
    var allBtn = document.createElement('button');
    allBtn.className = 'anime-tag-btn' + (biblioCollectionFilters.length === 0 && !showOnlyReviewsBiblio ? ' active' : '');
    allBtn.textContent = 'tous';
    allBtn.addEventListener('click', function() { biblioCollectionFilters = []; showOnlyReviewsBiblio = false; savePrefs('bibliographie', { tags: biblioCollectionFilters, reviews: showOnlyReviewsBiblio }); generateBibliography(biblioData(), !!document.getElementById('search-biblio').value); });
    topRow.appendChild(allBtn);

    if (hasReview) {
      var reviewBtn = document.createElement('button');
      reviewBtn.className = 'anime-tag-btn' + (showOnlyReviewsBiblio ? ' active' : '');
      reviewBtn.textContent = 'reviews';
      reviewBtn.addEventListener('click', function() {
        showOnlyReviewsBiblio = !showOnlyReviewsBiblio;
        savePrefs('bibliographie', { reviews: showOnlyReviewsBiblio });
        generateBibliography(biblioData(), !!document.getElementById('search-biblio').value);
      });
      topRow.appendChild(reviewBtn);
    }
    bF.appendChild(topRow);

    var collSection = document.createElement('div'); collSection.className = 'anime-tag-section';
    var collLabel = document.createElement('div'); collLabel.className = 'anime-tag-section-label'; collLabel.textContent = 'collection'; collSection.appendChild(collLabel);
    var collWrap = document.createElement('div'); collWrap.className = 'anime-tag-section-tags';
    
    for (var tag in collCounts) {
      if (collCounts[tag] > 0) {
        var btn = document.createElement('button');
        btn.className = 'anime-tag-btn' + (biblioCollectionFilters.indexOf(tag) !== -1 ? ' active' : '');
        btn.textContent = tag + ' (' + collCounts[tag] + ')';
        btn.addEventListener('click', function(t) { return function() { biblioCollectionFilters = toggleArr(biblioCollectionFilters, t); savePrefs('bibliographie', { tags: biblioCollectionFilters }); generateBibliography(biblioData(), !!document.getElementById('search-biblio').value); }; }(tag));
        collWrap.appendChild(btn);
      }
    }
    if (collWrap.children.length > 0) { collSection.appendChild(collWrap); bF.appendChild(collSection); }
  }

  var bBar = document.getElementById('biblio-project-bar');
  if (bBar) {
    var rereadCount = 0; var totalB = 0;
    for (var a in books) {
      books[a].forEach(function(b) {
        totalB++;
        if (b.tags && b.tags.indexOf('re-read') !== -1) rereadCount++;
      });
    }
    if (totalB > 0) {
      var pct = (rereadCount / totalB * 100).toFixed(1);
      bBar.innerHTML = '<div class="project-bar"><span class="project-label">projet relecture : ' + rereadCount + ' / ' + totalB + ' (' + pct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + pct + '%"></div></div></div>';
    } else { bBar.innerHTML = ''; }
  }

  if (biblioCollectionFilters.length) {
    var filteredBiblio = {};
    for (var auth in data) {
      var validBooks = data[auth].filter(function(b) {
        return b.tags && biblioCollectionFilters.some(function(t) { return b.tags.indexOf(t) !== -1; });
      });
      if (validBooks.length > 0) filteredBiblio[auth] = validBooks;
    }
    data = filteredBiblio;
  }

  // Compteur : calculé APRÈS application du filtre collection (sinon il affiche le total non filtré)
  let totalBooks = 0;
  for (const author in data) totalBooks += data[author].length;
  let globalTotalBooks = 0;
  for (const a in books) globalTotalBooks += books[a].length;

  let label;
  if (isSearch || biblioCollectionFilters.length) {
    label = totalBooks + " / " + globalTotalBooks + " livre" + (globalTotalBooks !== 1 ? "s" : "");
  } else if (showOnlyReviewsBiblio) {
    label = totalBooks + " / " + globalTotalBooks + " review" + (globalTotalBooks !== 1 ? "s" : "");
  } else {
    label = totalBooks + " livre" + (totalBooks !== 1 ? "s" : "") + " lu" + (totalBooks !== 1 ? "s" : "");
  }

  document.getElementById('biblio-counter').textContent = label;

    // Tri Bibliographie
  var sortContainer = document.getElementById('biblio-sort');
  sortContainer.innerHTML = '<span class="anime-sort-label">tri :</span>';
  ['auteur', 'note', 'titre'].forEach(function(mode) {
    var btn = document.createElement('button');
    var internalMode = mode === 'titre' ? 'alpha' : mode;
    btn.className = 'anime-sort-btn' + (biblioSortMode === internalMode ? ' active' : '');
    btn.textContent = mode;
    btn.addEventListener('click', function() {
      if (biblioSortMode === internalMode && internalMode !== 'auteur') {
        biblioSortDir *= -1;
      } else {
        biblioSortMode = internalMode;
        biblioSortDir = 1;
      }
      savePrefs('bibliographie', { sortMode: biblioSortMode, sortDir: biblioSortDir });
      sortContainer.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('bibliographyContent').dataset.initialized = '';
      
      // On régénère en respectant le mode "reviews" ET la recherche en cours
      generateBibliography(biblioData(), !!document.getElementById('search-biblio').value);
    });
    sortContainer.appendChild(btn);
  });

  // --- VUE GLOBALE BIBLIO ---
  if (biblioSortMode !== 'auteur') {
    var allBooks = [];
    for (var author in data) {
      data[author].forEach(function(book) { allBooks.push(book); });
    }

    allBooks.sort(function(a, b) {
      if (biblioSortMode === 'note') {
        if (a.note === null && b.note === null) return (a.title.localeCompare(b.title)) * biblioSortDir;
        if (a.note === null) return 1; if (b.note === null) return -1;
        return (b.note - a.note) * biblioSortDir;
      } else {
        return (a.title.localeCompare(b.title)) * biblioSortDir;
      }
    });

    if (allBooks.length === 0) {
      container.innerHTML = '<p class="empty-state">aucun résultat</p>';
      return;
    }

    var div = document.createElement('div'); div.className = 'books';
    allBooks.forEach(function(book) {
      var starsHtml = book.note !== null ? '<div class="book-meta">' + getStars(book.note) + '</div>' : '';
      var reviewHtml = book.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(book.review) + '</span>' : '';
      
      var card = document.createElement('a');
      card.href = book.link; card.target = "_blank"; card.className = 'book-card';
      card.innerHTML = '<img loading="lazy" src="' + book.cover + '" alt="' + book.title + '">' + getCollectionBadges(book) + '<div class="book-title">' + book.title + '</div>' + starsHtml + getOldNote(book) + reviewHtml;
      div.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(div);
    return; 
  }

  if (!container.dataset.initialized) {
    container.innerHTML = '';

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteDiv = document.createElement('div');
    quoteDiv.className = 'random-quote';
    quoteDiv.innerHTML = `« ${randomQuote.text} » <span class="quote-author">— ${randomQuote.author}</span>`;
    container.appendChild(quoteDiv);

    const listDiv = document.createElement('div');
    listDiv.id = 'authors-list';
    container.appendChild(listDiv);

    container.dataset.initialized = "true";
  }

  const listContainer = document.getElementById('authors-list');
  listContainer.innerHTML = '';

  var sortedAuthors = sortDataKeys(data);
  if (sortedAuthors.length === 0) {
    listContainer.innerHTML = '<p class="empty-state">aucun résultat</p>';
    return;
  }

  sortedAuthors.forEach(function(author) {
    listContainer.insertAdjacentHTML('beforeend', getCreatorHeader(author, data[author].length));

    const notesValides = data[author].map(b => b.note).filter(n => n !== null);
    if (notesValides.length > 1) {
      const moyenne = (notesValides.reduce((acc, note) => acc + note, 0) / notesValides.length).toFixed(1);
      const avgDiv = document.createElement('div');
      avgDiv.className = 'show-average';
      avgDiv.textContent = "moyenne : " + moyenne;
      listContainer.appendChild(avgDiv);
    }

    const booksDiv = document.createElement('div');
    booksDiv.className = 'books';

    sortEntriesByNote(data[author]).forEach(function(book) {
      const card = document.createElement('a');
      card.href = book.link;
      card.target = "_blank";
      card.className = 'book-card';
      
      const starsHtml = book.note !== null ? `<div class="book-meta">${getStars(book.note)}</div>` : '';
      
      var reviewHtml = book.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(book.review) + '</span>' : '';
      card.innerHTML = `
        <img loading="lazy" src="${book.cover}" alt="${book.title}">
        ${getCollectionBadges(book)}
        <div class="book-title">${book.title}</div>
        ${starsHtml}\n
        ${getOldNote(book)}\n
        ${reviewHtml}
      `;
      booksDiv.appendChild(card);
    });

    listContainer.appendChild(booksDiv);
  });
}

function setupEcransSort(subpage) {
  var sortContainer = document.getElementById('ecrans-sort');
  sortContainer.innerHTML = '<span class="anime-sort-label">tri :</span>';
  
  // Si on est sur Séries, on enlève le bouton "titre"
  var modes = subpage === 'series' 
    ? ['série', 'note'] 
    : ['réalisateur', 'note', 'titre'];
    
  modes.forEach(function(mode) {
    // On fait correspondre "série" à "réalisateur" en interne pour pas casser le code
    var internalMode = mode === 'titre' ? 'alpha' : (mode === 'série' ? 'réalisateur' : mode);
    
    var btn = document.createElement('button');
    btn.className = 'anime-sort-btn' + (ecransSortMode === internalMode ? ' active' : '');
    btn.textContent = mode;
    btn.addEventListener('click', function() {
      if (ecransSortMode === internalMode && internalMode !== 'réalisateur') {
        ecransSortDir *= -1;
      } else {
        ecransSortMode = internalMode;
        ecransSortDir = 1;
      }
      savePrefs('films', { sortMode: ecransSortMode, sortDir: ecransSortDir });
      document.querySelectorAll('#ecrans-sort .anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      
      if (subpage === 'films') generateFilms();
      else if (subpage === 'series') generateSeries();
    });
    sortContainer.appendChild(btn);
  });
}

// ── Sous-navigation Écrans ──
document.querySelectorAll('.sub-nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const subpage = link.dataset.subpage;

    setupEcransSort(subpage);

    document.querySelectorAll('.sub-nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    document.querySelectorAll('.sub-page').forEach(p => p.classList.remove('active'));
    document.getElementById('subpage-' + subpage).classList.add('active');

    const filteredFilms = filterData(films, ecransSearchQuery);
    const filteredSeries = filterData(series, ecransSearchQuery);
    const isSearch = !!ecransSearchQuery;

    let totalFilms = Object.values(filteredFilms).reduce((acc, arr) => acc + arr.length, 0);
    let totalSeries = Object.values(filteredSeries).reduce((acc, arr) => acc + arr.length, 0);
    let globalFilms = Object.values(films).reduce((acc, arr) => acc + arr.length, 0);
    let globalSeries = Object.values(series).reduce((acc, arr) => acc + arr.length, 0);
    
    let isFilmsFiltered = isSearch || filmsFormatFilters.length || filmsCollectionFilters.length;
    let isSeriesFiltered = isSearch || seriesCollectionFilters.length;
    
    let textFilms = isFilmsFiltered ? totalFilms + " / " + globalFilms + " film" + (globalFilms !== 1 ? "s" : "") : globalFilms + " film" + (globalFilms !== 1 ? "s" : "") + " vu" + (globalFilms !== 1 ? "s" : "");
    let textSeries = isSeriesFiltered ? totalSeries + " / " + globalSeries + " saison" + (globalSeries !== 1 ? "s" : "") : globalSeries + " saison" + (globalSeries !== 1 ? "s" : "") + " suivie" + (globalSeries !== 1 ? "s" : "");
    document.getElementById('ecrans-counter').textContent = textFilms + " • " + textSeries;

    if (subpage === 'films') generateFilms(filteredFilms, isSearch);
    if (subpage === 'series') generateSeries(filteredSeries, isSearch);
  });
});

// ── Compteur Écrans ──
function updateEcransCounter(filmsData = films, seriesData = series, isSearch = false) {
  let totalFilms = Object.values(filmsData).reduce((acc, arr) => acc + arr.length, 0);
  let totalSeries = Object.keys(seriesData).length;

  let textFilms = isSearch
    ? totalFilms + " film" + (totalFilms !== 1 ? "s" : "") + " trouvé" + (totalFilms !== 1 ? "s" : "")
    : totalFilms + " film" + (totalFilms !== 1 ? "s" : "") + " vu" + (totalFilms !== 1 ? "s" : "");
  let textSeries = isSearch
    ? totalSeries + " série" + (totalSeries !== 1 ? "s" : "") + " trouvée" + (totalSeries !== 1 ? "s" : "")
    : totalSeries + " série" + (totalSeries !== 1 ? "s" : "") + " suivie" + (totalSeries !== 1 ? "s" : "");

  document.getElementById('ecrans-counter').textContent = textFilms + " • " + textSeries;
}

// ── Generate Films ──
function generateFilms(data = films, isSearch = false) {
  const container = document.getElementById('filmsContent');

  var shortCount = 0;
  var featureCount = 0;
  for (var director in films) {
    films[director].forEach(function(movie) {
      if (movie.tags && movie.tags.indexOf('court métrage') !== -1) shortCount++;
      else featureCount++;
    });
  }

  var fC = document.getElementById('films-filters');
  if (fC) {
    fC.innerHTML = '';
    
    var row1 = document.createElement('div'); 
    row1.style.cssText = 'display: flex; gap: 8px; justify-content: center; margin-bottom: 10px;';
    
    var allBtn = document.createElement('button');
    allBtn.className = 'anime-tag-btn' + (filmsFormatFilters.length === 0 && filmsCollectionFilters.length === 0 ? ' active' : '');
    allBtn.textContent = 'tous (' + (shortCount + featureCount) + ')';
    allBtn.addEventListener('click', function() { 
      filmsFormatFilters = []; 
      filmsCollectionFilters = []; 
      savePrefs('films', { tags: filmsCollectionFilters, formats: filmsFormatFilters });
      generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); 
    });
    row1.appendChild(allBtn);
    fC.appendChild(row1);

    var fmtSection = document.createElement('div'); fmtSection.className = 'anime-tag-section';
    var fmtLabel = document.createElement('div'); fmtLabel.className = 'anime-tag-section-label'; fmtLabel.textContent = 'format'; fmtSection.appendChild(fmtLabel);
    var fmtWrap = document.createElement('div'); fmtWrap.className = 'anime-tag-section-tags';
    if (featureCount > 0) {
      var featBtn = document.createElement('button');
      featBtn.className = 'anime-tag-btn' + (filmsFormatFilters.indexOf('long') !== -1 ? ' active' : '');
      featBtn.textContent = 'longs métrages (' + featureCount + ')';
      featBtn.addEventListener('click', function() { filmsFormatFilters = toggleArr(filmsFormatFilters, 'long'); savePrefs('films', { formats: filmsFormatFilters }); generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); });
      fmtWrap.appendChild(featBtn);
    }
    if (shortCount > 0) {
      var shortBtn = document.createElement('button');
      shortBtn.className = 'anime-tag-btn' + (filmsFormatFilters.indexOf('court') !== -1 ? ' active' : '');
      shortBtn.textContent = 'courts métrages (' + shortCount + ')';
      shortBtn.addEventListener('click', function() { filmsFormatFilters = toggleArr(filmsFormatFilters, 'court'); savePrefs('films', { formats: filmsFormatFilters }); generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); });
      fmtWrap.appendChild(shortBtn);
    }
    if (fmtWrap.children.length > 0) { fmtSection.appendChild(fmtWrap); fC.appendChild(fmtSection); }

    // SECTION GENRE FILMS
    var fGenreCounts = { 'documentaire': 0 };
    for (var dG in films) {
      films[dG].forEach(function(mG) {
        if (mG.tags) mG.tags.forEach(function(t) { if (fGenreCounts[t] !== undefined) fGenreCounts[t]++; });
      });
    }
    var fGenreSection = document.createElement('div'); fGenreSection.className = 'anime-tag-section';
    var fGenreLabel = document.createElement('div'); fGenreLabel.className = 'anime-tag-section-label'; fGenreLabel.textContent = 'genre'; fGenreSection.appendChild(fGenreLabel);
    var fGenreWrap = document.createElement('div'); fGenreWrap.className = 'anime-tag-section-tags';
    for (var fGT in fGenreCounts) {
      if (fGenreCounts[fGT] > 0) {
        var fGBTn = document.createElement('button');
        fGBTn.className = 'anime-tag-btn' + (filmsCollectionFilters.indexOf(fGT) !== -1 ? ' active' : '');
        fGBTn.textContent = fGT + ' (' + fGenreCounts[fGT] + ')';
        fGBTn.addEventListener('click', function(t) { return function() { filmsCollectionFilters = toggleArr(filmsCollectionFilters, t); savePrefs('films', { tags: filmsCollectionFilters }); generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); }; }(fGT));
        fGenreWrap.appendChild(fGBTn);
      }
    }
    if (fGenreWrap.children.length > 0) { fGenreSection.appendChild(fGenreWrap); fC.appendChild(fGenreSection); }

    // SECTION COLLECTION FILMS
    var fCollCounts = { 're-watched': 0, 'archived': 0, 'bought': 0 };
    for (var d in films) {
      films[d].forEach(function(m) {
        if (m.tags) m.tags.forEach(function(t) { if (fCollCounts[t] !== undefined) fCollCounts[t]++; });
      });
    }
    var fCollSection = document.createElement('div'); fCollSection.className = 'anime-tag-section';
    var fCollLabel = document.createElement('div'); fCollLabel.className = 'anime-tag-section-label'; fCollLabel.textContent = 'collection'; fCollSection.appendChild(fCollLabel);
    var fCollWrap = document.createElement('div'); fCollWrap.className = 'anime-tag-section-tags';
    for (var fTag in fCollCounts) {
      if (fCollCounts[fTag] > 0) {
        var fBtn = document.createElement('button');
        fBtn.className = 'anime-tag-btn' + (filmsCollectionFilters.indexOf(fTag) !== -1 ? ' active' : '');
        fBtn.textContent = fTag + ' (' + fCollCounts[fTag] + ')';
        fBtn.addEventListener('click', function(t) { return function() { filmsCollectionFilters = toggleArr(filmsCollectionFilters, t); savePrefs('films', { tags: filmsCollectionFilters }); generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); }; }(fTag));
        fCollWrap.appendChild(fBtn);
      }
    }
    if (fCollWrap.children.length > 0) { fCollSection.appendChild(fCollWrap); fC.appendChild(fCollSection); }

    // SECTION QUALITÉ FILMS
    var fQualCounts = { 'coup de coeur': 0 };
    for (var d2 in films) {
      films[d2].forEach(function(m2) {
        if (m2.tags) m2.tags.forEach(function(t) { if (fQualCounts[t] !== undefined) fQualCounts[t]++; });
      });
    }
    var fQualSection = document.createElement('div'); fQualSection.className = 'anime-tag-section';
    var fQualLabel = document.createElement('div'); fQualLabel.className = 'anime-tag-section-label'; fQualLabel.textContent = 'qualité'; fQualSection.appendChild(fQualLabel);
    var fQualWrap = document.createElement('div'); fQualWrap.className = 'anime-tag-section-tags';
    for (var fQualTag in fQualCounts) {
      if (fQualCounts[fQualTag] > 0) {
        var fQualBtn = document.createElement('button');
        fQualBtn.className = 'anime-tag-btn quality-tag' + (filmsCollectionFilters.indexOf(fQualTag) !== -1 ? ' active' : '');
        fQualBtn.textContent = fQualTag + ' (' + fQualCounts[fQualTag] + ')';
        fQualBtn.addEventListener('click', function(t) { return function() { filmsCollectionFilters = toggleArr(filmsCollectionFilters, t); savePrefs('films', { tags: filmsCollectionFilters }); generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); }; }(fQualTag));
        fQualWrap.appendChild(fQualBtn);
      }
    }
    if (fQualWrap.children.length > 0) { fQualSection.appendChild(fQualWrap); fC.appendChild(fQualSection); }
  }

  if (filmsFormatFilters.length || filmsCollectionFilters.length) {
    var filteredData = {};
    for (var director in data) {
      var validMovies = data[director].filter(function(movie) {
        var isShort = movie.tags && movie.tags.indexOf('court métrage') !== -1;
        var fmtOk = filmsFormatFilters.length === 0 || filmsFormatFilters.some(function(f) { return f === 'court' ? isShort : !isShort; });
        var collOk = filmsCollectionFilters.length === 0 || (movie.tags && filmsCollectionFilters.some(function(t) { return movie.tags.indexOf(t) !== -1; }));
        return fmtOk && collOk;
      });
      if (validMovies.length > 0) filteredData[director] = validMovies;
    }
    data = filteredData;
  }

  var fCount = Object.values(data).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var fGlobal = Object.values(films).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var isFilt = isSearch || filmsFormatFilters.length || filmsCollectionFilters.length;
  var tFilms = isFilt ? fCount + " / " + fGlobal + " film" + (fGlobal !== 1 ? "s" : "") : fGlobal + " film" + (fGlobal !== 1 ? "s" : "") + " vu" + (fGlobal !== 1 ? "s" : "");

  var sBase = filterData(series, ecransSearchQuery); // la part séries du compteur doit tenir compte de la recherche
  var sCount = Object.values(sBase).reduce(function(acc, arr) { 
    return acc + (seriesCollectionFilters.length ? arr.filter(function(s) { return s.tags && seriesCollectionFilters.some(function(t) { return s.tags.indexOf(t) !== -1; }); }).length : arr.length); 
  }, 0);
  var sGlobal = Object.values(series).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var tSeries = (isSearch || seriesCollectionFilters.length) ? sCount + " / " + sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") : sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") + " suivie" + (sGlobal !== 1 ? "s" : "");

  document.getElementById('ecrans-counter').textContent = tFilms + " • " + tSeries;

  var fBar = document.getElementById('ecrans-project-bar');
  if (fBar) {
    var fRewatchCount = 0; var fTotal = 0;
    for (var dir in films) {
      films[dir].forEach(function(m) {
        fTotal++;
        if (m.tags && m.tags.indexOf('re-watched') !== -1) fRewatchCount++;
      });
    }
    if (fTotal > 0) {
      var fPct = (fRewatchCount / fTotal * 100).toFixed(1);
      fBar.innerHTML = '<div class="project-bar"><span class="project-label">projet revisionnage : ' + fRewatchCount + ' / ' + fTotal + ' (' + fPct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + fPct + '%"></div></div></div>';
    } else { fBar.innerHTML = ''; }
  }

  if (ecransSortMode !== 'réalisateur') {
    var allMovies = [];
    for (var dir in data) {
      data[dir].forEach(function(movie) { allMovies.push(movie); });
    }
    allMovies.sort(function(a, b) {
      if (ecransSortMode === 'note') {
        if (a.note === null && b.note === null) return (a.title.localeCompare(b.title)) * ecransSortDir;
        if (a.note === null) return 1; if (b.note === null) return -1;
        return (b.note - a.note) * ecransSortDir;
      } else {
        return (a.title.localeCompare(b.title)) * ecransSortDir;
      }
    });
    if (allMovies.length === 0) { container.innerHTML = '<p class="empty-state">aucun résultat</p>'; return; }
    var div = document.createElement('div'); div.className = 'books';
    allMovies.forEach(function(movie) {
      var starsHtml = movie.note !== null ? '<div class="book-meta">' + getStars(movie.note) + '</div>' : '';
      var reviewHtml = movie.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(movie.review) + '</span>' : '';
      if (movie.tags && movie.tags.indexOf('coup de coeur') !== -1) var cdcClass = ' coup-de-coeur-card'; else var cdcClass = '';
      var card = document.createElement('a');
      card.href = movie.link; card.target = "_blank"; card.className = 'book-card' + cdcClass;
      card.innerHTML = '<img loading="lazy" src="' + movie.cover + '" alt="' + movie.title + '">' + getFilmFormatBadge(movie) + getCollectionBadges(movie) + '<div class="book-title">' + movie.title + '</div>' + starsHtml + getOldNote(movie) + reviewHtml;
      div.appendChild(card);
    });
    container.innerHTML = '';
    container.appendChild(div);
    return; 
  }

  container.innerHTML = '';
  if (sortDataKeys(data).length === 0) { container.innerHTML = '<p class="empty-state">aucun résultat</p>'; return; }

  sortDataKeys(data).forEach(function(director) {
    container.insertAdjacentHTML('beforeend', getCreatorHeader(director, data[director].length));
    const notesValides = data[director].map(m => m.note).filter(n => n !== null);
    if (notesValides.length > 1) {
      const moyenne = (notesValides.reduce((acc, note) => acc + note, 0) / notesValides.length).toFixed(1);
      const avgDiv = document.createElement('div');
      avgDiv.className = 'show-average'; avgDiv.textContent = "moyenne : " + moyenne;
      container.appendChild(avgDiv);
    }
    const div = document.createElement('div'); div.className = 'books';
    sortEntriesByNote(data[director]).forEach(function(movie) {
      const card = document.createElement('a');
      card.href = movie.link; card.target = "_blank"; card.className = 'book-card';
      const starsHtml = movie.note !== null ? `<div class="book-meta">${getStars(movie.note)}</div>` : '';
      if (movie.tags && movie.tags.indexOf('coup de coeur') !== -1) card.className += ' coup-de-coeur-card';
      var reviewHtml = movie.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(movie.review) + '</span>' : '';
      card.innerHTML = `<img loading="lazy" src="${movie.cover}" alt="${movie.title}">${getFilmFormatBadge(movie)}${getCollectionBadges(movie)}<div class="book-title">${movie.title}</div>${starsHtml}${getOldNote(movie)}${reviewHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

// ── Generate Séries ──
function generateSeries(data = series, isSearch = false) {
  const container = document.getElementById('seriesContent');

  var sF = document.getElementById('series-filters');
  if (sF) {
    sF.innerHTML = '';
    var sCollCounts = { 're-watched': 0, 'archived': 0 };
    for (var show in series) {
      series[show].forEach(function(s) {
        if (s.tags) s.tags.forEach(function(t) { if (sCollCounts[t] !== undefined) sCollCounts[t]++; });
      });
    }
    var sTopRow = document.createElement('div');
    sTopRow.style.cssText = 'display: flex; gap: 8px; justify-content: center; margin-bottom: 10px;';
    var sAllBtn = document.createElement('button');
    sAllBtn.className = 'anime-tag-btn' + (seriesCollectionFilters.length === 0 ? ' active' : '');
    sAllBtn.textContent = 'tous';
    sAllBtn.addEventListener('click', function() { seriesCollectionFilters = []; savePrefs('series', { tags: seriesCollectionFilters }); generateSeries(filterData(series, ecransSearchQuery), !!ecransSearchQuery); });
    sTopRow.appendChild(sAllBtn);
    sF.appendChild(sTopRow);

    var sCollSection = document.createElement('div'); sCollSection.className = 'anime-tag-section';
    var sCollLabel = document.createElement('div'); sCollLabel.className = 'anime-tag-section-label'; sCollLabel.textContent = 'collection'; sCollSection.appendChild(sCollLabel);
    var sCollWrap = document.createElement('div'); sCollWrap.className = 'anime-tag-section-tags';
    for (var sTag in sCollCounts) {
      if (sCollCounts[sTag] > 0) {
        var sBtn = document.createElement('button');
        sBtn.className = 'anime-tag-btn' + (seriesCollectionFilters.indexOf(sTag) !== -1 ? ' active' : '');
        sBtn.textContent = sTag + ' (' + sCollCounts[sTag] + ')';
        sBtn.addEventListener('click', function(t) { return function() { seriesCollectionFilters = toggleArr(seriesCollectionFilters, t); savePrefs('series', { tags: seriesCollectionFilters }); generateSeries(filterData(series, ecransSearchQuery), !!ecransSearchQuery); }; }(sTag));
        sCollWrap.appendChild(sBtn);
      }
    }
    if (sCollWrap.children.length > 0) { sCollSection.appendChild(sCollWrap); sF.appendChild(sCollSection); }

    var sQualCounts = { 'coup de coeur': 0 };
    for (var sh2 in series) {
      series[sh2].forEach(function(s2) {
        if (s2.tags) s2.tags.forEach(function(t) { if (sQualCounts[t] !== undefined) sQualCounts[t]++; });
      });
    }
    var sQualSection = document.createElement('div'); sQualSection.className = 'anime-tag-section';
    var sQualLabel = document.createElement('div'); sQualLabel.className = 'anime-tag-section-label'; sQualLabel.textContent = 'qualité'; sQualSection.appendChild(sQualLabel);
    var sQualWrap = document.createElement('div'); sQualWrap.className = 'anime-tag-section-tags';
    for (var sQualTag in sQualCounts) {
      if (sQualCounts[sQualTag] > 0) {
        var sQualBtn = document.createElement('button');
        sQualBtn.className = 'anime-tag-btn quality-tag' + (seriesCollectionFilters.indexOf(sQualTag) !== -1 ? ' active' : '');
        sQualBtn.textContent = sQualTag + ' (' + sQualCounts[sQualTag] + ')';
        sQualBtn.addEventListener('click', function(t) { return function() { seriesCollectionFilters = toggleArr(seriesCollectionFilters, t); savePrefs('series', { tags: seriesCollectionFilters }); generateSeries(filterData(series, ecransSearchQuery), !!ecransSearchQuery); }; }(sQualTag));
        sQualWrap.appendChild(sQualBtn);
      }
    }
    if (sQualWrap.children.length > 0) { sQualSection.appendChild(sQualWrap); sF.appendChild(sQualSection); }
  }

  var sBar = document.getElementById('ecrans-project-bar');
  if (sBar) {
    var sRewatchCount = 0; var sTotal = 0;
    for (var sh in series) {
      series[sh].forEach(function(s) {
        sTotal++;
        if (s.tags && s.tags.indexOf('re-watched') !== -1) sRewatchCount++;
      });
    }
    if (sTotal > 0) {
      var sPct = (sRewatchCount / sTotal * 100).toFixed(1);
      sBar.innerHTML = '<div class="project-bar"><span class="project-label">projet revisionnage : ' + sRewatchCount + ' / ' + sTotal + ' (' + sPct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + sPct + '%"></div></div></div>';
    } else { sBar.innerHTML = ''; }
  }

  if (seriesCollectionFilters.length) {
    var filteredSeriesData = {};
    for (var showKey in data) {
      var validSeasons = data[showKey].filter(function(season) {
        return season.tags && seriesCollectionFilters.some(function(t) { return season.tags.indexOf(t) !== -1; });
      });
      if (validSeasons.length > 0) filteredSeriesData[showKey] = validSeasons;
    }
    data = filteredSeriesData;
  }

  // Compteur : calculé APRÈS application du filtre collection ; la part films tient compte de la recherche
  // (avant, generateSeries écrasait le compteur commun avec une part films non filtrée par la recherche)
  var sCount = Object.values(data).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var sGlobal = Object.values(series).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var sFilt = isSearch || seriesCollectionFilters.length;
  var tSeries = sFilt ? sCount + " / " + sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") : sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") + " suivie" + (sGlobal !== 1 ? "s" : "");

  var fBase = filterData(films, ecransSearchQuery);
  var fCount = Object.values(fBase).reduce(function(acc, arr) { 
    return acc + (filmsFormatFilters.length || filmsCollectionFilters.length ? arr.filter(function(m) { 
      var isShort = m.tags && m.tags.indexOf('court métrage') !== -1;
      var fmtOk = filmsFormatFilters.length === 0 || filmsFormatFilters.some(function(f) { return f === 'court' ? isShort : !isShort; });
      var collOk = filmsCollectionFilters.length === 0 || (m.tags && filmsCollectionFilters.some(function(t) { return m.tags.indexOf(t) !== -1; }));
      return fmtOk && collOk; 
    }).length : arr.length); 
  }, 0);
  var fGlobal = Object.values(films).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var fFilt = isSearch || filmsCollectionFilters.length || filmsFormatFilters.length;
  var tFilms = fFilt ? fCount + " / " + fGlobal + " film" + (fGlobal !== 1 ? "s" : "") : fGlobal + " film" + (fGlobal !== 1 ? "s" : "") + " vu" + (fGlobal !== 1 ? "s" : "");

  document.getElementById('ecrans-counter').textContent = tFilms + " • " + tSeries;

  if (ecransSortMode !== 'réalisateur') {
    var allSeries = [];
    for (var show in data) {
      data[show].forEach(function(season) { allSeries.push(season); });
    }
    allSeries.sort(function(a, b) {
      if (ecransSortMode === 'note') {
        if (a.note === null && b.note === null) return (a.title.localeCompare(b.title)) * ecransSortDir;
        if (a.note === null) return 1; if (b.note === null) return -1;
        return (b.note - a.note) * ecransSortDir;
      } else {
        return (a.title.localeCompare(b.title)) * ecransSortDir;
      }
    });
    if (allSeries.length === 0) { container.innerHTML = '<p class="empty-state">aucun résultat</p>'; return; }
    var div = document.createElement('div'); div.className = 'books';
    allSeries.forEach(function(season) {
      var starsHtml = season.note !== null ? '<div class="book-meta">' + getStars(season.note) + '</div>' : '';
      var reviewHtml = season.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(season.review) + '</span>' : '';
      if (season.tags && season.tags.indexOf('coup de coeur') !== -1) var cdcClass = ' coup-de-coeur-card'; else var cdcClass = '';
      var card = document.createElement('a');
      card.href = season.link; card.target = "_blank"; card.className = 'book-card' + cdcClass;
      card.innerHTML = '<img loading="lazy" src="' + season.cover + '" alt="' + season.title + '">' + getCollectionBadges(season) + '<div class="book-title">' + season.title + '</div>' + starsHtml + getOldNote(season) + reviewHtml;
      div.appendChild(card);
    });
    container.innerHTML = '';
    container.appendChild(div);
    return; 
  }

  container.innerHTML = '';
  if (sortDataKeys(data).length === 0) { container.innerHTML = '<p class="empty-state">aucun résultat</p>'; return; }

  sortDataKeys(data).forEach(function(show) {
    container.insertAdjacentHTML('beforeend', getCreatorHeader(show, data[show].length));
    const notesValides = data[show].map(s => s.note).filter(n => n !== null);
    if (notesValides.length > 1) {
      const moyenne = (notesValides.reduce((acc, note) => acc + note, 0) / notesValides.length).toFixed(1);
      const avgDiv = document.createElement('div');
      avgDiv.className = 'show-average'; avgDiv.textContent = "moyenne : " + moyenne;
      container.appendChild(avgDiv);
    }
    const div = document.createElement('div'); div.className = 'books';
    sortEntriesByNote(data[show]).forEach(function(season) {
      const card = document.createElement('a');
      card.href = season.link; card.target = "_blank"; card.className = 'book-card';
      const starsHtml = season.note !== null ? `<div class="book-meta">${getStars(season.note)}</div>` : '';
      if (season.tags && season.tags.indexOf('coup de coeur') !== -1) card.className += ' coup-de-coeur-card';
      var reviewHtml = season.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(season.review) + '</span>' : '';
      card.innerHTML = `<img loading="lazy" src="${season.cover}" alt="${season.title}">${getCollectionBadges(season)}<div class="book-title">${season.title}</div>${starsHtml}${getOldNote(season)}${reviewHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

// ── Generate Jeux vidéo ──
function generateGames(data = games, isSearch = false) {
  
  // 1. Filtres collection Jeux
  var gF = document.getElementById('jeux-filters');
  if (gF) {
    gF.innerHTML = '';
    var gCollCounts = { 'rejoué': 0, 'archived': 0 };
    games.forEach(function(g) {
      if (g.tags) g.tags.forEach(function(t) { if (gCollCounts[t] !== undefined) gCollCounts[t]++; });
    });
    var gTopRow = document.createElement('div');
    gTopRow.style.cssText = 'display: flex; gap: 8px; justify-content: center; margin-bottom: 10px;';
    var gAllBtn = document.createElement('button');
    gAllBtn.className = 'anime-tag-btn' + (jeuxCollectionFilters.length === 0 ? ' active' : '');
    gAllBtn.textContent = 'tous';
    var gSearchVal = document.getElementById('search-jeux').value;
    gAllBtn.addEventListener('click', function() { jeuxCollectionFilters = []; savePrefs('jeux', { tags: jeuxCollectionFilters }); generateGames(filterData(games, gSearchVal), !!gSearchVal); });
    gTopRow.appendChild(gAllBtn);
    gF.appendChild(gTopRow);

    var gCollSection = document.createElement('div'); gCollSection.className = 'anime-tag-section';
    var gCollLabel = document.createElement('div'); gCollLabel.className = 'anime-tag-section-label'; gCollLabel.textContent = 'collection'; gCollSection.appendChild(gCollLabel);
    var gCollWrap = document.createElement('div'); gCollWrap.className = 'anime-tag-section-tags';
    for (var gTag in gCollCounts) {
      if (gCollCounts[gTag] > 0) {
        var gBtn = document.createElement('button');
        gBtn.className = 'anime-tag-btn' + (jeuxCollectionFilters.indexOf(gTag) !== -1 ? ' active' : '');
        gBtn.textContent = gTag + ' (' + gCollCounts[gTag] + ')';
        gBtn.addEventListener('click', function(t) { return function() { jeuxCollectionFilters = toggleArr(jeuxCollectionFilters, t); savePrefs('jeux', { tags: jeuxCollectionFilters }); generateGames(filterData(games, gSearchVal), !!gSearchVal); }; }(gTag));
        gCollWrap.appendChild(gBtn);
      }
    }
    if (gCollWrap.children.length > 0) { gCollSection.appendChild(gCollWrap); gF.appendChild(gCollSection); }
  }

  // Barre progression replay Jeux
  var gBar = document.getElementById('jeux-project-bar');
  if (gBar) {
    var gReplayCount = 0; var gTotal = games.length;
    games.forEach(function(g) {
      if (g.tags && g.tags.indexOf('rejoué') !== -1) gReplayCount++;
    });
    if (gTotal > 0) {
      var gPct = (gReplayCount / gTotal * 100).toFixed(1);
      gBar.innerHTML = '<div class="project-bar"><span class="project-label">projet replay : ' + gReplayCount + ' / ' + gTotal + ' (' + gPct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + gPct + '%"></div></div></div>';
    } else { gBar.innerHTML = ''; }
  }

  // Application du filtre
  if (jeuxCollectionFilters.length) {
    data = data.filter(function(g) {
      return g.tags && jeuxCollectionFilters.some(function(t) { return g.tags.indexOf(t) !== -1; });
    });
  }

  // Comme data est maintenant une liste plate, on prend directement sa longueur
  let totalGames = data.length;
  let globalTotalGames = games.length;
  const label = (isSearch || jeuxCollectionFilters.length) 
    ? totalGames + " / " + globalTotalGames + " jeu" + (globalTotalGames !== 1 ? "x" : "")
    : totalGames + " jeu" + (totalGames !== 1 ? "x" : "") + " joué" + (totalGames !== 1 ? "s" : "");
  document.getElementById('jeux-counter').textContent = label;

  // Tri Jeux
  var sortContainer = document.getElementById('jeux-sort');
  sortContainer.innerHTML = '<span class="anime-sort-label">tri :</span>';
  ['note', 'titre'].forEach(function(mode) {
    var btn = document.createElement('button');
    var internalMode = mode === 'titre' ? 'alpha' : mode;
    btn.className = 'anime-sort-btn' + (jeuxSortMode === internalMode ? ' active' : '');
    btn.textContent = mode;
    btn.addEventListener('click', function() {
      if (jeuxSortMode === internalMode) {
        jeuxSortDir *= -1;
      } else {
        jeuxSortMode = internalMode;
        jeuxSortDir = 1;
      }
      savePrefs('jeux', { sortMode: jeuxSortMode, sortDir: jeuxSortDir });
      sortContainer.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      generateGames();
    });
    sortContainer.appendChild(btn);
  });

  const container = document.getElementById('jeuxContent');

  // On copie le tableau pour ne pas modifier l'original lors du tri
  var allGames = data.slice();

  allGames.sort(function(a, b) {
    if (jeuxSortMode === 'note') {
      if (a.note === null && b.note === null) return (a.title.localeCompare(b.title)) * jeuxSortDir;
      if (a.note === null) return 1; 
      if (b.note === null) return -1;
      return (b.note - a.note) * jeuxSortDir;
    } else {
      return (a.title.localeCompare(b.title)) * jeuxSortDir;
    }
  });

  if (allGames.length === 0) {
    container.innerHTML = '<p class="empty-state">aucun résultat</p>';
    return;
  }

  var div = document.createElement('div'); 
  div.className = 'books';
  
  allGames.forEach(function(game) {
    var starsHtml = game.note !== null ? '<div class="book-meta">' + getStars(game.note) + '</div>' : '';
    var reviewHtml = game.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(game.review) + '</span>' : '';
    
    var card = document.createElement('a');
    card.href = game.link; 
    card.target = "_blank"; 
    card.className = 'book-card';
    card.innerHTML = '<img loading="lazy" src="' + game.cover + '" alt="' + game.title + '">' + getCollectionBadges(game) + '<div class="book-title">' + game.title + '</div>' + starsHtml + getOldNote(game) + reviewHtml;
    div.appendChild(card);
  });
  
  container.innerHTML = '';
  container.appendChild(div);
}

// ── Generate Musique ──
function generateMusique(data = musique, isSearch = false) {
  // 1. Génération des boutons de filtre
  var formatCounts = { album: 0, ep: 0, single: 0, mixtape: 0 };
  for (var artist in musique) {
    musique[artist].forEach(function(album) {
      var fmt = album.format ? album.format.toLowerCase() : 'album';
      if (formatCounts[fmt] !== undefined) formatCounts[fmt]++;
    });
  }

  var fC = document.getElementById('musique-filters');
  if (fC) {
    fC.innerHTML = '';
    var topRow = document.createElement('div'); topRow.style.cssText = 'display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;';
    var allBtn = document.createElement('button');
    allBtn.className = 'anime-tag-btn' + (musiqueFormatFilters.length === 0 && musiqueCollectionFilters.length === 0 ? ' active' : '');
    var totalAll = formatCounts.album + formatCounts.ep + formatCounts.single + formatCounts.mixtape;
    allBtn.textContent = 'tous (' + totalAll + ')';
    allBtn.addEventListener('click', function() { 
      musiqueFormatFilters = []; 
      musiqueCollectionFilters = []; 
      savePrefs('musique', { formats: musiqueFormatFilters, tags: musiqueCollectionFilters });
      generateMusique(filterData(musique, document.getElementById('search-musique').value), isSearch); 
    });
    topRow.appendChild(allBtn);
    fC.appendChild(topRow);

    var formats = ['album', 'ep', 'single', 'mixtape'];
    var fmtSection = document.createElement('div'); fmtSection.className = 'anime-tag-section';
    
    var fmtLabel = document.createElement('div');
    fmtLabel.className = 'anime-tag-section-label';
    fmtLabel.textContent = 'format';
    fmtSection.appendChild(fmtLabel);
    
    var fmtWrap = document.createElement('div'); fmtWrap.className = 'anime-tag-section-tags';
    
    formats.forEach(function(fmt) {
      if (formatCounts[fmt] > 0) {
        var btn = document.createElement('button');
        btn.className = 'anime-tag-btn' + (musiqueFormatFilters.indexOf(fmt) !== -1 ? ' active' : '');
        btn.textContent = fmt + ' (' + formatCounts[fmt] + ')';
        btn.addEventListener('click', function() { 
          musiqueFormatFilters = toggleArr(musiqueFormatFilters, fmt);
          savePrefs('musique', { formats: musiqueFormatFilters });
          generateMusique(filterData(musique, document.getElementById('search-musique').value), isSearch); 
        });
        fmtWrap.appendChild(btn);
      }
    });
    fmtSection.appendChild(fmtWrap);
    fC.appendChild(fmtSection);

    // SECTION COLLECTION MUSIQUE
    var mCollCounts = { 'réécoute': 0, 'archived': 0, 'bought': 0 };
    for (var art in musique) {
      musique[art].forEach(function(m) {
        if (m.tags) m.tags.forEach(function(t) { if (mCollCounts[t] !== undefined) mCollCounts[t]++; });
      });
    }
    var mCollSection = document.createElement('div'); mCollSection.className = 'anime-tag-section';
    var mCollLabel = document.createElement('div'); mCollLabel.className = 'anime-tag-section-label'; mCollLabel.textContent = 'collection'; mCollSection.appendChild(mCollLabel);
    var mCollWrap = document.createElement('div'); mCollWrap.className = 'anime-tag-section-tags';
    
    for (var mTag in mCollCounts) {
      if (mCollCounts[mTag] > 0) {
        var mBtn = document.createElement('button');
        mBtn.className = 'anime-tag-btn' + (musiqueCollectionFilters.indexOf(mTag) !== -1 ? ' active' : '');
        mBtn.textContent = mTag + ' (' + mCollCounts[mTag] + ')';
        mBtn.addEventListener('click', function(t) { return function() { musiqueCollectionFilters = toggleArr(musiqueCollectionFilters, t); savePrefs('musique', { tags: musiqueCollectionFilters }); generateMusique(filterData(musique, document.getElementById('search-musique').value), isSearch); }; }(mTag));
        mCollWrap.appendChild(mBtn);
      }
    }
    if (mCollWrap.children.length > 0) { mCollSection.appendChild(mCollWrap); fC.appendChild(mCollSection); }
  }

  // 2. Application du filtre sur les données
  if (musiqueFormatFilters.length || musiqueCollectionFilters.length) {
    var filteredData = {};
    for (var artist in data) {
      var validAlbums = data[artist].filter(function(album) {
        var fmt = album.format ? album.format.toLowerCase() : 'album';
        var fmtOk = musiqueFormatFilters.length === 0 || musiqueFormatFilters.indexOf(fmt) !== -1;
        var collOk = musiqueCollectionFilters.length === 0 || (album.tags && musiqueCollectionFilters.some(function(t) { return album.tags.indexOf(t) !== -1; }));
        return fmtOk && collOk;
      });
      if (validAlbums.length > 0) filteredData[artist] = validAlbums;
    }
    data = filteredData;
  }

  // 3. Compteur de la vue actuelle
  let displayedAlbums = 0;
  for (const artist in data) {
    displayedAlbums += data[artist].length;
  }

  let globalTotalMusique = 0;
  for (const art in musique) globalTotalMusique += musique[art].length;

  const label = (isSearch || musiqueFormatFilters.length || musiqueCollectionFilters.length) 
    ? displayedAlbums + " / " + globalTotalMusique + " projet" + (globalTotalMusique !== 1 ? "s" : "")
    : displayedAlbums + " projet" + (displayedAlbums !== 1 ? "s" : "") + " écouté" + (displayedAlbums !== 1 ? "s" : "");
  document.getElementById('musique-counter').textContent = label;

  // 4. Barre réécoute (Toujours basée sur la totalité des projets, peu importe le filtre)
  var relistenBar = document.getElementById('musique-relisten-bar');
  if (relistenBar) {
    let globalTotal = 0;
    let globalRelisten = 0;
    for (const artist in musique) {
      musique[artist].forEach(function(album) {
        globalTotal++;
        if (album.tags && album.tags.indexOf('réécoute') !== -1) globalRelisten++;
      });
    }
    
    if (globalTotal > 0) {
      var percentage = (globalRelisten / globalTotal) * 100;
      relistenBar.innerHTML = '<div class="project-bar"><span class="project-label">projet réécoute : ' + globalRelisten + ' / ' + globalTotal + ' (' + percentage.toFixed(1) + '%)</span><div class="project-track"><div class="project-fill" style="width: ' + percentage + '%"></div></div></div>';
    } else {
      relistenBar.innerHTML = '';
    }
  }

  // Tri Musique
  var sortContainer = document.getElementById('musique-sort');
  sortContainer.innerHTML = '<span class="anime-sort-label">tri :</span>';
  ['artiste', 'note', 'titre'].forEach(function(mode) {
    var btn = document.createElement('button');
    var internalMode = mode === 'titre' ? 'alpha' : mode;
    btn.className = 'anime-sort-btn' + (musiqueSortMode === internalMode ? ' active' : '');
    btn.textContent = mode;
    btn.addEventListener('click', function() {
      if (musiqueSortMode === internalMode && internalMode !== 'artiste') {
        musiqueSortDir *= -1;
      } else {
        musiqueSortMode = internalMode;
        musiqueSortDir = 1;
      }
      savePrefs('musique', { sortMode: musiqueSortMode, sortDir: musiqueSortDir });
      sortContainer.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      generateMusique();
    });
    sortContainer.appendChild(btn);
  });

  const container = document.getElementById('musiqueContent');

  // --- VUE GLOBALE MUSIQUE ---
  if (musiqueSortMode !== 'artiste') {
    var allAlbums = [];
    for (var artist in data) {
      data[artist].forEach(function(album) { allAlbums.push(album); });
    }

    allAlbums.sort(function(a, b) {
      if (musiqueSortMode === 'note') {
        if (a.note === null && b.note === null) return (a.title.localeCompare(b.title)) * musiqueSortDir;
        if (a.note === null) return 1; if (b.note === null) return -1;
        return (b.note - a.note) * musiqueSortDir;
      } else {
        return (a.title.localeCompare(b.title)) * musiqueSortDir;
      }
    });

    if (allAlbums.length === 0) {
      container.innerHTML = '<p class="empty-state">aucun résultat</p>';
      return;
    }

    var div = document.createElement('div'); div.className = 'books';
    allAlbums.forEach(function(album) {
      var starsHtml = album.note !== null ? '<div class="book-meta">' + getStars(album.note) + '</div>' : '';
      var reviewHtml = album.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(album.review) + '</span>' : '';
      
var relistenBadge = getCollectionBadges(album);

var card = document.createElement('a');
      card.href = album.link; card.target = "_blank"; card.className = 'book-card';
      card.innerHTML = '<img loading="lazy" src="' + album.cover + '" alt="' + album.title + '">' + getMusicFormatBadge(album) + relistenBadge + '<div class="book-title">' + album.title + '</div>' + starsHtml + getOldNote(album) + reviewHtml;
      div.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(div);
    return; 
  }

  container.innerHTML = '';

  if (sortDataKeys(data).length === 0) {
    container.innerHTML = '<p class="empty-state">aucun résultat</p>';
    return;
  }

  sortDataKeys(data).forEach(function(artist) {
    container.insertAdjacentHTML('beforeend', getCreatorHeader(artist, data[artist].length));

    const notesValides = data[artist].map(m => m.note).filter(n => n !== null);
    if (notesValides.length > 1) {
      const moyenne = (notesValides.reduce((acc, note) => acc + note, 0) / notesValides.length).toFixed(1);
      const avgDiv = document.createElement('div');
      avgDiv.className = 'show-average';
      avgDiv.textContent = "moyenne : " + moyenne;
      container.appendChild(avgDiv);
    }

    const div = document.createElement('div');
    div.className = 'books';
    sortEntriesByNote(data[artist]).forEach(function(album) {
      const card = document.createElement('a');
      card.href = album.link;
      card.target = "_blank";
      card.className = 'book-card';

      const starsHtml = album.note !== null ? `<div class="book-meta">${getStars(album.note)}</div>` : '';

      var reviewHtml = album.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(album.review) + '</span>' : '';
      
      var relistenBadge = getCollectionBadges(album);
      
      card.innerHTML = `<img loading="lazy" src="${album.cover}" alt="${album.title}">${getMusicFormatBadge(album)}${relistenBadge}<div class="book-title">${album.title}</div>${starsHtml}${getOldNote(album)}${reviewHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

// ── Helper pour le badge de format film ──
function getFilmFormatBadge(movie) {
  // On vérifie "documentaire" en premier pour qu'il prenne le dessus
  if (movie.tags && movie.tags.indexOf('documentaire') !== -1) {
    return '<span class="film-format-badge">documentaire</span>';
  }
  if (movie.tags && movie.tags.indexOf('court métrage') !== -1) {
    return '<span class="film-format-badge">court métrage</span>';
  }
  return '';
}

// ── TAMAGOTCHI PERRUCHES ──
const TAMAGOTCHI_KEY = 'slidou_budgie_state';

// Fonction pour lancer une animation temporaire
function spawnAnim(parentElement, cssClass, emoji) {
  const el = document.createElement('span');
  el.className = cssClass;
  el.innerHTML = emoji;
  parentElement.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// ── Yeux ^^ temporaires ──
let isBirdHappy = false;

function triggerHappyEyes() {
  isBirdHappy = true;
  updateTamagotchiUI(); // Redessine avec les yeux ^^
  setTimeout(() => {
    isBirdHappy = false;
    updateTamagotchiUI(); // Redessine avec les yeux normaux
  }, 1500); // Revient à la normale après 1,5 secondes
}

// Fonction pour faire rebondir les barres
function bounceBars(birdId) {
  ['faim', 'bonheur', 'energie'].forEach(stat => {
    const bar = document.getElementById('stat-' + stat + '-' + birdId);
    if (!bar) return;
    bar.classList.remove('bar-bounce');
    void bar.offsetWidth; // Force le navigateur à relancer l'animation
    bar.classList.add('bar-bounce');
  });
}

const BIRD_COLORS = {
  pistachio: { body: '#66BB6A', belly: '#A5D6A7', wing: '#43A047' },
  cielazur: { body: '#42A5F5', belly: '#90CAF9', wing: '#1E88E5' }
};

const thoughts = [
  "Pistachio regarde la pluie tomber sur le rebord de la fenêtre.",
  "Ciel Azur a fredonné un air de Schumann pendant dix minutes.",
  "Elles se sont perchées côte à côte en silence.",
  "Un rayon de soleil traverse la pièce, Pistachio ferme les yeux.",
  "Ciel Azur donne un petit coup de bec au rebord de l'écran.",
  "Pistachio s'est endormie en écoutant le clavier cliquer.",
  "Elles se toiletent mutuellement, très concentrées.",
  "Ciel Azur a laissé tomber une graine, Pistachio l'a récupérée.",
  "Pistachio observe les lettres défiler avec curiosité.",
  "Ciel Azur a écarquillé les yeux en entendant un bruit sourd."
];

function getDefaultState() {
  return {
    pistachio: { faim: 80, bonheur: 80, energie: 80 },
    cielazur: { faim: 80, bonheur: 80, energie: 80 },
    friendSince: Date.now(),
    lastUpdate: Date.now()
  };
}

function getBudgieState() {
  let state = null;
  try { state = JSON.parse(localStorage.getItem(TAMAGOTCHI_KEY)); } catch (e) { state = null; }
  if (!state || typeof state !== 'object') return getDefaultState();
  if (state.faim !== undefined) state = getDefaultState();
  if (!state.friendSince) state.friendSince = Date.now();
  if (!state.lastUpdate) state.lastUpdate = Date.now();

  const now = Date.now();
  const elapsedMinutes = (now - state.lastUpdate) / (1000 * 60);
  const decay = elapsedMinutes * 0.055;
  
  ['pistachio', 'cielazur'].forEach(bird => {
    if(!state[bird]) state[bird] = { faim: 80, bonheur: 80, energie: 80 };
    state[bird].faim = Math.max(0, state[bird].faim - decay);
    state[bird].bonheur = Math.max(0, state[bird].bonheur - (decay * 0.8));
    state[bird].energie = Math.max(0, state[bird].energie - (decay * 0.3));
  });
  
  saveBudgieState(state);
  return state;
}

function saveBudgieState(state) {
  state.lastUpdate = Date.now();
  localStorage.setItem(TAMAGOTCHI_KEY, JSON.stringify(state));
}

function drawBudgie(birdId, state) {
  const container = document.getElementById('wrapper-' + birdId);
  if (!container) return;

  // la perruche explore le site : sa cage l'attend, vide
  if (typeof budgieAmbient !== 'undefined' && budgieAmbient.bird === birdId) {
    container.innerHTML = '<div class="cage-away">partie explorer…</div>';
    return;
  }

  const birdState = state[birdId];
  const colors = BIRD_COLORS[birdId];
  const avgStat = (birdState.faim + birdState.bonheur + birdState.energie) / 3;

  let eye = `<circle cx="54" cy="32" r="3" fill="#333"/>`;
  let beak = `<polygon points="64,38 58,44 70,44" fill="#FF9800"/>`;
  let extra = '';

  // NOUVEAU : Les yeux ^^
  if (isBirdHappy) {
    eye = `<path d="M51 34 L53 30 M55 30 L57 34" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  } else if (birdState.energie < 20) {
    eye = `<line x1="51" y1="32" x2="57" y2="32" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    beak = `<polygon points="64,38 59,42 69,42" fill="#FF9800"/>`;
    extra = `<text x="85" y="25" font-family="Space Grotesk" font-size="10" fill="#999" font-style="italic">Zzz</text>`;
  } else if (birdState.faim < 30 || avgStat < 40) {
    eye = `<circle cx="54" cy="32" r="3" fill="#333"/><line x1="50" y1="28" x2="48" y2="26" stroke="${colors.wing}" stroke-width="1.5" stroke-linecap="round"/>`;
    extra = `<text x="40" y="70" font-family="Space Grotesk" font-size="8" fill="#e57373">...</text>`;
  } else if (avgStat > 70) {
    beak = `<polygon points="64,38 58,43 70,43" fill="#FF9800"/>`;
    extra = `<circle cx="80" cy="35" r="2" fill="#FFD54F" opacity="0.8"/><circle cx="85" cy="30" r="1.5" fill="#FFD54F" opacity="0.6"/>`;
  }

  container.innerHTML = `
    <svg width="100" height="100" viewBox="0 0 100 100">
      <ellipse cx="50" cy="65" rx="22" ry="28" fill="${colors.body}"/>
      <ellipse cx="50" cy="72" rx="14" ry="18" fill="${colors.belly}"/>
      <path d="M28,55 Q40,50 35,80 Q40,75 45,75 Q42,60 28,55Z" fill="${colors.wing}"/>
      <circle cx="50" cy="35" r="18" fill="${colors.body}"/>
      ${eye}
      ${beak}
      ${extra}
    </svg>
  `;
}

var budgieLastThought = "";
function setRandomThought() {
  const thoughtEl = document.getElementById('bird-thought');
  const pool = thoughts.concat(budgieDynamicThoughts());
  let randomThought = pool[Math.floor(Math.random() * pool.length)];
  let guard = 0;
  while (randomThought === budgieLastThought && pool.length > 1 && guard < 8) {
    randomThought = pool[Math.floor(Math.random() * pool.length)];
    guard++;
  }
  budgieLastThought = randomThought;
  thoughtEl.classList.remove('visible');
  setTimeout(() => {
    thoughtEl.textContent = "« " + randomThought + " »";
    thoughtEl.classList.add('visible');
  }, 300);
}

function updateTamagotchiUI() {
  const state = getBudgieState();
  
  const daysSince = Math.floor((Date.now() - state.friendSince) / (1000 * 60 * 60 * 24));
  document.getElementById('bird-friendship').textContent = "amies depuis " + daysSince + " jour" + (daysSince > 1 ? "s" : "");
  
  ['pistachio', 'cielazur'].forEach(bird => {
    const bs = state[bird];
    document.getElementById('stat-faim-' + bird).style.width = bs.faim + '%';
    document.getElementById('stat-bonheur-' + bird).style.width = bs.bonheur + '%';
    document.getElementById('stat-energie-' + bird).style.width = bs.energie + '%';
    
    document.getElementById('stat-faim-' + bird).style.background = bs.faim < 30 ? '#e57373' : 'var(--link-color)';
    document.getElementById('stat-bonheur-' + bird).style.background = bs.bonheur < 30 ? '#e57373' : 'var(--link-color)';
    document.getElementById('stat-energie-' + bird).style.background = bs.energie < 30 ? '#e57373' : 'var(--link-color)';

    drawBudgie(bird, state);
  });

  const harmonyEl = document.getElementById('bird-harmony');
  if (state.pistachio.bonheur > 70 && state.cielazur.bonheur > 70) {
    harmonyEl.classList.add('visible');
  } else {
    harmonyEl.classList.remove('visible');
  }

  if (!document.getElementById('bird-thought').classList.contains('visible')) {
    setRandomThought();
  }
}

function petBird(birdId) {
  const state = getBudgieState();
  state[birdId].bonheur = Math.min(100, state[birdId].bonheur + 5);
  saveBudgieState(state);
  
  const bs = state[birdId];
  document.getElementById('stat-bonheur-' + birdId).style.width = bs.bonheur + '%';
  document.getElementById('stat-bonheur-' + birdId).style.background = bs.bonheur < 30 ? '#e57373' : 'var(--link-color)';
  
  drawBudgie(birdId, state);
  
  const wrapper = document.getElementById('wrapper-' + birdId);
  wrapper.classList.remove('bird-jump');
  void wrapper.offsetWidth; 
  wrapper.classList.add('bird-jump');
  spawnAnim(wrapper.parentElement, 'pop-heart', '❤️');
  budgieOnPet(birdId); // la copine réagit aussi
  bounceBars(birdId);
  
  const harmonyEl = document.getElementById('bird-harmony');
  if (state.pistachio.bonheur > 70 && state.cielazur.bonheur > 70) {
    harmonyEl.classList.add('visible');
  } else {
    harmonyEl.classList.remove('visible');
  }
  
  setRandomThought();
}

document.getElementById('btn-nourrir').addEventListener('click', () => {
  const state = getBudgieState();
  ['pistachio', 'cielazur'].forEach(bird => {
    state[bird].faim = Math.min(100, state[bird].faim + 30);
    state[bird].energie = Math.max(0, state[bird].energie - 5);
    
    const cage = document.getElementById('cage-' + bird);
    spawnAnim(cage, 'falling-seed', '🌻');
    bounceBars(bird);
  });
  saveBudgieState(state);
  setRandomThought();
  triggerHappyEyes();
});

document.getElementById('btn-jouer').addEventListener('click', () => {
  const state = getBudgieState();
  ['pistachio', 'cielazur'].forEach(bird => {
    if (state[bird].energie < 10) return; 
    state[bird].bonheur = Math.min(100, state[bird].bonheur + 30);
    state[bird].energie = Math.max(0, state[bird].energie - 15);
    state[bird].faim = Math.max(0, state[bird].faim - 10);
    
    const wrapper = document.getElementById('wrapper-' + bird);
    wrapper.classList.remove('bird-jump', 'bird-spin');
    void wrapper.offsetWidth; 
    wrapper.classList.add('bird-spin');
    bounceBars(bird);
  });
  saveBudgieState(state);
  setRandomThought();
  triggerHappyEyes();
});

document.getElementById('btn-dormir').addEventListener('click', () => {
  const state = getBudgieState();
  ['pistachio', 'cielazur'].forEach(bird => {
    state[bird].energie = Math.min(100, state[bird].energie + 40);
    state[bird].faim = Math.max(0, state[bird].faim - 5);
    
    const cage = document.getElementById('cage-' + bird);
    spawnAnim(cage, 'floating-zzz', 'Z z z');
    bounceBars(bird);
  });
  saveBudgieState(state);
  setRandomThought();
  updateTamagotchiUI();
});

document.getElementById('cage-pistachio').addEventListener('click', () => petBird('pistachio'));
document.getElementById('cage-cielazur').addEventListener('click', () => petBird('cielazur'));

['wrapper-pistachio', 'wrapper-cielazur'].forEach(id => {
  document.getElementById(id).addEventListener('animationend', () => {
    document.getElementById(id).classList.remove('bird-jump');
  });
});

// ════════════════════════════════════════════════════════════
// ── PERRUCHES PASSIVES : le perchoir ambulant ──
// Une perruche sort parfois de sa cage, vient se poser en bas à
// droite de la page en cours, vit sa vie (picore, lisse ses
// plumes, somnole…), puis rentre au nid (page à propos).
// 100 % décoratif : pointer-events none, aucune interaction captée.
// ════════════════════════════════════════════════════════════
var budgieAmbient = {
  el: null, holder: null, fx: null,
  bird: null,          // 'pistachio' | 'cielazur' quand elle est dehors
  state: 'home',       // home | flying-in | perched | flying-out
  pose: 'idle',
  page: '',
  arrivalTimer: null, poseTimer: null, leaveTimer: null, safetyTimer: null,
  hopTimer: null, markTimer: null, landTimer: null, scrollTimer: null,
  reducedMotion: false
};

// une perruche attitrée par page (à propos = chez elles, pas de sortie)
var BUDGIE_PAGE_BIRDS = {
  home: 'pistachio',
  bibliographie: 'pistachio',
  ecrans: 'pistachio',
  jeux: 'pistachio',
  anime: 'cielazur',
  manga: 'cielazur',
  musique: 'cielazur',
  statistiques: 'cielazur'
};

var BUDGIE_POSE_POOL = ['idle', 'idle', 'look', 'look', 'peck', 'peck', 'preen', 'sleep'];

(function budgieAmbientInit() {
  var el = document.createElement('div');
  el.id = 'budgie-ambient';
  el.className = 'budgie-ambient';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="ba-bird-zone">' +
      '<div class="ba-bird-holder"></div>' +
      '<svg class="ba-perch" viewBox="0 0 90 16" aria-hidden="true">' +
        '<path d="M2,10 Q28,3 56,8 T88,7" fill="none" stroke="var(--border-color)" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M40,7 q6,-8 15,-7 q-5,8 -15,7z" fill="var(--link-color)" opacity="0.5"/>' +
      '</svg>' +
      '<div class="ba-shadow"></div>' +
    '</div>' +
    '<div class="ba-mark">?</div>' +
    '<div class="ba-fx"></div>';
  document.body.appendChild(el);
  budgieAmbient.el = el;
  budgieAmbient.holder = el.querySelector('.ba-bird-holder');
  budgieAmbient.fx = el.querySelector('.ba-fx');
  budgieAmbient.reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // fin des vols : on filtre les animationend (ceux des poses internes bubblent aussi)
  el.addEventListener('animationend', function(e) {
    if (e.target !== budgieAmbient.el) return;
    if (e.animationName === 'budgieFlyIn') budgieLanded();
    else if (e.animationName === 'budgieFlyOut') budgieCleanup();
  });
})();

function budgieAmbientSVG(birdId) {
  var c = BIRD_COLORS[birdId];
  if (!c) return '';
  return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<g class="ab-all">' +
      '<ellipse class="ab-body" cx="50" cy="65" rx="22" ry="28" fill="' + c.body + '"/>' +
      '<ellipse cx="50" cy="73" rx="14" ry="17" fill="' + c.belly + '"/>' +
      '<path class="ab-wing" d="M28,55 Q40,50 35,80 Q40,75 45,75 Q42,60 28,55Z" fill="' + c.wing + '"/>' +
      '<g class="ab-head">' +
        '<circle cx="50" cy="35" r="18" fill="' + c.body + '"/>' +
        '<circle class="ab-eye-open" cx="55" cy="32" r="3" fill="#333"/>' +
        '<line class="ab-eye-closed" x1="51" y1="32" x2="59" y2="32" stroke="#333" stroke-width="2" stroke-linecap="round"/>' +
        '<polygon points="64,38 58,44 70,44" fill="#FF9800"/>' +
      '</g>' +
    '</g>' +
    '<g class="ab-zzz"><text x="72" y="28">Z</text><text x="82" y="20">z</text><text x="90" y="13">z</text></g>' +
  '</svg>';
}

function budgieBirdName(birdId) { return birdId === 'pistachio' ? 'Pistachio' : 'Ciel Azur'; }

function budgieThought(text) {
  var el = document.getElementById('bird-thought');
  if (!el) return;
  el.classList.remove('visible');
  setTimeout(function() {
    el.textContent = text;
    el.classList.add('visible');
  }, 300);
}

function setBudgiePose(p) {
  var el = budgieAmbient.el;
  if (!el) return;
  budgieAmbient.pose = p;
  ['pose-idle', 'pose-look', 'pose-peck', 'pose-preen', 'pose-sleep'].forEach(function(c) { el.classList.remove(c); });
  el.classList.add('pose-' + p);
}

function scheduleBudgiePoses() {
  clearTimeout(budgieAmbient.poseTimer);
  var delay = 5800 + Math.random() * 4200;
  if (budgieAmbient.pose === 'sleep') delay += 5200;
  budgieAmbient.poseTimer = setTimeout(function() {
    if (budgieAmbient.state !== 'perched') return;
    var next = BUDGIE_POSE_POOL[Math.floor(Math.random() * BUDGIE_POSE_POOL.length)];
    if (next === budgieAmbient.pose) next = 'idle';
    setBudgiePose(next);
    scheduleBudgiePoses();
  }, delay);
}

function budgieFlyIn(birdId, page) {
  var a = budgieAmbient;
  if (!a.el || a.bird || a.state !== 'home') return;
  a.bird = birdId;
  a.state = 'flying-in';
  a.page = page;
  a.pose = 'idle';
  a.holder.innerHTML = budgieAmbientSVG(birdId);
  updateTamagotchiUI(); // sa cage se vide aussitôt
  a.el.classList.add('ba-visible', 'flying', 'pose-idle');
  if (a.reducedMotion) {
    budgieLanded();
  } else {
    a.el.classList.add('ba-fly-in');
    clearTimeout(a.safetyTimer);
    a.safetyTimer = setTimeout(budgieLanded, 1500); // filet si animationend manque
  }
}

function budgieLanded() {
  var a = budgieAmbient;
  if (a.state !== 'flying-in') return;
  a.state = 'perched';
  clearTimeout(a.safetyTimer);
  a.el.classList.remove('flying', 'ba-fly-in');
  setBudgiePose('idle');
  if (!a.reducedMotion) {
    a.el.classList.add('ba-landed');
    clearTimeout(a.landTimer);
    a.landTimer = setTimeout(function() { a.el.classList.remove('ba-landed'); }, 460);
  }
  // petite touche selon la page d'accueil
  if (a.page === 'statistiques') setBudgiePose('peck');   // picore près du panthéon
  else if (a.page === 'anime' || a.page === 'manga') setBudgiePose('look');
  if (a.page === 'musique') setTimeout(function() { budgieReact('note'); }, 750);
  scheduleBudgiePoses();
  clearTimeout(a.leaveTimer);
  a.leaveTimer = setTimeout(budgieFlyOut, 46000 + Math.random() * 34000);
}

function budgieFlyOut() {
  var a = budgieAmbient;
  if (a.state === 'flying-in') { budgieCleanup(); return; }
  if (a.state !== 'perched') return;
  a.state = 'flying-out';
  clearTimeout(a.poseTimer); clearTimeout(a.leaveTimer); clearTimeout(a.safetyTimer);
  if (!a.el || a.reducedMotion) { budgieCleanup(); return; }
  a.el.classList.remove('pose-idle', 'pose-look', 'pose-peck', 'pose-preen', 'pose-sleep', 'ba-landed', 'act-hop', 'act-mark');
  a.el.classList.add('flying', 'ba-fly-out');
  clearTimeout(a.safetyTimer);
  a.safetyTimer = setTimeout(budgieCleanup, 1100); // filet
}

function budgieCleanup() {
  var a = budgieAmbient;
  clearTimeout(a.safetyTimer); clearTimeout(a.poseTimer); clearTimeout(a.leaveTimer);
  var who = a.bird;
  a.bird = null; a.state = 'home'; a.pose = 'idle'; a.page = '';
  if (a.el) {
    a.el.className = 'budgie-ambient';
    if (a.holder) a.holder.innerHTML = '';
    if (a.fx) a.fx.innerHTML = '';
  }
  if (!who) return;
  // retrouvailles : la cage se remplit, la copine réagit
  updateTamagotchiUI();
  var w = document.getElementById('wrapper-' + who);
  if (w) { w.classList.remove('bird-jump'); void w.offsetWidth; w.classList.add('bird-jump'); }
  var other = who === 'pistachio' ? 'cielazur' : 'pistachio';
  var cageOther = document.getElementById('cage-' + other);
  if (cageOther) spawnAnim(cageOther, 'pop-heart', '❤️');
  budgieThought('« ' + budgieBirdName(who) + ' est rentrée au nid. »');
}

function budgieOnNavigate(page) {
  clearTimeout(budgieAmbient.arrivalTimer);
  if (budgieAmbient.bird) budgieFlyOut();
  var who = BUDGIE_PAGE_BIRDS[page];
  if (!who) return;
  budgieAmbient.arrivalTimer = setTimeout(function() {
    if (document.hidden || budgieAmbient.bird || budgieAmbient.state !== 'home') return;
    budgieFlyIn(who, page);
  }, 1400 + Math.random() * 1800);
}

function budgieReact(kind) {
  var a = budgieAmbient;
  if (!a.el || a.state !== 'perched') return;
  if (kind === 'hop') {
    a.el.classList.remove('act-hop');
    void a.el.offsetWidth;
    a.el.classList.add('act-hop');
    clearTimeout(a.hopTimer);
    a.hopTimer = setTimeout(function() { a.el.classList.remove('act-hop'); }, 700);
  } else if (kind === 'perdu') {
    setBudgiePose('look');
    a.el.classList.add('act-mark');
    clearTimeout(a.markTimer);
    a.markTimer = setTimeout(function() { a.el.classList.remove('act-mark'); }, 2900);
  } else if (kind === 'coeur' || kind === 'note') {
    if (!a.fx) return;
    var s = document.createElement('span');
    s.textContent = kind === 'coeur' ? '❤️' : '♪';
    a.fx.appendChild(s);
    var done = function() { if (s.parentNode) s.parentNode.removeChild(s); };
    s.addEventListener('animationend', done);
    setTimeout(done, 1400);
    if (kind === 'note') setBudgiePose('look');
  }
}

// Quand on caresse une perruche dans sa cage, la copine réagit aussi
function budgieOnPet(birdId) {
  var other = birdId === 'pistachio' ? 'cielazur' : 'pistachio';
  if (budgieAmbient.bird === other && budgieAmbient.state === 'perched') {
    budgieReact('coeur');
    return;
  }
  var w = document.getElementById('wrapper-' + other);
  if (!w) return;
  var cage = document.getElementById('cage-' + other);
  if (cage) spawnAnim(cage, 'pop-heart', '❤️');
  w.classList.remove('bird-jump');
  void w.offsetWidth;
  w.classList.add('bird-jump');
}

// Recherche sans résultat → « ? » (détection par .empty-state, zéro intrusion)
document.addEventListener('input', function(e) {
  var t = e.target;
  if (!t || !t.classList || !t.classList.contains('search-bar')) return;
  var q = (t.value || '').trim();
  if (!q) return;
  setTimeout(function() {
    if ((t.value || '').trim() !== q) return;
    var page = document.querySelector('.page.active');
    if (!page) return;
    var scope = page.querySelector('.sub-page.active') || page;
    if (scope.querySelector('.empty-state')) budgieReact('perdu');
  }, 280);
});

// Un chip de filtre coché → petit saut (délégation EN CAPTURE : les handlers
// de chips reconstruisent leur conteneur, en bulle le bouton serait détaché)
document.addEventListener('click', function(e) {
  if (!budgieAmbient.el || budgieAmbient.state !== 'perched') return;
  var t = e.target;
  if (t && t.closest && t.closest('.manga-filters button, .anime-tags button')) budgieReact('hop');
}, true);

// Mobile : elle s'efface pendant le scroll, revient quand ça se calme
window.addEventListener('scroll', function() {
  var a = budgieAmbient;
  if (!a.el || a.state !== 'perched' || window.innerWidth > 768) return;
  a.el.classList.add('ba-scroll-hide');
  clearTimeout(a.scrollTimer);
  a.scrollTimer = setTimeout(function() { if (a.el) a.el.classList.remove('ba-scroll-hide'); }, 650);
}, { passive: true });

// ── Pensées vivantes : ancrées dans les vraies données du site ──
var budgieStatsCache = null;
function budgieSiteStats() {
  if (budgieStatsCache) return budgieStatsCache;
  var s = { total: 0, cinq: [], mangaAvg: 0, animeNormal: 0, dernier: null };
  var fams = [
    (typeof animeList !== 'undefined' ? animeList : null),
    (typeof mangaData !== 'undefined' ? mangaData : null),
    (typeof books !== 'undefined' ? books : null),
    (typeof games !== 'undefined' ? games : null),
    (typeof musique !== 'undefined' ? musique : null),
    (typeof films !== 'undefined' ? films : null),
    (typeof series !== 'undefined' ? series : null)
  ];
  fams.forEach(function(d) {
    if (!d) return;
    var arr = flattenWorks(d);
    s.total += arr.length;
    arr.forEach(function(it) { if (it && it.note === 5 && it.title) s.cinq.push(it.title); });
  });
  var notes = notesOf(typeof mangaData !== 'undefined' ? flattenWorks(mangaData) : []);
  if (notes.length) s.mangaAvg = notes.reduce(function(x, y) { return x + y; }, 0) / notes.length;
  var animes = typeof animeList !== 'undefined' ? flattenWorks(animeList) : [];
  s.animeNormal = animes.filter(function(x) { return (x.tags || []).indexOf('normal episode') !== -1; }).length;
  var jd = typeof journalData !== 'undefined' ? journalData : [];
  jd.forEach(function(en) { if (en && en.d && en.title && (!s.dernier || en.d > s.dernier.d)) s.dernier = en; });
  budgieStatsCache = s;
  return s;
}

function budgieTrunc(txt, n) {
  txt = String(txt);
  return txt.length > n ? txt.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : txt;
}

function budgieDynamicThoughts() {
  var out = [];
  var s = budgieSiteStats();
  var h = new Date().getHours();
  if (s.cinq.length) out.push("Ciel Azur picore près de tes " + s.cinq.length + " coups de cœur 5/5.");
  if (s.mangaAvg) out.push("Pistachio trouve que tu notes les mangas sévèrement (" + s.mangaAvg.toFixed(2).replace(".", ",") + " de moyenne).");
  if (s.animeNormal) out.push("Elles ont recensé " + s.animeNormal + " animes « normal episode » sur le site.");
  if (s.dernier) out.push("Dernière entrée du journal : « " + budgieTrunc(s.dernier.title, 34) + " ».");
  if (s.cinq.length) out.push("Pistachio repense à « " + budgieTrunc(s.cinq[Math.floor(Math.random() * s.cinq.length)], 30) + " », l'une de tes pépites.");
  if (s.total) out.push("Elles surveillent les " + s.total + " œuvres du site du bout du bec.");
  if (h >= 22 || h < 6) out.push("Il est tard : Ciel Azur somnole sur son perchoir.");
  else if (h < 12) out.push("Fraîche matinée : Pistachio étire ses ailes.");
  else if (h >= 18) out.push("Fin de journée, elles jacassent près de la fenêtre.");
  try {
    var st = getBudgieState();
    if (st.pistachio.faim > 85) out.push("Pistachio a le jabot bien plein.");
    if (st.cielazur.energie < 25) out.push("Ciel Azur traîne des ailes, faute d'énergie.");
  } catch (err) { /* état tamagotchi indisponible : on s'en passe */ }
  return out;
}
// ── fin perruches passives ──

// ── Événements de Recherche ──
document.getElementById('search-biblio').addEventListener('input', e => {
  const query = e.target.value;
  let dataToSearch = showOnlyReviewsBiblio ? filterByReview(books) : books;
  generateBibliography(filterData(dataToSearch, query), true);
});

document.getElementById('search-ecrans').addEventListener('input', e => {
  ecransSearchQuery = e.target.value;
  const filteredFilms = filterData(films, ecransSearchQuery);
  const filteredSeries = filterData(series, ecransSearchQuery);
  const isSearch = !!ecransSearchQuery;

  let totalFilms = Object.values(filteredFilms).reduce((acc, arr) => acc + arr.length, 0);
  let totalSeries = Object.values(filteredSeries).reduce((acc, arr) => acc + arr.length, 0);
  let globalFilms = Object.values(films).reduce((acc, arr) => acc + arr.length, 0);
  let globalSeries = Object.values(series).reduce((acc, arr) => acc + arr.length, 0);
  
  let isFilmsFiltered = isSearch || filmsFormatFilters.length || filmsCollectionFilters.length;
  let isSeriesFiltered = isSearch || seriesCollectionFilters.length;
  
  let textFilms = isFilmsFiltered ? totalFilms + " / " + globalFilms + " film" + (globalFilms !== 1 ? "s" : "") : globalFilms + " film" + (globalFilms !== 1 ? "s" : "") + " vu" + (globalFilms !== 1 ? "s" : "");
  let textSeries = isSeriesFiltered ? totalSeries + " / " + globalSeries + " saison" + (globalSeries !== 1 ? "s" : "") : globalSeries + " saison" + (globalSeries !== 1 ? "s" : "") + " suivie" + (globalSeries !== 1 ? "s" : "");
  document.getElementById('ecrans-counter').textContent = textFilms + " • " + textSeries;

  generateFilms(filteredFilms, isSearch);
  generateSeries(filteredSeries, isSearch);
});

document.getElementById('search-jeux').addEventListener('input', e => {
  const query = e.target.value;
  generateGames(filterData(games, query), true);
});

document.getElementById('search-musique').addEventListener('input', e => {
  const query = e.target.value;
  generateMusique(filterData(musique, query), true);
});

const typeColors = { film: "dot-film", livre: "dot-livre", jeu: "dot-jeu", musique: "dot-musique", anime: "dot-anime", "série": "dot-serie", manga: "dot-manga" };
const moisNoms = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const joursNoms = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// Date locale au format YYYY-MM-DD.
// (toISOString() renverrait la date UTC, fausse pour un visiteur en France dès qu'on approche minuit)
function toLocalDateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Variables pour la navigation dans le temps
let viewedYear = new Date().getFullYear();
let viewedMonth = new Date().getMonth();

// ── Calcul de la Streak ──
function renderStreak() {
  const container = document.getElementById('home-streak');
  if (!journal || journal.length === 0) {
    container.innerHTML = '';
    return;
  }

  // On crée un Set de toutes les dates uniques du journal pour aller vite
  const datesInJournal = new Set(journal.map(j => j.d));

  let streakCount = 0;
  let isPaused = false;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  // Si on n'a rien rentré aujourd'hui, la streak est "en pause", on commence à checker depuis hier
  const todayStr = toLocalDateStr(checkDate);
  if (!datesInJournal.has(todayStr)) {
    isPaused = true;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // On remonte le temps
  while (true) {
    const dateStr = toLocalDateStr(checkDate);
    if (datesInJournal.has(dateStr)) {
      streakCount++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Affichage propre
  if (streakCount === 0) {
    container.innerHTML = '';
    return;
  }

  const countHtml = `<span class="home-streak-count">${streakCount}</span>`;
  const pausedHtml = isPaused ? `<span class="home-streak-paused"> · en pause</span>` : '';
  
  const text = streakCount === 1 ? 'jour d\'affilée' : 'jours d\'affilée';
  container.innerHTML = `${countHtml} ${text}${pausedHtml}`;
}

// ── RECAP ANNUEL (Bouton d'ouverture) ──
let recapYear = new Date().getFullYear();

document.getElementById('toggle-recap-btn').addEventListener('click', function() {
  const recapEl = document.getElementById('home-recap');
  const dashboardEl = document.getElementById('home-dashboard');
  const calendarHeaderEl = document.querySelector('.home-calendar-header');
  const calendarGridEl = document.getElementById('home-calendar-grid');
  
  const isRecapVisible = recapEl.classList.contains('visible');
  
  if (isRecapVisible) {
    // Si le recap est ouvert, on le ferme et on remet le calendrier
    recapEl.classList.remove('visible');
    dashboardEl.classList.remove('hide-for-recap');
    calendarHeaderEl.classList.remove('hide-for-recap');
    calendarGridEl.classList.remove('hide-for-recap');
    this.textContent = 'bilan ' + recapYear;
  } else {
    // Si le recap est fermé, on l'ouvre et on cache le calendrier
    recapEl.classList.add('visible');
    dashboardEl.classList.add('hide-for-recap');
    calendarHeaderEl.classList.add('hide-for-recap');
    calendarGridEl.classList.add('hide-for-recap');
    this.textContent = 'retour au calendrier';
    document.getElementById('recap-year-title').textContent = recapYear; // resynchronise le titre avec l'année courante
     renderRecap(); // On activera ça à l'étape suivante !
  }
});

document.getElementById('recap-prev-year').addEventListener('click', () => {
  recapYear--;
  document.getElementById('recap-year-title').textContent = recapYear;
   renderRecap(); // Pour plus tard
});

document.getElementById('recap-next-year').addEventListener('click', () => {
  recapYear++;
  document.getElementById('recap-year-title').textContent = recapYear;
   renderRecap(); // Pour plus tard
});

// ── RECAP ANNUEL (Calcul des données) ──
const RECAP_CATS = ['livre', 'film', 'série', 'anime', 'manga', 'jeu', 'musique'];
const RECAP_PLURAL = { livre: 'livres', film: 'films', série: 'séries', anime: 'animes', manga: 'mangas', jeu: 'jeux', musique: 'projets' };
// Jeux « sans fin » : jouables à l'infini, jamais comptés « en cours »
const ENDLESS_GAMES = ['Minecraft', 'Valorant', 'Counter-Strike 2'];

// Une entrée anime est « principale » si… (règle auteur, étendue aux films d'animation)
function recapIsMainAnime(note) {
  if (!note) return true;
  const n = note.toLowerCase();
  if (n.includes('épisode') || n.includes('episode')) return true;
  if (/\d+\/\d+/.test(n)) return true;
  if (n.includes('short film')) return true;
  if (n.includes('hentai')) return true;
  if (n.includes('movie')) return true;
  return false;
}

// Unités d'une entrée chiffrée : « 3/12 » → 3 ; « 2-3/13 » → 2 ; « 2-3-4/24 » → 3 ; « 1/? » → 1
function recapUnits(note) {
  const m = (note || '').match(/(\d+(?:-\d+)*)\/(\d+|\?)/);
  if (!m) return 0;
  const parts = m[1].split('-').map(Number);
  if (m[2] === '?') return parts.length;
  return Math.max(1, parts[parts.length - 1] - parts[0] + 1);
}

function renderRecap() {
  const yearStr = recapYear.toString();
  const yearEntries = journal.filter(e => (e.d || '').startsWith(yearStr))
    .slice()
    .sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));

  const elEmpty = document.getElementById('recap-empty');
  const elContent = document.getElementById('recap-content');

  if (yearEntries.length === 0) {
    elEmpty.style.display = '';
    elContent.style.display = 'none';
    return;
  }
  elEmpty.style.display = 'none';
  elContent.style.display = '';

  // Œuvres uniques de l'année (titre + type), entrées triées chronologiquement
  const works = {};
  yearEntries.forEach(e => {
    const k = e.t + '|' + e.title;
    if (!works[k]) works[k] = { t: e.t, title: e.title, img: e.img, blur: !!e.blur, entries: [] };
    works[k].entries.push(e);
  });

  // Classement : terminées / en cours / sans fin (+ entrées anime 100 % secondaires écartées)
  const finished = {}, ongoing = {}, endless = [];
  RECAP_CATS.forEach(t => { finished[t] = []; ongoing[t] = []; });
  Object.values(works).forEach(w => {
    // Type improvisé dans le journal (hors des 7 catégories connues) → géré à la volée
    if (RECAP_CATS.indexOf(w.t) === -1) {
      RECAP_CATS.push(w.t);
      RECAP_PLURAL[w.t] = w.t + 's';
      finished[w.t] = []; ongoing[w.t] = [];
    }
    if (w.t === 'anime' && !w.entries.some(e => recapIsMainAnime(e.note))) return; // clips, pubs…
    if (w.t === 'jeu' && ENDLESS_GAMES.indexOf(w.title) !== -1) { endless.push(w); return; }
    const last = w.entries[w.entries.length - 1];
    (last.status === 'en cours' ? ongoing[w.t] : finished[w.t]).push(w);
  });

  // ── Bandeau principal ──
  const totalFinished = RECAP_CATS.reduce((n, t) => n + finished[t].length, 0);
  const totalOngoing = RECAP_CATS.reduce((n, t) => n + ongoing[t].length, 0);
  const fmtCat = arr => arr.length + ' ' + (arr.length > 1 ? RECAP_PLURAL[arr[0].t] : arr[0].t);
  document.getElementById('recap-finished-count').textContent = totalFinished;
  document.getElementById('recap-finished-detail').textContent =
    RECAP_CATS.map(t => finished[t]).filter(a => a.length > 0).map(fmtCat).join(' · ');
  document.getElementById('recap-ongoing-count').textContent = totalOngoing;
  document.getElementById('recap-ongoing-detail').textContent =
    RECAP_CATS.map(t => ongoing[t]).filter(a => a.length > 0).map(fmtCat).join(' · ') || '—';

  // ── Heatmap ──
  buildRecapHeatmap(yearStr, yearEntries);

  // ── Précisions ──
  let epNormaux = 0, epShorts = 0, secShorts = 0, secClips = 0, secPubs = 0;
  yearEntries.forEach(e => {
    if (e.t !== 'anime') return;
    if (recapIsMainAnime(e.note)) {
      if (/short episode/i.test(e.note || '')) epShorts += recapUnits(e.note);
      else epNormaux += recapUnits(e.note);
    } else {
      const n = (e.note || '').toLowerCase();
      if (n.includes('short')) secShorts++;
      else if (n.includes('music')) secClips++;
      else if (n.includes('commercial') || n.includes('cms')) secPubs++;
    }
  });
  // Chapitres de manga : delta entre entrées successives d'une même œuvre
  let chapitres = 0;
  Object.values(works).forEach(w => {
    if (w.t !== 'manga') return;
    let prev = 0;
    w.entries.forEach(e => {
      const m = (e.note || '').match(/(\d+(?:-\d+)*)\/(\d+|\?)/);
      if (!m) return;
      const nums = m[1].split('-').map(Number);
      const pos = nums[nums.length - 1];
      chapitres += (prev === 0 ? nums.length : Math.max(1, pos - prev));
      prev = pos;
    });
  });
  // Films : courts-métrages détectés dans les notes
  const courtMetra = new Set();
  yearEntries.forEach(e => {
    if (e.t === 'film' && /court[- ](métrage|metrage|documentaire)/i.test(e.note || '')) courtMetra.add(e.title);
  });
  // Musique : premières écoutes / réécoutes
  const mus = yearEntries.filter(e => e.t === 'musique');
  const premE = mus.filter(e => /premi[èe]re écoute/i.test(e.note || '')).length;
  const reE = mus.filter(e => /r[ée][ée]coute/i.test(e.note || '')).length;

  const precisionLines = [];
  if (finished.livre.length) precisionLines.push('livres — ' + finished.livre.length + ' terminé' + (finished.livre.length > 1 ? 's' : ''));
  if (finished.film.length) precisionLines.push('films — ' + finished.film.length + ' vu' + (finished.film.length > 1 ? 's' : '') + (courtMetra.size ? ', dont ' + courtMetra.size + ' courts-métrages' : ''));
  if (finished.anime.length || ongoing.anime.length) {
    let l = 'animes — ';
    const p = [];
    if (finished.anime.length) p.push(finished.anime.length + ' terminé' + (finished.anime.length > 1 ? 's' : ''));
    if (ongoing.anime.length) p.push(ongoing.anime.length + ' en cours');
    l += p.join(' · ');
    if (epNormaux || epShorts) l += ' · ~' + epNormaux + ' épisodes vus' + (epShorts ? ' + ~' + epShorts + ' shorts' : '');
    const secTot = secShorts + secClips + secPubs;
    if (secTot) {
      // « musics » = tag auteur pour les clips musicaux anime (note « music »)
      const secParts = [];
      if (secShorts) secParts.push(secShorts + ' courts');
      if (secClips) secParts.push(secClips + ' musics');
      if (secPubs) secParts.push(secPubs + ' pubs');
      l += ' · ' + secTot + ' à côté (' + secParts.join(', ') + ')';
    }
    precisionLines.push(l);
  }
  if (finished.manga.length || ongoing.manga.length) {
    let l = 'mangas — ';
    const p = [];
    if (finished.manga.length) p.push(finished.manga.length + ' terminé' + (finished.manga.length > 1 ? 's' : ''));
    if (ongoing.manga.length) p.push(ongoing.manga.length + ' en cours');
    l += p.join(' · ');
    if (chapitres) l += ' · ~' + chapitres + ' chapitres lus';
    precisionLines.push(l);
  }
  if (ongoing.série.length) precisionLines.push('séries — ' + ongoing.série.length + ' en cours');
  if (finished.jeu.length || ongoing.jeu.length || endless.length) {
    let l = 'jeux — ';
    const p = [];
    if (finished.jeu.length) p.push(finished.jeu.length + ' terminé' + (finished.jeu.length > 1 ? 's' : ''));
    if (ongoing.jeu.length) p.push(ongoing.jeu.length + ' en cours');
    l += p.join(' · ');
    if (endless.length) l += (p.length ? ' · ' : '') + 'des sessions sans fin sur ' + endless.map(w => w.title).join(', ');
    precisionLines.push(l);
  }
  if (finished.musique.length) {
    precisionLines.push('projets — ' + finished.musique.length + ' écouté' + (finished.musique.length > 1 ? 's' : '') + (premE ? ' · ' + premE + ' premières écoutes' : '') + (reE ? ' · ' + reE + ' réécoutes' : ''));
  }
  document.getElementById('recap-precision').innerHTML =
    precisionLines.map(l => '<div class="recap-precision-row">' + l + '</div>').join('');

  // ── Coups de cœur (note 5/5, via les listes du site) ──
  const noteLookup = {};
  function feedLookup(type, items) {
    (items || []).forEach(it => { if (it && it.title && typeof it.note === 'number') noteLookup[type + '|' + it.title.toLowerCase()] = it.note; });
  }
  try { Object.values(books).forEach(arr => feedLookup('livre', arr)); } catch (e) {}
  try { Object.values(films).forEach(arr => feedLookup('film', arr)); } catch (e) {}
  try { Object.values(musique).forEach(arr => feedLookup('musique', arr)); } catch (e) {}
  try { feedLookup('jeu', Array.isArray(games) ? games : []); } catch (e) {}
  const favs = [];
  RECAP_CATS.forEach(t => finished[t].forEach(w => {
    if (noteLookup[t + '|' + w.title.toLowerCase()] === 5) favs.push(w);
  }));
  const favSection = document.getElementById('recap-favorites-section');
  const favGrid = document.getElementById('recap-favorites');
  favGrid.innerHTML = '';
  if (favs.length > 0) {
    favSection.style.display = '';
    favs.forEach(w => {
      const card = document.createElement('div');
      card.className = 'book-card';
      const blurStyle = w.blur ? ' style="filter:blur(6px);transition:filter .3s;"' : '';
      card.innerHTML = '<img loading="lazy" src="' + w.img + '" alt="' + w.title + '"' + blurStyle + '><div class="book-title">' + w.title + '</div>';
      favGrid.appendChild(card);
    });
  } else {
    favSection.style.display = 'none';
  }

  // ── Galerie par catégorie (en-têtes enrichis terminés/en cours) ──
  const visualContainer = document.getElementById('recap-visual');
  visualContainer.innerHTML = '';

  RECAP_CATS.forEach(cat => {
    const all = cat === 'jeu'
      ? finished[cat].concat(ongoing[cat], endless)
      : finished[cat].concat(ongoing[cat]);
    if (all.length === 0) return;

    const label = all.length > 1 ? RECAP_PLURAL[cat] : cat;
    let header = label + ' (' + all.length + ')';
    if (ongoing[cat].length > 0) {
      header += ' — ' + finished[cat].length + ' terminé' + (finished[cat].length > 1 ? 's' : '') + ' · ' + ongoing[cat].length + ' en cours';
    }
    const h2 = document.createElement('h2');
    h2.textContent = header;
    visualContainer.appendChild(h2);

    const grid = document.createElement('div');
    grid.className = 'books';

    all.forEach(item => {
      const card = document.createElement('div');
      card.className = 'book-card';
      if (cat === 'musique') card.classList.add('recap-music-card');
      if (cat === 'film' || cat === 'série') card.classList.add('recap-ecrans-card');
      const blurStyle = item.blur ? ' style="filter:blur(6px);transition:filter .3s;"' : '';
      card.innerHTML = '<img loading="lazy" src="' + item.img + '" alt="' + item.title + '"' + blurStyle + '><div class="book-title">' + item.title + '</div>';
      grid.appendChild(card);
    });

    visualContainer.appendChild(grid);
  });

  // ── Pied : contrôle d'intégrité ──
  document.getElementById('recap-footer').textContent =
    yearEntries.length + " entrées de journal analysées · une œuvre est « en cours » tant que sa dernière entrée l'est encore";
}

// Grille d'activité annuelle : colonnes = semaines, lignes = jours, intensité = entrées
function buildRecapHeatmap(yearStr, yearEntries) {
  const host = document.getElementById('recap-heatmap');
  const counts = {};
  yearEntries.forEach(e => { counts[e.d] = (counts[e.d] || 0) + 1; });

  const start = Date.UTC(+yearStr, 0, 1);
  const totalDays = (Date.UTC(+yearStr + 1, 0, 1) - start) / 86400000;
  const offset = (new Date(start).getUTCDay() + 6) % 7; // lundi = 0
  const weeks = Math.ceil((offset + totalDays) / 7);
  const MONTHS = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];

  // Étiquettes de mois, placées sur la colonne du 1er du mois
  const labels = new Array(weeks).fill('');
  for (let m = 0; m < 12; m++) {
    const w = Math.floor(((Date.UTC(+yearStr, m, 1) - start) / 86400000 + offset) / 7);
    if (labels[w] === '') labels[w] = MONTHS[m];
  }
  let monthsHtml = '';
  for (let w = 0; w < weeks; w++) monthsHtml += '<span>' + labels[w] + '</span>';

  let cellsHtml = '';
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const dayIndex = w * 7 + d - offset;
      if (dayIndex < 0 || dayIndex >= totalDays) { cellsHtml += '<span class="hm-cell hm-off"></span>'; continue; }
      const dt = new Date(start + dayIndex * 86400000);
      const iso = dt.toISOString().slice(0, 10);
      const c = counts[iso] || 0;
      const lvl = c >= 7 ? 'hm-l4' : c >= 4 ? 'hm-l3' : c >= 2 ? 'hm-l2' : c >= 1 ? 'hm-l1' : 'hm-l0';
      cellsHtml += '<span class="hm-cell ' + lvl + '" title="' + (dayIndex + 1) + ' ' + MONTHS[dt.getUTCMonth()] + ' · ' + c + (c > 1 ? ' activités' : ' activité') + '"></span>';
    }
  }
  host.innerHTML = '<div class="hm-inner"><div class="hm-months">' + monthsHtml + '</div><div class="hm-grid">' + cellsHtml + '</div></div>';
}

function initHome() {
  renderDashboard();
  renderCalendar();
  renderStreak();
}

function renderDashboard() {
  const container = document.getElementById('home-dashboard');
  
  // On définit les catégories à chercher et le texte à afficher
const categories = ['livre', 'film', 'série', 'anime', 'manga', 'jeu', 'musique'];
const labels = { 
  livre: 'dernier livre lu', 
  film: 'dernier film visionné', 
  série: 'dernière série visionnée', 
  anime: 'dernier anime visionné', 
  manga: 'dernier manga lu', 
  jeu: 'dernier jeu joué', 
  musique: 'dernier projet écouté' 
};
  
  let html = `<div class="home-dashboard-title">dernières activités</div><div class="home-dashboard-grid">`;
  let hasAnyActivity = false;

  categories.forEach(cat => {
    // On filtre le journal pour ne garder que cette catégorie
    const catEntries = journal.filter(j => j.t === cat);
    
    if (catEntries.length > 0) {
      hasAnyActivity = true;
      // On prend l'entrée la plus récente (tri par date, peu importe l'ordre du fichier)
      const latestEntry = catEntries.slice().sort((x, y) => (x.d < y.d ? 1 : x.d > y.d ? -1 : 0))[0];
      
      var blurStyle = latestEntry.blur ? 'filter:blur(6px);transition:filter 0.3s;' : '';
      var ratioClass = cat === 'musique' ? ' dash-card-square' : ' dash-card-cover';
      html += `
        <div class="home-dash-card${ratioClass}">
          <img loading="lazy" src="${latestEntry.img}" alt="${latestEntry.title}" style="${blurStyle}">
          <span class="dash-label">${labels[cat]}</span>
          <span class="dash-title">${latestEntry.title}</span>
        </div>`;
    }
  });

  if (!hasAnyActivity) {
    html += `<div style="font-family: 'Space Grotesk', sans-serif; font-size: 13px; color: var(--secondary-text);">Aucune activité pour le moment.</div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

function renderCalendar() {
  const grid = document.getElementById('home-calendar-grid');
  const title = document.getElementById('home-month-title');
  
  title.textContent = moisNoms[viewedMonth] + " " + viewedYear;
  
  let html = joursNoms.map(j => `<div class="calendar-day-header">${j}</div>`).join('');
  
  const firstDay = new Date(viewedYear, viewedMonth, 1).getDay();
  const daysInMonth = new Date(viewedYear, viewedMonth + 1, 0).getDate();
  
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${viewedYear}-${String(viewedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEntries = journal.filter(j => j.d === dateStr);
    
    if (dayEntries.length > 0) {
      const badge = dayEntries.length > 1 ? `<div class="calendar-badge">+${dayEntries.length - 1}</div>` : '';
      var blurClass = dayEntries[0].blur ? ' blur-entry' : '';
      var dayStatus = getStatusLabel(dayEntries[0]);
      var statusDot = dayStatus === 'en cours' ? '<div class="calendar-status-dot ongoing"></div>' : (dayStatus === 'abandonné' ? '<div class="calendar-status-dot dropped"></div>' : '');
        html += `
        <div class="calendar-day has-data${blurClass}" data-date="${dateStr}">
          ${statusDot}
          <div class="calendar-day-num">${day}</div>
          <img loading="lazy" src="${dayEntries[0].img}" alt="${dateStr}">
          ${badge}
        </div>`;
    } else {
      html += `<div class="calendar-day"><div class="calendar-day-num">${day}</div></div>`;
    }
  }
  
  grid.innerHTML = html;
  
  document.querySelectorAll('.calendar-day.has-data').forEach(el => {
    el.addEventListener('click', (e) => openPopup(el.dataset.date));
  });
}

function changeMonth(offset) {
  viewedMonth += offset;
  if (viewedMonth > 11) {
    viewedMonth = 0;
    viewedYear++;
  } else if (viewedMonth < 0) {
    viewedMonth = 11;
    viewedYear--;
  }
  renderCalendar();
}

// ── Statuts automatiques du journal ──
function getStatusLabel(entry) {
  // Si tu as précisé un statut manuellement, on l'utilise
  if (entry.status === 'en cours') return 'en cours';
  if (entry.status === 'abandonné') return 'abandonné';
  
  // Sinon, on devine en fonction du type (t:)
  const labels = {
    'livre': 'lu',
    'manga': 'lu',
    'film': 'vu',
    'série': 'vu',
    'anime': 'terminé',
    'jeu': 'terminé',
    'musique': 'écouté'
  };
  return labels[entry.t] || '';
}

function openPopup(dateStr) {
  const popup = document.getElementById('calendar-popup');
  const content = document.getElementById('calendar-popup-content');
  const entries = journal.filter(j => j.d === dateStr);
  
  const dateObj = new Date(dateStr + "T00:00:00");
  const dateFormatee = dateObj.getDate() + " " + moisNoms[dateObj.getMonth()] + " " + dateObj.getFullYear();
  
  let html = `
    <button class="popup-close" id="popup-close-btn">&times;</button>
    <div class="popup-date">${dateFormatee}</div>
    <div class="popup-items">
  `;
  
  entries.forEach(item => {
    const dotClass = typeColors[item.t] || "";
    const noteHtml = item.note ? `<div class="popup-item-note">${item.note}</div>` : '';
    var blurClass = item.blur ? ' blur-entry' : '';
    const statusLabel = getStatusLabel(item);
    const statusClass = statusLabel === 'en cours' ? 'status-ongoing' : (statusLabel === 'abandonné' ? 'status-dropped' : 'status-done');
    const statusHtml = statusLabel ? '<div class="popup-item-status ' + statusClass + '">' + statusLabel + '</div>' : '';
    html += `
      <div class="popup-item${blurClass}">
        <img loading="lazy" src="${item.img}" alt="${item.title}">
        <div class="popup-item-title"><span class="popup-type-dot ${dotClass}"></span>${item.title}</div>
        ${noteHtml}
        ${statusHtml}
      </div>
    `;
  });
  
  html += `</div>`;
  content.innerHTML = html;
  popup.classList.add('visible');
}

function closePopup() {
  document.getElementById('calendar-popup').classList.remove('visible');
}

// Event Listeners
document.getElementById('btn-prev-month').addEventListener('click', () => changeMonth(-1));
document.getElementById('btn-next-month').addEventListener('click', () => changeMonth(1));

document.getElementById('calendar-popup').addEventListener('click', (e) => {
  if (e.target.id === 'calendar-popup' || e.target.id === 'popup-close-btn') {
    closePopup();
  }
});

document.getElementById('footer-year').textContent = new Date().getFullYear();

// Au chargement, on restaure la bonne page
window.addEventListener('load', () => {
  initHome();
  const savedPage = localStorage.getItem('activePage');
  if (savedPage && savedPage !== 'home' && document.getElementById('page-' + savedPage)) {
    navigateTo(savedPage);
  } else {
    budgieOnNavigate('home');
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopup();
});

// ── ANIME ──
const ANIME_BATCH = 50;
const TAG_BLACKLIST = ['+', '*', 'recap', 'arg', 'music.archived', 'watched', 'plan to watch', 'dropped', 'on hold', 'watching', 'rank', 'completed', ''];
const FORMAT_TAGS = ['normal episode', 'short episode', 'movie', 'short film', 'music', 'short', 'commercial', 'hentai'];
const QUALITY_TAGS = ['favorite', 'gem'];
const COLLECTION_TAGS = ['bought', 'archived', 're-watched'];
const TAG_REST_LIMIT = 20;
let animeFiltered = [];
let animeDisplayed = 0;
let activeTags = [];
let showOnlyReviewsAnime = false;
let tagsExpanded = false;
let animeSortMode = 'note';
let animeSortDir = 1; // 1 = Normal, -1 = Inversé
let _fmtE = [], _quaE = [], _rstE = [], _colE = [];

// ── Images via API Jikan avec cache persistant ──
const animeImageCache = new Map();
let imageQueue = [];
let imageLoading = false;
let cacheDirty = false;

let animeImgCacheLoaded = false;
function loadImageCache() {
  if (animeImgCacheLoaded) return; // le cache mémoire est ensuite la source de vérité
  animeImgCacheLoaded = true;
  try {
    const data = JSON.parse(localStorage.getItem('anime_img_cache'));
    if (data) Object.entries(data).forEach(([id, url]) => animeImageCache.set(parseInt(id), url));
  } catch (e) {}
}

const MAX_IMG_CACHE = 500;

function saveImageCache() {
  if (!cacheDirty) return;
  cacheDirty = false;
  if (animeImageCache.size > MAX_IMG_CACHE) {
    var entries = Array.from(animeImageCache.entries());
    animeImageCache = new Map(entries.slice(entries.length - MAX_IMG_CACHE));
  }
  try { localStorage.setItem('anime_img_cache', JSON.stringify(Object.fromEntries(animeImageCache))); } catch (e) {}
}

function queueImageLoad(animeId) {
  if (animeImageCache.has(animeId)) return;
  if (imageQueue.includes(animeId)) return;
  imageQueue.push(animeId);
  if (!imageLoading) processImageQueue();
}

function processImageQueue() {
  if (imageQueue.length === 0) { imageLoading = false; saveImageCache(); return; }
  imageLoading = true;
  const id = imageQueue.shift();
  fetch('https://api.jikan.moe/v4/anime/' + id)
    .then(r => { if (!r.ok) { var err = new Error('HTTP ' + r.status); err.status = r.status; throw err; } return r.json(); })
    .then(data => {
      if (data.data && data.data.images) {
        const url = data.data.images.jpg?.image_url || data.data.images.webp?.image_url;
        if (url) {
          animeImageCache.set(id, url);
          cacheDirty = true;
          replacePlaceholder(id, url);
        }
      }
    })
    .catch(e => { if (e && e.status === 404) failImagePlaceholder(id); }) // 404 = œuvre absente de MAL : on arrête le spinner (429/erreur réseau : on retentera au prochain rendu)
    .finally(() => { setTimeout(processImageQueue, 300); saveImageCache(); });
}

function replacePlaceholder(animeId, url) {
  const card = document.querySelector('.anime-card[data-id="' + animeId + '"]');
  if (!card) return;
  const placeholder = card.querySelector('.anime-placeholder');
  if (!placeholder) return;
  const img = document.createElement('img');
  img.src = url;
  img.alt = '';
  img.style.cssText = 'width:100%;height:220px;object-fit:cover;object-position:center;border-radius:2px;box-shadow:0 4px 8px var(--shadow-color);display:block;opacity:0;transition:opacity 0.4s;';
  img.onload = () => { placeholder.replaceWith(img); requestAnimationFrame(() => { img.style.opacity = '1'; }); };
  img.onerror = () => { img.remove(); };
}

// Marque le placeholder comme "image introuvable" (404) : stoppe le spinner, montre l'icône
function failImagePlaceholder(animeId) {
  var card = document.querySelector('.anime-card[data-id="' + animeId + '"]');
  if (!card) return;
  var placeholder = card.querySelector('.anime-placeholder');
  if (placeholder) placeholder.classList.add('img-failed');
}

// ── Tags ──
function generateAnime() {
  if (typeof animeList === 'undefined') {
    document.getElementById('animeContent').innerHTML = '<p class="empty-state">aucun résultat</p>';
    return;
  }
  loadImageCache();
  document.getElementById('anime-counter').textContent = animeList.length + " animes terminés";

  var rewatches = animeList.filter(function(a) { return a.tags.indexOf('re-watched') !== -1; }).length;
  var pct = animeList.length ? (rewatches / animeList.length * 100).toFixed(1) : 0;
  var barHtml = '<div class="project-bar"><span class="project-label">projet revisionnage : ' + rewatches + ' / ' + animeList.length + ' (' + pct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + pct + '%"></div></div></div>';
  document.getElementById('anime-project-bar').innerHTML = barHtml;

  var sortContainer = document.getElementById('anime-sort');
  sortContainer.innerHTML = '<span class="anime-sort-label">tri :</span>';
  ['note', 'titre'].forEach(function(mode) {
    var btn = document.createElement('button');
    btn.className = 'anime-sort-btn' + (animeSortMode === mode ? ' active' : '');
    btn.textContent = mode;
    btn.addEventListener('click', function() {
      // Si on clique sur le bouton QUI EST DÉJÀ actif, on inverse le sens
      if (animeSortMode === mode) {
        animeSortDir *= -1; // Passe de 1 à -1, ou de -1 à 1
      } else {
        // Sinon on change de mode et on remet le sens par défaut
        animeSortMode = mode;
        animeSortDir = 1; 
      }
      savePrefs('anime', { sortMode: animeSortMode, sortDir: animeSortDir });
      
      sortContainer.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      animeDisplayed = 0;
      applyAnimeFilter();
    });
    sortContainer.appendChild(btn);
  });

  var tagCount = {};
  animeList.forEach(function(a) {
    var hasHentai = a.tags.indexOf('hentai') !== -1;
    var hasCommercial = a.tags.indexOf('commercial') !== -1;
    a.tags.forEach(function(t) {
      if (TAG_BLACKLIST.indexOf(t) !== -1 || t.indexOf('rank:') === 0) return;
      if (hasHentai && (t === 'normal episode' || t === 'short episode')) return;
      if (hasCommercial && (t === 'short' || t === 'music' || t === 'short episode')) return;
      tagCount[t] = (tagCount[t] || 0) + 1;
    });
  });
  _fmtE = FORMAT_TAGS.map(function(ft) { return [ft, tagCount[ft] || 0]; }).filter(function(e) { return e[1] > 0; });
  _quaE = QUALITY_TAGS.map(function(qt) { return [qt, tagCount[qt] || 0]; }).filter(function(e) { return e[1] > 0; });
  _colE = COLLECTION_TAGS.map(function(ct) { return [ct, tagCount[ct] || 0]; }).filter(function(e) { return e[1] > 0; });
  _rstE = Object.entries(tagCount).filter(function(e) { return FORMAT_TAGS.indexOf(e[0]) === -1 && QUALITY_TAGS.indexOf(e[0]) === -1 && COLLECTION_TAGS.indexOf(e[0]) === -1; }).sort(function(a, b) { return b[1] - a[1]; });
  renderAnimeTags();
  applyAnimeFilter();
}

function renderAnimeTags() {
  var container = document.getElementById('anime-tags');
  var toggleBtn = document.getElementById('toggle-tags-btn');
  container.innerHTML = '';

  var allBtn = document.createElement('button');
  allBtn.className = 'anime-tag-btn' + (activeTags.length === 0 ? ' active' : '');
  allBtn.textContent = 'tous (' + animeList.length + ')';
    allBtn.addEventListener('click', function() { activeTags = []; showOnlyReviewsAnime = false; animeDisplayed = 0; savePrefs('anime', { tags: activeTags, reviews: showOnlyReviewsAnime }); renderAnimeTags(); applyAnimeFilter(); });
    
    // Petite boîte horizontale pour aligner "tous" et "reviews"
    var topRow = document.createElement('div');
    topRow.style.cssText = 'display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;';
    topRow.appendChild(allBtn);

    // Bouton Reviews pour Anime
    var hasReview = animeList.some(function(a) { return a.review; });
    if (hasReview) {
      var reviewBtn = document.createElement('button');
      reviewBtn.className = 'anime-tag-btn' + (showOnlyReviewsAnime ? ' active' : '');
      reviewBtn.textContent = 'reviews';
      reviewBtn.addEventListener('click', function() {
        showOnlyReviewsAnime = !showOnlyReviewsAnime;
        animeDisplayed = 0;
        savePrefs('anime', { reviews: showOnlyReviewsAnime });
        renderAnimeTags();
        applyAnimeFilter();
      });
      topRow.appendChild(reviewBtn); // On l'ajoute à la boîte, pas directement au container
    }
    
    container.appendChild(topRow); // On ajoute la boîte au container

  if (_fmtE.length) buildSection(container, 'format', _fmtE);
  if (_quaE.length) buildSection(container, 'qualité', _quaE);
  if (_colE.length) buildSection(container, 'collection', _colE);
  var visRest = tagsExpanded ? _rstE : _rstE.slice(0, TAG_REST_LIMIT);
  if (visRest.length) buildSection(container, 'autres', visRest);

  if (_rstE.length > TAG_REST_LIMIT) {
    toggleBtn.style.display = 'inline-block';
    toggleBtn.textContent = tagsExpanded ? 'moins' : '+' + (_rstE.length - TAG_REST_LIMIT) + ' autres';
  } else {
    toggleBtn.style.display = 'none';
  }
}

function buildSection(parent, label, entries) {
  var section = document.createElement('div');
  section.className = 'anime-tag-section';
  var lbl = document.createElement('div');
  lbl.className = 'anime-tag-section-label';
  lbl.textContent = label;
  section.appendChild(lbl);
  var wrap = document.createElement('div');
  wrap.className = 'anime-tag-section-tags';
  entries.forEach(function(entry) {
    var tag = entry[0], count = entry[1];
    var btn = document.createElement('button');
    btn.className = 'anime-tag-btn';
    if (QUALITY_TAGS.indexOf(tag) !== -1) btn.classList.add('quality-tag');
    if (activeTags.indexOf(tag) !== -1) btn.classList.add('active');
    btn.textContent = tag + ' (' + count + ')';
    btn.addEventListener('click', function() { activeTags = toggleArr(activeTags, tag); animeDisplayed = 0; savePrefs('anime', { tags: activeTags }); renderAnimeTags(); applyAnimeFilter(); });
    wrap.appendChild(btn);
  });
  section.appendChild(wrap);
  parent.appendChild(section);
}

// ── Filtre & rendu ──
function applyAnimeFilter() {
  var query = document.getElementById('search-anime').value;
  var norm = function(str) { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };

  animeFiltered = animeList.filter(function(a) {
    if (showOnlyReviewsAnime && !a.review) return false;
    if (activeTags.length) {
      // visible si éligible à au moins un des chips cochés (règles auteur dans animeMatchesTag)
      var tagOk = false;
      for (var i = 0; i < activeTags.length; i++) {
        if (animeMatchesTag(a, activeTags[i])) { tagOk = true; break; }
      }
      if (!tagOk) return false;
    }
    if (query) {
      var q = norm(query);
      return norm(a.title).indexOf(q) !== -1;
    }
    return true;
  });

  animeFiltered.sort(function(a, b) {
    if (animeSortMode === 'note') {
      if (a.note === null && b.note === null) return (a.title.localeCompare(b.title)) * animeSortDir;
      if (a.note === null) return 1;
      if (b.note === null) return -1;
      if (a.note !== b.note) return (b.note - a.note) * animeSortDir; // Le * animeSortDir fait la magie
      return a.title.localeCompare(b.title);
    } else {
      return (a.title.localeCompare(b.title)) * animeSortDir; // Le * animeSortDir fait la magie
    }
  });

  var displayedIds = {};
  animeFiltered.forEach(function(a) { displayedIds[a.id] = true; });
  imageQueue = imageQueue.filter(function(id) { return displayedIds[id]; });

  var counterText = '';
  if (showOnlyReviewsAnime) {
    counterText = animeFiltered.length + " review" + (animeFiltered.length !== 1 ? "s" : "");
  } else if (activeTags.length) {
    counterText = animeFiltered.length + ' / ' + animeList.length + ' animes';
  } else if (query) {
    counterText = animeFiltered.length + " anime" + (animeFiltered.length !== 1 ? "s" : "") + " trouvé" + (animeFiltered.length !== 1 ? "s" : "");
  } else {
    counterText = animeList.length + " anime" + (animeList.length !== 1 ? "s" : "") + " terminé" + (animeList.length !== 1 ? "s" : "");
  }
  document.getElementById('anime-counter').textContent = counterText;
  animeDisplayed = 0;
  document.getElementById('animeContent').innerHTML = '';

  if (animeFiltered.length === 0) {
    document.getElementById('animeContent').innerHTML = '<p class="empty-state">aucun résultat</p>';
    document.getElementById('load-more-anime').style.display = 'none';
    return;
  }

  renderAnimeBatch();
}

function renderAnimeBatch() {
  var container = document.getElementById('animeContent');
  var btn = document.getElementById('load-more-anime');

  if (activeTags.length === 1 && activeTags[0] === 'favorite') {
    renderTopList(container, animeFiltered, 'anime');
    btn.style.display = 'none';
    return;
  }

  var end = Math.min(animeDisplayed + ANIME_BATCH, animeFiltered.length);

  for (var i = animeDisplayed; i < end; i++) {
    var a = animeFiltered[i];
    var hue = (a.id * 137) % 360;
    var starsHtml = a.note !== null ? '<div class="book-meta">' + getStars(a.note) + '</div>' : '';

    var hasRw = a.tags.indexOf('re-watched') !== -1;
    var hasAr = a.tags.indexOf('archived') !== -1;
    var hasBo = a.tags.indexOf('bought') !== -1;
    var badges = '';
    if (hasRw || hasAr || hasBo) {
      badges = '<div class="anime-badges">';
      if (hasRw) badges += '<span class="anime-badge" title="re-watched"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></span>';
      if (hasAr) badges += '<span class="anime-badge" title="archived"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a9 9 0 0 1 9 9z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="9" x2="13" y2="9"/><line x1="9" y1="17" x2="15" y2="17"/></svg></span>';
      if (hasBo) badges += '<span class="anime-badge" title="bought"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>';
      badges += '</div>';
    }

    var imgBlock;
    if (animeImageCache.has(a.id)) {
      imgBlock = '<img loading="lazy" src="' + animeImageCache.get(a.id) + '" alt="" style="width:100%;height:220px;object-fit:cover;object-position:center;border-radius:2px;box-shadow:0 4px 8px var(--shadow-color);display:block;">';
    } else {
      imgBlock = '<div class="anime-placeholder" style="--hue:' + hue + '"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>';
      queueImageLoad(a.id);
    }

    var card = document.createElement('a');
    card.href = 'https://myanimelist.net/anime/' + a.id;
    card.target = '_blank';
    card.className = 'book-card anime-card';
    if (a.tags.indexOf('hentai') !== -1) card.className += ' hentai-card';
    if (a.tags.indexOf('favorite') !== -1) card.className += ' coup-de-coeur-card';
    if (a.tags.indexOf('gem') !== -1) card.className += ' gem-card';
    card.setAttribute('data-id', a.id);
    var reviewHtml = a.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(a.review) + '</span>' : '';
    card.innerHTML = imgBlock + badges + '<div class="book-title">' + a.title + '</div>' + starsHtml + getOldNote(a) + reviewHtml;
    container.appendChild(card);
  }

  animeDisplayed = end;
  if (animeDisplayed < animeFiltered.length) {
    btn.style.display = 'inline-block';
    btn.textContent = 'charger plus (' + (animeFiltered.length - animeDisplayed) + ' restants)';
  } else {
    btn.style.display = 'none';
  }
}

function renderTopList(container, items, type) {
  var list = document.createElement('div');
  list.className = 'top-list';

  var sorted = items.slice().sort(function(a, b) {
    var aRank = null, bRank = null;
    a.tags.forEach(function(t) { var m = t.match(/^rank:(\d+)$/); if (m) aRank = parseInt(m[1]); });
    b.tags.forEach(function(t) { var m = t.match(/^rank:(\d+)$/); if (m) bRank = parseInt(m[1]); });
    if (aRank !== null && bRank !== null) return aRank - bRank;
    if (aRank !== null) return -1;
    if (bRank !== null) return 1;
    if (a.note === null && b.note === null) return a.title.localeCompare(b.title);
    if (a.note === null) return 1; if (b.note === null) return -1;
    return b.note - a.note;
  });

  sorted.forEach(function(item, i) {
    var hue = (item.id * 137) % 360;
    var starsHtml = item.note !== null ? '<div class="top-stars">' + getStars(item.note) + '</div>' : '';

    var imgBlock;
    var cache = type === 'anime' ? animeImageCache : mangaImageCache;
    var queueFn = type === 'anime' ? queueImageLoad : queueMangaImage;
    if (cache.has(item.id)) {
      imgBlock = '<img loading="lazy" src="' + cache.get(item.id) + '" alt="">';
    } else {
      imgBlock = '<div class="' + (type === 'manga' ? 'manga-placeholder' : '') + ' anime-placeholder" style="--hue:' + hue + '"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>';
      queueFn(item.id);
    }

    var card = document.createElement('a');
    card.href = 'https://myanimelist.net/' + type + '/' + item.id;
    card.target = '_blank';
    card.className = 'top-item';
    card.innerHTML = '<div class="top-rank">' + (i + 1) + '</div>' + imgBlock + '<div class="top-info"><div class="top-title">' + item.title + '</div>' + starsHtml + '</div>';
    list.appendChild(card);
  });

  container.appendChild(list);
}

// ── MANGA ──
var MANGA_COLLECTION_TAGS = ['bought', 'archived', 're-read'];
var mangaActiveTags = [];
var mangaSortMode = 'auteur';
var mangaSortDir = 1;
var mangaImageCache = new Map();
var mangaImageQueue = [];
var mangaImageLoading = false;
var mangaCacheDirty = false;
let biblioSortMode = 'auteur';
let biblioSortDir = 1;
let biblioCollectionFilters = [];
let musiqueSortMode = 'artiste';
let musiqueFormatFilters = [];
let musiqueCollectionFilters = [];
let musiqueSortDir = 1;
let jeuxSortMode = 'note';
let jeuxSortDir = 1;
let jeuxCollectionFilters = [];
let ecransSortMode = 'réalisateur';
let filmsFormatFilters = [];
let filmsCollectionFilters = [];
let seriesCollectionFilters = [];
let ecransSortDir = 1;

// ── Mémorisation tris/filtres (chantier 8) : une clé localStorage pour toutes les pages ──
// Chaque page stocke : tags/formats actifs, reviews, tri (mode + sens). Restauration silencieuse au chargement.
var SLIDOU_PREFS_KEY = 'slidou-prefs';
function getAllPrefs() {
  try { return JSON.parse(localStorage.getItem(SLIDOU_PREFS_KEY)) || {}; } catch (e) { return {}; }
}
function savePrefs(page, patch) {
  try {
    var all = getAllPrefs();
    var cur = all[page] || {};
    for (var k in patch) cur[k] = patch[k];
    all[page] = cur;
    localStorage.setItem(SLIDOU_PREFS_KEY, JSON.stringify(all));
  } catch (e) {}
}
function toggleArr(arr, val) {
  var i = arr.indexOf(val);
  if (i === -1) return arr.concat([val]);
  var out = arr.slice(); out.splice(i, 1);
  return out;
}
// Éligibilité d'une œuvre à un chip (règles auteur conservées du filtre mono)
function animeMatchesTag(a, tag) {
  if (a.tags.indexOf(tag) === -1) return false;
  if (tag === 'normal episode' || tag === 'short episode') {
    if (a.tags.indexOf('hentai') !== -1) return false;
  }
  if (tag === 'short' || tag === 'music' || tag === 'short episode') {
    if (a.tags.indexOf('commercial') !== -1) return false;
  }
  return true;
}
function mangaMatchesTag(m, tag) {
  if (m.tags.indexOf(tag) === -1) return false;
  if (tag === 'one-shot' && m.tags.indexOf('hentai') !== -1) return false;
  return true;
}
// Restauration des préférences (une seule fois, avant le premier rendu de page)
(function restoreSlidouPrefs() {
  var p = getAllPrefs();
  if (p['bibliographie']) {
    biblioCollectionFilters = (p['bibliographie'].tags || []).slice();
    showOnlyReviewsBiblio = !!p['bibliographie'].reviews;
    if (p['bibliographie'].sortMode) biblioSortMode = p['bibliographie'].sortMode;
    if (p['bibliographie'].sortDir) biblioSortDir = p['bibliographie'].sortDir;
  }
  if (p['films']) {
    filmsCollectionFilters = (p['films'].tags || []).slice();
    filmsFormatFilters = (p['films'].formats || []).slice();
    if (p['films'].sortMode) ecransSortMode = p['films'].sortMode;
    if (p['films'].sortDir) ecransSortDir = p['films'].sortDir;
  }
  if (p['series']) {
    seriesCollectionFilters = (p['series'].tags || []).slice();
  }
  if (p['jeux']) {
    jeuxCollectionFilters = (p['jeux'].tags || []).slice();
    if (p['jeux'].sortMode) jeuxSortMode = p['jeux'].sortMode;
    if (p['jeux'].sortDir) jeuxSortDir = p['jeux'].sortDir;
  }
  if (p['musique']) {
    musiqueFormatFilters = (p['musique'].formats || []).slice();
    musiqueCollectionFilters = (p['musique'].tags || []).slice();
    if (p['musique'].sortMode) musiqueSortMode = p['musique'].sortMode;
    if (p['musique'].sortDir) musiqueSortDir = p['musique'].sortDir;
  }
  if (p['anime']) {
    activeTags = (p['anime'].tags || []).slice();
    showOnlyReviewsAnime = !!p['anime'].reviews;
    if (p['anime'].sortMode) animeSortMode = p['anime'].sortMode;
    if (p['anime'].sortDir) animeSortDir = p['anime'].sortDir;
  }
  if (p['manga']) {
    mangaActiveTags = (p['manga'].tags || []).slice();
    if (p['manga'].sortMode) mangaSortMode = p['manga'].sortMode;
    if (p['manga'].sortDir) mangaSortDir = p['manga'].sortDir;
  }
})();

let mangaImgCacheLoaded = false;
function loadMangaImageCache() {
  if (mangaImgCacheLoaded) return; // le cache mémoire est ensuite la source de vérité
  mangaImgCacheLoaded = true;
  try { var d = JSON.parse(localStorage.getItem('manga_img_cache')); if (d) Object.entries(d).forEach(function(e) { mangaImageCache.set(parseInt(e[0]), e[1]); }); } catch (e) {}
}
function saveMangaImageCache() {
  if (!mangaCacheDirty) return; mangaCacheDirty = false;
  if (mangaImageCache.size > MAX_IMG_CACHE) {
    var entries = Array.from(mangaImageCache.entries());
    mangaImageCache = new Map(entries.slice(entries.length - MAX_IMG_CACHE));
  }
  try { localStorage.setItem('manga_img_cache', JSON.stringify(Object.fromEntries(mangaImageCache))); } catch (e) {}
}
function queueMangaImage(id) {
  if (mangaImageCache.has(id) || mangaImageQueue.indexOf(id) !== -1) return;
  mangaImageQueue.push(id); if (!mangaImageLoading) processMangaImageQueue();
}
function processMangaImageQueue() {
  if (mangaImageQueue.length === 0) { mangaImageLoading = false; saveMangaImageCache(); return; }
  mangaImageLoading = true;
  var id = mangaImageQueue.shift();
  fetch('https://api.jikan.moe/v4/manga/' + id)
    .then(function(r) { if (!r.ok) { var err = new Error('HTTP ' + r.status); err.status = r.status; throw err; } return r.json(); })
    .then(function(data) {
      if (data.data && data.data.images) {
        var url = data.data.images.jpg?.image_url || data.data.images.webp?.image_url;
        if (url) { mangaImageCache.set(id, url); mangaCacheDirty = true; replaceMangaPlaceholder(id, url); }
      }
    })
    .catch(function(e) { if (e && e.status === 404) failMangaImagePlaceholder(id); })
    .finally(function() { setTimeout(processMangaImageQueue, 350); saveMangaImageCache(); });
}
function replaceMangaPlaceholder(mangaId, url) {
  var card = document.querySelector('.manga-card[data-id="' + mangaId + '"]');
  if (!card) return; var ph = card.querySelector('.manga-placeholder'); if (!ph) return;
  var img = document.createElement('img'); img.src = url; img.alt = '';
  img.style.cssText = 'width:100%;height:220px;object-fit:cover;object-position:top;border-radius:2px;box-shadow:0 4px 8px var(--shadow-color);display:block;opacity:0;transition:opacity 0.4s;';
  img.onload = function() { ph.replaceWith(img); requestAnimationFrame(function() { img.style.opacity = '1'; }); };
  img.onerror = function() { img.remove(); };
}

// Marque le placeholder manga comme "image introuvable" (404)
function failMangaImagePlaceholder(mangaId) {
  var card = document.querySelector('.manga-card[data-id="' + mangaId + '"]');
  if (!card) return;
  var placeholder = card.querySelector('.anime-placeholder');
  if (placeholder) placeholder.classList.add('img-failed');
}

function generateManga() {
  if (typeof mangaData === 'undefined') {
    document.getElementById('mangaContent').innerHTML = '<p class="empty-state">aucun résultat</p>';
    return;
  }
  loadMangaImageCache();
  var total = 0; for (var a in mangaData) total += mangaData[a].length;
  document.getElementById('manga-counter').textContent = total + " manga lu" + (total !== 1 ? "s" : "");

  var rereads = 0;
  for (var a in mangaData) {
mangaData[a].forEach(function(m) {
    if (m.tags && m.tags.indexOf('re-read') !== -1) {
        rereads++;
    }
});
  }
  var pct = total ? (rereads / total * 100).toFixed(1) : 0;
  var barHtml = '<div class="project-bar"><span class="project-label">projet relecture : ' + rereads + ' / ' + total + ' (' + pct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + pct + '%"></div></div></div>';
  document.getElementById('manga-project-bar').innerHTML = barHtml;

  var sortContainer = document.getElementById('manga-sort');
  sortContainer.innerHTML = '<span class="anime-sort-label">tri :</span>';
  ['auteur', 'note', 'titre'].forEach(function(mode) {
    var btn = document.createElement('button');
    var internalMode = mode === 'titre' ? 'alpha' : mode;
    btn.className = 'anime-sort-btn' + (mangaSortMode === internalMode ? ' active' : '');
    btn.textContent = mode;
    btn.addEventListener('click', function() {
      if (mangaSortMode === internalMode && internalMode !== 'auteur') {
        mangaSortDir *= -1;
      } else {
        mangaSortMode = internalMode;
        mangaSortDir = 1;
      }
      savePrefs('manga', { sortMode: mangaSortMode, sortDir: mangaSortDir });
      sortContainer.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderManga();
    });
    sortContainer.appendChild(btn);
  });

  var fC = document.getElementById('manga-filters'); fC.innerHTML = '';
  var allBtn = document.createElement('button');
  allBtn.className = 'anime-tag-btn' + (mangaActiveTags.length === 0 ? ' active' : '');
  allBtn.dataset.tag = '__all__';
  allBtn.textContent = 'tous (' + total + ')';
  allBtn.addEventListener('click', function() { mangaActiveTags = []; savePrefs('manga', { tags: mangaActiveTags }); renderMangaFilters(); renderManga(); });
  fC.appendChild(allBtn);

  var fmtTags = ['one-shot', 'hentai'];
  var quaTags = ['favorite', 'gem'];

  var mangaTagCount = {};
  for (var a in mangaData) {
    mangaData[a].forEach(function(m) {
      var isHentai = m.tags.indexOf('hentai') !== -1;
      m.tags.forEach(function(t) {
        if (t === 'one-shot' && isHentai) return;
        mangaTagCount[t] = (mangaTagCount[t] || 0) + 1;
      });
    });
  }
  var fmtArr = fmtTags.map(function(t) { return [t, mangaTagCount[t] || 0]; }).filter(function(e) { return e[1] > 0; });
  var quaArr = quaTags.map(function(t) { return [t, mangaTagCount[t] || 0]; }).filter(function(e) { return e[1] > 0; });

  if (fmtArr.length) {
    var s1 = document.createElement('div'); s1.className = 'anime-tag-section';
    var l1 = document.createElement('div'); l1.className = 'anime-tag-section-label'; l1.textContent = 'format'; s1.appendChild(l1);
    var w1 = document.createElement('div'); w1.className = 'anime-tag-section-tags';
    fmtArr.forEach(function(entry) {
      var tag = entry[0], count = entry[1];
      var btn = document.createElement('button');
      btn.className = 'anime-tag-btn'; if (mangaActiveTags.indexOf(tag) !== -1) btn.classList.add('active');
      btn.dataset.tag = tag;
      btn.textContent = tag + ' (' + count + ')';
      btn.addEventListener('click', function() { mangaActiveTags = toggleArr(mangaActiveTags, tag); savePrefs('manga', { tags: mangaActiveTags }); renderMangaFilters(); renderManga(); });
      w1.appendChild(btn);
    });
    s1.appendChild(w1); fC.appendChild(s1);
  }

  if (quaArr.length) {
    var s2 = document.createElement('div'); s2.className = 'anime-tag-section';
    var l2 = document.createElement('div'); l2.className = 'anime-tag-section-label'; l2.textContent = 'qualité'; s2.appendChild(l2);
    var w2 = document.createElement('div'); w2.className = 'anime-tag-section-tags';
    quaArr.forEach(function(entry) {
      var tag = entry[0], count = entry[1];
      var btn = document.createElement('button');
      btn.className = 'anime-tag-btn quality-tag'; if (mangaActiveTags.indexOf(tag) !== -1) btn.classList.add('active');
      btn.dataset.tag = tag;
      btn.textContent = tag + ' (' + count + ')';
      btn.addEventListener('click', function() { mangaActiveTags = toggleArr(mangaActiveTags, tag); savePrefs('manga', { tags: mangaActiveTags }); renderMangaFilters(); renderManga(); });
      w2.appendChild(btn);
    });
    s2.appendChild(w2); fC.appendChild(s2);
  }

  // Nouvelle section Collection
  var colArr = MANGA_COLLECTION_TAGS.map(function(t) { return [t, mangaTagCount[t] || 0]; }).filter(function(e) { return e[1] > 0; });
  if (colArr.length) {
    var s3 = document.createElement('div'); s3.className = 'anime-tag-section';
    var l3 = document.createElement('div'); l3.className = 'anime-tag-section-label'; l3.textContent = 'collection'; s3.appendChild(l3);
    var w3 = document.createElement('div'); w3.className = 'anime-tag-section-tags';
    colArr.forEach(function(entry) {
      var tag = entry[0], count = entry[1];
      var btn = document.createElement('button');
      btn.className = 'anime-tag-btn'; if (mangaActiveTags.indexOf(tag) !== -1) btn.classList.add('active');
      btn.dataset.tag = tag;
      btn.textContent = tag + ' (' + count + ')';
      btn.addEventListener('click', function() { mangaActiveTags = toggleArr(mangaActiveTags, tag); savePrefs('manga', { tags: mangaActiveTags }); renderMangaFilters(); renderManga(); });
      w3.appendChild(btn);
    });
    s3.appendChild(w3); fC.appendChild(s3);
  }

  renderManga();
}

function renderMangaFilters() {
  document.querySelectorAll('#manga-filters .anime-tag-btn').forEach(function(btn) {
    btn.classList.remove('active');
    var t = btn.dataset.tag;
    if (t === '__all__') { if (mangaActiveTags.length === 0) btn.classList.add('active'); }
    else if (t && mangaActiveTags.indexOf(t) !== -1) btn.classList.add('active');
  });
}

function renderManga() {
  var container = document.getElementById('mangaContent'); container.innerHTML = '';
  var query = document.getElementById('search-manga').value;
  var norm = function(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
  var q = query ? norm(query) : '';
  
  var total = 0; for (var a in mangaData) total += mangaData[a].length;

  if (mangaActiveTags.length === 1 && mangaActiveTags[0] === 'favorite') {
    var allFav = [];
    for (var a in mangaData) {
      mangaData[a].forEach(function(m) {
        if (m.tags.indexOf('favorite') !== -1) {
          if (q) { if (norm(m.title).indexOf(q) !== -1) allFav.push(m); }
          else { allFav.push(m); }
        }
      });
    }
    if (allFav.length === 0) {
      container.innerHTML = '<p class="empty-state">aucun résultat</p>';
      return;
    }
    document.getElementById('manga-counter').textContent = allFav.length + ' / ' + total + ' mangas';
    renderTopList(container, allFav, 'manga');
    return;
  }

  // --- VUE GLOBALE (Si on clique sur Note ou Titre) ---
  if (mangaSortMode !== 'auteur') {
    var allMangas = [];
    for (var a in mangaData) {
      var cleanAuthor = a.replace(' [completed]', '');
      mangaData[a].forEach(function(m) { 
        m._authorName = cleanAuthor; // On stocke le nom de l'auteur dans le manga
        allMangas.push(m); 
      });
    }

    var filteredGlobal = allMangas.filter(function(m) {
      if (mangaActiveTags.length) {
        var tagOk = false;
        for (var i = 0; i < mangaActiveTags.length; i++) {
          if (mangaMatchesTag(m, mangaActiveTags[i])) { tagOk = true; break; }
        }
        if (!tagOk) return false;
      }
      if (q) { return norm(m.title).indexOf(q) !== -1 || norm(m._authorName).indexOf(q) !== -1; }
      return true;
    });

    filteredGlobal.sort(function(a, b) {
      if (mangaSortMode === 'note') {
        if (a.note === null && b.note === null) return (a.title.localeCompare(b.title)) * mangaSortDir;
        if (a.note === null) return 1; if (b.note === null) return -1;
        return (b.note - a.note) * mangaSortDir;
      } else {
        return (a.title.localeCompare(b.title)) * mangaSortDir;
      }
    });

    var mangaLabel = q
      ? filteredGlobal.length + " mangas trouvé" + (filteredGlobal.length !== 1 ? "s" : "")
      : mangaActiveTags.length
        ? filteredGlobal.length + " / " + total + " mangas"
        : total + " mangas lu" + (total !== 1 ? "s" : "");
    document.getElementById('manga-counter').textContent = mangaLabel;

    if (filteredGlobal.length === 0) {
      container.innerHTML = '<p class="empty-state">aucun résultat</p>';
      return;
    }

    var div = document.createElement('div'); div.className = 'books';
    filteredGlobal.forEach(function(m) {
      var hue = (m.id * 137) % 360;
      var stars = m.note !== null ? '<div class="book-meta">' + getStars(m.note) + '</div>' : '';
      var badges = '';
      var hasRr = m.tags.indexOf('re-read') !== -1, hasAr = m.tags.indexOf('archived') !== -1, hasBo = m.tags.indexOf('bought') !== -1;
      if (hasRr || hasAr || hasBo) {
        badges = '<div class="anime-badges">';
        if (hasRr) badges += '<span class="anime-badge" title="re-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></span>';
        if (hasAr) badges += '<span class="anime-badge" title="archived"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a9 9 0 0 1 9 9z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="9" x2="13" y2="9"/><line x1="9" y1="17" x2="15" y2="17"/></svg></span>';
        if (hasBo) badges += '<span class="anime-badge" title="bought"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>';
        badges += '</div>';
      }

      var imgBlock;
      if (mangaImageCache.has(m.id)) {
                imgBlock = '<img loading="lazy" src="' + mangaImageCache.get(m.id) + '" alt="" class="manga-img-render">';
      } else {
        imgBlock = '<div class="manga-placeholder anime-placeholder" style="--hue:' + hue + '"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></div>';
        queueMangaImage(m.id);
      }

      var card = document.createElement('a');
      card.href = 'https://myanimelist.net/manga/' + m.id; card.target = '_blank';
      card.className = 'book-card manga-card';
      if (m.tags.indexOf('hentai') !== -1) card.classList.add('hentai-card');
      if (m.tags.indexOf('favorite') !== -1) card.classList.add('coup-de-coeur-card');
      if (m.tags.indexOf('gem') !== -1) card.classList.add('gem-card');
      card.setAttribute('data-id', m.id);
      var reviewHtml = m.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(m.review) + '</span>' : '';
      card.innerHTML = imgBlock + badges + '<div class="book-title">' + m.title + '</div>'  + stars + getOldNote(m) + reviewHtml;
      div.appendChild(card);
    });
    container.appendChild(div);
    return; 
  }

  // --- ANCIEN CODE (Si on est en mode "auteur") ---
  var keys = Object.keys(mangaData);

  keys.sort(function(a, b) {
    if (mangaData[b].length !== mangaData[a].length) return mangaData[b].length - mangaData[a].length;
    var aN = mangaData[a].map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    var bN = mangaData[b].map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    var aA = aN.length ? aN.reduce(function(x, y) { return x + y; }, 0) / aN.length : 0;
    var bA = bN.length ? bN.reduce(function(x, y) { return x + y; }, 0) / bN.length : 0;
    return bA - aA || a.localeCompare(b);
  });

  var totalFiltered = 0;
  keys.forEach(function(author) {
    // On vérifie d'abord si la recherche correspond au nom de l'auteur
    var authorMatch = q ? norm(author.replace(' [completed]', '')).indexOf(q) !== -1 : false;
    
    var filtered = mangaData[author].filter(function(m) {
      if (mangaActiveTags.length) {
        var tagOk = false;
        for (var i = 0; i < mangaActiveTags.length; i++) {
          if (mangaMatchesTag(m, mangaActiveTags[i])) { tagOk = true; break; }
        }
        if (!tagOk) return false;
      }
      // Si l'auteur correspond, on garde toutes ses œuvres. Sinon, on cherche par titre.
      if (q) { return authorMatch || norm(m.title).indexOf(q) !== -1; }
      return true;
    });
    totalFiltered += filtered.length;
    if (author === keys[keys.length - 1]) {
      var mangaLabel = q
        ? totalFiltered + " mangas trouvé" + (totalFiltered !== 1 ? "s" : "")
        : mangaActiveTags.length
          ? totalFiltered + " / " + total + " mangas"
          : total + " mangas lu" + (total !== 1 ? "s" : "");
      document.getElementById('manga-counter').textContent = mangaLabel;

      if (totalFiltered === 0) {
        container.innerHTML = '<p class="empty-state">aucun résultat</p>';
        return;
      }
    }
    if (filtered.length === 0) return;
    
    // CORRECTION ICI : Suppression du double bloc de tri orphelin
    filtered.sort(function(a, b) {
      if (a.note === null && b.note === null) return (a.title.localeCompare(b.title)) * mangaSortDir;
      if (a.note === null) return 1; if (b.note === null) return -1;
      return (b.note - a.note) * mangaSortDir;
    });

    container.insertAdjacentHTML('beforeend', getCreatorHeader(author, filtered.length));

    var nv = filtered.map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    if (nv.length > 1) {
      var avg = document.createElement('div'); avg.className = 'show-average';
      avg.textContent = 'moyenne : ' + (nv.reduce(function(x, y) { return x + y; }, 0) / nv.length).toFixed(1);
      container.appendChild(avg);
    }

    var div = document.createElement('div'); div.className = 'books';
    filtered.forEach(function(m) {
      var hue = (m.id * 137) % 360;
      var stars = m.note !== null ? '<div class="book-meta">' + getStars(m.note) + '</div>' : '';
      var badges = '';
      var hasRr = m.tags.indexOf('re-read') !== -1, hasAr = m.tags.indexOf('archived') !== -1, hasBo = m.tags.indexOf('bought') !== -1;
      if (hasRr || hasAr || hasBo) {
        badges = '<div class="anime-badges">';
        if (hasRr) badges += '<span class="anime-badge" title="re-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></span>';
        if (hasAr) badges += '<span class="anime-badge" title="archived"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a9 9 0 0 1 9 9z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="9" x2="13" y2="9"/><line x1="9" y1="17" x2="15" y2="17"/></svg></span>';
        if (hasBo) badges += '<span class="anime-badge" title="bought"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>';
        badges += '</div>';
      }

      var imgBlock;
      if (mangaImageCache.has(m.id)) {
                imgBlock = '<img loading="lazy" src="' + mangaImageCache.get(m.id) + '" alt="" class="manga-img-render">';
      } else {
        imgBlock = '<div class="manga-placeholder anime-placeholder" style="--hue:' + hue + '"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></div>';
        queueMangaImage(m.id);
      }

      var card = document.createElement('a');
      card.href = 'https://myanimelist.net/manga/' + m.id; card.target = '_blank';
      card.className = 'book-card manga-card';
      if (m.tags.indexOf('hentai') !== -1) card.classList.add('hentai-card');
      if (m.tags.indexOf('favorite') !== -1) card.classList.add('coup-de-coeur-card');
      if (m.tags.indexOf('gem') !== -1) card.classList.add('gem-card');
      card.setAttribute('data-id', m.id);
      var reviewHtml = m.review ? '<button class="review-btn">review</button><span class="review-data" style="display:none">' + escapeHtml(m.review) + '</span>' : '';
      card.innerHTML = imgBlock + badges + '<div class="book-title">' + m.title + '</div>'  + stars + getOldNote(m) + reviewHtml;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

// ── Outils partagés des stats enrichies ──
function flattenWorks(d) {
  if (Array.isArray(d)) return d.slice();
  var out = [];
  for (var k in d) { if (Object.prototype.hasOwnProperty.call(d, k)) out = out.concat(d[k]); }
  return out;
}
function notesOf(items) {
  return items.map(function(i) { return i.note; }).filter(function(n) { return n !== null && n !== undefined; });
}

// ── PANTHÉON : toutes les œuvres notées 5/5, une ligne carrousel par famille ──
// Covers animes/mangas : caches localStorage (remplis par les pages animes/mangas, via Jikan) — lecture passive, aucune requête ici.
function buildPantheon(container) {
  var familles = [
    { nom: 'animes',  icon: '🌸', data: (typeof animeList !== 'undefined' ? animeList : null) },
    { nom: 'mangas',  icon: '📖', data: (typeof mangaData !== 'undefined' ? mangaData : null) },
    { nom: 'livres',  icon: '📚', data: (typeof books !== 'undefined' ? books : null) },
    { nom: 'jeux',    icon: '🎮', data: (typeof games !== 'undefined' ? games : null) },
    { nom: 'projets', icon: '🎵', data: (typeof musique !== 'undefined' ? musique : null) },
    { nom: 'films',   icon: '🎬', data: (typeof films !== 'undefined' ? films : null) }
  ];
  var rows = [];
  familles.forEach(function(f) {
    if (!f.data) return;
    var cinq = flattenWorks(f.data).filter(function(it) { return it.note === 5; });
    if (cinq.length) rows.push({ nom: f.nom, icon: f.icon, items: cinq });
  });
  if (!rows.length) return;
  rows.sort(function(a, b) { return b.items.length - a.items.length; });
  var total = rows.reduce(function(a, r) { return a + r.items.length; }, 0);

  var sec = document.createElement('div');
  sec.className = 'pantheon';
  var head = document.createElement('div');
  head.className = 'stats-header';
  head.innerHTML = '<span class="stats-name">panthéon</span><span class="stats-sep"></span><span class="pantheon-total">' + total + ' coups de cœur 5/5</span>';
  sec.appendChild(head);

  rows.forEach(function(r) {
    var row = document.createElement('div');
    row.className = 'pantheon-row';
    var label = document.createElement('div');
    label.className = 'pantheon-row-label';
    label.innerHTML = '<span>' + r.icon + '</span><span>' + r.nom + '</span><span class="pantheon-row-count">' + r.items.length + '</span>';
    row.appendChild(label);
    var strip = document.createElement('div');
    strip.className = 'pantheon-strip';
    r.items.forEach(function(it) {
      var cell = document.createElement('div');
      cell.className = 'pantheon-cover';
      cell.title = (it.title || '') + ' — 5/5';
      var cov = it.cover
        || (typeof animeImageCache !== 'undefined' && it.id && animeImageCache.has(it.id) ? animeImageCache.get(it.id) : '')
        || (typeof mangaImageCache !== 'undefined' && it.id && mangaImageCache.has(it.id) ? mangaImageCache.get(it.id) : '');
      if (cov) {
        var img = document.createElement('img');
        img.src = cov; img.alt = ''; img.loading = 'lazy';
        img.addEventListener('error', function() { img.remove(); cell.classList.add('no-cover'); });
        cell.appendChild(img);
      } else {
        cell.classList.add('no-cover');
      }
      if (it.link) {
        cell.classList.add('has-link');
        cell.addEventListener('click', function() { window.open(it.link, '_blank'); });
      }
      strip.appendChild(cell);
    });
    row.appendChild(strip);
    sec.appendChild(row);
  });
  container.appendChild(sec);
}

// ── SÉVÉRITÉ COMPARÉE : la moyenne de chaque famille, côte à côte ──
// « principaux » animes = règle de l'auteur : tagués normal episode, short episode, movie ou short film
var ANIME_MAIN_FORMATS = ['normal episode', 'short episode', 'movie', 'short film'];

function buildSeverity(container) {
  var tous = typeof animeList !== 'undefined' ? animeList : [];
  var isMain = function(a) {
    return (a.tags || []).some(function(t) { return ANIME_MAIN_FORMATS.indexOf(t) !== -1; });
  };
  var aMain = tous.filter(isMain);
  var aSec = tous.filter(function(a) { return !isMain(a); });

  var defs = [];
  var addFam = function(nom, data, isAnimeMain) {
    if (!data) return;
    var items = flattenWorks(data);
    var notes = notesOf(items);
    if (!notes.length) return;
    defs.push({ nom: nom, notes: notes, total: items.length, isAnimeMain: !!isAnimeMain });
  };
  addFam('mangas', typeof mangaData !== 'undefined' ? mangaData : null);
  addFam('saisons', series);
  addFam('livres', books);
  addFam('films', films);
  addFam('animes', aMain, true);
  addFam('jeux', games);
  addFam('projets', musique);
  if (defs.length < 2) return;

  defs.forEach(function(d) {
    d.moy = d.notes.reduce(function(a, b) { return a + b; }, 0) / d.notes.length;
    d.p45 = Math.round(100 * d.notes.filter(function(x) { return x >= 4.5; }).length / d.notes.length);
    d.p2 = Math.round(100 * d.notes.filter(function(x) { return x <= 2; }).length / d.notes.length);
  });
  defs.sort(function(a, b) { return b.moy - a.moy; });

  var sec = document.createElement('div');
  sec.className = 'sev-block';
  var head = document.createElement('div');
  head.className = 'stats-header';
  head.innerHTML = '<span class="stats-name">sévérité comparée</span><span class="stats-sep"></span><span class="sev-head-note">comment tu notes, famille par famille</span>';
  sec.appendChild(head);

  defs.forEach(function(d) {
    var i = d.moy / 5;
    var col = 'hsl(' + Math.round(220 * i) + ', ' + Math.round(55 + i * 15) + '%, ' + Math.round(40 + i * 15) + '%)';
    var row = document.createElement('div');
    row.className = 'sev-row';
    row.innerHTML = '<span class="sev-label">' + d.nom + (d.isAnimeMain ? '<span class="sev-asterisk">*</span>' : '') + '</span>'
      + '<div class="sev-track"><div class="sev-fill" style="width:' + (d.moy / 5 * 100).toFixed(1) + '%;background:' + col + '"></div></div>'
      + '<span class="sev-val">' + d.moy.toFixed(2) + '</span>';
    sec.appendChild(row);
    var sub = document.createElement('div');
    sub.className = 'sev-sub';
    var parts = [d.notes.length + ' notées' + (d.total > d.notes.length ? ' / ' + d.total : ''), d.p45 + ' % ≥ 4.5', d.p2 + ' % ≤ 2'];
    sub.textContent = parts.join(' · ');
    sec.appendChild(sub);
  });

  var foot = [];
  var nTous = notesOf(tous);
  var nSec = notesOf(aSec);
  if (aSec.length && nSec.length) {
    var mTous = nTous.length ? (nTous.reduce(function(a, b) { return a + b; }, 0) / nTous.length).toFixed(2) : '-';
    var mSec = (nSec.reduce(function(a, b) { return a + b; }, 0) / nSec.length).toFixed(2);
    foot.push('* animes principaux = tagués « normal episode », « short episode », « movie » ou « short film » — tout-venant : ' + mTous + ' · à côté : ' + mSec + ' (' + aSec.length + ' entrées)');
  }
  var top = defs[0], bot = defs[defs.length - 1];
  if (top.moy - bot.moy >= 0.3) {
    foot.push('écart max : ' + top.nom + ' ' + top.moy.toFixed(2) + ' → ' + bot.nom + ' ' + bot.moy.toFixed(2) + ' (' + (top.moy - bot.moy).toFixed(2) + ' pt)');
  }
  if (foot.length) {
    var noteEl = document.createElement('div');
    noteEl.className = 'sev-note';
    foot.forEach(function(t) {
      var l = document.createElement('div');
      l.textContent = t;
      noteEl.appendChild(l);
    });
    sec.appendChild(noteEl);
  }
  container.appendChild(sec);
}

function generateStats() {
  var container = document.getElementById('statsContent');
  container.innerHTML = '';
  buildPantheon(container);

  var sections = [
    { name: 'livres', data: books, creatorLabel: 'auteur' },
    { name: 'films', data: films, creatorLabel: 'réalisateur' },
    { name: 'saisons', data: series, creatorLabel: 'série' }, // <-- CHANGÉ ICI
    { name: 'projets', data: musique, creatorLabel: 'artiste' }
  ];

  if (typeof animeList !== 'undefined') {
    var animeNotes = animeList.map(function(a) { return a.note; }).filter(function(n) { return n !== null; });
    if (animeNotes.length > 0) sections.push({ name: 'anime', notes: animeNotes });
  }

  if (typeof games !== 'undefined' && games.length > 0) {
    var gameNotes = games.map(function(g) { return g.note; }).filter(function(n) { return n !== null; });
    if (gameNotes.length > 0) sections.push({ name: 'jeux', notes: gameNotes });
  }

  if (typeof mangaData !== 'undefined') {
    sections.push({ name: 'manga', data: mangaData, creatorLabel: 'auteur' });
  }

  // --- CARTES RÉSUMÉ ---
  var cardsContainer = document.createElement('div');
  cardsContainer.className = 'stats-cards';
  
  var cardData = [
    { name: 'livres', data: books, icon: '📚' },
    { name: 'films', data: films, icon: '🎬' },
    { name: 'saisons', data: series, icon: '📺' }, // <-- CHANGÉ ICI
    { name: 'jeux', data: games, isFlat: true, icon: '🎮' },
    { name: 'projets', data: musique, icon: '🎵' },
    { name: 'animes', data: (typeof animeList !== 'undefined' ? animeList : null), isFlat: true, icon: '🌸' },
    { name: 'mangas', data: (typeof mangaData !== 'undefined' ? mangaData : null), icon: '📖' }
  ];

  cardData.forEach(function(cat) {
    if (!cat.data) return;
    var total = 0;
    var notes = [];
    
    if (cat.isFlat) {
      cat.data.forEach(function(item) { 
        total++; 
        if (item.note !== null) notes.push(item.note); 
      });
    } else {
      for (var k in cat.data) {
        cat.data[k].forEach(function(item) {
          total++;
          if (item.note !== null) notes.push(item.note);
        });
      }
    }
    
    if (total > 0) {
      var avg = notes.length > 0 ? (notes.reduce(function(a, b) { return a + b; }, 0) / notes.length).toFixed(1) : '-';
      var card = document.createElement('div');
      card.className = 'stats-card';
      card.innerHTML = `
        <div class="stats-card-icon">${cat.icon}</div>
        <div class="stats-card-count">${total}</div>
        <div class="stats-card-label">${cat.name}</div>
        <div class="stats-card-avg">moy. ${avg}</div>
      `;
      cardsContainer.appendChild(card);
    }
  });
  container.appendChild(cardsContainer);
  buildSeverity(container);

  sections.forEach(function(section) {
    var allNotes = [];
    if (section.notes) {
      allNotes = section.notes;
    } else {
      for (var key in section.data) {
        section.data[key].forEach(function(item) {
          if (item.note !== null) allNotes.push(item.note);
        });
      }
    }

    if (allNotes.length === 0) return;

    var moyenne = (allNotes.reduce(function(a, b) { return a + b; }, 0) / allNotes.length).toFixed(1);
    var counts = {};
    allNotes.forEach(function(n) {
      var k = n % 1 === 0 ? n.toString() : n.toFixed(1);
      counts[k] = (counts[k] || 0) + 1;
    });

    var sortedKeys = Object.keys(counts).sort(function(a, b) { return parseFloat(a) - parseFloat(b); });
    var maxCount = Math.max.apply(null, sortedKeys.map(function(k) { return counts[k]; }));
    var maxBarHeight = 120;

    var sectionDiv = document.createElement('div');
    sectionDiv.className = 'stats-section';

    var header = document.createElement('div');
    header.className = 'stats-header';
    header.innerHTML = '<span class="stats-name">' + section.name + '</span><span class="stats-sep"></span><span class="stats-moy">moy. ' + moyenne + '</span><span class="stats-sep"></span><span class="stats-total">' + allNotes.length + ' noté' + (allNotes.length !== 1 ? 's' : '') + '</span>';
    sectionDiv.appendChild(header);

    var barsDiv = document.createElement('div');
    barsDiv.className = 'stats-bars';

    sortedKeys.forEach(function(key) {
      var noteVal = parseFloat(key);
      var barHeight = maxCount ? Math.max(3, (counts[key] / maxCount) * maxBarHeight) : 0;

      var intensity = noteVal / 5;
      var hue = 220 * intensity;
      var sat = 55 + intensity * 15;
      var light = 40 + intensity * 15;
      var barColor = 'hsl(' + hue + ', ' + sat + '%, ' + light + '%)';

      var col = document.createElement('div');
      col.className = 'stats-vbar-col';
      col.innerHTML = '<span class="stats-vbar-count">' + counts[key] + '</span><div class="stats-vbar-fill" style="height:' + barHeight + 'px;background:' + barColor + '"></div><span class="stats-vbar-label">' + key + '</span>';
      barsDiv.appendChild(col);
    });

    // On crée la boîte flex qui contiendra le graphique et le top 3
    var mainFlex = document.createElement('div');
    mainFlex.className = 'stats-main-flex';

    var chartCol = document.createElement('div');
    chartCol.className = 'stats-chart-col';
    chartCol.appendChild(barsDiv);

    var xAxis = document.createElement('div');
    xAxis.className = 'stats-axis-x';
    xAxis.textContent = 'notes';
    chartCol.appendChild(xAxis);

    var yAxis = document.createElement('div');
    yAxis.className = 'stats-axis-y';
    yAxis.textContent = 'nombres';
    chartCol.appendChild(yAxis);

    mainFlex.appendChild(chartCol);

    if (section.creatorLabel) {
      var topKeys = Object.keys(section.data).map(function(key) {
        var cleanName = key.replace(' [completed]', '');
        var notes = section.data[key].map(function(item) { return item.note; }).filter(function(n) { return n !== null; });
        var avg = notes.length ? (notes.reduce(function(a, b) { return a + b; }, 0) / notes.length).toFixed(1) : '-';
        return { name: cleanName, count: section.data[key].length, avg: avg };
      }).sort(function(a, b) { return b.count - a.count; }).slice(0, 3);

      if (topKeys.length > 0) {
        var topDiv = document.createElement('div');
        topDiv.className = 'stats-top';
        topKeys.forEach(function(item, i) {
          var topItem = document.createElement('div');
          topItem.className = 'stats-top-item';
          var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
          topItem.innerHTML = '<span class="stats-top-rank">' + medal + '</span><span class="stats-top-name">' + item.name + '</span><span class="stats-top-info">' + item.count + ' · moy. ' + item.avg + '</span>';
          topDiv.appendChild(topItem);
        });
        mainFlex.appendChild(topDiv); // On met le Top 3 dans la boîte flex, à droite
      }
    }

    sectionDiv.appendChild(mainFlex);
    container.appendChild(sectionDiv);
  });
}

// ── Lecteur MP3 ──
var currentTrack = 0;
var isPlaying = false;
var audio = document.getElementById('player-audio');

function loadTrack(index) {
  if (typeof playerTracks === 'undefined' || playerTracks.length === 0) return;
  currentTrack = index;
  var track = playerTracks[currentTrack];
  audio.src = track.file;
  document.querySelector('.player-title').textContent = track.title;
  document.querySelector('.player-artist').textContent = track.artiste;
  document.getElementById('player-bar-fill').style.width = '0%';
  document.getElementById('player-time-current').textContent = '0:00';
  document.getElementById('player-time-total').textContent = '0:00';
  document.querySelector('.player-btn-play').textContent = '▶';
  document.querySelector('.player-btn-play').classList.remove('playing');
  isPlaying = false;
}

function formatTime(sec) {
  var m = Math.floor(sec / 60);
  var s = Math.floor(sec % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

audio.addEventListener('timeupdate', function() {
  if (audio.duration) {
    var pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('player-bar-fill').style.width = pct + '%';
    document.getElementById('player-time-current').textContent = formatTime(audio.currentTime);
    document.getElementById('player-time-total').textContent = formatTime(audio.duration);
  }
});

// Lance la lecture en absorbant les rejets de promesse (fichier manquant, politique autoplay…)
// sinon chaque échec de play() génère une erreur "Unhandled rejection" dans la console
function safePlay() {
  var p = audio.play();
  if (p && p.catch) {
    p.catch(function() {
      isPlaying = false;
      var btn = document.querySelector('.player-btn-play');
      if (btn) { btn.textContent = '▶'; btn.classList.remove('playing'); }
    });
  }
}

audio.addEventListener('ended', function() {
  if (typeof playerTracks === 'undefined' || playerTracks.length === 0) return;
  if (currentTrack < playerTracks.length - 1) {
    loadTrack(currentTrack + 1);
    safePlay();
    isPlaying = true;
    document.querySelector('.player-btn-play').textContent = '❚❚';
    document.querySelector('.player-btn-play').classList.add('playing');
  } else {
    isPlaying = false;
    document.querySelector('.player-btn-play').textContent = '▶';
    document.querySelector('.player-btn-play').classList.remove('playing');
    document.getElementById('player-bar-fill').style.width = '0%';
  }
});

document.getElementById('player-play').addEventListener('click', function() {
  if (typeof playerTracks === 'undefined' || playerTracks.length === 0) return;
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    this.textContent = '▶';
    this.classList.remove('playing');
  } else {
    if (audio.src === '') loadTrack(0);
    safePlay();
    isPlaying = true;
    this.textContent = '❚❚';
    this.classList.add('playing');
  }
});

document.getElementById('player-prev').addEventListener('click', function() {
  if (typeof playerTracks === 'undefined' || playerTracks.length === 0) return;
  var idx = currentTrack - 1;
  if (idx < 0) idx = playerTracks.length - 1;
  loadTrack(idx);
  if (isPlaying) safePlay();
});

document.getElementById('player-next').addEventListener('click', function() {
  if (typeof playerTracks === 'undefined' || playerTracks.length === 0) return;
  var idx = currentTrack + 1;
  if (idx >= playerTracks.length) idx = 0;
  loadTrack(idx);
  if (isPlaying) safePlay();
});

document.getElementById('player-bar').addEventListener('click', function(e) {
  if (audio.duration) {
    var rect = this.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  }
});

if (typeof playerTracks !== 'undefined' && playerTracks.length > 0) loadTrack(0);

document.getElementById('toggle-tags-btn').addEventListener('click', function() { tagsExpanded = !tagsExpanded; renderAnimeTags(); });
document.getElementById('search-anime').addEventListener('input', function() { animeDisplayed = 0; applyAnimeFilter(); });
document.getElementById('load-more-anime').addEventListener('click', renderAnimeBatch);
document.getElementById('search-manga').addEventListener('input', function() { renderManga(); });

// ── RÉDUIRE LES CRÉATEURS (Écouteur global) ──
document.addEventListener('click', function(e) {
  // Si on clique sur le titre d'un créateur (ou un enfant comme le badge)
  var header = e.target.closest('h2.creator-toggle');
  if (!header) return;

  // On cherche tous les éléments qui suivent le titre jusqu'au prochain titre
  var sibling = header.nextElementSibling;
  while (sibling && sibling.tagName !== 'H2') {
    if (sibling.classList.contains('books') || sibling.classList.contains('show-average')) {
      sibling.classList.toggle('hidden-books');
    }
    sibling = sibling.nextElementSibling;
  }
  
  // On fait tourner la flèche
  header.classList.toggle('collapsed-creator');
});

// ── Remplir "En ce moment" sur la page À propos ──
function renderCurrently() {
  var list = document.getElementById('currently-list');
  if (!list) return;
  list.innerHTML = '';

  var current = {
    livre: null, film: null, série: null, 
    anime: null, manga: null, jeu: null, musique: null
  };
  var labels = {
    livre: 'lecture', film: 'film', série: 'série', 
    anime: 'anime', manga: 'manga', jeu: 'jeu', musique: 'musique'
  };

  // On parcourt le journal à l'envers (du plus récent au plus ancien)
  for (var i = journal.length - 1; i >= 0; i--) {
    var entry = journal[i];
    // Si c'est "en cours" et qu'on n'a pas encore trouvé ce type de média
    if (entry.status === 'en cours' && current[entry.t] === null) {
      current[entry.t] = entry.title;
    }
  }

  var hasContent = false;
  for (var cat in current) {
    if (current[cat]) {
      hasContent = true;
      var li = document.createElement('li');
      li.innerHTML = '<span>' + labels[cat] + '</span> ' + current[cat];
      list.appendChild(li);
    }
  }

  if (!hasContent) {
    list.innerHTML = '<li><span>rien</span> en cours pour le moment</li>';
  }
}

// ── RECHERCHE GLOBALE (palette Ctrl+K) ──
// Palette centrée ouverte par Ctrl+K / ⌘K, l'input de la sidebar ou un bouton loupe (mobile).
// Moteur : ET multi-mots insensible accents/casse, score préfixe > début de mot > sous-chaîne,
// créateurs favorisés (règle historique), surlignage des fragments, limite par catégorie.
(function() {
  const palette = document.getElementById('search-palette');
  const input = document.getElementById('palette-input');
  const results = document.getElementById('palette-results');
  const trigger = document.getElementById('global-search');
  const mobileBtn = document.getElementById('search-toggle');
  if (!palette || !input || !results || !trigger) return;

  const typeColors = {
    'Livre': "#ef5350", 'Film': "#42A5F5", 'Série': "#26A69A",
    'Jeu': "#66BB6A", 'Musique': "#AB47BC", 'Anime': "#EC407A", 'Manga': "#FF7043"
  };
  const pageMap = {
    'Livre': { page: 'bibliographie', input: 'search-biblio' },
    'Film': { page: 'ecrans', input: 'search-ecrans' },
    'Série': { page: 'ecrans', input: 'search-ecrans' },
    'Jeu': { page: 'jeux', input: 'search-jeux' },
    'Musique': { page: 'musique', input: 'search-musique' },
    'Anime': { page: 'anime', input: 'search-anime' },
    'Manga': { page: 'manga', input: 'search-manga' }
  };
  const MAX_PAR_CATEGORIE = { creator: 3, oeuvre: 6 };
  const MAX_TOTAL = 40;

  let items = [];       // éléments .gs-item affichés (navigation clavier)
  let selIndex = -1;
  let lastMatches = [];
  let candidats = null; // cache : listes aplaties en candidats de recherche

  const norm = function(str) { return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); };

  // Normalise en conservant la correspondance vers les indices d'origine (pour le surlignage)
  function normMap(str) {
    const src = String(str || '');
    const nfd = src.normalize('NFD');
    let out = '', map = [];
    for (let i = 0; i < nfd.length; i++) {
      const ch = nfd[i];
      if (ch >= '\u0300' && ch <= '\u036f') continue; // diacritiques
      out += ch.toLowerCase();
      map.push(i);
    }
    return { s: out, map: map };
  }

  // Entoure de <mark> chaque fragment qui matche un token (indices remappés sur la chaîne d'origine)
  function highlight(text, tokens) {
    const src = String(text || '');
    const nm = normMap(src);
    const ranges = [];
    tokens.forEach(function(tk) {
      let from = 0, idx;
      while ((idx = nm.s.indexOf(tk, from)) !== -1) {
        const s = nm.map[idx], e = nm.map[idx + tk.length - 1];
        if (s !== undefined && e !== undefined) ranges.push([s, e + 1]);
        from = idx + 1;
      }
    });
    if (!ranges.length) return escapeHtml(src);
    ranges.sort(function(a, b) { return a[0] - b[0]; });
    const merged = [ranges[0]];
    for (let i = 1; i < ranges.length; i++) {
      const last = merged[merged.length - 1];
      if (ranges[i][0] <= last[1]) last[1] = Math.max(last[1], ranges[i][1]);
      else merged.push(ranges[i]);
    }
    let out = '', pos = 0;
    merged.forEach(function(r) {
      out += escapeHtml(src.slice(pos, r[0])) + '<mark>' + escapeHtml(src.slice(r[0], r[1])) + '</mark>';
      pos = r[1];
    });
    return out + escapeHtml(src.slice(pos));
  }

  // Aplatit les 7 listes en candidats {cat, title, sub, isCreator, creator, item}
  function collectCandidats() {
    const cands = [];
    function scanGrouped(data, catName, creatorLabel) {
      if (!data) return;
      Object.keys(data).forEach(function(key) {
        const cleanKey = key.replace(' [completed]', '');
        cands.push({ cat: catName, title: cleanKey, sub: creatorLabel + ' · ' + data[key].length + ' œuvres', isCreator: true, creator: '' });
        data[key].forEach(function(item) {
          cands.push({ cat: catName, title: item.title, sub: cleanKey, isCreator: false, creator: cleanKey, item: item });
        });
      });
    }
    function scanFlat(data, catName) {
      if (!data) return;
      (Array.isArray(data) ? data : []).forEach(function(item) {
        cands.push({ cat: catName, title: item.title, sub: '', isCreator: false, creator: '', item: item });
      });
    }
    if (typeof books !== 'undefined') scanGrouped(books, 'Livre', 'Auteur');
    if (typeof films !== 'undefined') scanGrouped(films, 'Film', 'Réalisateur');
    if (typeof series !== 'undefined') scanGrouped(series, 'Série', 'Série');
    if (typeof games !== 'undefined' && games.length) scanFlat(games, 'Jeu');
    if (typeof musique !== 'undefined') scanGrouped(musique, 'Musique', 'Artiste');
    if (typeof animeList !== 'undefined') scanFlat(animeList, 'Anime');
    if (typeof mangaData !== 'undefined') scanGrouped(mangaData, 'Manga', 'Auteur');
    return cands;
  }

  // -1 = ne matche pas, sinon score (chaque token doit matcher titre OU créateur)
  function scoreCandidat(m, tokens) {
    const t = norm(m.title);
    const c = m.isCreator ? '' : norm(m.creator);
    let score = 0;
    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i];
      const ti = t.indexOf(tk), ci = c ? c.indexOf(tk) : -1;
      if (ti === -1 && ci === -1) return -1;
      let best = 0;
      if (ti !== -1) {
        if (ti === 0) best = 60;                                   // préfixe du titre
        else if (/[^a-z0-9]/.test(t.charAt(ti - 1))) best = 35;    // début de mot
        else best = 10;                                            // sous-chaîne
      }
      if (ci !== -1) best = Math.max(best, 20);                    // match créateur
      score += best;
    }
    if (t === tokens.join(' ')) score += 300;                      // titre exact
    return score;
  }

  function coverOf(m) {
    if (!m.item) return '';
    return m.item.cover
      || (m.cat === 'Anime' && typeof animeImageCache !== 'undefined' && animeImageCache.has(m.item.id) ? animeImageCache.get(m.item.id) : '')
      || (m.cat === 'Manga' && typeof mangaImageCache !== 'undefined' && mangaImageCache.has(m.item.id) ? mangaImageCache.get(m.item.id) : '');
  }

  function showHint(html) {
    items = []; selIndex = -1; lastMatches = [];
    results.innerHTML = '<div class="search-palette-hint">' + html + '</div>';
  }

  function runSearch(qRaw) {
    const tokens = norm(qRaw).split(/\s+/).filter(Boolean);
    if (!tokens.length) { showHint('commence à taper pour chercher dans toutes les listes…'); return; }
    if (!candidats) candidats = collectCandidats();

    const scored = [];
    candidats.forEach(function(m) {
      const s = scoreCandidat(m, tokens);
      if (s > 0) scored.push({ m: m, s: s });
    });
    scored.sort(function(a, b) {
      if (a.m.isCreator !== b.m.isCreator) return a.m.isCreator ? -1 : 1; // créateurs en haut (règle historique)
      if (b.s !== a.s) return b.s - a.s;
      if (a.m.title.length !== b.m.title.length) return a.m.title.length - b.m.title.length;
      return a.m.title.localeCompare(b.m.title);
    });

    // limite par catégorie pour que toutes les familles restent visibles
    const parCat = {}, final = [];
    for (let i = 0; i < scored.length && final.length < MAX_TOTAL; i++) {
      const m = scored[i].m;
      const cap = m.isCreator ? MAX_PAR_CATEGORIE.creator : MAX_PAR_CATEGORIE.oeuvre;
      parCat[m.cat] = parCat[m.cat] || 0;
      if (parCat[m.cat] >= cap) continue;
      parCat[m.cat]++;
      final.push(m);
    }

    // rendu
    items = []; selIndex = -1; lastMatches = final;
    results.innerHTML = '';
    if (!final.length) {
      results.innerHTML = '<div class="search-palette-hint">aucun résultat pour « ' + escapeHtml(qRaw) + ' »</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    final.forEach(function(m, i) {
      const el = document.createElement('div');
      el.className = 'gs-item';
      el.style.cursor = 'pointer';
      const dot = '<span class="popup-type-dot" style="background:' + typeColors[m.cat] + '; margin-right:0; flex-shrink:0;"></span>';
      let imgHtml;
      if (m.isCreator) {
        imgHtml = '<div class="gs-creator-avatar"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>';
      } else {
        const cov = coverOf(m);
        imgHtml = cov ? '<img src="' + cov + '" alt="">' : '<div style="width:32px;height:48px;background:var(--border-color);border-radius:3px;flex-shrink:0;"></div>';
      }
      const subHtml = m.isCreator ? escapeHtml(m.sub) : escapeHtml(m.cat.toLowerCase() + (m.sub ? ' · ' + m.sub : ''));
      el.innerHTML = dot + imgHtml + '<div class="gs-item-info"><div class="gs-item-title">' + highlight(m.title, tokens) + '</div><div class="gs-item-sub">' + subHtml + '</div></div>';
      el.addEventListener('click', function() { openResult(m); });
      el.addEventListener('mousemove', function() { select(i); });
      frag.appendChild(el);
      items.push(el);
    });
    results.appendChild(frag);
  }

  function select(i) {
    if (!items.length) return;
    if (selIndex >= 0 && items[selIndex]) items[selIndex].classList.remove('selected');
    selIndex = i;
    items[selIndex].classList.add('selected');
    items[selIndex].scrollIntoView({ block: 'nearest' });
  }

  function openResult(m) {
    closePalette();
    navigateTo(pageMap[m.cat].page);
    const localInput = document.getElementById(pageMap[m.cat].input);
    if (localInput) {
      localInput.value = m.title;
      localInput.dispatchEvent(new Event('input'));
    }
    // Page Écrans : bascule sur la bonne sous-page (films ou séries)
    if (m.cat === 'Film' || m.cat === 'Série') {
      const targetSub = (m.cat === 'Série') ? 'series' : 'films';
      const activeSub = document.querySelector('.sub-nav-link.active');
      if (!activeSub || activeSub.dataset.subpage !== targetSub) {
        const subLink = document.querySelector('.sub-nav-link[data-subpage="' + targetSub + '"]');
        if (subLink) subLink.click();
      }
    }
  }

  function openPalette() {
    palette.classList.add('open');
    input.value = '';
    showHint('commence à taper pour chercher dans toutes les listes…');
    input.focus();
  }
  function closePalette() {
    palette.classList.remove('open');
    input.blur();
  }

  // Déclencheurs
  trigger.addEventListener('click', openPalette);
  if (mobileBtn) mobileBtn.addEventListener('click', openPalette);
  palette.addEventListener('click', function(e) { if (e.target === palette) closePalette(); });

  // Raccourcis clavier globaux : Ctrl+K / ⌘K ouvre, Échap ferme
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('open')) input.focus(); else openPalette();
    } else if (e.key === 'Escape' && palette.classList.contains('open')) {
      closePalette();
    }
  });

  // Clavier dans la palette : ↑ ↓ naviguent, Entrée ouvre
  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (items.length) select((selIndex + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (items.length) select((selIndex - 1 + items.length) % items.length); }
    else if (e.key === 'Enter') { e.preventDefault(); if (selIndex >= 0 && items[selIndex]) items[selIndex].click(); }
  });

  // Recherche à la frappe (léger debounce)
  let searchTimer;
  input.addEventListener('input', function() {
    clearTimeout(searchTimer);
    const v = input.value;
    searchTimer = setTimeout(function() { runSearch(v); }, 120);
  });
})();

// ── PWA : enregistrement du service worker ──
// (uniquement en contexte sécurisé : https en production, localhost en test local)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').catch(function() {
      /* en cas d'échec (fichier absent, vieux navigateur…), le site fonctionne comme avant */
    });
  });
}
