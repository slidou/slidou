let showOnlyReviewsBiblio = false;

function filterByReview(data) {
  const result = {};
  for (const category in data) {
    const reviewedItems = data[category].filter(item => item.review);
    if (reviewedItems.length > 0) result[category] = reviewedItems;
  }
  return result;
}

// ── Chargement des données ──
let books, films, series, games, musique, journal;
try { books = booksData; } catch(e) { books = {}; }
try { films = filmsData; } catch(e) { films = {}; }
try { series = seriesData; } catch(e) { series = {}; }
try { games = gamesData; } catch(e) { games = []; }
try { musique = musicData; } catch(e) { musique = {}; }
try { journal = journalData; } catch(e) { journal = {}; }
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

// ── Helper pour le badge Archived ──
function getArchivedBadge(item) {
  if (item.tags && item.tags.indexOf('archived') !== -1) {
    return '<div class="anime-badges"><span class="anime-badge" title="archived"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a9 9 0 0 1 9 9z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="9" x2="13" y2="9"/><line x1="9" y1="17" x2="15" y2="17"/></svg></span></div>';
  }
  return '';
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
    biblioCollectionFilter = null;
    showOnlyReviewsBiblio = false;
    document.getElementById('bibliographyContent').dataset.initialized = '';
    document.getElementById('search-biblio').value = '';
    generateBibliography();
  }
  if (page === 'ecrans') {
    ecransSearchQuery = '';
    filmsFormatFilter = null;
    ecransCollectionFilter = null;
    document.getElementById('search-ecrans').value = '';
    updateEcransCounter();

      var activeSubEcran = document.querySelector('.sub-nav-link.active').dataset.subpage;
      setupEcransSort(activeSubEcran);

    generateFilms();
  }
  if (page === 'jeux') {
    jeuxCollectionFilter = null;
    document.getElementById('search-jeux').value = '';
    generateGames();
  }
  if (page === 'musique') {
    musiqueFormatFilter = null;
    musiqueCollectionFilter = null;
    document.getElementById('search-musique').value = '';
    generateMusique();
  }
  if (page === 'anime') {
    showOnlyReviewsAnime = false;
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
  
  let totalBooks = 0;
  for (const author in data) totalBooks += data[author].length;
  let globalTotalBooks = 0;
  for (const a in books) globalTotalBooks += books[a].length;
  
  let label;
  if (isSearch || biblioCollectionFilter) {
    label = totalBooks + " / " + globalTotalBooks + " livre" + (globalTotalBooks !== 1 ? "s" : "");
  } else if (showOnlyReviewsBiblio) {
    label = totalBooks + " / " + globalTotalBooks + " review" + (globalTotalBooks !== 1 ? "s" : "");
  } else {
    label = totalBooks + " livre" + (totalBooks !== 1 ? "s" : "") + " lu" + (totalBooks !== 1 ? "s" : "");
  }
  
  document.getElementById('biblio-counter').textContent = label;

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
    allBtn.className = 'anime-tag-btn' + (biblioCollectionFilter === null && !showOnlyReviewsBiblio ? ' active' : '');
    allBtn.textContent = 'tous';
    allBtn.addEventListener('click', function() { biblioCollectionFilter = null; showOnlyReviewsBiblio = false; generateBibliography(); });
    topRow.appendChild(allBtn);

    if (hasReview) {
      var reviewBtn = document.createElement('button');
      reviewBtn.className = 'anime-tag-btn' + (showOnlyReviewsBiblio ? ' active' : '');
      reviewBtn.textContent = 'reviews';
      reviewBtn.addEventListener('click', function() {
        showOnlyReviewsBiblio = !showOnlyReviewsBiblio;
        biblioCollectionFilter = null;
        document.getElementById('search-biblio').value = '';
        generateBibliography(showOnlyReviewsBiblio ? filterByReview(books) : books);
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
        btn.className = 'anime-tag-btn' + (biblioCollectionFilter === tag ? ' active' : '');
        btn.textContent = tag + ' (' + collCounts[tag] + ')';
        btn.addEventListener('click', function(t) { return function() { biblioCollectionFilter = biblioCollectionFilter === t ? null : t; showOnlyReviewsBiblio = false; generateBibliography(); }; }(tag));
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
      bBar.innerHTML = '<div class="project-bar"><span class="project-label">projet re-read : ' + rereadCount + ' / ' + totalB + ' (' + pct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + pct + '%"></div></div></div>';
    } else { bBar.innerHTML = ''; }
  }

  if (biblioCollectionFilter) {
    var filteredBiblio = {};
    for (var auth in data) {
      var validBooks = data[auth].filter(function(b) {
        return b.tags && b.tags.indexOf(biblioCollectionFilter) !== -1;
      });
      if (validBooks.length > 0) filteredBiblio[auth] = validBooks;
    }
    data = filteredBiblio;
  }

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
      document.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('bibliographyContent').dataset.initialized = '';
      
      // On vérifie si on était en mode "reviews" avant de trier
      var dataToUse = showOnlyReviewsBiblio ? filterByReview(books) : books;
      generateBibliography(dataToUse);
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

  if (sortDataKeys(data).length === 0) {
    listContainer.innerHTML = '<p class="empty-state">aucun résultat</p>';
    return;
  }

  sortDataKeys(data).forEach(function(author) {
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
    
    filmsFormatFilter = null;
    ecransCollectionFilter = null;

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
    
    let isFilmsFiltered = isSearch || filmsFormatFilter || ecransCollectionFilter;
    let isSeriesFiltered = isSearch || ecransCollectionFilter;
    
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

  // 1. Génération des boutons de filtre
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
    
    // LIGNE 1 : Le bouton "Tous" seul au centre
    var row1 = document.createElement('div'); 
    row1.style.cssText = 'display: flex; gap: 8px; justify-content: center;';
    
    var allBtn = document.createElement('button');
    allBtn.className = 'anime-tag-btn' + (filmsFormatFilter === null && ecransCollectionFilter === null ? ' active' : '');
    allBtn.textContent = 'tous (' + (shortCount + featureCount) + ')';
    allBtn.addEventListener('click', function() { 
      filmsFormatFilter = null; 
      ecransCollectionFilter = null; // <-- On ajoute ça pour vider la collection
      generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); 
    });
    row1.appendChild(allBtn);
    fC.appendChild(row1);

    // SECTION FORMAT : Longs et Courts métrages
    var fmtSection = document.createElement('div');
    fmtSection.className = 'anime-tag-section';

    var fmtLabel = document.createElement('div');
    fmtLabel.className = 'anime-tag-section-label';
    fmtLabel.textContent = 'format';
    fmtSection.appendChild(fmtLabel);

    var fmtWrap = document.createElement('div');
    fmtWrap.className = 'anime-tag-section-tags';

    if (featureCount > 0) {
      var featBtn = document.createElement('button');
      featBtn.className = 'anime-tag-btn' + (filmsFormatFilter === 'long' ? ' active' : '');
      featBtn.textContent = 'longs métrages (' + featureCount + ')';
      featBtn.addEventListener('click', function() { 
        filmsFormatFilter = filmsFormatFilter === 'long' ? null : 'long';
        ecransCollectionFilter = null;
        generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); 
      });
      fmtWrap.appendChild(featBtn);
    }

    if (shortCount > 0) {
      var shortBtn = document.createElement('button');
      shortBtn.className = 'anime-tag-btn' + (filmsFormatFilter === 'court' ? ' active' : '');
      shortBtn.textContent = 'courts métrages (' + shortCount + ')';
      shortBtn.addEventListener('click', function() { 
        filmsFormatFilter = filmsFormatFilter === 'court' ? null : 'court';
        ecransCollectionFilter = null;
        generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); 
      });
      fmtWrap.appendChild(shortBtn);
    }
    
    // On ajoute la section format seulement si elle contient au moins un bouton
    if (fmtWrap.children.length > 0) {
      fmtSection.appendChild(fmtWrap);
      fC.appendChild(fmtSection);
    }

    // SECTION COLLECTION FILMS
    var fCollCounts = { 're-watched': 0, 'archived': 0 };
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
        fBtn.className = 'anime-tag-btn' + (ecransCollectionFilter === fTag ? ' active' : '');
        fBtn.textContent = fTag + ' (' + fCollCounts[fTag] + ')';
        fBtn.addEventListener('click', function(t) { return function() { ecransCollectionFilter = ecransCollectionFilter === t ? null : t; filmsFormatFilter = null; generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); }; }(fTag));
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
        fQualBtn.className = 'anime-tag-btn quality-tag' + (ecransCollectionFilter === fQualTag ? ' active' : '');
        fQualBtn.textContent = fQualTag + ' (' + fQualCounts[fQualTag] + ')';
        fQualBtn.addEventListener('click', function(t) { return function() { ecransCollectionFilter = ecransCollectionFilter === t ? null : t; filmsFormatFilter = null; generateFilms(filterData(films, ecransSearchQuery), !!ecransSearchQuery); }; }(fQualTag));
        fQualWrap.appendChild(fQualBtn);
      }
    }
    if (fQualWrap.children.length > 0) { fQualSection.appendChild(fQualWrap); fC.appendChild(fQualSection); }
  }

  // BARRE PROGRESSION RE-WATCH FILMS
  var fBar = document.getElementById('films-project-bar');
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
      fBar.innerHTML = '<div class="project-bar"><span class="project-label">projet re-watch : ' + fRewatchCount + ' / ' + fTotal + ' (' + fPct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + fPct + '%"></div></div></div>';
    } else { fBar.innerHTML = ''; }
  }

  // 2. Application du filtre sur les données
  if (filmsFormatFilter || ecransCollectionFilter) {
    var filteredData = {};
    for (var director in data) {
      var validMovies = data[director].filter(function(movie) {
        var isShort = movie.tags && movie.tags.indexOf('court métrage') !== -1;
        var fmtOk = true;
        if (filmsFormatFilter === 'court') fmtOk = isShort;
        if (filmsFormatFilter === 'long') fmtOk = !isShort;
        var collOk = ecransCollectionFilter ? (movie.tags && movie.tags.indexOf(ecransCollectionFilter) !== -1) : true;
        return fmtOk && collOk;
      });
      if (validMovies.length > 0) filteredData[director] = validMovies;
    }
    data = filteredData;
  }

  // Mise à jour du compteur Écrans (Films)
  var fCount = Object.values(data).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var fGlobal = Object.values(films).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var isFilt = isSearch || filmsFormatFilter || ecransCollectionFilter;
  var tFilms = isFilt ? fCount + " / " + fGlobal + " film" + (fGlobal !== 1 ? "s" : "") : fGlobal + " film" + (fGlobal !== 1 ? "s" : "") + " vu" + (fGlobal !== 1 ? "s" : "");

  var sCount = Object.values(series).reduce(function(acc, arr) { 
    return acc + (ecransCollectionFilter ? arr.filter(function(s) { return s.tags && s.tags.indexOf(ecransCollectionFilter) !== -1; }).length : arr.length); 
  }, 0);
  var sGlobal = Object.values(series).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var tSeries = ecransCollectionFilter ? sCount + " / " + sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") : sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") + " suivie" + (sGlobal !== 1 ? "s" : "");

  document.getElementById('ecrans-counter').textContent = tFilms + " • " + tSeries;

  // Mise à jour de la barre de progression re-watch
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
      fBar.innerHTML = '<div class="project-bar"><span class="project-label">projet re-watch : ' + fRewatchCount + ' / ' + fTotal + ' (' + fPct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + fPct + '%"></div></div></div>';
    } else { fBar.innerHTML = ''; }
  }

  // --- VUE GLOBALE FILMS ---
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

  if (sortDataKeys(data).length === 0) {
    container.innerHTML = '<p class="empty-state">aucun résultat</p>';
    return;
  }

  sortDataKeys(data).forEach(function(director) {
    container.insertAdjacentHTML('beforeend', getCreatorHeader(director, data[director].length));

    const notesValides = data[director].map(m => m.note).filter(n => n !== null);
    if (notesValides.length > 1) {
      const moyenne = (notesValides.reduce((acc, note) => acc + note, 0) / notesValides.length).toFixed(1);
      const avgDiv = document.createElement('div');
      avgDiv.className = 'show-average';
      avgDiv.textContent = "moyenne : " + moyenne;
      container.appendChild(avgDiv);
    }

    const div = document.createElement('div');
    div.className = 'books';
    sortEntriesByNote(data[director]).forEach(function(movie) {
      const card = document.createElement('a');
      card.href = movie.link; 
      card.target = "_blank"; 
      card.className = 'book-card';
      
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

  // Mise à jour du compteur Écrans
  var sCount = Object.values(data).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var sGlobal = Object.values(series).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var sFilt = isSearch || ecransCollectionFilter;
  var tSeries = sFilt ? sCount + " / " + sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") : sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") + " suivie" + (sGlobal !== 1 ? "s" : "");

  var fCount = Object.values(films).reduce(function(acc, arr) { 
    return acc + (ecransCollectionFilter ? arr.filter(function(m) { return m.tags && m.tags.indexOf(ecransCollectionFilter) !== -1; }).length : arr.length); 
  }, 0);
  var fGlobal = Object.values(films).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var fFilt = ecransCollectionFilter || filmsFormatFilter;
  var tFilms = fFilt ? fCount + " / " + fGlobal + " film" + (fGlobal !== 1 ? "s" : "") : fGlobal + " film" + (fGlobal !== 1 ? "s" : "") + " vu" + (fGlobal !== 1 ? "s" : "");

  document.getElementById('ecrans-counter').textContent = tFilms + " • " + tSeries;

  // 1. Filtres collection Séries
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
    sAllBtn.className = 'anime-tag-btn' + (ecransCollectionFilter === null ? ' active' : ''); // <-- Celle-ci est déjà bonne, mais vérifie juste qu'elle est bien là.
    sAllBtn.textContent = 'tous';
    sAllBtn.addEventListener('click', function() { ecransCollectionFilter = null; generateSeries(filterData(series, ecransSearchQuery), !!ecransSearchQuery); });
    sTopRow.appendChild(sAllBtn);
    sF.appendChild(sTopRow);

    var sCollSection = document.createElement('div'); sCollSection.className = 'anime-tag-section';
    var sCollLabel = document.createElement('div'); sCollLabel.className = 'anime-tag-section-label'; sCollLabel.textContent = 'collection'; sCollSection.appendChild(sCollLabel);
    var sCollWrap = document.createElement('div'); sCollWrap.className = 'anime-tag-section-tags';
    for (var sTag in sCollCounts) {
      if (sCollCounts[sTag] > 0) {
        var sBtn = document.createElement('button');
        sBtn.className = 'anime-tag-btn' + (ecransCollectionFilter === sTag ? ' active' : '');
        sBtn.textContent = sTag + ' (' + sCollCounts[sTag] + ')';
        sBtn.addEventListener('click', function(t) { return function() { ecransCollectionFilter = ecransCollectionFilter === t ? null : t; generateSeries(filterData(series, ecransSearchQuery), !!ecransSearchQuery); }; }(sTag));
        sCollWrap.appendChild(sBtn);
      }
    }
    if (sCollWrap.children.length > 0) { sCollSection.appendChild(sCollWrap); sF.appendChild(sCollSection); }

    // SECTION QUALITÉ SÉRIES
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
        sQualBtn.className = 'anime-tag-btn quality-tag' + (ecransCollectionFilter === sQualTag ? ' active' : '');
        sQualBtn.textContent = sQualTag + ' (' + sQualCounts[sQualTag] + ')';
        sQualBtn.addEventListener('click', function(t) { return function() { ecransCollectionFilter = ecransCollectionFilter === t ? null : t; generateSeries(filterData(series, ecransSearchQuery), !!ecransSearchQuery); }; }(sQualTag));
        sQualWrap.appendChild(sQualBtn);
      }
    }
    if (sQualWrap.children.length > 0) { sQualSection.appendChild(sQualWrap); sF.appendChild(sQualSection); }
  }

  // Barre progression re-watch Séries
  var sBar = document.getElementById('series-project-bar');
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
      sBar.innerHTML = '<div class="project-bar"><span class="project-label">projet re-watch : ' + sRewatchCount + ' / ' + sTotal + ' (' + sPct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + sPct + '%"></div></div></div>';
    } else { sBar.innerHTML = ''; }
  }

  // Application du filtre
  if (ecransCollectionFilter) {
    var filteredSeriesData = {};
    for (var showKey in data) {
      var validSeasons = data[showKey].filter(function(season) {
        return season.tags && season.tags.indexOf(ecransCollectionFilter) !== -1;
      });
      if (validSeasons.length > 0) filteredSeriesData[showKey] = validSeasons;
    }
    data = filteredSeriesData;
  }

  // Mise à jour du compteur Écrans (Séries)
  var sCount = Object.values(data).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var sGlobal = Object.values(series).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var sFilt = isSearch || ecransCollectionFilter;
  var tSeries = sFilt ? sCount + " / " + sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") : sGlobal + " saison" + (sGlobal !== 1 ? "s" : "") + " suivie" + (sGlobal !== 1 ? "s" : "");

  var fCount = Object.values(films).reduce(function(acc, arr) { 
    return acc + (ecransCollectionFilter || filmsFormatFilter ? arr.filter(function(m) { 
      var isShort = m.tags && m.tags.indexOf('court métrage') !== -1;
      var fmtOk = true;
      if (filmsFormatFilter === 'court') fmtOk = isShort;
      if (filmsFormatFilter === 'long') fmtOk = !isShort;
      var collOk = ecransCollectionFilter ? (m.tags && m.tags.indexOf(ecransCollectionFilter) !== -1) : true;
      return fmtOk && collOk; 
    }).length : arr.length); 
  }, 0);
  var fGlobal = Object.values(films).reduce(function(acc, arr) { return acc + arr.length; }, 0);
  var fFilt = ecransCollectionFilter || filmsFormatFilter;
  var tFilms = fFilt ? fCount + " / " + fGlobal + " film" + (fGlobal !== 1 ? "s" : "") : fGlobal + " film" + (fGlobal !== 1 ? "s" : "") + " vu" + (fGlobal !== 1 ? "s" : "");

  document.getElementById('ecrans-counter').textContent = tFilms + " • " + tSeries;

  // Mise à jour de la barre de progression re-watch
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
      sBar.innerHTML = '<div class="project-bar"><span class="project-label">projet re-watch : ' + sRewatchCount + ' / ' + sTotal + ' (' + sPct + '%)</span><div class="project-track"><div class="project-fill" style="width:' + sPct + '%"></div></div></div>';
    } else { sBar.innerHTML = ''; }
  }

  // --- VUE GLOBALE SÉRIES ---
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

  if (sortDataKeys(data).length === 0) {
    container.innerHTML = '<p class="empty-state">aucun résultat</p>';
    return;
  }

  sortDataKeys(data).forEach(function(show) {
    container.insertAdjacentHTML('beforeend', getCreatorHeader(show, data[show].length));

    const notesValides = data[show].map(s => s.note).filter(n => n !== null);
    if (notesValides.length > 1) {
      const moyenne = (notesValides.reduce((acc, note) => acc + note, 0) / notesValides.length).toFixed(1);
      const avgDiv = document.createElement('div');
      avgDiv.className = 'show-average';
      avgDiv.textContent = "moyenne : " + moyenne;
      container.appendChild(avgDiv);
    }

    const div = document.createElement('div');
    div.className = 'books';
        sortEntriesByNote(data[show]).forEach(function(season) {
      const card = document.createElement('a');
      card.href = season.link; card.target = "_blank"; card.className = 'book-card';
      
      const starsHtml = season.note !== null ? `<div class="book-meta">${getStars(season.note)}</div>` : '';
      
      if (season.tags && season.tags.indexOf('coup de coeur') !== -1) card.className += 'coup-de-coeur-card';
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
    gAllBtn.className = 'anime-tag-btn' + (jeuxCollectionFilter === null ? ' active' : '');
    gAllBtn.textContent = 'tous';
    var gSearchVal = document.getElementById('search-jeux').value;
    gAllBtn.addEventListener('click', function() { jeuxCollectionFilter = null; generateGames(filterData(games, gSearchVal), !!gSearchVal); });
    gTopRow.appendChild(gAllBtn);
    gF.appendChild(gTopRow);

    var gCollSection = document.createElement('div'); gCollSection.className = 'anime-tag-section';
    var gCollLabel = document.createElement('div'); gCollLabel.className = 'anime-tag-section-label'; gCollLabel.textContent = 'collection'; gCollSection.appendChild(gCollLabel);
    var gCollWrap = document.createElement('div'); gCollWrap.className = 'anime-tag-section-tags';
    for (var gTag in gCollCounts) {
      if (gCollCounts[gTag] > 0) {
        var gBtn = document.createElement('button');
        gBtn.className = 'anime-tag-btn' + (jeuxCollectionFilter === gTag ? ' active' : '');
        gBtn.textContent = gTag + ' (' + gCollCounts[gTag] + ')';
        gBtn.addEventListener('click', function(t) { return function() { jeuxCollectionFilter = jeuxCollectionFilter === t ? null : t; generateGames(filterData(games, gSearchVal), !!gSearchVal); }; }(gTag));
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
  if (jeuxCollectionFilter) {
    data = data.filter(function(g) {
      return g.tags && g.tags.indexOf(jeuxCollectionFilter) !== -1;
    });
  }

  // Comme data est maintenant une liste plate, on prend directement sa longueur
  let totalGames = data.length;
  let globalTotalGames = games.length;
  const label = (isSearch || jeuxCollectionFilter) 
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
      document.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
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
    allBtn.className = 'anime-tag-btn' + (musiqueFormatFilter === null && musiqueCollectionFilter === null ? ' active' : '');
    var totalAll = formatCounts.album + formatCounts.ep + formatCounts.single + formatCounts.mixtape;
    allBtn.textContent = 'tous (' + totalAll + ')';
    allBtn.addEventListener('click', function() { 
      musiqueFormatFilter = null; 
      musiqueCollectionFilter = null; // <-- On ajoute ça pour vider la collection
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
        btn.className = 'anime-tag-btn' + (musiqueFormatFilter === fmt ? ' active' : '');
        btn.textContent = fmt + ' (' + formatCounts[fmt] + ')';
        btn.addEventListener('click', function() { 
          musiqueFormatFilter = musiqueFormatFilter === fmt ? null : fmt;
          musiqueCollectionFilter = null; // On coupe l'autre filtre
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
        mBtn.className = 'anime-tag-btn' + (musiqueCollectionFilter === mTag ? ' active' : '');
        mBtn.textContent = mTag + ' (' + mCollCounts[mTag] + ')';
        mBtn.addEventListener('click', function(t) { return function() { musiqueCollectionFilter = musiqueCollectionFilter === t ? null : t; musiqueFormatFilter = null; generateMusique(filterData(musique, document.getElementById('search-musique').value), isSearch); }; }(mTag));
        mCollWrap.appendChild(mBtn);
      }
    }
    if (mCollWrap.children.length > 0) { mCollSection.appendChild(mCollWrap); fC.appendChild(mCollSection); }
  }

  // 2. Application du filtre sur les données
  if (musiqueFormatFilter || musiqueCollectionFilter) {
    var filteredData = {};
    for (var artist in data) {
      var validAlbums = data[artist].filter(function(album) {
        var fmt = album.format ? album.format.toLowerCase() : 'album';
        var fmtOk = musiqueFormatFilter ? (fmt === musiqueFormatFilter) : true;
        var collOk = musiqueCollectionFilter ? (album.tags && album.tags.indexOf(musiqueCollectionFilter) !== -1) : true;
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

  const label = (isSearch || musiqueFormatFilter || musiqueCollectionFilter) 
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
      document.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
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
      
var badgesHtml = '';
if (album.tags && album.tags.indexOf('réécoute') !== -1) {
  badgesHtml += '<span class="anime-badge" title="réécouté"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg></span>';
}
if (album.tags && album.tags.indexOf('archived') !== -1) {
  badgesHtml += '<span class="anime-badge" title="archived"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a9 9 0 0 1 9 9z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="9" x2="13" y2="9"/><line x1="9" y1="17" x2="15" y2="17"/></svg></span>';
}
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
  let state = JSON.parse(localStorage.getItem(TAMAGOTCHI_KEY));
  if (!state) return getDefaultState();
  if (state.faim !== undefined) state = getDefaultState();
  if (!state.friendSince) state.friendSince = Date.now();

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

function setRandomThought() {
  const thoughtEl = document.getElementById('bird-thought');
  const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
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
  
  let isFilmsFiltered = isSearch || filmsFormatFilter || ecransCollectionFilter;
  let isSeriesFiltered = isSearch || ecransCollectionFilter;
  
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
  const todayStr = checkDate.toISOString().split('T')[0];
  if (!datesInJournal.has(todayStr)) {
    isPaused = true;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // On remonte le temps
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
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
function renderRecap() {
  const yearStr = recapYear.toString();
  const yearJournal = journal.filter(j => j.d.startsWith(yearStr));
  
  if (yearJournal.length === 0) {
    document.getElementById('recap-main-count').textContent = '0';
    document.getElementById('recap-main-breakdown').textContent = 'aucune activité cette année';
    document.getElementById('recap-secondary-count').textContent = '0';
    document.getElementById('recap-secondary-breakdown').textContent = '';
    document.getElementById('recap-visual').innerHTML = '';
    return;
  }

  // On utilise des Map pour stocker le titre ET l'image, sans doublons
  const mainItems = {
    livre: new Map(),
    film: new Map(),
    série: new Map(),
    anime: new Map(),
    manga: new Map(),
    jeu: new Map(),
    musique: new Map()
  };
  
  const secondaryCounts = { anime: { short: 0, music: 0, commercial: 0, 'short film': 0 } };

  function isMainAnime(note) {
    if (!note) return true;
    const n = note.toLowerCase();
    if (n.includes('épisode') || n.includes('episode')) return true;
    if (/\d+\/\d+/.test(n)) return true; 
    if (n.includes('short film')) return true; // Ajouté
    if (n.includes('hentai')) return true;     // Ajouté
    return false;
  }

  yearJournal.forEach(entry => {
    if (entry.t === 'anime') {
      if (isMainAnime(entry.note)) {
        // .set ignore automatiquement le doublon si le titre est identique
        mainItems.anime.set(entry.title, { title: entry.title, img: entry.img, blur: entry.blur || false });
      } else {
        const n = entry.note.toLowerCase();
        if (n.includes('short')) secondaryCounts.anime.short++;
        else if (n.includes('music')) secondaryCounts.anime.music++;
        else if (n.includes('commercial') || n.includes('cms')) secondaryCounts.anime.commercial++;
      }
    } else if (mainItems[entry.t]) {
      mainItems[entry.t].set(entry.title, { title: entry.title, img: entry.img, blur: entry.blur || false });
    }
  });

  // --- PARTIE TEXTE (Compteurs) ---
  const pluralMap = { livre: 'livres', film: 'films', série: 'séries', anime: 'animes', manga: 'mangas', jeu: 'jeux', musique: 'albums' };
  let totalMain = 0;
  const mainParts = [];
  
  for (const cat in mainItems) {
    const count = mainItems[cat].size;
    if (count > 0) {
      totalMain += count;
      const label = count > 1 ? pluralMap[cat] : cat;
      mainParts.push(count + ' ' + label);
    }
  }

  let totalSecondary = 0;
  const secParts = [];
  for (const type in secondaryCounts.anime) {
    const count = secondaryCounts.anime[type];
    if (count > 0) {
      totalSecondary += count;
      secParts.push(count + ' ' + type + (count > 1 ? 's' : ''));
    }
  }

  document.getElementById('recap-main-count').textContent = totalMain;
  document.getElementById('recap-main-breakdown').textContent = mainParts.join(' · ');
  document.getElementById('recap-secondary-count').textContent = totalSecondary;
  document.getElementById('recap-secondary-breakdown').textContent = secParts.length > 0 ? ('animes : ' + secParts.join(' · ')) : '';


  // --- PARTIE VISUELLE (Les images) ---
  const visualContainer = document.getElementById('recap-visual');
  visualContainer.innerHTML = '';

  // L'ordre dans lequel on veut afficher les catégories
  const categoryOrder = ['livre', 'film', 'série', 'anime', 'manga', 'jeu', 'musique'];

  categoryOrder.forEach(cat => {
    if (mainItems[cat].size === 0) return; // On saute si vide
    
    const count = mainItems[cat].size;
    const label = count > 1 ? pluralMap[cat] : cat;

    // Le titre de la catégorie (ex: "animes (3)")
    const h2 = document.createElement('h2');
    h2.textContent = label + ' (' + count + ')';
    visualContainer.appendChild(h2);

    // La grille d'images
    const grid = document.createElement('div');
    grid.className = 'books'; // On réutilise TA classe CSS !

    mainItems[cat].forEach(item => {
      const card = document.createElement('div');
      card.className = 'book-card';
      
      // Ajout des classes spéciales selon le format
      if (cat === 'musique') card.classList.add('recap-music-card');
      if (cat === 'film' || cat === 'série') card.classList.add('recap-ecrans-card');
      
      // Ajout du flou si besoin (avec la transition pour que ça disparaisse doucement au survol)
      const blurStyle = item.blur ? 'style="filter:blur(6px); transition: filter 0.3s;"' : '';
      
      card.innerHTML = `
        <img loading="lazy" src="${item.img}" alt="${item.title}" ${blurStyle}>
        <div class="book-title">${item.title}</div>
      `;
      grid.appendChild(card);
    });

    visualContainer.appendChild(grid);
  });
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
      // On trie par date et on prend le plus récent
      const latestEntry = catEntries[catEntries.length - 1];
      
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
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopup();
});

// ── ANIME ──
const ANIME_BATCH = 50;
const TAG_BLACKLIST = ['+', '*', 'recap', 'arg', 'music.archived', 're-watched', 'watched', 'plan to watch', 'dropped', 'on hold', 'watching', 'rank', 'completed', ''];
const FORMAT_TAGS = ['normal episode', 'short episode', 'movie', 'short film', 'music', 'short', 'commercial', 'hentai'];
const QUALITY_TAGS = ['favorite', 'gem'];
const COLLECTION_TAGS = ['bought', 'archived', 're-watched'];
const TAG_REST_LIMIT = 20;
let animeFiltered = [];
let animeDisplayed = 0;
let activeTag = null;
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

function loadImageCache() {
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
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
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
    .catch(() => {})
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
      
      document.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
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
  allBtn.className = 'anime-tag-btn' + (activeTag === null ? ' active' : '');
  allBtn.textContent = 'tous (' + animeList.length + ')';
    allBtn.addEventListener('click', function() { activeTag = null; showOnlyReviewsAnime = false; animeDisplayed = 0; renderAnimeTags(); applyAnimeFilter(); });
    
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
        activeTag = null; // On coupe l'autre filtre
        animeDisplayed = 0;
        renderAnimeTags();
        applyAnimeFilter();
      });
      topRow.appendChild(reviewBtn); // On l'ajoute à la boîte, pas directement au container
    }
    
    container.appendChild(topRow); // On ajoute la boîte au container

  if (_fmtE.length) buildSection(container, 'format', _fmtE);
  if (_quaE.length) buildSection(container, 'qualité', _quaE);
  if (_colE.length) buildSection(container, 'collection', _colE);
  var visRest = tagsExpanded ? _rstE.slice(0, TAG_REST_LIMIT) : _rstE;

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
    if (activeTag === tag) btn.classList.add('active');
    btn.textContent = tag + ' (' + count + ')';
    btn.addEventListener('click', function() { activeTag = activeTag === tag ? null : tag; animeDisplayed = 0; renderAnimeTags(); applyAnimeFilter(); });
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
    if (activeTag === 'favorite') {
      if (a.tags.indexOf('favorite') === -1) return false;
      if (query) { var q = norm(query); return norm(a.title).indexOf(q) !== -1; }
      return true;
    }
    if (activeTag) {
      if (activeTag === 'normal episode' || activeTag === 'short episode') {
        if (a.tags.indexOf('hentai') !== -1) return false;
      }
      if (activeTag === 'short') {
        if (a.tags.indexOf('commercial') !== -1) return false;
      }
      if (activeTag === 'short episode') {
        if (a.tags.indexOf('hentai') !== -1 || a.tags.indexOf('commercial') !== -1) return false;
      }
      if (activeTag === 'music') {
        if (a.tags.indexOf('commercial') !== -1) return false;
      }
      if (a.tags.indexOf(activeTag) === -1) return false;
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
  } else if (activeTag) {
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

  if (activeTag === 'favorite') {
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
var MANGA_TAG_BLACKLIST = ['*', 're-read', 'watched', 'plan to read', 'dropped', 'on hold', 'reading', 'rank', 'completed', ''];
var MANGA_FILTER_TAGS = ['one-shot', 'hentai', 'favorite', 'gem'];
var MANGA_COLLECTION_TAGS = ['bought', 'archived', 're-read'];
var mangaActiveFilter = null;
var mangaSortMode = 'auteur';
var mangaSortDir = 1;
var mangaImageCache = new Map();
var mangaImageQueue = [];
var mangaImageLoading = false;
var mangaCacheDirty = false;
let biblioSortMode = 'auteur';
let biblioSortDir = 1;
let biblioCollectionFilter = null;
let musiqueSortMode = 'artiste';
let musiqueFormatFilter = null;
let musiqueCollectionFilter = null;
let musiqueSortDir = 1;
let jeuxSortMode = 'note';
let jeuxSortDir = 1;
let jeuxCollectionFilter = null;
let ecransSortMode = 'réalisateur';
let filmsFormatFilter = null;
let ecransCollectionFilter = null;
let ecransSortDir = 1;

function loadMangaImageCache() {
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
    .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
    .then(function(data) {
      if (data.data && data.data.images) {
        var url = data.data.images.jpg?.image_url || data.data.images.webp?.image_url;
        if (url) { mangaImageCache.set(id, url); mangaCacheDirty = true; replaceMangaPlaceholder(id, url); }
      }
    })
    .catch(function() {})
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
      document.querySelectorAll('.anime-sort-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderManga();
    });
    sortContainer.appendChild(btn);
  });

  var fC = document.getElementById('manga-filters'); fC.innerHTML = '';
  var allBtn = document.createElement('button');
  allBtn.className = 'anime-tag-btn' + (mangaActiveFilter === null ? ' active' : '');
  allBtn.textContent = 'tous (' + total + ')';
  allBtn.addEventListener('click', function() { mangaActiveFilter = null; renderMangaFilters(); renderManga(); });
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
      btn.className = 'anime-tag-btn'; if (mangaActiveFilter === tag) btn.classList.add('active');
      btn.textContent = tag + ' (' + count + ')';
      btn.addEventListener('click', function() { mangaActiveFilter = mangaActiveFilter === tag ? null : tag; renderMangaFilters(); renderManga(); });
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
      btn.className = 'anime-tag-btn quality-tag'; if (mangaActiveFilter === tag) btn.classList.add('active');
      btn.textContent = tag + ' (' + count + ')';
      btn.addEventListener('click', function() { mangaActiveFilter = mangaActiveFilter === tag ? null : tag; renderMangaFilters(); renderManga(); });
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
      btn.className = 'anime-tag-btn'; if (mangaActiveFilter === tag) btn.classList.add('active');
      btn.textContent = tag + ' (' + count + ')';
      btn.addEventListener('click', function() { mangaActiveFilter = mangaActiveFilter === tag ? null : tag; renderMangaFilters(); renderManga(); });
      w3.appendChild(btn);
    });
    s3.appendChild(w3); fC.appendChild(s3);
  }

  renderManga();
}

function renderMangaFilters() {
  document.querySelectorAll('#manga-filters .anime-tag-btn').forEach(function(btn) {
    btn.classList.remove('active');
    if (btn.textContent.includes('tous') && mangaActiveFilter === null) btn.classList.add('active');
    // On utilise "includes" au lieu de "===" pour ignorer le chiffre entre parenthèses
    if (mangaActiveFilter && btn.textContent.includes(mangaActiveFilter)) btn.classList.add('active');
  });
}

function renderManga() {
  var container = document.getElementById('mangaContent'); container.innerHTML = '';
  var query = document.getElementById('search-manga').value;
  var norm = function(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
  var q = query ? norm(query) : '';
  
  var total = 0; for (var a in mangaData) total += mangaData[a].length;

  if (mangaActiveFilter === 'favorite') {
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
    document.getElementById('manga-counter').textContent = allFav.length + ' / ' + total + ' manga';
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
      if (mangaActiveFilter) {
        if (mangaActiveFilter === 'hentai') { if (m.tags.indexOf('hentai') === -1) return false; }
        else if (mangaActiveFilter === 'one-shot') { if (m.tags.indexOf('one-shot') === -1) return false; if (m.tags.indexOf('hentai') !== -1) return false; }
        else { if (m.tags.indexOf(mangaActiveFilter) === -1) return false; }
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
      : mangaActiveFilter
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
      if (mangaActiveFilter) {
        if (mangaActiveFilter === 'hentai') {
          if (m.tags.indexOf('hentai') === -1) return false;
        } else if (mangaActiveFilter === 'one-shot') {
          if (m.tags.indexOf('one-shot') === -1) return false;
          if (m.tags.indexOf('hentai') !== -1) return false;
        } else {
          if (m.tags.indexOf(mangaActiveFilter) === -1) return false;
        }
      }
      // Si l'auteur correspond, on garde toutes ses œuvres. Sinon, on cherche par titre.
      if (q) { return authorMatch || norm(m.title).indexOf(q) !== -1; }
      return true;
    });
    totalFiltered += filtered.length;
    if (author === keys[keys.length - 1]) {
      var mangaLabel = q
        ? totalFiltered + " mangas trouvé" + (totalFiltered !== 1 ? "s" : "")
        : mangaActiveFilter
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

function generateStats() {
  var container = document.getElementById('statsContent');
  container.innerHTML = '';

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
    { name: 'animes', data: animeList, isFlat: true, icon: '🌸' },
    { name: 'mangas', data: mangaData, icon: '📖' }
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

audio.addEventListener('ended', function() {
  if (currentTrack < playerTracks.length - 1) {
    loadTrack(currentTrack + 1);
    audio.play();
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
    audio.play();
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
  if (isPlaying) audio.play();
});

document.getElementById('player-next').addEventListener('click', function() {
  if (typeof playerTracks === 'undefined' || playerTracks.length === 0) return;
  var idx = currentTrack + 1;
  if (idx >= playerTracks.length) idx = 0;
  loadTrack(idx);
  if (isPlaying) audio.play();
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

// ── RECHERCHE GLOBALE ──
let globalSearchTimeout;
document.addEventListener('input', function(e) {
  if (e.target.id !== 'global-search') return;
  
  clearTimeout(globalSearchTimeout);
  var val = e.target.value.trim();
  var resBox = document.getElementById('global-search-results');
  
  if (val.length < 2) {
    resBox.classList.remove('visible');
    return;
  }
  
  globalSearchTimeout = setTimeout(function() {
    var norm = function(str) { return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
    var q = norm(val);
    var matches = [];
    var typeColors = { 
      'Livre': "#ef5350", 'Film': "#42A5F5", 'Série': "#26A69A", 
      'Jeu': "#66BB6A", 'Musique': "#AB47BC", 'Anime': "#EC407A", 'Manga': "#FF7043" 
    };
    
    // La fonction qui scanne
    function searchCat(data, catName, isGrouped, creatorLabel) {
      if (!data) return;
      if (isGrouped) {
        for (var key in data) {
          var cleanKey = key.replace(' [completed]', '');
          var matchKey = norm(cleanKey).includes(q);
          
          // 1. Si le nom de l'auteur/artiste correspond, on crée une entrée "Créateur"
          if (matchKey) {
            matches.push({ 
              cat: catName, 
              title: cleanKey, 
              sub: creatorLabel + ' · ' + data[key].length + ' œuvres', 
              isCreator: true 
            });
          }
          
          // 2. On cherche aussi dans les titres des œuvres
          data[key].forEach(function(item) {
            if (norm(item.title).includes(q)) {
              var cover = item.cover || (catName === 'Anime' && typeof animeImageCache !== 'undefined' && animeImageCache.has(item.id) ? animeImageCache.get(item.id) : '') || (catName === 'Manga' && typeof mangaImageCache !== 'undefined' && mangaImageCache.has(item.id) ? mangaImageCache.get(item.id) : '');
              matches.push({ cat: catName, title: item.title, sub: cleanKey, img: cover, isCreator: false });
            }
          });
        }
      } else { // Pour les listes plates (Jeux, Animés)
        data.forEach(function(item) {
          if (norm(item.title).includes(q)) {
            var cover = item.cover || (catName === 'Anime' && typeof animeImageCache !== 'undefined' && animeImageCache.has(item.id) ? animeImageCache.get(item.id) : '');
            matches.push({ cat: catName, title: item.title, sub: '', img: cover, isCreator: false });
          }
        });
      }
    }
    
    if (typeof books !== 'undefined') searchCat(books, 'Livre', true, 'Auteur');
    if (typeof films !== 'undefined') searchCat(films, 'Film', true, 'Réalisateur');
    if (typeof series !== 'undefined') searchCat(series, 'Série', true, 'Série');
    if (typeof games !== 'undefined' && games.length) searchCat(games, 'Jeu', false, 'Studio');
    if (typeof musique !== 'undefined') searchCat(musique, 'Musique', true, 'Artiste');
    if (typeof animeList !== 'undefined') searchCat(animeList, 'Anime', false, '');
    if (typeof mangaData !== 'undefined') searchCat(mangaData, 'Manga', true, 'Auteur');
    
    // On met les créateurs en premier, puis par ordre alphabétique
    matches.sort(function(a, b) {
      if (a.isCreator !== b.isCreator) return b.isCreator - a.isCreator; // Créateurs en haut
      if (a.cat === b.cat) return a.title.localeCompare(b.title);
      return a.cat.localeCompare(b.cat);
    });

    resBox.innerHTML = '<button class="gs-close" onclick="document.getElementById(\'global-search-results\').classList.remove(\'visible\')">&times;</button>';
    
    if (matches.length === 0) {
      resBox.innerHTML += '<div class="gs-no-results">Aucun résultat pour « ' + val + ' »</div>';
    } else {
      var limit = Math.min(matches.length, 30);
      var pageMap = {
        'Livre': { page: 'bibliographie', input: 'search-biblio' },
        'Film': { page: 'ecrans', input: 'search-ecrans' },
        'Série': { page: 'ecrans', input: 'search-ecrans' },
        'Jeu': { page: 'jeux', input: 'search-jeux' },
        'Musique': { page: 'musique', input: 'search-musique' },
        'Anime': { page: 'anime', input: 'search-anime' },
        'Manga': { page: 'manga', input: 'search-manga' }
      };

      for (var i = 0; i < limit; i++) {
        var m = matches[i];
        var itemWrap = document.createElement('div');
        itemWrap.className = 'gs-item';
        itemWrap.style.cursor = 'pointer';
        
        // Si c'est un créateur, on met l'avatar par défaut, sinon l'image de l'œuvre
        var imgHtml = '';
        if (m.isCreator) {
          imgHtml = '<div class="gs-creator-avatar"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>';
        } else if (m.img) {
          imgHtml = '<img src="'+m.img+'" alt="">';
        } else {
          imgHtml = '<div style="width:32px;height:48px;background:var(--border-color);border-radius:3px;flex-shrink:0;"></div>';
        }
        
        var dot = '<span class="popup-type-dot" style="background:'+typeColors[m.cat]+'; margin-right:0; flex-shrink:0;"></span>';
        var subHtml = m.isCreator ? m.sub : (m.cat.toLowerCase() + (m.sub ? ' · ' + m.sub : ''));
        
        itemWrap.innerHTML = dot + imgHtml + '<div class="gs-item-info"><div class="gs-item-title">'+m.title+'</div><div class="gs-item-sub">'+subHtml+'</div></div>';
        
        // Action de clic (unifiée)
        itemWrap.addEventListener('click', function(e) {
          var cat = this.dataset.cat;
          var title = this.dataset.title;
          
          resBox.classList.remove('visible');
          document.getElementById('global-search').value = '';
          
          navigateTo(pageMap[cat].page);
          
          var localInput = document.getElementById(pageMap[cat].input);
          if (localInput) {
            localInput.value = title;
            localInput.dispatchEvent(new Event('input'));
          }
        });
        
        itemWrap.dataset.cat = m.cat;
        itemWrap.dataset.title = m.title;
        
        resBox.appendChild(itemWrap);
      }
      
      if (matches.length > 30) {
        var moreDiv = document.createElement('div');
        moreDiv.className = 'gs-no-results';
        moreDiv.textContent = '+' + (matches.length - 30) + ' autres résultats...';
        resBox.appendChild(moreDiv);
      }
    }
    resBox.classList.add('visible');
  }, 250);
});

// Fermer la recherche si on clique en dehors ou sur Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.getElementById('global-search-results').classList.remove('visible');
});
document.addEventListener('click', function(e) {
  var resBox = document.getElementById('global-search-results');
  var searchInput = document.getElementById('global-search');
  if (resBox.classList.contains('visible') && !resBox.contains(e.target) && e.target !== searchInput) {
    resBox.classList.remove('visible');
  }
});

// ── Helper pour la classe de qualité (Coup de coeur / Gem) ──
function getQualityClass(item) {
  if (!item.tags) return '';
  if (item.tags.indexOf('favorite') !== -1 || item.tags.indexOf('coup de coeur') !== -1) return ' coup-de-coeur-card';
  if (item.tags.indexOf('gem') !== -1) return ' gem-card';
  return '';
}