// ── Bibliography data ──
const booksData = {
    "Fyodor Dostoevsky": [
    { title: "Les nuits blanches", note: 4, cover: "covers/les-nuits-blanches.jpg", link: "https://www.goodreads.com/book/show/1772910.White_Nights" },
    { title: "Les carnets du sous-sol", note: 4, cover: "covers/carnets-du-sous-sol.jpg", link: "https://www.goodreads.com/book/show/1424502.Les_Carnets_du_sous_sol" },
    { title: "Le Rêve d'un homme ridicule", note: 4, cover: "covers/reve-homme-ridicule.jpg", link: "https://www.goodreads.com/book/show/1424499.Le_R_ve_d_un_homme_ridicule" },
    { title: "Un Voleur Honnête", note: 4, cover: "covers/unvoleurhonnete.jpg", link: "https://www.goodreads.com/book/show/2360416.Un_Voleur_Honn_te" },
    { title: "Un cœur faible", note: 3, cover: "covers/coeurfaible.jpg", link: "https://www.goodreads.com/book/show/3548787-un-c-ur-faible" },
    { title: "Le joueur", note: 2, cover: "covers/le-joueur-dostoievski.jpg", link: "https://www.goodreads.com/book/show/1389044.Le_Joueur" },
    { title: "Le Bouffon", note: 2, cover: "covers/lebouffon.jpg", link: "https://www.goodreads.com/book/show/34694060-le-bouffon" },
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