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
    { title: "Luv(sic) Hexalogy", note: 5, cover: "music/luvsichexalogy.webp", link: "https://rateyourmusic.com/release/comp/nujabes-feat-shing02/luv_sic-hexalogy/", tags: ["réécoute","archived"] },
  ],
  "potsu [completed]": [
    { title: "Just Friends", note: 5, cover: "music/justfriends.webp", link: "https://rateyourmusic.com/release/album/potsu/just-friends/", tags: ["réécoute","archived"] },
    { title: "Ivy League", note: 4.5, cover: "music/ivyleague.webp", link: "https://rateyourmusic.com/release/album/potsu/ivy-league/", tags: ["réécoute","archived"] },
    { title: "Reaching for a Star", note: 4, cover: "music/rfas.webp", link: "https://rateyourmusic.com/release/album/potsu/reaching-for-a-star/", tags: ["réécoute","archived"] },
    { title: "Star-Crossed", note: 4.5, cover: "music/starcrossed.webp", link: "https://rateyourmusic.com/release/album/potsu/star-crossed/", tags: ["réécoute","archived"] },
    { title: "Camera Roll", note: 2.5, cover: "music/cameraroll.webp", link: "https://rateyourmusic.com/release/album/potsu/camera-roll/", tags: ["réécoute","archived"] },
    { title: "Neon Tokyo // ?????", note: 3.5, cover: "music/neontokyo.webp", link: "https://rateyourmusic.com/release/single/potsu/neon-tokyo-/", format: "single" },
    { title: "i'm closing my eyes", note: 3.5, cover: "music/imclosingeyes.webp", link: "https://rateyourmusic.com/release/single/potsu/im-closing-my-eyes/", format: "single" },
    { title: "[oops]", note: 3.5, cover: "music/oops.webp", link: "https://rateyourmusic.com/release/single/potsu/_oops/", format: "single" },
    { title: "another.wun", note: 3.5, cover: "music/anotherwun.webp", link: "https://rateyourmusic.com/release/single/potsu/another_wun/", format: "single" },
    { title: "moonglow", note: 3.5, cover: "music/moonglow.webp", link: "https://rateyourmusic.com/release/single/potsu/moonglow/", format: "single", tags: ["réécoute","archived"] },
    { title: "breakfast", note: 4, cover: "music/breakfast.webp", link: "https://rateyourmusic.com/release/single/potsu/breakfast/", format: "single", tags: ["réécoute"] },
    { title: "homeshook", note: 3.5, cover: "music/homeshook.webp", link: "https://rateyourmusic.com/release/single/potsu/homeshook/", format: "single" },
    { title: "fall apart", note: 5, cover: "music/fallapart.webp", link: "https://rateyourmusic.com/release/single/potsu/fall-apart/", format: "single", tags: ["réécoute"] },
    { title: "It's Raining", note: 4, cover: "music/raining.webp", link: "https://rateyourmusic.com/release/single/masked-man-potsu/its-raining/", format: "single", tags: ["réécoute"] },
    { title: "drive by", note: 3, cover: "music/driveby.webp", link: "https://rateyourmusic.com/release/single/potsu/drive-by/", format: "single", tags: ["réécoute"] },
    { title: "runaway", note: 3.5, cover: "music/runaway.webp", link: "https://rateyourmusic.com/release/single/potsu/runaway/", format: "single", tags: ["réécoute"] },
    { title: "sidewalk safari", note: 3.5, cover: "music/sidewalksafari.webp", link: "https://rateyourmusic.com/release/ep/potsu-tenpo/sidewalk-safari/", format: "ep", tags: ["réécoute"] },
    { title: "Reflection", note: 2.5, cover: "music/reflection.webp", link: "https://rateyourmusic.com/release/single/sweeney-potsu/reflection/", format: "single" },
    { title: "Haunt Me", note: 3, cover: "music/hauntme.webp", link: "https://rateyourmusic.com/release/single/ben-beal-potsu/haunt-me/", format: "single", tags: ["réécoute"] },
    { title: "i'll be okay", note: 4, cover: "music/illbeokay.webp", link: "https://rateyourmusic.com/release/single/potsu/ill-be-okay/", format: "single", tags: ["réécoute"] },
    { title: "Fallen", note: 3.5, cover: "music/fallen.webp", link: "https://rateyourmusic.com/release/single/potsu-rav/fallen/", format: "single", tags: ["réécoute"] },
    { title: "me when i watch bluey", note: 2, cover: "music/bluey.webp", link: "https://rateyourmusic.com/release/ep/potsu/me-when-i-watch-bluey/", format: "ep" },
    { title: "make you feel", note: 2, cover: "music/makeyoufeel.webp", link: "https://rateyourmusic.com/release/single/potsu-danny-p/make-you-feel/", format: "single" },
    { title: "have u seen my dog", note: 1.5, cover: "music/haveuseenmydog.webp", link: "https://rateyourmusic.com/release/single/potsu/have-u-seen-my-dog/", format: "single" },
    { title: "lovesick", note: 3.5, cover: "music/lovesick.webp", link: "https://rateyourmusic.com/release/single/potsu/lovesick/", format: "single", tags: ["réécoute"] },
    { title: "Silent Dialogue", note: 3, cover: "music/silentdialogue.webp", link: "https://rateyourmusic.com/release/album/potsu/silent-dialogue/" },
    { title: "Cat Naps", note: 3.5, cover: "music/catnaps.webp", link: "https://rateyourmusic.com/release/album/potsu/cat-naps/" },
    { title: "Moon Beams", note: 3, cover: "music/moonbeams.webp", link: "https://rateyourmusic.com/release/album/potsu/moon-beams/" },
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
    { title: "HHHH²", note: 2.5, cover: "music/hhhh².jpg", link: "https://rateyourmusic.com/release/album/josman/hhhh2/" },
    { title: "000$", note: 4.5, cover: "music/000$.webp", link: "https://rateyourmusic.com/release/mixtape/josman/000/", tags: ["réécoute"] },
    { title: "J.O.$", note: 4, cover: "music/J.O.$.webp", link: "https://rateyourmusic.com/release/album/josman/j_o/", tags: ["réécoute"] },
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
    { title: "Batterie faible", note: 5, cover: "music/batteriefaible.webp", link: "https://rateyourmusic.com/release/album/damso/batterie-faible/", tags: ["réécoute","archived"] },
    { title: "Ipséité", note: 5, cover: "music/ipséité.webp", link: "https://rateyourmusic.com/release/album/damso/ipseite/", tags: ["réécoute","archived"] },
  ],
  "Stan Getz": [
    { title: "Jazz Samba Encore!", note: 4, cover: "music/jazzsambaencore.webp", link: "https://rateyourmusic.com/release/album/stan-getz-luiz-bonfa/jazz-samba-encore/" },
  ],
  "Ken Carson": [
    { title: "A Great Chaos", note: 3.5, cover: "music/agreatchaos.webp", link: "https://rateyourmusic.com/release/album/ken-carson/a-great-chaos/", tags: ["réécoute"] },
  ],
};