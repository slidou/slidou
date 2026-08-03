// ── Data Musique ──
const musicData = {
  "Lupe Fiasco": [
    { title: "Samurai", note: 5, cover: "music/samurai.webp", link: "https://rateyourmusic.com/release/album/lupe-fiasco/samurai/", tags: ["réécoute"] },
  ],
  "Nitsua": [
    { title: "Safety in the Sun", note: 3.5, cover: "music/safetyinthesun.webp", link: "https://rateyourmusic.com/release/album/nitsua/safety-in-the-sun/" },
  ],
  "slayr": [
    { title: "Half Blood (BloodLuxe)", note: 3.5, cover: "music/halfblood.webp", link: "https://rateyourmusic.com/release/mixtape/slayr/half-blood-bloodluxe/" },
  ],
  "Luidji": [
    { title: "Tristesse Business : Saison 1", note: 5, cover: "music/tristessebusiness.webp", link: "https://rateyourmusic.com/release/album/luidji/tristesse-business-saison-1/", tags: ["réécoute"] },
  ],
  "Makala": [
    { title: "YAMOTO", note: 4.5, cover: "music/yamoto.webp", link: "https://rateyourmusic.com/release/album/makala/yamoto/", tags: ["réécoute"] },
    { title: "Radio Suicide", note: 3, cover: "music/radiosuicide.webp", link: "https://rateyourmusic.com/release/album/makala/radio-suicide/" },
  ],
  "Nujabes": [
    { title: "Luv(sic) Hexalogy", note: 5, cover: "music/luvsichexalogy.webp", link: "https://rateyourmusic.com/release/comp/nujabes-feat-shing02/luv_sic-hexalogy/", tags: ["réécoute"] },
  ],
  "potsu": [
    { title: "Just Friends", note: 5, cover: "music/justfriends.webp", link: "https://rateyourmusic.com/release/album/potsu/just-friends/", tags: ["réécoute"] },
    { title: "Ivy League", note: 4.5, cover: "music/ivyleague.webp", link: "https://rateyourmusic.com/release/album/potsu/ivy-league/", tags: ["réécoute"] },
    { title: "Reaching for a Star", note: 4, cover: "music/rfas.webp", link: "https://rateyourmusic.com/release/album/potsu/reaching-for-a-star/", tags: ["réécoute"] },
    { title: "Star-Crossed", note: 4.5, cover: "music/starcrossed.webp", link: "https://rateyourmusic.com/release/album/potsu/star-crossed/", tags: ["réécoute"] },
  ],
  "Kekra": [
    { title: "Kekra", note: 4, cover: "music/kekra.webp", link: "https://rateyourmusic.com/release/album/kekra/kekra/", tags: ["réécoute"] },
    { title: "Vréel 3", note: 3.5, cover: "music/vréel3.webp", link: "https://rateyourmusic.com/release/album/kekra/vreel-3/" },
    { title: "Stratos", note: 3, cover: "music/stratos.webp", link: "https://rateyourmusic.com/release/album/kekra/stratos/", tags: ["réécoute"] },
  ],
  "aupinard": [
    { title: "spleen. social club", note: 3, cover: "music/spleensocialclub.PNG", link: "https://rateyourmusic.com/release/album/aupinard/spleen-social-club/" },
    { title: "Pluie, montagnes et soleil", note: 3.5, cover: "music/pluiemontagnessoleil.webp", link: "https://rateyourmusic.com/release/album/aupinard/pluie-montagnes-et-soleil/" },
  ],
  "Ino Casablanca": [
    { title: "Extasia", note: 4, cover: "music/extasia.webp", link: "https://rateyourmusic.com/release/mixtape/ino-casablanca/extasia/", tags: ["réécoute"] },
    { title: "Tamara", note: 3, cover: "music/tamara.webp", link: "https://rateyourmusic.com/release/mixtape/ino-casablanca/tamara/" },
  ],
  "Mac Miller": [
    { title: "Circles", note: 5, cover: "music/circles.webp", link: "https://rateyourmusic.com/release/album/mac-miller/circles/", tags: ["réécoute"] },
    { title: "Balloonerism", note: 3, cover: "music/balloonerism.webp", link: "https://rateyourmusic.com/release/album/mac-miller/balloonerism/" },
    { title: "The Divine Feminine", note: 3.5, cover: "music/divinefeminine.webp", link: "https://rateyourmusic.com/release/album/mac-miller/the-divine-feminine/" },
  ],
  "Drake": [
    { title: "Iceman", note: 1, cover: "music/iceman.webp", link: "https://rateyourmusic.com/release/album/drake/iceman/" },
    { title: "Maid of Honour", note: 1, cover: "music/maidofhonour.webp", link: "https://rateyourmusic.com/release/album/drake/maid-of-honour/" },
    { title: "Habibti", note: 1, cover: "music/habibti.webp", link: "https://rateyourmusic.com/release/album/drake/habibti/" },
  ],
  "Hiroshi Suzuki": [
    { title: "キャット", note: 3, cover: "music/キャット.webp", link: "https://rateyourmusic.com/release/album/%E9%88%B4%E6%9C%A8%E5%BC%98/%E3%82%AD%E3%83%A3%E3%83%83%E3%83%88/" },
  ],
  "Ateyaba": [
    { title: "Ateyaba", note: 3.5, cover: "music/ateyaba.webp", link: "https://rateyourmusic.com/release/album/joke/ateyaba/" },
  ],
  "RADWIMPS": [
    { title: "Keitaidenwa", note: 3.5, cover: "music/keitaidenwa.webp", link: "https://rateyourmusic.com/release/single/radwimps/%E6%90%BA%E5%B8%AF%E9%9B%BB%E8%A9%B1-keitaidenwa/" },
  ],
  "Charli XCX": [
    { title: "Brat", note: 3.5, cover: "music/brat.webp", link: "https://rateyourmusic.com/release/album/charli-xcx/brat/" },
  ],
  "Metro Boomin": [
    { title: "Heroes & Villains", note: 4.5, cover: "music/heroesvillains.webp", link: "https://rateyourmusic.com/release/album/metro-boomin/heroes-and-villains/", tags: ["réécoute"] },
  ],
  "LinLin": [
    { title: "Disco Inferno", note: 3, cover: "music/discoinferno.webp", link: "https://rateyourmusic.com/release/album/linlin/disco-inferno/" },
  ],
  "Hamza": [
    { title: "PUBLIC ENEMY", note: 2.5, cover: "music/publicenemy.jpg", link: "https://rateyourmusic.com/release/ep/hamza/public-enemy/" },
    { title: "1994", note: 4, cover: "music/1994.webp", link: "https://rateyourmusic.com/release/mixtape/hamza/1994/", tags: ["réécoute"] },
  ],
  "Josman": [
    { title: "HHHH²", note: 2.5, cover: "music/hhhh².jpg", link: "." },
  ],
  "Krisy": [
    { title: "Edward Risky", note: 3.5, cover: "music/edwardrisky.jpg", link: "https://rateyourmusic.com/release/album/krisy/edward-risky/" },
    { title: "Paradis d'amour", note: 4, cover: "music/paradisdamour.webp", link: "https://rateyourmusic.com/release/album/krisy/paradis-damour/", tags: ["réécoute"] },
    { title: "Euphoria", note: 3.5, cover: "music/euphoria.webp", link: "https://rateyourmusic.com/release/album/krisy/euphoria/", tags: ["réécoute"] },
  ],
  "mage tears": [
    { title: "cats in the cold", note: 3, cover: "music/catsinthecold.webp", link: "https://rateyourmusic.com/release/album/mage-tears/cats-in-the-cold/" },
  ],
  "Playboi Carti": [
    { title: "Whole Lotta Red", note: 4, cover: "music/wholelottared.webp", link: "https://rateyourmusic.com/release/album/playboi-carti/whole-lotta-red/", tags: ["réécoute"] },
  ],
  "Future": [
    { title: "The Real Me", note: 2, cover: "music/therealme.webp", link: "https://rateyourmusic.com/release/album/future/the-real-me/" },
  ],
  "Nirvana": [
    { title: "Nevermind", note: 2.5, cover: "music/nevermind.webp", link: "https://rateyourmusic.com/release/album/nirvana/nevermind/" },
  ],
  "Clairo": [
    { title: "Charm", note: 3, cover: "music/charm.webp", link: "https://rateyourmusic.com/release/album/clairo/charm/", tags: ["réécoute"] },
  ],
  "C418": [
    { title: "Minecraft: Volume Alpha", note: 5, cover: "music/minecraft.webp", link: "https://rateyourmusic.com/release/album/c418/minecraft-volume-alpha/", tags: ["réécoute"] },
  ],
  "Kanye West": [
    { title: "Graduation", note: 4, cover: "music/graduation.webp", link: "https://rateyourmusic.com/release/album/kanye-west/graduation/" },
  ],
  "Dosseh": [
    { title: "Yuri", note: 4, cover: "music/yuri.webp", link: "https://rateyourmusic.com/release/album/dosseh/yuri/" },
  ],
  "Lil Tecca": [
    { title: "DOPAMINE", note: 3, cover: "music/dopamine.webp", link: "https://rateyourmusic.com/release/album/lil-tecca/dopamine/", tags: ["réécoute"] },
  ],
  "Damso": [
    { title: "Batterie faible", note: 5, cover: "music/batteriefaible.webp", link: "https://rateyourmusic.com/release/album/damso/batterie-faible/", tags: ["réécoute"] },
    { title: "Ipséité", note: 5, cover: "music/ipséité.webp", link: "https://rateyourmusic.com/release/album/damso/ipseite/", tags: ["réécoute"] },
  ],
  "Stan Getz": [
    { title: "Jazz Samba Encore!", note: 4, cover: "music/jazzsambaencore.webp", link: "https://rateyourmusic.com/release/album/stan-getz-luiz-bonfa/jazz-samba-encore/" },
  ],
  "Ken Carson": [
    { title: "A Great Chaos", note: 4, cover: "music/agreatchaos.webp", link: "https://rateyourmusic.com/release/album/ken-carson/a-great-chaos/" },
  ],
};