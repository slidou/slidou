// ── Chargement des données ──
const books = booksData;
const films = filmsData;
const series = seriesData;
const games = gamesData;
const musique = musicData;
const journal = journalData;

// ── Tri utilitaire ──
function sortDataKeys(data) {
  return Object.keys(data).sort(function(a, b) {
    if (data[b].length !== data[a].length) return data[b].length - data[a].length;
    var aN = data[a].map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    var bN = data[b].map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    var aA = aN.length ? aN.reduce(function(x, y) { return x + y; }, 0) / aN.length : 0;
    var bA = bN.length ? bN.reduce(function(x, y) { return x + y; }, 0) / bN.length : 0;
    return bA - aA || a.localeCompare(b);
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

// ── Système d'étoiles (gère les demis et les notes vides) ──
function getStars(note) {
  if (!note) return '';
  let stars = '★'.repeat(Math.floor(note));
  if (note % 1 !== 0) stars += '½'; 
  stars += '☆'.repeat(5 - Math.ceil(note)); 
  return stars;
}

// ── Navigation ──
function navigateTo(page) {
  document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`).classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  window.scrollTo({ top: 0, behavior: 'instant' });
  document.querySelector('.content').scrollTo({ top: 0, behavior: 'instant' });

  localStorage.setItem('activePage', page);

  if (page === 'home') initHome();
  if (page === 'bibliographie') generateBibliography();
  if (page === 'ecrans') generateFilms();
  if (page === 'jeux') generateGames();
  if (page === 'musique') generateMusique();
  if (page === 'anime') generateAnime();
  if (page === 'manga') generateManga();
  if (page === 'apropos') updateTamagotchiUI();
  
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
  { text: "La justice sans la force est impuissante, la force sans la justice est tyrannique.", author: "Blaise Pascal" }
];

// ── Moteur de recherche ──
function filterData(data, query) {
  if (!query) return data; 
  const normalize = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[''`']/g, "");
  const q = normalize(query);
  
  const result = {};
  for (const category in data) {
    const matchCategory = normalize(category).includes(q);
    const filteredItems = data[category].filter(item => {
      const matchTitle = normalize(item.title).includes(q);
      const matchEngTitle = item.englishTitle && normalize(item.englishTitle).includes(q);
      return matchTitle || matchEngTitle || matchCategory;
    });
    if (filteredItems.length > 0) result[category] = filteredItems;
  }
  return result;
}

// ── Generate Bibliography ──
function generateBibliography(data = books) {
  const container = document.getElementById('bibliographyContent');
  
  let totalBooks = 0;
  for (const author in books) totalBooks += books[author].length;
  document.getElementById('biblio-counter').textContent = totalBooks + " livres lus";

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

  sortDataKeys(data).forEach(function(author) {
    const h2 = document.createElement('h2');
    h2.textContent = author + " ( " + data[author].length + " )";
    listContainer.appendChild(h2);

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
      
      card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <div class="book-title">${book.title}</div>
        ${starsHtml}
      `;
      booksDiv.appendChild(card);
    });

    listContainer.appendChild(booksDiv);
  });
}

// ── Sous-navigation Écrans ──
document.querySelectorAll('.sub-nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const subpage = link.dataset.subpage;

    document.querySelectorAll('.sub-nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    document.querySelectorAll('.sub-page').forEach(p => p.classList.remove('active'));
    document.getElementById('subpage-' + subpage).classList.add('active');

    if (subpage === 'films') generateFilms();
    if (subpage === 'series') generateSeries();
  });
});

// ── Compteur Écrans ──
function updateEcransCounter() {
  let totalFilms = Object.values(films).reduce((acc, arr) => acc + arr.length, 0);
  let totalSeries = Object.keys(series).length;
  document.getElementById('ecrans-counter').textContent = totalFilms + " films vus • " + totalSeries + " séries suivies";
}

// ── Generate Films ──
function generateFilms(data = films) {
  updateEcransCounter();
  const container = document.getElementById('filmsContent');
  container.innerHTML = '';
    sortDataKeys(data).forEach(function(director) {
    const h2 = document.createElement('h2');
    h2.textContent = director + " ( " + data[director].length + " )";
    container.appendChild(h2);

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
      
      card.innerHTML = `<img src="${movie.cover}" alt="${movie.title}"><div class="book-title">${movie.title}</div>${starsHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

// ── Generate Séries ──
function generateSeries(data = series) {
  updateEcransCounter();
  const container = document.getElementById('seriesContent');
  container.innerHTML = '';
    sortDataKeys(data).forEach(function(show) {
    const h2 = document.createElement('h2');
    h2.textContent = show + " ( " + data[show].length + " )";
    container.appendChild(h2);

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
      
      card.innerHTML = `<img src="${season.cover}" alt="${season.title}"><div class="book-title">${season.title}</div>${starsHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

// ── Generate Jeux vidéo ──
function generateGames(data = games) {
  let totalGames = 0;
  for (const dev in games) totalGames += games[dev].length;
  document.getElementById('jeux-counter').textContent = totalGames + " jeux joués";

  const container = document.getElementById('jeuxContent');
  container.innerHTML = '';

   sortDataKeys(data).forEach(function(dev) {
    const h2 = document.createElement('h2');
    h2.textContent = dev + " ( " + data[dev].length + " )";
    container.appendChild(h2);

    const notesValides = data[dev].map(g => g.note).filter(n => n !== null);
    if (notesValides.length > 1) {
      const moyenne = (notesValides.reduce((acc, note) => acc + note, 0) / notesValides.length).toFixed(1);
      const avgDiv = document.createElement('div');
      avgDiv.className = 'show-average';
      avgDiv.textContent = "moyenne : " + moyenne;
      container.appendChild(avgDiv);
    }

    const div = document.createElement('div');
    div.className = 'books';
    sortEntriesByNote(data[dev]).forEach(function(game) {
      const card = document.createElement('a');
      card.href = game.link;
      card.target = "_blank";
      card.className = 'book-card';

      const starsHtml = game.note !== null ? `<div class="book-meta">${getStars(game.note)}</div>` : '';

      card.innerHTML = `<img src="${game.cover}" alt="${game.title}"><div class="book-title">${game.title}</div>${starsHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

// ── Generate Musique ──
function generateMusique(data = musique) {
  let totalAlbums = 0;
  for (const artist in musique) totalAlbums += musique[artist].length;
  document.getElementById('musique-counter').textContent = totalAlbums + " albums écoutés";

  const container = document.getElementById('musiqueContent');
  container.innerHTML = '';

  sortDataKeys(data).forEach(function(artist) {
    const h2 = document.createElement('h2');
    h2.textContent = artist + " ( " + data[artist].length + " )";
    container.appendChild(h2);

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

      card.innerHTML = `<img src="${album.cover}" alt="${album.title}"><div class="book-title">${album.title}</div>${starsHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

// ── TAMAGOTCHI PERRUCHES ──
const TAMAGOTCHI_KEY = 'slidou_budgie_state';

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
  const decay = elapsedMinutes * 0.5;
  
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

  if (birdState.energie < 20) {
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
  });
  saveBudgieState(state);
  setRandomThought();
  updateTamagotchiUI();
});

document.getElementById('btn-jouer').addEventListener('click', () => {
  const state = getBudgieState();
  ['pistachio', 'cielazur'].forEach(bird => {
    if (state[bird].energie < 10) return; 
    state[bird].bonheur = Math.min(100, state[bird].bonheur + 30);
    state[bird].energie = Math.max(0, state[bird].energie - 15);
    state[bird].faim = Math.max(0, state[bird].faim - 10);
  });
  saveBudgieState(state);
  setRandomThought();
  updateTamagotchiUI();
});

document.getElementById('btn-dormir').addEventListener('click', () => {
  const state = getBudgieState();
  ['pistachio', 'cielazur'].forEach(bird => {
    state[bird].energie = Math.min(100, state[bird].energie + 40);
    state[bird].faim = Math.max(0, state[bird].faim - 5);
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
  const filteredBooks = filterData(books, query);
  generateBibliography(filteredBooks);
});

document.getElementById('search-ecrans').addEventListener('input', e => {
  const query = e.target.value;
  const filteredFilms = filterData(films, query);
  const filteredSeries = filterData(series, query);
  
  const isFilmsActive = document.getElementById('subpage-films').classList.contains('active');
  if (isFilmsActive) {
    generateFilms(filteredFilms);
  } else {
    generateSeries(filteredSeries);
  }
});

document.getElementById('search-jeux').addEventListener('input', e => {
  const query = e.target.value;
  const filteredGames = filterData(games, query);
  generateGames(filteredGames);
});

document.getElementById('search-musique').addEventListener('input', e => {
  const query = e.target.value;
  const filteredMusique = filterData(musique, query);
  generateMusique(filteredMusique);
});

const typeColors = { film: "dot-film", livre: "dot-livre", jeu: "dot-jeu", musique: "dot-musique", anime: "dot-anime", "série": "dot-serie", manga: "dot-manga" };
const moisNoms = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const joursNoms = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// Variables pour la navigation dans le temps
let viewedYear = new Date().getFullYear();
let viewedMonth = new Date().getMonth();

function initHome() {
  renderDashboard();
  renderCalendar();
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
  musique: 'dernier album écouté' 
};
  
  let html = `<div class="home-dashboard-title">dernières activités</div><div class="home-dashboard-grid">`;
  let hasAnyActivity = false;

  categories.forEach(cat => {
    // On filtre le journal pour ne garder que cette catégorie
    const catEntries = journal.filter(j => j.t === cat);
    
    if (catEntries.length > 0) {
      hasAnyActivity = true;
      // On trie par date et on prend le plus récent
      const latestEntry = catEntries.sort((a, b) => new Date(b.d) - new Date(a.d))[0];
      
      var blurStyle = latestEntry.blur ? 'filter:blur(6px);transition:filter 0.3s;' : '';
      html += `
        <div class="home-dash-card">
          <img src="${latestEntry.img}" alt="${latestEntry.title}" style="${blurStyle}">
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
      html += `
        <div class="calendar-day has-data${blurClass}" data-date="${dateStr}">
          <div class="calendar-day-num">${day}</div>
          <img src="${dayEntries[0].img}" alt="${dateStr}">
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
    html += `
      <div class="popup-item${blurClass}">
        <img src="${item.img}" alt="${item.title}">
        <div class="popup-item-title"><span class="popup-type-dot ${dotClass}"></span>${item.title}</div>
        ${noteHtml}
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
const TAG_BLACKLIST = ['+', '*', 'recap', 'arg', 'music.archived', 'archived', 're-watched', 'bought', 'watched', 'plan to watch', 'dropped', 'on hold', 'watching', 'rank', 'completed', ''];
const FORMAT_TAGS = ['normal episode', 'short episode', 'movie', 'short film', 'music', 'short', 'commercial', 'hentai'];
const QUALITY_TAGS = ['favorite', 'gem'];
const TAG_REST_LIMIT = 20;
let animeFiltered = [];
let animeDisplayed = 0;
let activeTag = null;
let tagsExpanded = false;
let animeSortMode = 'note';
let _fmtE = [], _quaE = [], _rstE = [];

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

function saveImageCache() {
  if (!cacheDirty) return;
  cacheDirty = false;
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
    document.getElementById('animeContent').innerHTML = '<p style="color:var(--secondary-text);font-family:Space Grotesk,sans-serif;padding:40px;">Aucune donnée anime trouvée.</p>';
    return;
  }
  loadImageCache();
  document.getElementById('anime-counter').textContent = animeList.length + " animes terminés";

  var sortContainer = document.getElementById('anime-sort');
  sortContainer.innerHTML = '<span class="anime-sort-label">tri :</span>';
  ['note', 'titre'].forEach(function(mode) {
    var btn = document.createElement('button');
    btn.className = 'anime-sort-btn' + (animeSortMode === mode ? ' active' : '');
    btn.textContent = mode;
    btn.addEventListener('click', function() {
      animeSortMode = mode;
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
  _rstE = Object.entries(tagCount).filter(function(e) { return FORMAT_TAGS.indexOf(e[0]) === -1 && QUALITY_TAGS.indexOf(e[0]) === -1; }).sort(function(a, b) { return b[1] - a[1]; });
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
  allBtn.addEventListener('click', function() { activeTag = null; animeDisplayed = 0; renderAnimeTags(); applyAnimeFilter(); });
  container.appendChild(allBtn);

  if (_fmtE.length) buildSection(container, 'format', _fmtE);
  if (_quaE.length) buildSection(container, 'qualité', _quaE);

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
    if (activeTag === 'favorite') return a.tags.indexOf('favorite') !== -1;
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
      if (a.note === null && b.note === null) return a.title.localeCompare(b.title);
      if (a.note === null) return 1;
      if (b.note === null) return -1;
      if (a.note !== b.note) return b.note - a.note;
      return a.title.localeCompare(b.title);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  var displayedIds = {};
  animeFiltered.forEach(function(a) { displayedIds[a.id] = true; });
  imageQueue = imageQueue.filter(function(id) { return displayedIds[id]; });

  document.getElementById('anime-counter').textContent = activeTag && !query
    ? animeFiltered.length + ' / ' + animeList.length + ' animes'
    : animeList.length + " animes terminés";
  animeDisplayed = 0;
  document.getElementById('animeContent').innerHTML = '';
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
      if (hasAr) badges += '<span class="anime-badge" title="archived"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a9 9 0 0 1 9 9z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="9" x2="13" y2="9"/><line x1="9" y1="17" x2="15" y2="17"/></svg></span>';
      if (hasBo) badges += '<span class="anime-badge" title="bought"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></span>';
      badges += '</div>';
    }

    var imgBlock;
    if (animeImageCache.has(a.id)) {
      imgBlock = '<img src="' + animeImageCache.get(a.id) + '" alt="" style="width:100%;height:220px;object-fit:cover;object-position:center;border-radius:2px;box-shadow:0 4px 8px var(--shadow-color);display:block;">';
    } else {
      imgBlock = '<div class="anime-placeholder" style="--hue:' + hue + '"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>';
      queueImageLoad(a.id);
    }

    var card = document.createElement('a');
    card.href = 'https://myanimelist.net/anime/' + a.id;
    card.target = '_blank';
    card.className = 'book-card anime-card';
    if (a.tags.indexOf('hentai') !== -1) card.className += ' hentai-card';
    card.setAttribute('data-id', a.id);
    card.innerHTML = imgBlock + badges + '<div class="book-title">' + a.title + '</div>' + starsHtml;
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
      imgBlock = '<img src="' + cache.get(item.id) + '" alt="">';
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
var MANGA_TAG_BLACKLIST = ['*', 'archived', 're-read', 'bought', 'watched', 'plan to read', 'dropped', 'on hold', 'reading', 'rank', 'completed', ''];
var MANGA_FILTER_TAGS = ['one-shot', 'hentai', 'favorite', 'gem'];
var mangaActiveFilter = null;
var mangaSortMode = 'alpha';
var mangaImageCache = new Map();
var mangaImageQueue = [];
var mangaImageLoading = false;
var mangaCacheDirty = false;

function loadMangaImageCache() {
  try { var d = JSON.parse(localStorage.getItem('manga_img_cache')); if (d) Object.entries(d).forEach(function(e) { mangaImageCache.set(parseInt(e[0]), e[1]); }); } catch (e) {}
}
function saveMangaImageCache() {
  if (!mangaCacheDirty) return; mangaCacheDirty = false;
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
    document.getElementById('mangaContent').innerHTML = '<p style="color:var(--secondary-text);font-family:Space Grotesk,sans-serif;padding:40px;">Aucune donnee manga trouvee.</p>';
    return;
  }
  loadMangaImageCache();
  var total = 0; for (var a in mangaData) total += mangaData[a].length;
  document.getElementById('manga-counter').textContent = total + " manga lus";

  var fC = document.getElementById('manga-filters'); fC.innerHTML = '';
  var allBtn = document.createElement('button');
  allBtn.className = 'anime-tag-btn' + (mangaActiveFilter === null ? ' active' : '');
  allBtn.textContent = 'tous';
  allBtn.addEventListener('click', function() { mangaActiveFilter = null; renderMangaFilters(); renderManga(); });
  fC.appendChild(allBtn);

  var fmtTags = ['one-shot', 'hentai'];
  var quaTags = ['favorite', 'gem'];
  var fmtArr = fmtTags.map(function(t) { return t; });
  var quaArr = quaTags.map(function(t) { return t; });

  if (fmtArr.length) {
    var s1 = document.createElement('div'); s1.className = 'anime-tag-section';
    var l1 = document.createElement('div'); l1.className = 'anime-tag-section-label'; l1.textContent = 'format'; s1.appendChild(l1);
    var w1 = document.createElement('div'); w1.className = 'anime-tag-section-tags';
    fmtArr.forEach(function(tag) {
      var btn = document.createElement('button');
      btn.className = 'anime-tag-btn'; if (mangaActiveFilter === tag) btn.classList.add('active');
      btn.textContent = tag;
      btn.addEventListener('click', function() { mangaActiveFilter = mangaActiveFilter === tag ? null : tag; renderMangaFilters(); renderManga(); });
      w1.appendChild(btn);
    });
    s1.appendChild(w1); fC.appendChild(s1);
  }

  if (quaArr.length) {
    var s2 = document.createElement('div'); s2.className = 'anime-tag-section';
    var l2 = document.createElement('div'); l2.className = 'anime-tag-section-label'; l2.textContent = 'qualité'; s2.appendChild(l2);
    var w2 = document.createElement('div'); w2.className = 'anime-tag-section-tags';
    quaArr.forEach(function(tag) {
      var btn = document.createElement('button');
      btn.className = 'anime-tag-btn quality-tag'; if (mangaActiveFilter === tag) btn.classList.add('active');
      btn.textContent = tag;
      btn.addEventListener('click', function() { mangaActiveFilter = mangaActiveFilter === tag ? null : tag; renderMangaFilters(); renderManga(); });
      w2.appendChild(btn);
    });
    s2.appendChild(w2); fC.appendChild(s2);
  }
  renderManga();
}

function renderMangaFilters() {
  document.querySelectorAll('#manga-filters .anime-tag-btn').forEach(function(btn) {
    btn.classList.remove('active');
    if (btn.textContent === 'tous' && mangaActiveFilter === null) btn.classList.add('active');
    if (btn.textContent === mangaActiveFilter) btn.classList.add('active');
  });
}

function renderManga() {
  var container = document.getElementById('mangaContent'); container.innerHTML = '';
  var query = document.getElementById('search-manga').value;
  var norm = function(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
  var q = query ? norm(query) : '';
  var keys = Object.keys(mangaData);

  keys.sort(function(a, b) {
    if (mangaData[b].length !== mangaData[a].length) return mangaData[b].length - mangaData[a].length;
    var aN = mangaData[a].map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    var bN = mangaData[b].map(function(m) { return m.note; }).filter(function(n) { return n !== null; });
    var aA = aN.length ? aN.reduce(function(x, y) { return x + y; }, 0) / aN.length : 0;
    var bA = bN.length ? bN.reduce(function(x, y) { return x + y; }, 0) / bN.length : 0;
    return bA - aA || a.localeCompare(b);
  });

    if (mangaActiveFilter === 'favorite') {
    var allFav = [];
    keys.forEach(function(author) {
      mangaData[author].forEach(function(m) {
        if (m.tags.indexOf('favorite') !== -1) {
          if (q) { if (norm(m.title).indexOf(q) !== -1) allFav.push(m); }
          else { allFav.push(m); }
        }
      });
    });
    renderTopList(container, allFav, 'manga');
    return;
  }

  keys.forEach(function(author) {
    var filtered = mangaData[author].filter(function(m) {
      if (mangaActiveFilter) {
        if (mangaActiveFilter === 'hentai' && m.tags.indexOf('one-shot') !== -1 && m.tags.indexOf('hentai') !== -1) return true;
        if (mangaActiveFilter === 'one-shot' && m.tags.indexOf('one-shot') !== -1 && m.tags.indexOf('hentai') !== -1) return false;
        if (m.tags.indexOf(mangaActiveFilter) === -1) return false;
      }
      if (q) { return norm(m.title).indexOf(q) !== -1; }
      return true;
    });
    if (filtered.length === 0) return;
        filtered.sort(function(a, b) {
      if (a.note === null && b.note === null) return a.title.localeCompare(b.title);
      if (a.note === null) return 1; if (b.note === null) return -1;
      return b.note - a.note;
    });

    var h2 = document.createElement('h2');
    h2.textContent = author + ' ( ' + filtered.length + ' )';
    container.appendChild(h2);

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
        imgBlock = '<img src="' + mangaImageCache.get(m.id) + '" alt="" style="width:100%;height:220px;object-fit:cover;object-position:top;border-radius:2px;box-shadow:0 4px 8px var(--shadow-color);display:block;">';
      } else {
        imgBlock = '<div class="manga-placeholder anime-placeholder" style="--hue:' + hue + '"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></div>';
        queueMangaImage(m.id);
      }

      var card = document.createElement('a');
      card.href = 'https://myanimelist.net/manga/' + m.id; card.target = '_blank';
      card.className = 'book-card manga-card';
      if (m.tags.indexOf('hentai') !== -1) card.classList.add('hentai-card');
      card.setAttribute('data-id', m.id);
      card.innerHTML = imgBlock + badges + '<div class="book-title">' + m.title + '</div>'  + stars;
      div.appendChild(card);
    });
    container.appendChild(div);
  });
}

document.getElementById('toggle-tags-btn').addEventListener('click', function() { tagsExpanded = !tagsExpanded; renderAnimeTags(); });
document.getElementById('search-anime').addEventListener('input', function() { animeDisplayed = 0; applyAnimeFilter(); });
document.getElementById('load-more-anime').addEventListener('click', renderAnimeBatch);
document.getElementById('search-manga').addEventListener('input', function() { renderManga(); });