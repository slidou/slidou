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
  { text: "Ce que la névrose fait à un homme, elle le dépossède de son être.", author: "Me" },
  { text: "Lorsque l'homme crée une oeuvre, il s'offre à elle.", author: "Me" },
  { text: "Le vague à l'âme nous enivre.", author: "Me" },
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

// ── Bibliography data ──
const books = {
    "Fyodor Dostoevsky": [
    { title: "Les nuits blanches", note: 4, cover: "covers/les-nuits-blanches.jpg", link: "https://www.goodreads.com/book/show/1772910.White_Nights" },
    { title: "Les carnets du sous-sol", note: 4, cover: "covers/carnets-du-sous-sol.jpg", link: "https://www.goodreads.com/book/show/1424502.Les_Carnets_du_sous_sol" },
    { title: "Le Rêve d'un homme ridicule", note: 4, cover: "covers/reve-homme-ridicule.jpg", link: "https://www.goodreads.com/book/show/1424499.Le_R_ve_d_un_homme_ridicule" },
    { title: "Un Voleur Honnête", note: 4, cover: "covers/unvoleurhonnete.jpg", link: "https://www.goodreads.com/book/show/2360416.Un_Voleur_Honn_te" },
    { title: "Un cœur faible", note: 3, cover: "covers/coeurfaible.jpg", link: "https://www.goodreads.com/book/show/3548787-un-c-ur-faible" },
    { title: "Le joueur", note: 2, cover: "covers/le-joueur-dostoievski.jpg", link: "https://www.goodreads.com/book/show/1389044.Le_Joueur" }
  ],
  "Franz Kafka": [
    { title: "La métamorphose", note: 4, cover: "covers/la-metamorphose.jpg", link: "https://www.goodreads.com/book/show/193988.La_M_tamorphose" },
    { title: "Lettre au père", note: 3, cover: "covers/lettre-au-pere.jpg", link: "https://www.goodreads.com/book/show/1289568.Lettre_au_p_re" },
    { title: "Devant la loi", note: 3, cover: "covers/devant-la-loi.jpg", link: "https://www.goodreads.com/book/show/36275000-before-the-law" },
    { title: "La Sentence - Dans la colonie pénitentiaire", note: 3, cover: "covers/la-sentence.jpg", link: "https://www.goodreads.com/book/show/177198041-la-sentence---dans-la-colonie-p-nitentiaire" },
    { title: "Le Terrier", note: 2, cover: "covers/le-terrier.jpg", link: "https://www.goodreads.com/book/show/199745510-le-terrier" }
  ],
  "Albert Camus": [
    { title: "La Chute", note: 5, cover: "covers/la-chute.jpg", link: "https://www.goodreads.com/book/show/774027.La_chute" },
    { title: "L'Étranger", note: 4, cover: "covers/letranger.jpg", link: "https://www.goodreads.com/book/show/15688.L_tranger" },
    { title: "La Peste", note: 3, cover: "covers/la-peste.jpg", link: "https://www.goodreads.com/book/show/770754.La_peste" },
    { title: "L'été", note: 3, cover: "covers/lete.jpg", link: "https://www.goodreads.com/book/show/12922533-l-t" },
    { title: "Le Malentendu", note: 3, cover: "covers/le-malentendu.jpg", link: "https://www.goodreads.com/book/show/168813720-by-albert-camus---le-malentendu-folio-theatre-french-edition-1995-0" }
  ],
  "Stefan Zweig": [
    { title: "Le Joueur d'échecs", note: 4, cover: "covers/joueur-echecs.jpg", link: "https://www.goodreads.com/book/show/1393712.Le_Joueur_d_checs" },
    { title: "Lettre d'une inconnue", note: 4, cover: "covers/lettre-inconnue.jpg", link: "https://www.goodreads.com/book/show/6427100-lettre-d-une-inconnue" },
    { title: "La Confusion des sentiments", note: 3, cover: "covers/confusion-sentiments.jpg", link: "https://www.goodreads.com/book/show/1393713.La_Confusion_des_sentiments" }
  ],
  "Antoine de Saint-Exupéry": [
    { title: "Le Petit Prince", note: 5, cover: "covers/petit-prince.jpg", link: "https://www.goodreads.com/book/show/43827544-the-little-prince" },
    { title: "Lettre à un otage", note: 5, cover: "covers/lettre-otage.jpg", link: "https://www.goodreads.com/book/show/1289991.Lettre_un_otage" }
  ],
  "Arthur Schopenhauer": [
    { title: "L'art d'avoir toujours raison", note: 5, cover: "covers/art-avoir-raison.jpg", link: "https://www.goodreads.com/book/show/36493598-l-art-d-avoir-toujours-raison-suivi-de-la-lecture-et-les-livres-et-pens" },
    { title: "Essai sur les femmes", note: 5, cover: "covers/essai-femmes.jpg", link: "https://www.goodreads.com/book/show/6779945-essai-sur-les-femmes" }
  ],
  "Emil M. Cioran": [
    { title: "De l'inconvénient d'être né", note: 5, cover: "covers/inconvenient-etre-ne.jpg", link: "https://www.goodreads.com/book/show/1768286.De_l_inconv_nient_d_tre_n_" },
    { title: "Sur les cimes du désespoir", note: 4, cover: "covers/cimes-desespoir.jpg", link: "https://www.goodreads.com/book/show/117546.Sur_les_cimes_du_d_sespoir" }
  ],
  "Victor Hugo": [
    { title: "Le dernier jour d'un condamné", note: 4, cover: "covers/dernier-jour-condamne.jpg", link: "https://www.goodreads.com/book/show/1638232.Le_Dernier_Jour_d_un_condamn_" },
    { title: "Claude gueux", note: 4, cover: "covers/claude-gueux.jpg", link: "https://www.goodreads.com/book/show/125527590-claude-gueux" }
  ],
  "Jean Racine": [
    { title: "Phèdre", note: 4, cover: "covers/phedre.jpg", link: "https://www.goodreads.com/book/show/81864.Ph_dre" },
    { title: "Andromaque", note: 4, cover: "covers/andromaque.jpg", link: "https://www.goodreads.com/book/show/33517073-andromaque" }
  ],
  "Osamu Dazai": [
    { title: "La Déchéance d'un homme", note: 4, cover: "covers/decheance-homme.jpg", link: "https://www.goodreads.com/book/show/11222940-no-longer-human" },
    { title: "Soleil couchant", note: 4, cover: "covers/soleil-couchant.jpg", link: "https://www.goodreads.com/book/show/194740.The_Setting_Sun" }
  ],
  "Jordan Bardella": [
    { title: "Ce Que Je Cherche", note: 1, cover: "covers/ce-que-je-cherche.jpg", link: "https://www.goodreads.com/book/show/220459830-ce-que-je-cherche" },
    { title: "Ce que veulent les Français", note: 1, cover: "covers/ce-que-veulent-francais.jpg", link: "https://www.goodreads.com/book/show/237782229-ce-que-veulent-les-fran-ais" }
  ],
  "Léo Etchar": [
    { title: "COVID-19 : Une crise sanitaire névrosée", note: 5, cover: "covers/covid-etchar.jpg", link: "https://www.goodreads.com/book/show/87062089-covid-19" }
  ],
  "Sarah Kane": [
    { title: "4.48 Psychosis", note: 5, cover: "covers/4-48-psychosis.jpg", link: "https://www.goodreads.com/book/show/146548.4_48_Psychosis" }
  ],
  "Yoshida Kenkō": [
    { title: "A Cup of Sake Beneath the Cherry Trees", note: 5, cover: "covers/cup-of-sake.jpg", link: "https://www.goodreads.com/book/show/24874345-a-cup-of-sake-beneath-the-cherry-trees" }
  ],
  "Stig Dagerman": [
    { title: "Notre besoin de consolation est impossible à rassasier", note: 5, cover: "covers/besoin-consolation.jpg", link: "https://www.goodreads.com/book/show/1495836.Notre_besoin_de_consolation_est_impossible_rassasier" }
  ],
  "Ivan Turgenev": [
    { title: "Le Journal d'un homme de trop", note: 5, cover: "covers/journal-homme-de-trop.jpg", link: "https://www.goodreads.com/book/show/2082727.Le_Journal_d_un_homme_de_trop" }
  ],
  "Michel Onfray": [
    { title: "Traité d'athéologie", note: 5, cover: "covers/traite-atheologie.jpg", link: "https://www.goodreads.com/book/show/1838025.Trait_d_ath_ologie" }
  ],
  "Khalil Gibran": [
    { title: "Le Prophète", note: 5, cover: "covers/le-prophete.jpg", link: "https://www.goodreads.com/book/show/59605643-le-proph-te" }
  ],
  "Stéphane Michaka": [
    { title: "La mémoire des couleurs", note: 5, cover: "covers/memoire-couleurs.jpg", link: "https://www.goodreads.com/book/show/42752899-la-m-moire-des-couleurs" }
  ],
  "Roald Dahl": [
    { title: "Charlie et la Chocolaterie", note: 5, cover: "covers/charlie-chocolaterie.jpg", link: "https://www.goodreads.com/book/show/524352.Charlie_et_la_chocolaterie" }
  ],
  "Karl Marx": [
    { title: "Manifeste du parti communiste", note: 4, cover: "covers/manifeste-communiste.jpg", link: "https://www.goodreads.com/book/show/2021781.Manifeste_du_parti_communiste" }
  ],
  "Louisa Yousfi": [
    { title: "Rester barbare", note: 4, cover: "covers/rester-barbare.jpg", link: "https://www.goodreads.com/book/show/60605405-rester-barbare" }
  ],
  "Léane Alestra": [
    { title: "Les Hommes hétéros le sont-ils vraiment ?", note: 4, cover: "covers/hommes-heteros.jpg", link: "https://www.goodreads.com/book/show/123162762-les-hommes-h-t-ros-le-sont-ils-vraiment" }
  ],
  "Charles Baudelaire": [
    { title: "Les Fleurs du Mal", note: 4, cover: "covers/fleurs-du-mal.jpg", link: "https://www.goodreads.com/book/show/207354.Les_Fleurs_du_Mal" }
  ],
  "Alfred de Musset": [
    { title: "On ne badine pas avec l'amour", note: 4, cover: "covers/badine-amour.jpg", link: "https://www.goodreads.com/book/show/570255.On_ne_badine_pas_avec_l_amour" }
  ],
  "Michael Morpurgo": [
    { title: "Soldat Peaceful", note: 4, cover: "covers/soldat-peaceful.jpg", link: "https://www.goodreads.com/book/show/15908589-soldat-peaceful" }
  ],
  "Harlan Ellison": [
    { title: "I Have No Mouth & I Must Scream", note: 4, cover: "covers/i-have-no-mouth.jpg", link: "https://www.goodreads.com/book/show/20813135-i-have-no-mouth-i-must-scream" }
  ],
  "Nemo Ramjet": [
    { title: "All Tomorrows", note: 4, cover: "covers/all-tomorrows.jpg", link: "https://www.goodreads.com/book/show/16143402-all-tomorrows" }
  ],
  "Franck Pavloff": [
    { title: "Matin Brun", note: 4, cover: "covers/matin-brun.jpg", link: "https://www.goodreads.com/book/show/2110174.Matin_Brun" }
  ],
  "Stéphane Hessel": [
    { title: "Indignez-vous !", note: 4, cover: "covers/indignez-vous.jpg", link: "https://www.goodreads.com/book/show/9638101-indignez-vous" }
  ],
  "Emile Zola": [
    { title: "J'accuse!", note: 4, cover: "covers/jaccuse.jpg", link: "https://www.goodreads.com/book/show/816964.J_accuse_" }
  ],
  "Frank Elgar": [
    { title: "Van Gogh", note: 4, cover: "covers/van-gogh-elgar.jpg", link: "https://www.goodreads.com/book/show/181685869-van-gogh-par-frank-elgar-hazan-peinture-beaux-arts-aldine-des-arts-daran" }
  ],
  "Jean-Paul Sartre": [
    { title: "La Nausée", note: 3, cover: "covers/la-nausee.jpg", link: "https://www.goodreads.com/book/show/87302.La_naus_e" }
  ],
  "Jean-François Amadieu": [
    { title: "Le Poids Des Apparences", note: 3, cover: "covers/poids-apparences.jpg", link: "https://www.goodreads.com/book/show/1043993.Le_Poids_Des_Apparences" }
  ],
  "Sénèque": [
    { title: "La Brièveté de la vie", note: 3, cover: "covers/brievete-vie.jpg", link: "https://www.goodreads.com/book/show/200094601-la-bri-vet-de-la-vie-suivi-de-lettres-lucilius" }
  ],
  "Hermann Hesse": [
    { title: "Siddhartha", note: 3, cover: "covers/siddhartha.jpg", link: "https://www.goodreads.com/book/show/42639871-siddharta" }
  ],
  "Arthur Rimbaud": [
    { title: "Les Cahiers de Douai", note: 3, cover: "covers/cahiers-douai.jpg", link: "https://www.goodreads.com/book/show/35377217-les-cahiers-de-douai" }
  ],
  "Maxence Fermine": [
    { title: "Neige", note: 3, cover: "covers/neige-fermine.jpg", link: "https://www.goodreads.com/book/show/107946.Neige_Points_" }
  ],
  "Gaël Faye": [
    { title: "Petit pays", note: 3, cover: "covers/petit-pays.jpg", link: "https://www.goodreads.com/book/show/36075029-petit-pays" }
  ],
  "Elsa Marpeau": [
    { title: "Carpe Diem", note: 3, cover: "covers/carpe-diem-marpeau.jpg", link: "https://www.goodreads.com/book/show/169829072-carpe-diem" }
  ],
  "Charles Robin": [
    { title: "Tous philosophes?", note: 3, cover: "covers/tous-philosophes.jpg", link: "https://www.goodreads.com/book/show/59815825-tous-philosophes" }
  ],
  "Eric Bénier-Bürckel": [
    { title: "Un prof bien sous tout rapport", note: 3, cover: "covers/prof-bien-rapport.jpg", link: "https://www.goodreads.com/book/show/482179.Un_prof_bien_sous_tout_rapport_" }
  ],
  "Octave Houdas": [
    { title: "Ethnographie de l'Algérie", note: 3, cover: "covers/ethnographie-algerie.jpg", link: "https://www.goodreads.com/book/show/22680330-ethnographie-de-l-alg-rie-d-1886-sciences-sociales" }
  ],
  "Jean-Jacques Rousseau": [
    { title: "Les Rêveries du promeneur solitaire", note: 2, cover: "covers/reveries-promeneur.jpg", link: "https://www.goodreads.com/book/show/58698503-les-r-veries-du-promeneur-solitaire" }
  ],
  "Jean-Luc Lagarce": [
    { title: "Juste la fin du monde", note: 2, cover: "covers/juste-fin-monde.jpg", link: "https://www.goodreads.com/book/show/1084444.Juste_la_fin_du_monde" }
  ],
  "Niccolò Machiavelli": [
    { title: "Le Prince", note: 1, cover: "covers/le-prince.jpg", link: "https://www.goodreads.com/book/show/54411076-le-prince-de-machiavel" }
  ],
  "Alain Soral": [
    { title: "Sociologie du dragueur", note: 1, cover: "covers/socio-dragueur.jpg", link: "https://www.goodreads.com/book/show/1484348.Sociologie_du_dragueur" }
  ],
  "Matthieu Meriot": [
    { title: "The Legend of Zelda : souvenirs d'enfance", note: 1, cover: "covers/zelda-souvenirs.jpg", link: "https://www.goodreads.com/book/show/63219063-the-legend-of-zelda" }
  ],
  "Éric Zemmour": [
    { title: "La messe n'est pas dite", note: 1, cover: "covers/messe-pas-dite.jpg", link: "https://www.goodreads.com/book/show/241169518-la-messe-n-est-pas-dite" }
  ],
  "Nicolas Sarkozy": [
    { title: "Le journal d'un prisonnier", note: 1, cover: "covers/journal-prisonnier.jpg", link: "https://www.goodreads.com/book/show/244241204-le-journal-d-un-prisonnier" }
  ],
  "Giovanni Boccaccio": [
    { title: "Mrs Rosie and the Priest", note: 1, cover: "covers/mrs-rosie-priest.jpg", link: "https://www.goodreads.com/book/show/24874328-mrs-rosie-and-the-priest" }
  ]
};

