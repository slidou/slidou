// ── Bibliography data ──
const booksData = {
    "Fyodor Dostoevsky": [
    { title: "Les nuits blanches", note: 4, cover: "covers/les-nuits-blanches.jpg", link: "https://www.goodreads.com/book/show/1772910.White_Nights" },
    { title: "Les carnets du sous-sol", note: 4, cover: "covers/carnets-du-sous-sol.jpg", link: "https://www.goodreads.com/book/show/1424502.Les_Carnets_du_sous_sol" },
    { title: "Le Rêve d'un homme ridicule", note: 4, cover: "covers/reve-homme-ridicule.jpg", link: "https://www.goodreads.com/book/show/1424499.Le_R_ve_d_un_homme_ridicule", review: `Une étoile et un revolver, une petite fille et un rêve.

Lire cette nouvelle me trottait dans la tête depuis un assez long moment, évidemment il m'a déjà été donné de lire quelques livres de Dostoïevski, sans pour autant plonger pour le moment dans ses œuvres les plus fournies.

C'est en tombant sur le chef-d'œuvre d'animation d'Aleksandr Petrov, adaptant cette nouvelle, que ma curiosité a été immédiatement piquée... (je vous conseille fortement d'aller le regarder, tout comme ses autres courts-métrages d'animation "Le Vieil Homme et la Mer", "Mon amour" ou encore "Mermaid"). Je l'ai regardé le 9 février 2025, mais ce n'était qu'hier que je me suis enfin lancé dans la lecture de ce livre sans y réfléchir à deux fois. Et je ne sais maintenant par où commencer pour en parler... Faisons dans le classique, par le début.

Le protagoniste que l'on suit est un homme ridicule, il se perçoit en tout cas comme tel depuis son enfance et il décide lors d'une soirée agréable de mettre fin à ses jours pour ainsi mettre un terme à cette farce une fois pour toute. Durant cette soirée, en observant une étoile dans le ciel, il décide que c’est le moment. Pourquoi ? Parce qu’à cet instant, plus rien n’a de valeur à ses yeux. Pour en finir, il fallait tomber dans le nihilisme le plus total, ne plus donner d'importance à quoi que ce soit, plus de valeur au monde. C'était chose faite à ce moment-là... Enfin, ça l'était.

Le point clé de toute cette histoire réside dans une rencontre des plus troublantes, celle avec une petite fille déboussolée et désemparée qui vient le supplier de l'aider. Mais il ne cherche même pas à savoir pour quelle raison exacte elle le supplie, pire que cela, il finit par s'énerver et la repousser avant de rentrer chez lui. Mais il était déjà trop tard.

Trop tard oui, il ne peut plus se suicider, et c'est pour cette raison qu'il s'est énervé. Il a ressenti de la pitié envers la petite fille. Il se souciait encore de ce qu'elle pouvait ressentir. Il se rend compte qu'il a encore des sentiments, qu'il ressent encore de l'amour envers l'humanité, de la pitié pour celle qui le supplie de l'aider.

De retour chez lui, le voilà maintenant assis devant son bureau, revolver chargé face à lui, l'outil final de sa silencieuse défaite, mais impossible de l'utiliser.
Il s'endort alors et plonge dans un rêve où, comme une boîte de Pandore ouverte, les questions jaillissent sans fin tout au long d'une nuit qui semble éternelle. Tant que je suis vivant, je ressentirai des sentiments, mais pourtant, si j'en finis dans deux heures, à quoi bon me prendre la tête avec ça ? Cette colère et cette honte de ne pas l'avoir aidée rongent pourtant son esprit.

Après moultes péripéties, il finit par avoir face à lui l'origine de l'Homme, l'amour. Amour qu'il finit par corrompre par sa simple présence, ou du moins, tout comme son sentiment de ridicule, il croit que c’est de sa faute, sans en connaître la raison exacte. Il se sent coupable, car à ses yeux il est avant tout coupable d'exister, ridicule d'exister, tout est donc forcément de sa faute.

Il se rend compte d'une chose essentielle malgré cela, que malgré la corruption dans le rêve idyllique, malgré la débauche, l'homme est avant tout capable d'aimer. Voilà la solution face au nihilisme, et pour être honnête c'est une chose à laquelle je pense assez souvent. L'amour oui... le seul et unique remède face au nihilisme.

« Je ne veux pas et je ne peux pas croire que le mal soit l’état normal des hommes. »

Ça change des autres livres que j'ai pu lire de lui, c'est beaucoup plus lumineux, plus porté sur l'espoir. Même un homme qui a pris la décision de se suicider peut retrouver foi envers l'amour, foi envers l'humanité, foi envers la Vie.

La vérité finit par apparaître face à lui, l'homme peut être bon :

« Ce qui compte : aime ton prochain comme toi-même, voilà ce qui compte – c’est tout, et il ne faut rien d’autre : tu trouveras tout de suite comment construire. Et pourtant, tout cela, ce n’est rien qu’une vieille vérité qu’on rabâche, qu’on a lue des billions de fois, mais, voilà, elle n’a pas pris racine ! »

Il finit à la fin par retrouver la fille, et cette fois-ci, il ira.

On comprendra tout de suite que le texte, que ce soit par le monde miroir dans le rêve avant tout décrit comme étant paradisiaque ou par l'origine de l'amour, renvoie explicitement à une vision christique de la rédemption, ce qui n'est pas étonnant venant de Dostoïevski (le bagne l'ayant profondément marqué).

Et moi aussi, je finis d’écrire ces quelques lignes, à quelques instants de succomber à mon tour à Morphée, assis devant mon bureau.` },
    { title: "Un Voleur Honnête", note: 4, cover: "covers/unvoleurhonnete.jpg", link: "https://www.goodreads.com/book/show/2360416.Un_Voleur_Honn_te" },
    { title: "Un cœur faible", note: 3, cover: "covers/coeurfaible.jpg", link: "https://www.goodreads.com/book/show/3548787-un-c-ur-faible", review: `Le personnage principal se crée une dette morale imaginaire tout le long de l'histoire, il n'arrête pas de répéter qu'il reçoit beaucoup trop de bonheur de la part de son meilleur ami et de sa fiancée pendant que lui ne leur donne rien en retour. Et c'est là que son ami lui répond qu'il n'a rien à rembourser du tout, que c'était ça l'amitié. Il avait transformé l'amour en obligation morale.

Il y a aussi un aspect toujours d'actualité de nos jours, au cours de l'histoire il doit rendre un travail important selon lui, écrire 6 carnets, sauf qu'il ne lui reste que deux jours pour tout finir et il n'a même pas fait 1/4. Et c'est à ce moment là que s'installe la procrastination anxieuse, il pense au travail titanesque qu'il lui reste à faire, commence à paniquer, fait autre chose pour ne pas y penser, et la catastrophe se rapproche de plus en plus dangereusement. S'installe alors une spirale qui le pousse littéralement dans la folie mentale.
Il devient fou non pas à cause du réel en lui-même, mais à cause du scénario qu'il s'est créé dans sa tête.
Tout ça pour au final apprendre de la part de son patron que ce n'était pas un travail urgent et qu'il aurait pu lui laisser plus de temps.

Et c'est souvent comme ça chez les personnages de Dostoïevski, j'ai lu l'expression de "conscience hypertrophiée" que j'aime bien, les personnages réfléchissent trop, ressentent trop et anticipent trop.
C'est cette peur de ne pas mériter le bonheur, de devoir à tout prix être parfait sinon ce n'est pas assez. Certaines personnes sont plus à l'aise dans la souffrance que le bonheur.

Vers la fin son ami dit : "Ce fut comme s’il venait de comprendre, seulement à cet instant, toute cette inquiétude et de savoir pourquoi son pauvre Vassia, qui n’avait pas supporté son bonheur, était devenu fou."

Tout le monde autour de lui est bienveillant, que ce soit son ami, sa fiancée ou son patron, mais il transforme cet amour en fardeau moral écrasant.
Ce n’est pas la cruauté du monde qui détruit Vassia, mais son incapacité à accepter simplement d’être aimé.` },
    { title: "Le joueur", note: 2, cover: "covers/le-joueur-dostoievski.jpg", link: "https://www.goodreads.com/book/show/1389044.Le_Joueur", review: `Franchement, j’ai trouvé que l’auteur passait complètement à côté de son sujet. Le jeu, qui aurait dû être au cœur du récit, est relégué au second plan. C’était sûrement un choix, mais je m’attendais à une vraie réflexion sur la dépendance et l’obsession des joueurs, comme le laissait entendre la quatrième de couverture. Au final, tout ça est à peine effleuré.

Les personnages sont mis en avant, mais aucun ne m’a vraiment intéressé, impossible de m’y attacher. Leurs intrigues me passaient au-dessus de la tête. Seule l’histoire de la grand-mère apporte une touche d’humour bienvenue, mais à part ça, rien de marquant.

Ni les dialogues ni le style de l’auteur ne m’ont touché. Une lecture qui ne m’a pas convaincu.` },
    { title: "Le Bouffon", note: 2, cover: "covers/lebouffon.jpg", link: "https://www.goodreads.com/book/show/34694060-le-bouffon" },
  ],
  "Franz Kafka": [
    { title: "La métamorphose", note: 4, cover: "covers/la-metamorphose.jpg", link: "https://www.goodreads.com/book/show/193988.La_M_tamorphose", review: `Ce qui est intéressant dans ce livre, c'est que l'auteur ne prend pas la démarche classique de montrer uniquement la transformation et l'évolution d'un personnage dans son changement physique. Là, nous suivons surtout la métamorphose de tout un groupe, la métamorphose des liens qu'ils ont avec le personnage principal, le propos ici n'est pas vraiment l'insecte qu'il est devenu mais l'isolement social derrière qui en résulte.
Il passe d'un pilier de groupe au rejeté absolu. On pourrait très bien remplacer sa transformation en une personne qui tombe malade, un "déchet social" ou ce que vous voulez, ce serait pareil. On passe d'une famille aimante quand tout se passe bien dans le meilleur des mondes, à une hostilité sans nom quand le pilier s'écroule, la compassion et l'amour disparaissent pour laisser place au dégoût dans un premier temps puis à l'indifférence la plus totale. Sa disparition ne serait que bénéfique pour tout le monde.

Ça ne dérangeait personne quand notre protagoniste troquait sa liberté contre de l’argent pour payer les dettes de sa famille.

Vous imaginez bien que j'ai vraiment bien apprécié le livre parce que je me reconnais d’une certaine manière, ce n’est pas très long en plus, je l'ai lu en deux fois, je vous le conseille grandement.` },
    { title: "Lettre au père", note: 3, cover: "covers/lettre-au-pere.jpg", link: "https://www.goodreads.com/book/show/1289568.Lettre_au_p_re" },
    { title: "Devant la loi", note: 3, cover: "covers/devant-la-loi.jpg", link: "https://www.goodreads.com/book/show/36275000-before-the-law" },
    { title: "La Sentence - Dans la colonie pénitentiaire", note: 3, cover: "covers/la-sentence.jpg", link: "https://www.goodreads.com/book/show/177198041-la-sentence---dans-la-colonie-p-nitentiaire", review: `Une lecture intéressante, mais qui ne m'a pas transcendé. Heureusement, c'était court.

Pour commencer, si je devais interpréter "La Sentence", je verrais en elle la figure d'un parent ultra-toxique et autoritaire qui juge et condamne selon son propre narratif, sans jamais écouter sa progéniture. Il incarne cette volonté de contrôle absolu sur la vie d’autrui, comme si le lien du sang signifiait une propriété totale. L’enfant, quant à lui, se soumet entièrement à la figure paternelle. En connaissant la relation entre Kafka et son père, cette lecture prend tout son sens.  

Concernant "Dans la colonie pénitentiaire", j’ai trouvé le concept de la machine infernale fascinant, mais je ne suis pas entièrement convaincu par l’exécution du récit. Les deux histoires se rejoignent autour de la notion de jugement, un jugement que l’on pourrait qualifier de dogmatique et absurde. Ici, l’accusé ne connaît même pas son crime, et la culpabilité est considérée comme un fait indiscutable. L’officier applique la sentence avec une ferveur quasi-religieuse, comme s'il était le dernier prêtre d’un culte moribond. Cette idée est particulièrement renforcée par ce qui ressemble à un clin d’œil au mythe de la résurrection de Jésus à la fin du récit.  

Ce qui rend l’histoire encore plus ironique, c’est l’aveuglement total de l’officier face à la chute de son propre système. Il refuse d’admettre que la machine est obsolète, que le commandant a été remplacé et que plus personne ne croit en cette justice mécanique et cruelle. Pourtant, il s’accroche désespérément à ses croyances et décide de prouver sa foi en s’infligeant la sentence lui-même, dans un ultime acte de soumission au dogme.  

L'ancien commandant, quant à lui, est décrit comme une figure quasi-divine, omnipotente et créatrice de règles. Il est à la fois juge, soldat, ingénieur, chimiste et dessinateur. L’officier parle de lui comme d’un guide infaillible. Comme je disais plus haut, une prophétie annonce même que l'officier va renaître, à la manière du commandant, pour guider les hommes. Cependant, cette attente messianique est d’autant plus absurde qu’elle appartient à un monde révolu, où le système qu’il défend est en train de s’effondrer. Kafka joue ici avec l’absurde et tourne en dérision les idéologies totalitaires et religieuses qui survivent malgré leur propre décrépitude.  

La scène finale est également marquante : le visiteur rejette le système de la colonie, mais refuse aussi d’en devenir un acteur. Il demeure un observateur extérieur, refusant même d’embarquer le soldat et le condamné avec lui. Ce choix souligne une indifférence presque cruelle : plutôt que d’intervenir pour sauver ces deux hommes d’un destin incertain, il les abandonne, comme s’ils faisaient partie intégrante d’un système voué à l’effondrement.` },
    { title: "Le Terrier", note: 2, cover: "covers/le-terrier.jpg", link: "https://www.goodreads.com/book/show/199745510-le-terrier" }
  ],
  "Albert Camus": [
    { title: "La Chute", note: 5, cover: "covers/la-chute.jpg", link: "https://www.goodreads.com/book/show/774027.La_chute", review: `C'est à partir de cet événement fatidique (la chute de la femme dans la Seine) que le personnage principal commence à vaciller. Il prend conscience qu'il est lui aussi sujet au jugement, car il n'a rien fait pour la sauver cette nuit-là. Son image d’homme parfait se fissure peu à peu. Dès lors, il a l'impression que les gens autour de lui affichent des sourires en coin et rient dans son dos, ce qui le rend de plus en plus maladroit, persuadé d’être constamment jugé.

Bien sûr, tout cela se passe avant tout dans sa psyché, Il croit être jugé, alors il projette ce jugement sur les autres, qui deviennent le reflet de sa propre culpabilité. Il s'enferme lui-même dans sa propre prison mentale dont il est à la fois le geôlier et le captif. 
Il n'est pas "bon" par nature, il veut l’être parce qu'il s'aime lui-même. Il est même prêt à devenir immortel pour pouvoir s’admirer éternellement. Ce qu’il cherche, ce n’est pas tant la vertu que l’image parfaite de lui-même dans le regard des autres. Il ne veut pas seulement être parfait, il veut que le monde le voie comme tel. Conscient de son hypocrisie, il préfère pourtant maintenir l’illusion, pour lui comme pour les autres.

La dernière phrase du livre résume toute cette mécanique et sa culpabilité : "Ô jeune fille, jette-toi encore dans l'eau pour que j'aie une seconde fois la chance de nous sauver tous les deux !" Cette femme qui tombe symbolise littéralement la chute mentale du personnage principal. Il va même jusqu'à montrer un tableau volé à un inconnu, comme si, au fond, il espérait être arrêté. Ce tableau représente des juges, une présence symbolique qui semble le scruter en permanence, jusque chez lui, il se sent coupable.

Un chef-d'œuvre dont certaines citations m'ont marqué à jamais.` },
    { title: "L'Étranger", note: 4, cover: "covers/letranger.jpg", link: "https://www.goodreads.com/book/show/15688.L_tranger", review: `"Du moment qu'on meurt, comment et quand, cela n'importe pas, c'était évident."` },
    { title: "La Peste", note: 3, cover: "covers/la-peste.jpg", link: "https://www.goodreads.com/book/show/770754.La_peste", review: `La résistance face au mal absurde.` },
    { title: "L'été", note: 3, cover: "covers/lete.jpg", link: "https://www.goodreads.com/book/show/12922533-l-t" },
    { title: "Le Malentendu", note: 3, cover: "covers/le-malentendu.jpg", link: "https://www.goodreads.com/book/show/168813720-by-albert-camus---le-malentendu-folio-theatre-french-edition-1995-0" }
  ],
  "Stefan Zweig": [
    { title: "Le Joueur d'échecs", note: 4, cover: "covers/joueur-echecs.jpg", link: "https://www.goodreads.com/book/show/1393712.Le_Joueur_d_checs", review: `C'était très bon, rien de spécial à dire.
On voit vraiment à quel point les joueurs d'échecs sont dans un monde à part, un peu comme les artistes. Le côté obsessionnel est très bien retranscrit, et l'auteur mêle de véritables références historiques à une histoire fictive, tout est parfaitement géré.
On comprend vraiment que ce n'est pas simplement un jeu. Certains y mettent littéralement toute leur vie dans ces 64 carrés noirs et blancs, C'est un mélange entre l'art et la science, et aucun hasard n'y est possible.` },
    { title: "Lettre d'une inconnue", note: 4, cover: "covers/lettre-inconnue.jpg", link: "https://www.goodreads.com/book/show/6427100-lettre-d-une-inconnue", review: `Un livre qui parle de l'amour obsessionnel d'une femme pour un homme, pour qui elle est restée une inconnue, de son enfance jusqu'à la fin. Elle a dédié toute sa vie, toute son âme, à cette personne, mais la vie ne lui fera pas de cadeau et un destin tragique finira par l'emporter dans l'indifférence générale.

Une très bonne lecture. J'étais déjà d'humeur morose ce soir, et cela n'a fait qu'ajouter une couche à cet état.` },
    { title: "La Confusion des sentiments", note: 3, cover: "covers/confusion-sentiments.jpg", link: "https://www.goodreads.com/book/show/1393713.La_Confusion_des_sentiments", review: `Lecture agréable même si j'ai plus apprécié les deux autres livres de l’auteur que j'ai lus.
Peut-être que le sujet me parlait moins ou que je suis passé un peu à côté. 

L’histoire raconte celle d'un homme totalement fasciné et admiratif d’un de ses maîtres, ce qui engendre un tas de sentiments confus.
"Freud a salué la finesse et la vérité avec lesquelles l'auteur d'Amok et du Joueur d'échecs restituait le trouble d'une passion et le malaise qu'elle engendre chez celui qui en est l'objet".

Après, étant donné que le livre est paru en 1927, ça devait être quelque chose pour l’époque, je n’en doute pas.` }
  ],
  "Antoine de Saint-Exupéry": [
    { title: "Le Petit Prince", note: 5, cover: "covers/petit-prince.jpg", link: "https://www.goodreads.com/book/show/43827544-the-little-prince", review: `Le Petit Prince, rien de spécial à dire dessus si ce n'est que c'est un chef-d'œuvre, je l'avais lu quand j'étais en primaire, mais avec la relecture, je me suis rendu compte que je n'avais pas compris énormément de sous-texte (ce qui est logique).

Pour moi, le livre, c'est avant tout un appel à ne pas oublier l'humain en devenant une grande personne, à ne pas oublier de regarder avec le cœur et non avec les yeux.
Tout comme ce qui fait la beauté du désert (le puits), de la maison (le trésor) ou de l'étoile (la rose) est invisible, ce qui fait la beauté de l'homme est une chose invisible que l'on nomme les liens du cœur.

Et je tiens à dire que la version physique du livre est magnifique, avec ses différents dessins à l'intérieur. Je suis bien content de l'avoir.` },
    { title: "Lettre à un otage", note: 5, cover: "covers/lettre-otage.jpg", link: "https://www.goodreads.com/book/show/1289991.Lettre_un_otage", review: `L'amitié et l'amour de la France, l'espoir de sa libération, le remords de l'avoir quittée en pleine occupation allemande... Pourtant, il se dit voyageur et non émigré, contrairement à beaucoup d'autres, car plus que tout, il rêve de retrouver ses racines un jour.

C'est son amitié qui le fait passer d’émigrant à voyageur. C'est grâce à cette amitié, pour cet homme jamais nommé (afin de ne pas le mettre en danger), qu'il reste fidèle à ses racines.

"Jamais je n'ai aimé mieux ma maison que dans le Sahara", pour nous rappeler surtout que "La présence de l'ami qui en apparence s'est éloigné, peut se faire plus dense qu'une présence réelle."

Lettre à un otage, ou plutôt lettre à un ami... Un ami resté en France.` }
  ],
  "Arthur Schopenhauer": [
    { title: "L'art d'avoir toujours raison", note: 5, cover: "covers/art-avoir-raison.jpg", link: "https://www.goodreads.com/book/show/36493598-l-art-d-avoir-toujours-raison-suivi-de-la-lecture-et-les-livres-et-pens" },
    { title: "Essai sur les femmes", note: 5, cover: "covers/essai-femmes.jpg", link: "https://www.goodreads.com/book/show/6779945-essai-sur-les-femmes" }
  ],
  "Emil M. Cioran": [
    { title: "De l'inconvénient d'être né", note: 5, cover: "covers/inconvenient-etre-ne.jpg", link: "https://www.goodreads.com/book/show/1768286.De_l_inconv_nient_d_tre_n_", review: `Le livre est un chef-d'œuvre à mes yeux et me parle énormément. Ici, on ne suit pas une histoire mais plutôt une suite de pensées et d’anecdotes de l'auteur dans lesquelles il est facile de se projeter. Compliqué donc de résumer le livre tant il est riche, mais il aborde la naissance, la mort et ce qu'il y a entre ces deux états, dont la notion de liberté. 

Ici on change de focale : on ne méprise plus la mort pour ce qu'elle est, mais la naissance (une malédiction) pour ce qu'elle nous impose. On ne regarde pas devant nous mais derrière, d'où tout découle. Exister, venir au monde, c'est avoir perdu d'avance. Vous l'aurez deviner rien qu'au titre, c'est fataliste et pessimiste à souhait, avec une touche d'humour parfois. Mais il y'a du bon à en tirer, tant l'auteur est en contradiction avec lui-même tout au long du livre. 

Ça n'aide en rien ma santé mentale, ça c'est sûr, mais je suis quand même curieux de lire les autres ouvrages qu'il a pu sortir.` },
    { title: "Sur les cimes du désespoir", note: 4, cover: "covers/cimes-desespoir.jpg", link: "https://www.goodreads.com/book/show/117546.Sur_les_cimes_du_d_sespoir" }
  ],
  "Victor Hugo": [
    { title: "Le dernier jour d'un condamné", note: 4, cover: "covers/dernier-jour-condamne.jpg", link: "https://www.goodreads.com/book/show/1638232.Le_Dernier_Jour_d_un_condamn_", review: `Suite à Claude Gueux, j'ai lu Le Dernier Jour d'un Condamné, un très bon livre, rien à redire.

C'est avant tout un livre sur l'humain. On est plongé dans la souffrance et détresse psychologique d’un condamné, à l’aube de sa dernière heure dont on ignore jusqu’au crime. C'est une œuvre qui se veut entièrement politique et dénonce l'absurdité de la peine de mort.

Bien que ce sujet date de 1800, il reste d'actualité. N'ayant aucune information sur le crime, nous, lecteurs, ne pouvons juger l'homme, mais seulement sa peine.` },
    { title: "Claude gueux", note: 4, cover: "covers/claude-gueux.jpg", link: "https://www.goodreads.com/book/show/125527590-claude-gueux", review: `Je viens de finir Claude Gueux, un livre parfaitement en vigueur même en 2023 malgré que l'histoire se déroule en 1830 avec des enjeux importants dans une société saine.

Victor Hugo constate à travers cette affaire que le peuple souffre, et que c'est cette détresse qui le pousse au crime.
Il a voulu faire de Claude le représentant du peuple misérable. Le personnage incarne cette identité sociale jusque dans son nom : Gueux.
On nous dit que cet homme a volé et tué, mais à aucun moment on ne cherche à comprendre ce qui l'a poussé à de tels extrêmes. La société devrait pourtant reconnaître sa part de responsabilité dans les crimes engendrés par la misère qu'elle ne sait pas combattre. La société est coupable du crime de Claude, qu'elle n'a pas su prévenir.

Quand on lui retire sa seule lueur d'espoir – son ami en prison – par pure méchanceté, il déclare alors "Je lui ai donné jusqu'au 4 novembre pour me rendre Albin. Il m'a fait mettre au cachot pour avoir dit cela. Moi, pendant ce temps-là, je l'ai jugé et je l'ai condamné à mort" - "Que la nécessité de se faire justice soi-même était un cul-de-sac où l'on se trouvait engagé quelquefois".

Une autre phrase après avoir commis l'irréparable, un meurtre, et lorsqu'il voulu se donner la mort : "Médecins et juges s'empressaient autour de Claude ; les uns guérissaient ses blessures, les autres dressaient son échafaud".
A noter qu'il avait fait 4ans de prison sur les 5 reçues pour vol, ça renforce encore plus le caractère désespéré de son geste.

"Claude Gueux avait commencé par vivre en concubinage avec une fille publique ; puis il avait volé ; puis il avait tué. Tout cela était vrai. Mais pourquoi ai-je volé ? pourquoi ai-je tué ? Posez ces deux questions à côté des autres, messieurs les jurés".

Ce livre est avant tout une question de l'éducation, question de la pénalité ; et entre ces deux questions, la société toute entière.

J'ai relevé quelques passages qui me semble importants à mes yeux :

"Voyez Claude Gueux. Cerveau bien fait, cœur bien fait, sans nul doute. Mais le sort le met dans une société si mal faite qu'il finit par tuer. Qui est réellement coupable ? Est ce lui ? Est ce nous ?"

"Vous vous querellez après pour savoir si les boutons de la garde nationale doivent être blancs ou jaunes, et si l'assurance est une plus belle chose que la certitude. Messieurs des centres, messieurs des extrémités, le gros du peuple souffre ! Que vous l'appeliez république ou monarchie, le peuple souffre. Ceci est un fait. Le peuple a faim, le peuple a froid. La misère le pousse au crime ou au vice, selon le sexe. Ayez pitié du peuple."

"Démontez moi cette vieille échelle boiteuse des crimes et des peines, et refaites là. Refaites votre pénalité, refaites vos codes, refaites vos prisons, refaites vos juges. Remettez les lois au pas des mœurs."

"Avec la solde de vos quatre-vingts bourreaux, vous paierez six cents maîtres d'écoles."

"Or de ces pauvres têtes mal conformées, le premier tort est à la nature sans doute, le second à l'éducation. La nature a mal ébauché, l'éducation a mal retouché l'ébauche."

"Donnez au peuple qui travaille et qui souffre, donnez au peuple, pour qui ce monde-ci est mauvais, la croyance à un meilleur monde fait pour lui. Il sera tranquille, il sera patient. La patience est faite d'espérance."

Et pour finir la phrase la plus importante du livre :

"Cette tête de l'homme du peuple, cultivez-la, défrichez-la, arrosez-la, fécondez-la, éclairez-la, moralisez-la, utilisez-la ; vous n'aurez pas besoin de la couper."` }
  ],
  "Jean Racine": [
    { title: "Phèdre", note: 4, cover: "covers/phedre.jpg", link: "https://www.goodreads.com/book/show/81864.Ph_dre" },
    { title: "Andromaque", note: 4, cover: "covers/andromaque.jpg", link: "https://www.goodreads.com/book/show/33517073-andromaque" }
  ],
  "Osamu Dazai": [
    { title: "La Déchéance d'un homme", note: 4, cover: "covers/decheance-homme.jpg", link: "https://www.goodreads.com/book/show/11222940-no-longer-human", review: `J'avais déjà lu la version manga avant cela et c'est exactement la même histoire, hormis la fin qui change légèrement. La version manga est un peu plus modernisée. Bonne lecture, tout le monde peut se reconnaître, à un certain degré qui varie selon ce que l'on a vécu ou non, dans la psyché du personnage principal.` },
    { title: "Soleil couchant", note: 4, cover: "covers/soleil-couchant.jpg", link: "https://www.goodreads.com/book/show/194740.The_Setting_Sun" }
  ],
  "Jordan Bardella": [
    { title: "Ce Que Je Cherche", note: 1, cover: "covers/ce-que-je-cherche.jpg", link: "https://www.goodreads.com/book/show/220459830-ce-que-je-cherche", review: `Fond absolument désastreux et ennuyeux à mourir, au point que je me passerai de commentaire par flemme. Mais cerise sur le gâteau, la forme pêche aussi : faire une faute de paronymie entre 'dénote' et 'détonne' dans un livre qui se veut un minimum sérieux, fallait le faire. D'autant plus quand l’auteur, en plus d’être bourré de contradictions, n’a sans doute même pas écrit seul.` },
    { title: "Ce que veulent les Français", note: 1, cover: "covers/ce-que-veulent-francais.jpg", link: "https://www.goodreads.com/book/show/237782229-ce-que-veulent-les-fran-ais", review: `Quelle misère, quelle souffrance.
Un livre fantasmé et médiocre contenant la même structure narrative en boucle.` }
  ],
  "Léo Etchar": [
    { title: "COVID-19 : Une crise sanitaire névrosée", note: 5, cover: "covers/covid-etchar.jpg", link: "https://www.goodreads.com/book/show/87062089-covid-19", review: `Livre du GOAT.` }
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
    { title: "Le Journal d'un homme de trop", note: 5, cover: "covers/journal-homme-de-trop.jpg", link: "https://www.goodreads.com/book/show/2082727.Le_Journal_d_un_homme_de_trop", review: `Le journal d'un homme de trop, je l'ai lu en une fois, je n'ai pas su m'arrêter.
Un homme sur son lit de mort qui tente de raconter sa vie dans un journal, deux semaines avant sa mort et de nous prouver qu'il a toujours été un homme de trop pour cette vie, que la nature même n'a pas voulu en premier lieu.
Mais très vite, il se concentre surtout sur son premier amour et les relations autour dans lesquelles il s'est toujours senti de trop, une cinquième roue, un cinquième destrier dont on pourrait aisément se passer, un oiseau de trop.

Je vais m'arrêter là pour ne pas spoiler l’histoire mais vraiment j'ai dévoré le livre, excellent rien d'autre à ajouter.

"Mon Dieu ! mon Dieu ! je vais mourir... Ce coeur avide et capable d'amour va bientôt cesser de battre... Est-il possible qu'il se taise à jamais sans avoir une seule fois connu le bonheur".` }
  ],
  "Michel Onfray": [
    { title: "Traité d'athéologie", note: 5, cover: "covers/traite-atheologie.jpg", link: "https://www.goodreads.com/book/show/1838025.Trait_d_ath_ologie", review: `Je connaissais déjà la majorité des informations présentes dans le livre, suivant depuis un bon moment la sphère des apostats sur Internet, mais j’ai particulièrement apprécié le rappel de l’abomination qu’est la circoncision. Et même si cela devrait aller de soi, le fait que chaque point soit systématiquement sourcé pour démonter tout l’attirail religieux est excellent. Malgré cela, ceux qui se trouvent dans l'obscurité fuiront toujours la lumière afin d'éviter de voir leur monde s'écrouler sous le poids du réel. L'endoctrinement est une puissance terrifiante, capable d'enfermer l'esprit dans une prison mentale dont il ne s'évadera jamais.

J’aime beaucoup la façon dont l'auteur tape sur toutes les religions. Même si je suis plus calé sur l’islam que sur le christianisme, c’était intéressant de lire l’histoire du premier État totalitaire chrétien, né des folies de Constantin et de Paul avant lui. L’ouvrage déconstruit méthodiquement les trois grandes religions, avec sources à l’appui et esprit critique. Et quelle meilleure période pour le lire que celle du ramadan et du carême ?

Une chose que j’ignorais totalement, en revanche, c’est que l’Église catholique accordait son absolution au régime collaborationniste de Vichy dès 1940 et que le Vatican était très proche d’Hitler. Il faut dire qu’ils avaient un ennemi commun : les juifs. Son livre Mein Kampf ne fait d’ailleurs pas partie de leur index des livres bannis... alors qu’on y retrouve une tonne d’ouvrages scientifiques et philosophiques.

Je conclurai avec une phrase de Lucrèce, tirée de son génialissime "De la nature", qui était en avance sur son temps :
"La science peut seule éveiller dans les âmes, à défaut du soleil, l'astre de la raison."` }
  ],
  "Khalil Gibran": [
    { title: "Le Prophète", note: 5, cover: "covers/le-prophete.jpg", link: "https://www.goodreads.com/book/show/59605643-le-proph-te", review: `Ce livre dégage une sagesse absolue.
Excellente lecture, je comprends mieux pourquoi il est qualifié de 'livre de chevet'. C'est le genre de livre qu'on peut relire à n'importe quel moment de sa vie, en fonction de ce qu'on traverse et des thèmes qui nous interpellent. Il aborde la vie sous tous ses aspects : la mort, le plaisir, l'amour, la notion de bien et de mal, le temps, la liberté, sans oublier la vie en société avec des sujets comme le travail, le crime, le châtiment, et la loi. Cela pourrait sembler un peu simpliste ou démago, mais ce que j'aime particulièrement, c'est que chaque sujet est traité sans jugement, avec l'objectif de comprendre l'essence même de chaque terme. Le blanc et le noir existent en même temps pour laisser place au gris, à la sagesse. La raison a besoin de la passion pour exister, tout comme le mal n'est que le bien torturé par sa propre faim et sa propre soif.` }
  ],
  "Stéphane Michaka": [
    { title: "La mémoire des couleurs", note: 5, cover: "covers/memoire-couleurs.jpg", link: "https://www.goodreads.com/book/show/42752899-la-m-moire-des-couleurs", review: `Enfin fini de lire La Mémoire des couleurs, c'était incroyable, rien de plus à ajouter sans spoiler, j'étais vraiment happé par l'histoire du début à la fin. Pour vous donnez une idée, c'est un mélange entre 1984, de la science-fiction et Houseki no Kuni, le tout saupoudré d'amnésie et de quête de soi. C'est le plus gros livre que j'ai lu jusqu'à présent, avec 425 pages.` }
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
    { title: "Les Fleurs du Mal", note: 4, cover: "covers/fleurs-du-mal.jpg", link: "https://www.goodreads.com/book/show/207354.Les_Fleurs_du_Mal", review: `Les Métamorphoses du Vampire. Rien de plus à ajouter.` }
  ],
  "Alfred de Musset": [
    { title: "On ne badine pas avec l'amour", note: 4, cover: "covers/badine-amour.jpg", link: "https://www.goodreads.com/book/show/570255.On_ne_badine_pas_avec_l_amour", review: `C'était la première pièce de théâtre que je lisais, et j'ai trouvé ça excellent. J'ai vraiment pris plaisir à la lire. On ne plaisante pas avec l'amour sans en goûter les conséquences.` }
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
    { title: "J'accuse!", note: 4, cover: "covers/jaccuse.jpg", link: "https://www.goodreads.com/book/show/816964.J_accuse_", review: `Un combat engagé pour la vérité et la justice. Zola, poursuivi pour diffamation après la publication de son article en 1898, doit s’exiler en Angleterre. Il ne verra jamais le triomphe de sa cause : Dreyfus ne sera réhabilité qu’en 1906, quatre ans après la mort mystérieuse de l’écrivain en 1902 (certains ont spéculé sur un assassinat). Mais son courage et sa détermination à exposer la Vérité marqueront l’histoire.

Sans détour, il dénonce les coupables et souligne le rôle crucial de la presse, une arme qu’il manie lui-même dans cet article brûlant. Conscient des risques, il assume pleinement sa prise de position :

"En portant ces accusations, je n'ignore pas que je me mets sous le coup des articles 30 et 31 de la loi sur la presse du 29 juillet 1881, qui punit les délits de diffamation. Et c’est volontairement que je m'expose."

Il fustige une société corrompue qui préfère blanchir les criminels plutôt que de reconnaître ses propres erreurs :

"Nous assistons à ce spectacle infâme, des hommes perdus de dettes et de crimes dont on proclame l'innocence, tandis qu'on frappe l'honneur même, un homme à la vie sans tache ! Quand une société en est là, elle tombe en décomposition."

Mais Zola sait que la vérité ne peut être enterrée à jamais :

"Quand on enferme la vérité sous terre, elle s’y amasse, elle y prend une force telle d’explosion, que, le jour où elle éclate, elle fait tout sauter avec elle. On verra bien si l’on ne vient pas de préparer, pour plus tard, le plus retentissant des désastres."

Un texte brûlant, animé par une passion absolue pour la justice et la lumière :

"Je n'ai qu'une passion, celle de la lumière, au nom de l'humanité qui a tant souffert et qui a droit au bonheur. Ma protestation enflammée n'est que le cri de mon âme. Qu'on ose donc me traduire en cour d'assises et que l’enquête ait lieu au grand jour !".` }
  ],
  "Frank Elgar": [
    { title: "Van Gogh", note: 4, cover: "covers/van-gogh-elgar.jpg", link: "https://www.goodreads.com/book/show/181685869-van-gogh-par-frank-elgar-hazan-peinture-beaux-arts-aldine-des-arts-daran" }
  ],
  "Jean-Paul Sartre": [
    { title: "La Nausée", note: 3, cover: "covers/la-nausee.jpg", link: "https://www.goodreads.com/book/show/87302.La_naus_e" }
  ],
  "Jean-François Amadieu": [
    { title: "Le Poids Des Apparences", note: 3, cover: "covers/poids-apparences.jpg", link: "https://www.goodreads.com/book/show/1043993.Le_Poids_Des_Apparences", review: `C'était sympa, mais sans plus. Pour quelqu'un comme moi, qui a été nourri aux redpills de JVC depuis toujours, c'était un peu comme enfoncer des portes ouvertes. Le physique compte pour tout dans la vie, et cela de manière inhérente chez l'homme, depuis son enfance jusqu'à en dicter sa destinée.
Mais il faut aussi voir cela comme un composant qui s'ajoute à la reproduction sociale et au réseau humain que l'on possède. Cette réflexion est personnelle et ne provient pas du livre. À part ça, rien de spécial à ajouter.

Une lecture intéressante, mais j'avais parfois le sentiment que c'était long à lire, vu le nombre d'informations et de chiffres par page.` }
  ],
  "Sénèque": [
    { title: "La Brièveté de la vie", note: 3, cover: "covers/brievete-vie.jpg", link: "https://www.goodreads.com/book/show/200094601-la-bri-vet-de-la-vie-suivi-de-lettres-lucilius", review: `J'ai trouvé la lecture ok sans plus. Un mélange d'épicurisme, dont l'auteur ne se cache même pas d'avoir repris, et de stoïcisme. Ça parle du fait d'apprendre à accepter la mort, je dirais même à mourir : "Qui sait mourir ne sait plus être esclave", mais aussi du fait que la vie est loin d'être courte, bien qu'on passe la majorité de notre temps à la perdre. 
"La vie qui sait l'employer, est assez longue." Il nous incite à prendre conscience de la valeur du temps, à se le réapproprier et à ne pas le consacrer tout entier notre vie professionnelle, à des ivresses passagères ou encore à des personnes qui ne le méritent pas.

La phrase qui résume parfaitement le livre pour moi : "Ainsi, parce qu'un homme a des cheveux blancs et des rides, ne va pas croire qu'il ait vécu longtemps ; il n'a pas longtemps vécu, mais longtemps duré".` }
  ],
  "Hermann Hesse": [
    { title: "Siddhartha", note: 3, cover: "covers/siddhartha.jpg", link: "https://www.goodreads.com/book/show/42639871-siddharta", review: `Durant l'histoire, Siddhartha finit par comprendre qu'il n'a en aucun cas besoin d'une doctrine ou d'un guide à penser pour saisir la personne qu'il est vraiment, son moi, et le monde qui l'entoure. Lorsqu'il s'en rendit compte, il regarda autour de lui. Il eut alors l'impression de découvrir le monde pour la première fois, tant sa beauté lui apparaissait.
Au lieu de diriger ses pensées vers un monde qui n'existe pas, il réalise la beauté et l'enchantement du monde réel, celui qui l'entoure. Il voit désormais les choses telles qu'elles sont, sans les filtrer à travers un voile mystique.

"Non, le vrai chercheur, celui qui a vraiment le désir de trouver, ne devrait embrasser aucune doctrine."

Il est désormais maître de lui-même, n'appartenant plus à aucune doctrine ni à personne, et jouit d'une liberté totale. Toutefois, cette liberté le confronte à une profonde solitude, car ayant compris qu'il n'existe pas de but absolu dans la vie, il se retrouve perdu quant à la direction à prendre.
Il passe de percevoir la réalité à travers un voile d'illusions à la contempler telle qu'elle est. Pour lui, la réalité se situait forcément au-delà des apparences visibles.
Désormais, il peut voir les choses pour ce qu'elles sont sans s'inquiéter de leur essence ou de ce qu'elles cachent.

"Rien de tout cela n'était nouveau ; mais il ne l'avait jamais vu ; sa pensée l'en avait toujours tenu éloigné."

C'est vraiment intéressant parce que l'on constate qu'une fois qu'il a quitté son cadre religieux, ses dogmes, il succombe peu à peu à la cupidité de la société, sombrant dans la déchéance et l'avarice. Il finit par se perdre, déconnecté de son véritable moi. Seule l'option de se donner la mort semble mettre fin à cette ignominie. Douce est la vie du croyant qui connaît déjà son essence.
Au moment fatidique où il s'apprêtait à se jeter dans le fleuve, il se souvint soudain de sa spiritualité, ce qui le fit revenir instantanément à la raison.

C'est à travers son fils qu'il finira par comprendre l'humanité dont il semblait si éloigné, il comprit que le désir n'était pas une futilité puérile, mais la raison même pour laquelle les hommes vivent. Il finira par laisser son ego de côté et comprendre qu'il n'est pas au dessus des hommes, mais en réalité, en fait partie intégrante.

Chacun ne peut trouver que seul sa voie, voilà le message de fond de ce livre. Tout comme Siddhartha a quitté la maison paternelle pour suivre son propre chemin, son fils fait de même malgré le chagrin que cela engendre chez son père. Siddhartha a toujours refusé de se soumettre à un quelconque maître ou à une doctrine, préférant trouver seul sa voie. Un rejet de toutes les doctrines, une condamnation du monde de la puissance et de l'argent, l'éloge de la vie contemplative. Une recherche de sagesse, une profession de foi individualiste.

"Ce n'est pas dans les discours ni dans le penser que réside sa grandeur ; mais dans ses actes, dans sa vie."

Malheureusement, je trouve que le livre s'essouffle vers la fin et commence à devenir assez pénible à finir malgré le fait qu'il soit assez court, ça reste néanmoins une lecture des plus sympathiques sinon ça ne m'aurait pas donné envie d'écrire dessus.

Quelques informations complémentaires que je juge intéressantes :

- "Car Hermann Hesse, rebelle à toute forme d'autorité, n'a jamais cessé d'être préoccupé par les problèmes d'éducation."

me rappelle une réflexion que j'ai eue et notée il y a peu :

Là où l'éducation est présente, l'autorité disparaît, l'autorité a besoin de l'ignorance pour exister. Et ça rejoint aussi ma théorie sur le langage, langage simple ➜ esprit/conscience simple ➜ réflexion simple ➜ quelqu’un d’autre réfléchit à ta place.

- "Hesse est un précurseur de la littérature psychédélique."

- "Hesse soutient une joute courtoise, à la fois contre Goethe et contre Thomas Mann."

- "Écrire et peindre sont des jeux destinés à distraire les hommes de leur détresse."

- "Quand on cherche, reprit Siddhartha, il arrive facilement que nos yeux voient que l'objet de nos recherches ; on ne trouve rien parce qu'ils sont inaccessibles à autre chose, parce qu'on ne songe toujours qu'à cet objet, parce qu'on s'est fixé un but à atteindre et qu'on est entièrement possédé par ce but. Qui dit chercher dit avoir un but. Mais trouver, c'est être libre, c'est être ouvert à tout, c'est n'avoir aucun but déterminé. Toi, Vénérable, tu es peut-être en effet un chercheur ; mais le but que tu as devant les yeux et que tu essaies d'atteindre t'empêche justement de voir ce qui est tout proche de toi."

Cette citation me rappelle celle que j'avais lu dans le manga Vagabon :

- "Préoccupé par une seule feuille... vous ne verrez pas l'arbre. Si vous êtes préoccupé par un seul arbre... vous manquerez toute la forêt."` }
  ],
  "Arthur Rimbaud": [
    { title: "Les Cahiers de Douai", note: 3, cover: "covers/cahiers-douai.jpg", link: "https://www.goodreads.com/book/show/35377217-les-cahiers-de-douai", review: `C'est le premier livre que je lis de Rimbaud. Je ne suis pas spécialement un mordu de poésie, ni un professionnel pour comprendre toutes les subtilités, mais ça reste néanmoins une lecture agréable.` }
  ],
  "Maxence Fermine": [
    { title: "Neige", note: 3, cover: "covers/neige-fermine.jpg", link: "https://www.goodreads.com/book/show/107946.Neige_Points_" }
  ],
  "Gaël Faye": [
    { title: "Petit pays", note: 3, cover: "covers/petit-pays.jpg", link: "https://www.goodreads.com/book/show/36075029-petit-pays" }
  ],
  "Elsa Marpeau": [
    { title: "Carpe Diem", note: 3, cover: "covers/carpe-diem-marpeau.jpg", link: "https://www.goodreads.com/book/show/169829072-carpe-diem", review: `L'art du bonheur… Haha ! Ceux qui me connaissent bien savent que je suis un amoureux du bonheur.

Bon, avant toute chose, que veut dire ce satané carpe diem ? Eh bien, tout simplement : "cueille le jour", ou plutôt "profite du jour présent". La phrase assimile implicitement le jour à une fleur, qu'il faut cueillir dans l'instant fragile où elle est éclose. L'image rappelle donc que la vie, tout comme la rose, fane si rapidement qu'il faut en jouir au moment où elle est encore belle.

Horace disait par exemple : "Tandis que nous parlons, notre saison, ennemie, aura fui : cueille le jour, sans faire confiance au lendemain."
"Ne cherche pas à t'interroger sur ce que sera demain, et quel que soit le jour que le sort t'octroiera, tire-en les fruits et ne méprise pas les douces amours, enfant, ni les danses, tant que ton âge verdoyant ignore la vieillesse blême."

Le carpe diem répondait surtout au désir des philosophes épicuriens de vivre dans le présent. Pour Épicure, le mot "bonheur" se confond avec l'ataraxie, c'est-à-dire l'absence de troubles. Vivre heureux exige d'éviter la douleur du corps et l'inquiétude de l'esprit.
Il refuse une vision ethnocentrique, selon laquelle notre univers serait le centre de la Création. Pour lui, les dieux ne s'intéressent pas aux hommes, ils n'ont pas conçu cet univers et ne le contrôlent pas. À cette idée s'ajoutent trois autres principes qui forment le socle de l'éthique épicurienne :
- On ne doit pas craindre la mort, car elle est un absent, un néant, et on ne saurait avoir peur d'une chose qui n'existe que lorsque nous n'existons plus.
- La douleur est supportable, car elle est limitée dans le temps.
- Le bonheur est accessible, pourvu que l'on distingue la jouissance désordonnée de l'ataraxie (c'est-à-dire la maîtrise de ses passions).

Ainsi, la quête du pouvoir et de l'argent est néfaste, car elle est illimitée et ne peut qu'engendrer une perpétuelle insatisfaction, il faut donc consommer le bonheur avec modération.

Cueillir le jour, c'est refuser de vivre dans une nostalgie stérile ou dans une attente vaine du futur ; c'est accepter le présent, seule réalité certaine.

Durant la Renaissance, le jeu constitue une dimension primordiale de l'exhortation à jouir de l'instant. Le rire, longtemps considéré comme diabolique, devient salvateur.
Pour Montaigne, la philosophie épicurienne vise à rechercher la paix intérieur.

Au départ, il y a l'idée de la mort, du vieillissement. "Tout passe", tel pourrait être le fondement du carpe diem à la Renaissance. Par la suite, l'avènement du catholicisme en a transformé le sens : notre vie terrestre n'est qu'un prélude à la vie céleste.

Pour ce qui est des poèmes, ils s'inspirent souvent de la philosophie néo-platonicienne, selon laquelle le degré d'amour le plus élevé est celui qui unit les âmes des amants, et non leurs corps. Nombre de ces poèmes déplorent la cruauté de la femme. En revanche, le carpe diem affirme le plaisir de l'union charnelle. La rose, qui se fane rapidement, constitue la métaphore par excellence de ces poèmes, désignant la vie comme la beauté féminine.

Au XVIe siècle, deux tonalités traversent les poèmes : les plus nombreux peignent la beauté de la dame et sa cruauté, tandis que d'autres l'incitent à profiter de l'existence avant que la vieillesse ne vienne.
Pour Du Bellay, le carpe diem change de tournure : il ne désigne plus la femme, mais le bonheur lié au pays natal et à la nature, ce qui fait suite à un fort mal du pays.
Pour Belleau, c'est une invitation aux plaisirs charnels. Toutefois, le désir qu'il exprime est teinté d'une certaine sagesse, proprement épicurienne : jouissons, mais seulement de ce que nous possédons.
Pour Grévin, c'est un appel fort et direct à jouir de la jeunesse : "Cueillir cette belle jeunesse ? Qu'attendre une morne vieillesse ?"

Au XVIIe siècle, l'accent ne porte plus sur les mêmes enjeux. Désormais, l'invitation à la jouissance immédiate laisse place à la notion de mouvement, de fuite du temps et de vieillesse.
Plutôt que "profite de la vie", le XVIIe traduirait carpe diem par "la vie ne dure qu'un instant".

Pour Colletet, la beauté féminine se fane, tandis que celle du poète demeure pour l'éternité.
Pour La Fontaine, il faut profiter de ce que l'on a, sans chercher à assouvir des désirs intarissables (quête de sagesse).

Au 18e siècle, le carpe diem ne sert plus d'exhortation sensuelle, devient une véritable quête métaphysique du bonheur. L'ataraxie redevient un thème majeur, intégré dans un modèle de vie.
Cependant, certains affirment la suprématie des passions. La vie sans trouble, prônée par Voltaire, est mise à mal par l'idée que l'homme est gouverné par elles.
Pour Voltaire, philosophe des Lumières, il faut cueillir le temps présent sans tomber dans les excès de la débauche.

Dans "Candide", une fable philosophique, Candide finira par trouver la paix en cultivant son jardin :

"Et quand on ne disputait pas, l'ennui était si excessif que la vieille osa un jour leur dire : 'Je voudrais savoir lequel est le pire : être violée cent fois par des pirates nègres, avoir une fesse coupée, passer par les baguettes chez les Bulgares, être fouettée et pendue dans un auto-da-fé, être disséquée, ramer en galère, éprouver enfin toutes les misères par lesquelles nous avons tous passé, ou bien rester ici à ne rien faire ?' - ' C'est une grande question'  dit Candide"

"Ce discours fit naître de nouvelles réflexions, et Martin conclut que l'homme était né pour vivre dans les convulsions de l'inquiétude ou dans la léthargie de l'ennui."
"Je n'ai que vingt arpents, répondit le Turc ; je les cultive avec mes enfants ; le travail éloigne de nous trois grands maux : l'ennui, le vice, et le besoin."

"Travaillons sans raisonner, dit Martin ; c'est le seul moyen de rendre la vie supportable."

"Cela est bien bien dit, répondit Candide, mais il faut cultiver notre jardin."

Pour Helvétius, "plaisir et douleur sont et seront toujours l'unique principe des actions de l'homme" :

"Le motif qui la lui fait exercer, c'est que notre esprit s'occupe, non du besoin, mais des moyens de le satisfaire. Le difficile n'est pas de manger, mais d'apprêter le repas."

"Or, entre tous les plaisirs, celui qui sans contredit agit le plus fortement sur nous et communique à notre âme le plus d'énergie, est le plaisir des femmes"

"A mesure que ses désirs s'éteignent, l'homme perd son activité ; et par degrés, la mort s'empare de lui"

"Tant qu'on donnera à boire à l'ouvrier pour l'exciter au travail, il faudra convenir du pouvoir qu'ont sur nous les plaisirs des sens"

Au 19eme siècle, c'est l'échec du carpe diem. Les jeunes auteurs ont l'impression que leurs parents leur ont laissé un monde détruit, où règne le malheur en maître. La nouvelle génération a hérité d'un "monde en ruines" (si seulement ils avaient vu la gueule du monde en 2023).
La mélancolie devient une figure centrale de la pensée romantique. Le carpe diem n'est plus un appel à jouir , mais une impossibilité, un regret de n'avoir pas sur jouir de l'instant, qui a fui irrémédiablement.
Le poète Lamartine appelle en effet à jouir de la vie, mais pour lui, il est déjà trop tard : la femme aimée est morte.
Baudelaire, lui, prend la provocation à deux mains et compare la femme à une charogne pourrissante au bord de la route pour parler de sa beauté fugace : "Et pourtant vous serez semblable à cette ordure, à cette horrible infection"

Voilà comment le carpe diem a évolué durant ces siècles.

Par contre, pour le coup, j'ai trouvé le livre sympa, sans plus. On est plus sur une synthèse globale classée selon des périodes qu’une réelle réflexion.` }
  ],
  "Charles Robin": [
    { title: "Tous philosophes?", note: 3, cover: "covers/tous-philosophes.jpg", link: "https://www.goodreads.com/book/show/59815825-tous-philosophes" }
  ],
  "Eric Bénier-Bürckel": [
    { title: "Un prof bien sous tout rapport", note: 3, cover: "covers/prof-bien-rapport.jpg", link: "https://www.goodreads.com/book/show/482179.Un_prof_bien_sous_tout_rapport_", review: `Très violent et trash, ce n’est clairement pas une lecture pour tout le monde. Cela étant dit, le livre n’en reste pas moins divertissant et intéressant sur bien des aspects.

Notre cher tueur en série pense que le divertissement ne sert qu’à faire diversion face à la mort inéluctable. Il tue parce qu’il a peur de sa propre mortalité. Dans ces moments, il se sent en contrôle ; il s’érige au-dessus de la mort. Il devient le bourreau de sa propre mortalité : "J’ai peur de mourir, donc je tue", comme si, à chaque victime, c’était sa propre finitude qui volait en éclats. De même, en tuant, il s’assure de réellement exister : je tue, donc j’existe. La personne qu’il mutile souffre clairement, et cette souffrance est due à sa propre action, preuve irréfutable de son existence. Tuer, c’est savoir que l’on n’est pas encore mort.

C’est avant tout un personnage qui se sent profondément vide, sans substance, sans but ni espoir, coincé dans une boucle nihiliste d’une routine meurtrière.
"Le plus difficile, pour un homme, ce n’est pas de vivre ou de survivre, mais c’est d’avoir envie de vivre."

Même tous les livres qu’il a lus ne sont que des voix qui ont donné naissance à la sienne. Ils ne lui ont pas donné de consistance, mais l’en ont vidé : "J’espérais la lumière, et les ténèbres sont venues."

Il pensait trouver la réponse à son "pourquoi ?" existentiel à l'intérieur, mais finit par se rendre compte que la vérité est, par essence, la vie elle-même : il faut la vivre. Elle n’a pas besoin de paroles pour s’exprimer.

Et c’est marrant, parce que la phrase qui revient très souvent à chaque réveil, "Aujourd’hui ou demain, je peux mourir", je me la dis aussi quasiment tout le temps.

Finalement, la citation en exergue du livre, tirée de Dostoïevski, résume très bien la psyché de Baptiste :

"Aucun homme ne peut vivre sans but qu’il s’efforce d’atteindre ; s’il n’a plus ni but ni espoir, sa détresse fait de lui un monstre."

Et je dois bien l’avouer, ça fait très bizarre de lire un roman aussi incisif en sachant que l’auteur a déjà été mon prof de philo en terminale.` }
  ],
  "Octave Houdas": [
    { title: "Ethnographie de l'Algérie", note: 3, cover: "covers/ethnographie-algerie.jpg", link: "https://www.goodreads.com/book/show/22680330-ethnographie-de-l-alg-rie-d-1886-sciences-sociales" }
  ],
  "Jean-Jacques Rousseau": [
    { title: "Les Rêveries du promeneur solitaire", note: 2, cover: "covers/reveries-promeneur.jpg", link: "https://www.goodreads.com/book/show/58698503-les-r-veries-du-promeneur-solitaire", review: `Je déteste la façon d'écrire de Rousseau.` }
  ],
  "Jean-Luc Lagarce": [
    { title: "Juste la fin du monde", note: 2, cover: "covers/juste-fin-monde.jpg", link: "https://www.goodreads.com/book/show/1084444.Juste_la_fin_du_monde" }
  ],
  "Niccolò Machiavelli": [
    { title: "Le Prince", note: 1, cover: "covers/le-prince.jpg", link: "https://www.goodreads.com/book/show/54411076-le-prince-de-machiavel", review: `Pire livre que j'ai lu jusqu'à présent, c'est juste nul. Je me suis ennuyé, je m'en fous complètement du sujet même du livre. Ce livre a été écrit pour un prince, mais je suis un bouffon, donc forcément, ça ne fait pas mouche.` }
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
  ],
  "Mikhaïl Boulgakov": [
    { title: "Morphine", note: 3, cover: "covers/morphine.jpg", link: "https://www.goodreads.com/book/show/125084812-morphine" }
  ],
  "Nikolai Gogol": [
    { title: "Le Nez", note: 4, cover: "covers/lenez.jpg", link: "https://www.goodreads.com/book/show/24311743-le-nez" }
  ],
  "Christine Kelly": [
    { title: "Libertés sans expression", note: 1, cover: "covers/libertesansexpression.jpg", link: "https://www.goodreads.com/book/show/61741943-libert-s-sans-expression" }
  ]
};