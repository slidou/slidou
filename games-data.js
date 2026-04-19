// ── Data Jeux vidéo ──
const gamesData = {
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