// ── Data Jeux vidéo ──
const games = {
  "Tarsier Studios": [
    { title: "Little Nightmares", note: 5, cover: "games/ln1.jpg", link: "https://backloggd.com/games/little-nightmares/" },
    { title: "Little Nightmares II", note: 5, cover: "games/ln2.jpg", link: "https://backloggd.com/games/little-nightmares-ii/" },
  ],
  "VaragtP": [
    { title: "Plantera", note: 5, cover: "games/plantera1.jpg", link: "https://backloggd.com/games/plantera/" },
    { title: "Plantera 2: Golden Acorn", note: 5, cover: "games/plantera2.jpg", link: "https://backloggd.com/games/plantera-2-golden-acorn/" },
  ],
  "Nikita Kryukov": [
    { title: "Milk Outside a Bag of Milk Outside a Bag of Milk", note: 3.5, cover: "games/milk.jpg", link: "https://backloggd.com/games/milk-outside-a-bag-of-milk-outside-a-bag-of-milk/" },
    { title: "Milk Inside a Bag of Milk Inside a Bag of Milk", note: 3, cover: "games/milki.jpg", link: "https://backloggd.com/games/milk-inside-a-bag-of-milk-inside-a-bag-of-milk/" },
  ],
  "Dani": [
    { title: "Muck", note: 3, cover: "games/muck.jpg", link: "https://www.backloggd.com/game/muck/" },
    { title: "Crab Game", note: 3, cover: "games/crabgame.jpg", link: "https://www.backloggd.com/game/crab-game/" },
  ],
  "Quiet River": [
    { title: "Zup! X", note: 2, cover: "games/zupx.jpg", link: "https://backloggd.com/games/zup-x/" },
    { title: "Zup!", note: 2, cover: "games/zup.jpg", link: "https://backloggd.com/games/zup/" },
  ],
   "Valve": [
    { title: "Left 4 Dead 2", note: 2.5, cover: "games/l4d2.jpg", link: "https://www.backloggd.com/game/left-4-dead-2/" },
    { title: "Portal 2", note: null, cover: "games/portal2.jpg", link: "https://www.backloggd.com/game/portal-2/" },
  ],
  "Snkl Studio": [
    { title: "JQ: countries", note: 1, cover: "games/jqcountries.jpg", link: "https://backloggd.com/games/jq-countries/" },
    { title: "Znkl: 177", note: 1, cover: "games/znkl.jpg", link: "https://backloggd.com/games/znkl-177/" },
  ],
  "Mojang Studios": [
    { title: "Minecraft: Java Edition", note: 5, cover: "games/minecraft.jpg", link: "https://backloggd.com/games/minecraft-java-edition/" },
  ],
  "Mega Crit Games": [
    { title: "Slay the Spire", note: 5, cover: "games/slaythespire.jpg", link: "https://www.backloggd.com/game/slay-the-spire/" },
  ],
  "Noio": [
    { title: "Kingdom: Classic", note: 5, cover: "games/kingdom.jpg", link: "https://backloggd.com/games/kingdom-classic--1/" },
  ],
  "WeirdBeard": [
    { title: "Tricky Towers", note: 5, cover: "games/trickytowers.jpg", link: "https://backloggd.com/games/tricky-towers/" },
  ],
  "funl": [
    { title: "Click to Ten", note: 5, cover: "games/clicktoten.jpg", link: "https://backloggd.com/games/click-to-ten/" },
  ],
  "Subset Games": [
    { title: "FTL: Faster Than Light", note: 5, cover: "games/ftl.jpg", link: "https://backloggd.com/games/ftl-faster-than-light/" },
  ],
  "Nicalis, Inc.": [
    { title: "The Binding of Isaac: Rebirth", note: 5, cover: "games/isaac.jpg", link: "https://backloggd.com/games/the-binding-of-isaac-rebirth/" },
  ],
  "KAGAMI WORKs": [
    { title: "Mirror", note: 5, cover: "games/mirror.jpg", link: "https://backloggd.com/games/mirror/" },
  ],
  "Tobias Springer": [
    { title: "Shapez", note: 5, cover: "games/shapez.jpg", link: "https://backloggd.com/games/shapez/" },
  ],
  "Re-Logic": [
    { title: "Terraria", note: 5, cover: "games/terraria.jpg", link: "https://backloggd.com/games/terraria/" },
  ],
  "Poncle": [
    { title: "Vampire Survivors", note: 5, cover: "games/vampiresurvivors.jpg", link: "https://backloggd.com/games/vampire-survivors/" },
  ],
  "Whalefall": [
    { title: "Poco", note: 4, cover: "games/poco.jpg", link: "https://backloggd.com/games/poco/" },
  ],
  "Hop Frog": [
    { title: "Forager", note: 4, cover: "games/forager.jpg", link: "https://backloggd.com/games/forager/" },
  ],
  "Zeekerss": [
    { title: "Lethal Company", note: 4, cover: "games/lethalcompany.jpg", link: "https://backloggd.com/games/lethal-company/" },
  ],
  "Smartly Dressed Games": [
    { title: "Unturned", note: 4, cover: "games/unturned.jpg", link: "https://backloggd.com/games/unturned--1/" },
  ],
  "Red Barrels": [
    { title: "Outlast", note: 4, cover: "games/outlast.jpg", link: "https://backloggd.com/games/outlast/" },
  ],
  "The Behemoth": [
    { title: "BattleBlock Theater", note: 3.5, cover: "games/battleblock.jpg", link: "https://backloggd.com/games/battleblock-theater/" },
  ],
  "The Pixel Hunt": [
    { title: "Wednesdays", note: 3, cover: "games/wednesdays.jpg", link: "https://backloggd.com/games/wednesdays/" },
  ],
  "Londer Software": [
    { title: "Zort", note: 3, cover: "games/zort.jpg", link: "https://backloggd.com/games/zort/" },
  ],
  "AIHASTO": [
    { title: "Eco Hole", note: 3, cover: "games/ecohole.jpg", link: "https://backloggd.com/games/eco-hole/" },
  ],
  "Dominique Grieshofer": [
    { title: "Refunct", note: 3, cover: "games/refunct.jpg", link: "https://backloggd.com/games/refunct/" },
  ],
  "ColloseusX": [
    { title: "Creature Clicker: Capture, Train, Ascend!", note: 3, cover: "games/creatureclicker.jpg", link: "https://backloggd.com/games/creature-clicker-capture-train-ascend/" },
  ],
  "borgia mango": [
    { title: "Inland", note: 3, cover: "games/inland.jpg", link: "https://backloggd.com/games/inland/" },
  ],
  "GOGOGOBATO": [
    { title: "Little Girl On Earth Asking Why She Asking Why", note: 2.5, cover: "games/littlegirl.jpg", link: "https://backloggd.com/games/little-girl-on-earth-asking-why-she-asking-why/" },
  ],
  "tokoronyori": [
    { title: "Bokura", note: 2.5, cover: "games/bokura.jpg", link: "https://backloggd.com/games/bokura/" },
  ],
  "EGAMER": [
    { title: "Slash It", note: 2.5, cover: "games/slashit.jpg", link: "https://backloggd.com/games/slash-it/" },
  ],
  "EM Games": [
    { title: "Isle of Jura", note: 2.5, cover: "games/isleofjura.jpg", link: "https://backloggd.com/games/isle-of-jura/" },
  ],
  "Anegar Games": [
    { title: "Chained Together", note: 2.5, cover: "games/chainedtogether.jpg", link: "https://backloggd.com/games/chained-together/" },
  ],
  "Tbjbu2": [
    { title: "Pet Lands", note: 1.5, cover: "games/petlands.jpg", link: "https://backloggd.com/games/pet-lands/" },
  ],
  "Ocular Interactive": [
    { title: "Redactem", note: 1.5, cover: "games/redactem.jpg", link: "https://backloggd.com/games/redactem/" },
  ],
  "8Floor": [
    { title: "Business Tour", note: 1, cover: "games/businesstour.jpg", link: "https://backloggd.com/games/business-tour/" },
  ],
  "Nikita Ghost_RUS": [
    { title: "Anime girl or Bottle?", note: 1, cover: "games/animegirl.jpg", link: "https://backloggd.com/games/anime-girl-or-bottle/" },
  ],
  "NipoBox": [
    { title: "Away", note: 0.5, cover: "games/away.jpg", link: "https://backloggd.com/games/away/" },
  ],
  "MrFatcat": [
    { title: "Inside the Backrooms", note: 0.5, cover: "games/backrooms.jpg", link: "https://backloggd.com/games/inside-the-backrooms/" },
  ],
  "Synapse Games": [
    { title: "Spellstone", note: null, cover: "games/spellstone.jpg", link: "https://backloggd.com/games/spellstone/" },
  ],
  "Nerial": [
    { title: "Reigns", note: null, cover: "games/reigns.jpg", link: "https://backloggd.com/games/reigns/" },
  ],
  "SKH Apps": [
    { title: "Pacify", note: null, cover: "games/pacify.jpg", link: "https://backloggd.com/games/pacify/" },
  ],
};

