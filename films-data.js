// ── Data Films ──
const filmsData = {
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
  "Takeshi Kitano": [
    { title: "Sonatine - Mélodie mortelle", note: 4, cover: "films/sonatine.webp", link: "https://www.senscritique.com/film/sonatine_melodie_mortelle/432069" },
  ],
  "David Dufresne": [
    { title: "Un pays qui se tient sage", note: null, cover: "films/unpayssage.jpg", link: "https://www.senscritique.com/film/un_pays_qui_se_tient_sage/42372324" },
  ],
};