// ── Data Musique ──
const musique = {
  "Lupe Fiasco": [
    { title: "Samurai", note: 5, cover: "music/samurai.webp", link: "https://rateyourmusic.com/release/album/lupe-fiasco/samurai/" },
  ],
};

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

  for (const author in data) {
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

    data[author].forEach(book => {
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
  }
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

// ── Data Films ──
const films = {
  "Christopher Nolan": [
    { title: "Interstellar", note: 4.5, cover: "films/interstellar.webp", link: "https://www.senscritique.com/film/interstellar/388583" },
    { title: "Inception", note: 4.5, cover: "films/inception.jpg", link: "https://www.senscritique.com/film/inception/471143" },
    { title: "The Dark Knight - Le Chevalier noir", note: 4, cover: "films/thedarkknight.webp", link: "https://www.senscritique.com/film/the_dark_knight_le_chevalier_noir/419456" },
    { title: "Oppenheimer", note: 3.5, cover: "films/oppenheimer.webp", link: "https://www.senscritique.com/film/oppenheimer/45419890" },
    { title: "Batman Begins", note: 3.5, cover: "films/batmanbegins.png", link: "https://www.senscritique.com/film/batman_begins/368879" },
    { title: "Insomnia", note: 3.5, cover: "films/insomnia.jpg", link: "https://www.senscritique.com/film/insomnia/461694" },
    { title: "Memento", note: 3.5, cover: "films/memento.jpg", link: "https://www.senscritique.com/film/memento/473176" },
    { title: "Le Prestige", note: 3, cover: "films/leprestige.jpg", link: "https://www.senscritique.com/film/le_prestige/484187" },
    { title: "Following", note: 2.5, cover: "films/following.jpg", link: "https://www.senscritique.com/film/following_le_suiveur/382251" },
    { title: "Doodlebug", note: null, cover: "films/doodlebug.jpg", link: "https://www.senscritique.com/film/doodlebug/404551" },
    { title: "Tarantella", note: null, cover: "films/tarantella.jpg", link: "https://www.senscritique.com/film/tarantella/24971949" },
  ],
    "Aleksandr Petrov": [
    { title: "Le Rêve d'un homme ridicule", note: 4.5, cover: "films/hommeridicule.jpg", link: "https://www.senscritique.com/film/le_reve_d_un_homme_ridicule/485462" },
    { title: "Le Vieil Homme et la Mer", note: 4, cover: "films/vieilhommeetmer.jpg", link: "https://www.senscritique.com/film/le_vieil_homme_et_la_mer/372930" },
    { title: "La Sirène", note: 4, cover: "films/lasirene.jpg", link: "https://www.senscritique.com/film/la_sirene/1225870" },
    { title: "Mon amour", note: 3, cover: "films/monamour.jpg", link: "https://www.senscritique.com/film/mon_amour/470451" },
    { title: "La Vache", note: 3, cover: "films/lavache.jpg", link: "https://www.senscritique.com/film/la_vache/403933" },
    { title: "Firebird", note: 3, cover: "films/firebird.jpg", link: "https://www.senscritique.com/film/firebird/39011325" },
    { title: "Russian Railways", note: 3, cover: "films/russianrailways.jpg", link: "https://www.senscritique.com/film/russian_railways/77841626" },
    { title: "The Marathon", note: 2.5, cover: "films/themarathon.jpg", link: "https://www.senscritique.com/film/the_marathon/384124" },
  ],
  "Peter Foldes": [
    { title: "On Closer Inspection", note: 3.5, cover: "films/oncloserinspection.png", link: "https://www.senscritique.com/film/on_closer_inspection/39788325" },
    { title: "La faim", note: null, cover: "films/lafaim.jpg", link: "https://www.senscritique.com/film/la_faim/423152" },
    { title: "Metadata", note: null, cover: "films/metadata.jpg", link: "https://www.senscritique.com/film/metadata/39783473" },
    { title: "Plus Vite", note: null, cover: "films/plusvite.jpg", link: "https://www.senscritique.com/film/plus_vite/450266" },
    { title: "Un garçon plein d'avenir", note: null, cover: "films/ungarconpleindavenir.jpg", link: "https://www.senscritique.com/film/un_garcon_plein_d_avenir/27851836" },
    { title: "Appétit d'oiseau", note: null, cover: "films/appetitdoiseau.jpg", link: "https://www.senscritique.com/film/appetit_d_oiseau/13020568" },
    { title: "A Short Vision", note: null, cover: "films/ashortvision.jpg", link: "https://www.senscritique.com/film/a_short_vision/13053528" },
  ],
  "Frédéric Back": [
    { title: "Illusion ?", note: 4, cover: "films/illusion.png", link: "https://www.senscritique.com/film/illusion/453450" },
    { title: "Tout Rien", note: 4, cover: "films/toutrien.png", link: "https://www.senscritique.com/film/tout_rien/495941" },
    { title: "Abracadabra", note: 3, cover: "films/abracadabra.png", link: "https://www.senscritique.com/film/abracadabra/387546" },
    { title: "Inon ou la Conquête du feu", note: 2.5, cover: "films/inon.png", link: "https://www.senscritique.com/film/inon_ou_la_conquete_du_feu/451138" },
    { title: "Taratata !", note: 2.5, cover: "films/taratata.jpg", link: "https://www.senscritique.com/film/taratata/484860" },
    { title: "La Création des oiseaux", note: 2, cover: "films/lacreationdesoiseaux.png", link: "https://www.senscritique.com/film/la_creation_des_oiseaux/466433" },
  ],
  "René Laloux": [
    { title: "La Planète sauvage", note: 3.5, cover: "films/laplanetesauvage.png", link: "https://www.senscritique.com/film/la_planete_sauvage/474489" },
    { title: "La Prisonnière", note: 3.5, cover: "films/laprisonniere.jpg", link: "https://www.senscritique.com/film/la_prisonniere/379335" },
    { title: "Les Achalunés", note: 0.5, cover: "films/lesachalunes.jpg", link: "https://www.senscritique.com/film/les_achalunes/12110226" },
    { title: "Tic Tac", note: 0.5, cover: "films/tictac.jpg", link: "https://www.senscritique.com/film/tic_tac/16866395" },
    { title: "Les Temps morts", note: null, cover: "films/lestempsmorts.jpg", link: "https://www.senscritique.com/film/les_temps_morts/450104" },
    { title: "Les Dents du singe", note: null, cover: "films/lesdentsdusinge.jpg", link: "https://www.senscritique.com/film/les_dents_du_singe/552178" },
  ],
  "Michael Dudok de Wit": [
    { title: "La Tortue rouge", note: 4, cover: "films/latortuerouge.jpg", link: "https://www.senscritique.com/film/la_tortue_rouge/10900169" },
    { title: "Père et fille", note: null, cover: "films/pereetfille.jpg", link: "https://www.senscritique.com/film/pere_et_fille/476376" },
    { title: "Tom Sweep", note: null, cover: "films/tomsweep.jpg", link: "https://www.senscritique.com/film/tom_sweep/433403" },
    { title: "L'Arôme du thé", note: 0.5, cover: "films/laromeduthe.jpg", link: "https://www.senscritique.com/film/l_arome_du_the/480159" },
  ],
  "Jean-Luc Godard": [
    { title: "Le Petit Soldat", note: 4, cover: "films/lepetitsoldat.jpg", link: "https://www.senscritique.com/film/le_petit_soldat/428321" },
    { title: "Vivre sa vie", note: 3.5, cover: "films/vivresavie.jpg", link: "https://www.senscritique.com/film/vivre_sa_vie/372817" },
    { title: "Deux ou trois choses que je sais d'elle", note: 0.5, cover: "films/deuxoutroischoses.jpg", link: "https://www.senscritique.com/film/deux_ou_trois_choses_que_je_sais_d_elle/438890" },
    { title: "Je vous salue, Sarajevo", note: null, cover: "films/sarajevo.jpg", link: "https://www.senscritique.com/film/je_vous_salue_sarajevo/495688" },
  ],
  "Chad Stahelski": [
    { title: "John Wick", note: 3.5, cover: "films/johnwick.png", link: "https://www.senscritique.com/film/john_wick/11989542" },
    { title: "John Wick 2", note: 3.5, cover: "films/johnwick2.png", link: "https://www.senscritique.com/film/john_wick_2/13221402" },
    { title: "John Wick - Parabellum", note: 3.5, cover: "films/johnwick3.png", link: "https://www.senscritique.com/film/john_wick_parabellum/253583030" },
  ],
  "Jan Švankmajer": [
    { title: "Obscurité, lumière, obscurité", note: null, cover: "films/obscurite.jpg", link: "https://www.senscritique.com/film/obscurite_lumiere_obscurite/426157" },
    { title: "Meat Love", note: null, cover: "films/meatlove.jpg", link: "https://www.senscritique.com/film/meat_love/476726" },
    { title: "Les Possibilités du dialogue", note: null, cover: "films/lespossibilitesdudialogue.jpg", link: "https://www.senscritique.com/film/les_possibilites_du_dialogue/495460" },
  ],
  "Phil Lord": [
    { title: "21 Jump Street", note: 4, cover: "films/21jumpstreet.jpg", link: "https://www.senscritique.com/film/21_jump_street/405826" },
    { title: "22 Jump Street", note: 4, cover: "films/22jumpstreet.jpg", link: "https://www.senscritique.com/film/22_jump_street/7937020" },
  ],
  "Naoto Yamakawa": [
    { title: "Attack on the Bakery", note: 4, cover: "films/bakery.jpg", link: "https://www.senscritique.com/film/attack_on_the_bakery/16798354" },
    { title: "A Girl, She Is 100%", note: 3.5, cover: "films/agirlsheis.jpg", link: "https://www.senscritique.com/film/a_girl_she_is_100/43801189" },
  ],
  "Anthony Russo": [
    { title: "Avengers: Infinity War", note: 4, cover: "films/infinitywar.jpg", link: "https://www.senscritique.com/film/avengers_infinity_war/9008787" },
    { title: "Avengers: Endgame", note: 3, cover: "films/endgame.jpg", link: "https://www.senscritique.com/film/avengers_endgame/12707585" },
  ],
  "Quentin Tarantino": [
    { title: "Reservoir Dogs", note: 3, cover: "films/reservoirdogs.png", link: "https://www.senscritique.com/film/reservoir_dogs/430335" },
    { title: "Inglourious Basterds", note: 3, cover: "films/inglourious.webp", link: "https://www.senscritique.com/film/inglourious_basterds/388285" },
  ],
  "Park Chan-Wook": [
    { title: "Old Boy", note: 5, cover: "films/oldboy.png", link: "https://www.senscritique.com/film/old_boy/444625" },
  ],
  "Sidney Lumet": [
    { title: "Douze Hommes en colère", note: 5, cover: "films/douzehommes.jpg", link: "https://www.senscritique.com/film/douze_hommes_en_colere/370894" },
  ],
  "Yang Li": [
    { title: "Escape From the 21st Century", note: 5, cover: "films/escape21.webp", link: "https://www.senscritique.com/film/escape_from_the_21st_century/97622952" },
  ],
  "Bernard Queysanne": [
    { title: "Un homme qui dort", note: 4.5, cover: "films/unhommequidort.jpg", link: "https://www.senscritique.com/film/un_homme_qui_dort/390872" },
  ],
  "Jean Cocteau": [
    { title: "Le Testament d'Orphée", note: 4.5, cover: "films/letestamentdorphee.jpg", link: "https://www.senscritique.com/film/le_testament_d_orphee/397005" },
  ],
  "Daniel Kwan": [
    { title: "Everything Everywhere All at Once", note: 4.5, cover: "films/everything.webp", link: "https://www.senscritique.com/film/everything_everywhere_all_at_once/41357764" },
  ],
  "Georges Schwizgebel": [
    { title: "Fugue", note: 4.5, cover: "films/fugue.jpg", link: "https://www.senscritique.com/film/fugue/456566" },
  ],
  "Alain Guiraudie": [
    { title: "Ce vieux rêve qui bouge", note: 4.5, cover: "films/cevieuxreve.jpg", link: "https://www.senscritique.com/film/ce_vieux_reve_qui_bouge/1333244" },
  ],
  "Martin Scorsese": [
    { title: "Shutter Island", note: 4.5, cover: "films/shutterisland.png", link: "https://www.senscritique.com/film/shutter_island/405140" },
  ],
  "Patrick Imbert": [
    { title: "Le Sommet des dieux", note: 4.5, cover: "films/lesommetdesdieux.jpg", link: "https://www.senscritique.com/film/le_sommet_des_dieux/20012631" },
  ],
  "Mathieu Kassovitz": [
    { title: "La Haine", note: 4.5, cover: "films/lahaine.png", link: "https://www.senscritique.com/film/la_haine/472094" },
  ],
  "Joaquim Dos Santos": [
    { title: "Spider-Man: Across the Spider-Verse", note: 4.5, cover: "films/acrossspiderverse.png", link: "https://www.senscritique.com/film/spider_man_across_the_spider_verse/38465583" },
  ],
  "Bob Persichetti": [
    { title: "Spider-Man : New Generation", note: 4, cover: "films/spidermannewgeneration.webp", link: "https://www.senscritique.com/film/spider_man_new_generation/14954623" },
  ],
  "Fabio Scacchioli": [
    { title: "Miss Candace Hilligoss' Flickering Halo", note: 4, cover: "films/misscandace.jpg", link: "https://www.senscritique.com/film/miss_candace_hilligoss_flickering_halo/24982154" },
  ],
  "Caroline Poggi": [
    { title: "Bébé Colère", note: 4, cover: "films/bebecolere.png", link: "https://www.senscritique.com/film/bebe_colere/43518566" },
  ],
  "Tim Egan": [
    { title: "Curve", note: 4, cover: "films/curve.jpg", link: "https://www.senscritique.com/film/curve/23737037" },
  ],
  "Elizabeth Chai Vasarhelyi": [
    { title: "Free Solo", note: 4, cover: "films/freesolo.jpg", link: "https://www.senscritique.com/film/free_solo/36158361" },
  ],
  "Darren Aronofsky": [
    { title: "Requiem for a Dream", note: 4, cover: "films/requiemforadream.jpg", link: "https://www.senscritique.com/film/requiem_for_a_dream/466346" },
  ],
  "Todd Phillips": [
    { title: "Joker", note: 4, cover: "films/joker.webp", link: "https://www.senscritique.com/film/joker/27059297" },
  ],
  "Peter Weir": [
    { title: "The Truman Show", note: 4, cover: "films/thetrumanshow.jpg", link: "https://www.senscritique.com/film/the_truman_show/415454" },
  ],
  "Brad Anderson": [
    { title: "The Machinist", note: 4, cover: "films/themachinist.jpg", link: "https://www.senscritique.com/film/the_machinist/434608" },
  ],
  "David Fincher": [
    { title: "Fight Club", note: 4, cover: "films/fightclub.webp", link: "https://www.senscritique.com/film/fight_club/363185" },
  ],
  "Abbas Kiarostami": [
    { title: "Le Goût de la cerise", note: 3.5, cover: "films/cerise.jpg", link: "https://www.senscritique.com/film/le_gout_de_la_cerise/470935" },
  ],
  "Wim Wenders": [
    { title: "Perfect Days", note: 3.5, cover: "films/perfectdays.png", link: "https://www.senscritique.com/film/perfect_days/55674665" },
  ],
  "Sogo Ishii": [
    { title: "Mirrored Mind", note: 3.5, cover: "films/mirroredmind.jpg", link: "https://www.senscritique.com/film/mirrored_mind/38280622" },
  ],
  "Friedrich Wilhelm Murnau": [
    { title: "Nosferatu le vampire", note: 3.5, cover: "films/nosferatu.jpg", link: "https://www.senscritique.com/film/nosferatu_le_vampire/470348" },
  ],
  "Robert Eggers": [
    { title: "The Lighthouse", note: 3.5, cover: "films/thelighthouse.jpg", link: "https://www.senscritique.com/film/the_lighthouse/30479044" },
  ],
  "Tony Kaye": [
    { title: "American History X", note: 3.5, cover: "films/americanstoryx.jpg", link: "https://www.senscritique.com/film/american_history_x/392288" },
  ],
  "Lorcan Finnegan": [
    { title: "Vivarium", note: 3.5, cover: "films/vivarium.jpg", link: "https://www.senscritique.com/film/vivarium/39308515" },
  ],
  "George Butler": [
    { title: "Pumping Iron", note: 3.5, cover: "films/pumpingiron.jpg", link: "https://www.senscritique.com/film/pumping_iron_arnold_le_magnifique/465603" },
  ],
  "Jerrod Carmichael": [
    { title: "On the Count of Three", note: 3.5, cover: "films/onthecountofthree.jpg", link: "https://www.senscritique.com/film/on_the_count_of_three/43825064" },
  ],
  "Denis Villeneuve": [
    { title: "Premier Contact", note: 3.5, cover: "films/premiercontact.jpg", link: "https://www.senscritique.com/film/premier_contact/11134569" },
  ],
  "Andrew Foerster": [
    { title: "The God Man", note: 3.5, cover: "films/thegodman.jpg", link: "https://www.senscritique.com/film/the_god_man/112316892" },
  ],
  "David Leitch": [
    { title: "Bullet Train", note: 3.5, cover: "films/bulletrain.png", link: "https://www.senscritique.com/film/bullet_train/42556935" },
  ],
  "Hideaki Anno": [
    { title: "Ryusei Kacho", note: 3.5, cover: "films/ryuseikacho.jpg", link: "https://www.senscritique.com/film/ryusei_kacho/17202295" },
  ],
  "Mary Harron": [
    { title: "American Psycho", note: 3.5, cover: "films/americanpsycho.jpg", link: "https://www.senscritique.com/film/american_psycho/375957" },
  ],
  "Steven Soderbergh": [
    { title: "Paranoïa", note: 3.5, cover: "films/paranoia.jpg", link: "https://www.senscritique.com/film/paranoia/26804240" },
  ],
  "Yeon Sang-Ho": [
    { title: "Dernier train pour Busan", note: 3.5, cover: "films/busan.png", link: "https://www.senscritique.com/film/dernier_train_pour_busan/20666236" },
  ],
  "Bong Joon-Ho": [
    { title: "Parasite", note: 3.5, cover: "films/parasite.png", link: "https://www.senscritique.com/film/parasite/25357970" },
  ],
  "Ridley Scott": [
    { title: "Alien - Le 8ème Passager", note: 3.5, cover: "films/alien.png", link: "https://www.senscritique.com/film/alien_le_8eme_passager/435660" },
  ],
  "Seth MacFarlane": [
    { title: "Ted", note: 3.5, cover: "films/ted.jpg", link: "https://www.senscritique.com/film/ted/435443" },
  ],
  "Joel Schumacher": [
    { title: "Le Nombre 23", note: 3.5, cover: "films/lenombre23.jpg", link: "https://www.senscritique.com/film/le_nombre_23/444473" },
  ],
  "Jonathan Demme": [
    { title: "Le Silence des agneaux", note: 3.5, cover: "films/lesilencedesagneaux.jpg", link: "https://www.senscritique.com/film/le_silence_des_agneaux/380343" },
  ],
  "Genki Kawamura": [
    { title: "Exit 8", note: 3.5, cover: "films/exit8.png", link: "https://www.senscritique.com/film/exit_8/106570232" },
  ],
  "Scott Beck": [
    { title: "Heretic", note: 3, cover: "films/heretic.png", link: "https://www.senscritique.com/film/heretic/85721413" },
  ],
  "Jean-Pierre Jeunet": [
    { title: "Le Fabuleux Destin d'Amélie Poulain", note: 3, cover: "films/ameliepoulain.jpg", link: "https://www.senscritique.com/film/le_fabuleux_destin_d_amelie_poulain/406497" },
  ],
  "Elijah Bynum": [
    { title: "Magazine Dreams", note: 3, cover: "films/magazinedreams.jpg", link: "https://www.senscritique.com/film/magazine_dreams/47765720" },
  ],
  "Chris Sanders": [
    { title: "Le Robot sauvage", note: 3, cover: "films/robotsauvage.webp", link: "https://www.senscritique.com/film/le_robot_sauvage/61044627" },
  ],
  "Bruno Dumont": [
    { title: "France", note: 3, cover: "films/france.jpg", link: "https://www.senscritique.com/film/france/39281781" },
  ],
  "Kelly Reichardt": [
    { title: "Old Joy", note: 3, cover: "films/oldjoy.jpg", link: "https://www.senscritique.com/film/old_joy/415832" },
  ],
  "Lilly Wachowski": [
    { title: "Matrix", note: 3, cover: "films/matrix.png", link: "https://www.senscritique.com/film/matrix/382239" },
  ],
  "Spike Jonze": [
    { title: "Her", note: 3, cover: "films/her.png", link: "https://www.senscritique.com/film/her/1301677" },
  ],
  "Wes Anderson": [
    { title: "Fantastic Mr. Fox", note: 2.5, cover: "films/fantasticmrfox.jpg", link: "https://www.senscritique.com/film/fantastic_mr_fox/450461" },
  ],
  "Jared Hess": [
    { title: "A Minecraft Movie", note: 2, cover: "films/minecraft.png", link: "https://www.senscritique.com/film/minecraft_le_film/10997206" },
  ],
  "Bryan Singer": [
    { title: "Usual Suspects", note: 2, cover: "films/usualsuspects.webp", link: "https://www.senscritique.com/film/usual_suspects/390881" },
  ],
  "Emma Tammi": [
    { title: "Five Nights at Freddy's", note: 2, cover: "films/freddy.png", link: "https://www.senscritique.com/film/five_nights_at_freddys/16778152" },
  ],
  "Chris Marker": [
    { title: "Sans soleil", note: 0.5, cover: "films/sanssoleil.jpg", link: "https://www.senscritique.com/film/sans_soleil/407618" },
  ],
  "Aaron Fradkin": [
    { title: "The Ballerina", note: 0.5, cover: "films/theballerina.jpg", link: "https://www.senscritique.com/film/the_ballerina/63430922" },
  ],
  "Christopher Cox": [
    { title: "Don't Look Away", note: 0.5, cover: "films/dontlookaway.jpg", link: "https://www.senscritique.com/film/don_t_look_away/31960064" },
  ],
  "Danièle Huillet": [
    { title: "Dialogue d'ombres", note: 0.5, cover: "films/dialoguedombres.jpg", link: "https://www.senscritique.com/film/dialogue_d_ombres/12575276" },
  ],
  "Sean S. Cunningham": [
    { title: "Vendredi 13", note: 0.5, cover: "films/vendredi13.png", link: "https://www.senscritique.com/film/vendredi_13/469282" },
  ],
  "Toshio Matsumoto": [
    { title: "Phantom", note: null, cover: "films/phantom.jpg", link: "https://www.senscritique.com/film/phantom/12036583" },
  ],
  "Chris Cunningham": [
    { title: "Rubber Johnny", note: null, cover: "films/rubberjohnny.jpg", link: "https://www.senscritique.com/film/rubber_johnny/4916148" },
  ],
  "Harun Farocki": [
    { title: "Feu inextinguible", note: null, cover: "films/feuinextinguible.jpg", link: "https://www.senscritique.com/film/feu_inextinguible/485078" },
  ],
  "Clément Freze": [
    { title: "Mindliar - Le Dernier Mensonge", note: null, cover: "films/mindliar.jpg", link: "https://www.senscritique.com/film/mindliar_le_dernier_mensonge/103459923" },
  ],
  "Simon Shack": [
    { title: "September Clues", note: null, cover: "films/septemberclues.jpg", link: "https://www.senscritique.com/film/september_clues/39789827" },
  ],
  "Jérémy Clapin": [
    { title: "J'ai perdu mon corps", note: null, cover: "films/jaiperdumoncorps.png", link: "https://www.senscritique.com/film/j_ai_perdu_mon_corps/39006031" },
  ],
  "David Dufresne": [
    { title: "Un pays qui se tient sage", note: null, cover: "films/unpayssage.jpg", link: "https://www.senscritique.com/film/un_pays_qui_se_tient_sage/42372324" },
  ],
};

// ── Data Séries ──
const series = {
  "Breaking Bad": [
    { title: "Saison 1", note: 3.5, cover: "series/breakingbad1.jpg", link: "https://www.senscritique.com/serie/breaking_bad/264963" },
    { title: "Saison 2", note: 3.5, cover: "series/breakingbad2.webp", link: "https://www.senscritique.com/serie/breaking_bad/264963" },
    { title: "Saison 3", note: 3.5, cover: "series/breakingbad3.jpg", link: "https://www.senscritique.com/serie/breaking_bad/264963" },
    { title: "Saison 4", note: 3, cover: "series/breakingbad4.webp", link: "https://www.senscritique.com/serie/breaking_bad/264963" },
    { title: "Saison 5", note: 4, cover: "series/breakingbad5.jpg", link: "https://www.senscritique.com/serie/breaking_bad/264963" }
  ],
  "Arcane": [
    { title: "Saison 1", note: 4.5, cover: "series/arcane.jpg", link: "https://www.senscritique.com/serie/arcane/40487888" },
  ],
  "Squid Game": [
    { title: "Saison 1", note: 4, cover: "series/squidgame.webp", link: "https://www.senscritique.com/serie/squid_game/45353208" },
  ],
  "One Piece": [
    { title: "Saison 1", note: 4, cover: "series/onepiece.png", link: "https://www.senscritique.com/serie/one_piece/26565027" },
  ],
  "Inside Jamel Comedy Club": [
    { title: "Saison 1", note: 3.5, cover: "series/jamel.jpg", link: "https://www.senscritique.com/serie/inside_jamel_comedy_club/441758" },
  ],
  "Alice in Borderland": [
    { title: "Saison 1", note: 2.5, cover: "series/alice.png", link: "https://www.senscritique.com/serie/alice_in_borderland/43182155" },
  ],
};

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
  for (const director in data) {
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
    data[director].forEach(movie => {
      const card = document.createElement('a');
      card.href = movie.link; 
      card.target = "_blank"; 
      card.className = 'book-card';
      
      const starsHtml = movie.note !== null ? `<div class="book-meta">${getStars(movie.note)}</div>` : '';
      
      card.innerHTML = `<img src="${movie.cover}" alt="${movie.title}"><div class="book-title">${movie.title}</div>${starsHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  }
}

// ── Generate Séries ──
function generateSeries(data = series) {
  updateEcransCounter();
  const container = document.getElementById('seriesContent');
  container.innerHTML = '';
  for (const show in data) {
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
    data[show].forEach(season => {
      const card = document.createElement('a');
      card.href = season.link; card.target = "_blank"; card.className = 'book-card';
      
      const starsHtml = season.note !== null ? `<div class="book-meta">${getStars(season.note)}</div>` : '';
      
      card.innerHTML = `<img src="${season.cover}" alt="${season.title}"><div class="book-title">${season.title}</div>${starsHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  }
}

// ── Generate Jeux vidéo ──
function generateGames(data = games) {
  let totalGames = 0;
  for (const dev in games) totalGames += games[dev].length;
  document.getElementById('jeux-counter').textContent = totalGames + " jeux joués";

  const container = document.getElementById('jeuxContent');
  container.innerHTML = '';

  for (const dev in data) {
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
    data[dev].forEach(game => {
      const card = document.createElement('a');
      card.href = game.link;
      card.target = "_blank";
      card.className = 'book-card';

      const starsHtml = game.note !== null ? `<div class="book-meta">${getStars(game.note)}</div>` : '';

      card.innerHTML = `<img src="${game.cover}" alt="${game.title}"><div class="book-title">${game.title}</div>${starsHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  }
}

// ── Generate Musique ──
function generateMusique(data = musique) {
  let totalAlbums = 0;
  for (const artist in musique) totalAlbums += musique[artist].length;
  document.getElementById('musique-counter').textContent = totalAlbums + " albums écoutés";

  const container = document.getElementById('musiqueContent');
  container.innerHTML = '';

  for (const artist in data) {
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
    data[artist].forEach(album => {
      const card = document.createElement('a');
      card.href = album.link;
      card.target = "_blank";
      card.className = 'book-card';

      const starsHtml = album.note !== null ? `<div class="book-meta">${getStars(album.note)}</div>` : '';

      card.innerHTML = `<img src="${album.cover}" alt="${album.title}"><div class="book-title">${album.title}</div>${starsHtml}`;
      div.appendChild(card);
    });
    container.appendChild(div);
  }
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

// ── JOURNAL & CALENDRIER ──
const journal = [
{ d: "2026-04-16", t: "film", title: "Old Boy", img: "films/oldboy.png", note: "test" },
];

const typeColors = { film: "dot-film", livre: "dot-livre", jeu: "dot-jeu", musique: "dot-musique" };
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
const categories = ['livre', 'film', 'anime', 'jeu', 'musique'];
const labels = { 
  livre: 'Dernier lu', 
  film: 'Dernier vu', 
  anime: 'Dernier anime', 
  jeu: 'Dernier joué', 
  musique: 'Dernier écouté' 
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
      
      html += `
        <div class="home-dash-card">
          <img src="${latestEntry.img}" alt="${latestEntry.title}">
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
      html += `
        <div class="calendar-day has-data" data-date="${dateStr}">
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
    html += `
      <div class="popup-item">
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
const TAG_BLACKLIST = ['+', '*', 'recap', 'arg', 'music.archived', 'archived', 're-watched', 'bought', 'watched', 'plan to watch', 'dropped', 'on hold', 'watching', 'completed', ''];
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
      if (TAG_BLACKLIST.indexOf(t) !== -1) return;
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
    if (query) {
      var q = norm(query);
      return norm(a.title).indexOf(q) !== -1;
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

document.getElementById('toggle-tags-btn').addEventListener('click', function() { tagsExpanded = !tagsExpanded; renderAnimeTags(); });
document.getElementById('search-anime').addEventListener('input', function() { animeDisplayed = 0; applyAnimeFilter(); });
document.getElementById('load-more-anime').addEventListener('click', renderAnimeBatch);