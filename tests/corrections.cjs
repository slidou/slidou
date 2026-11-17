// Vérifications locales ciblées, contextes Chromium jetables, données synthétiques.
const fs = require('fs'), path = require('path'), http = require('http'), assert = require('assert/strict');
const {createRequire} = require('module');
const req = createRequire('C:/Users/akrmm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium} = req('playwright'), {PNG} = req('pngjs');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'audit/corrections');
fs.mkdirSync(out, {recursive:true});
const results = {checks:[], visual:[], errors:[]};
function check(name, value, details) { results.checks.push({name,ok:!!value,details}); assert(value,name); }
const server = http.createServer((r,s)=>{
 let f = path.resolve(root,'.'+decodeURIComponent(new URL(r.url,'http://localhost').pathname));
 if(!f.startsWith(root+path.sep) && f!==root) return s.writeHead(403).end();
 if(f===root) f=path.join(root,'index.html');
 fs.readFile(f,(e,b)=>{if(e)return s.writeHead(404).end();const range=/^bytes=(\d+)-(\d*)$/.exec(r.headers.range||'');if(range&&path.extname(f)==='.mp3'){const start=+range[1],end=range[2]?Math.min(+range[2],b.length-1):b.length-1;s.writeHead(206,{'Content-Type':'audio/mpeg','Accept-Ranges':'bytes','Content-Range':'bytes '+start+'-'+end+'/'+b.length,'Content-Length':end-start+1});return s.end(b.subarray(start,end+1));}s.writeHead(200,{'Accept-Ranges':'bytes','Content-Length':b.length,'Content-Type':({'.js':'text/javascript','.html':'text/html','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.mp3':'audio/mpeg'})[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});s.end(b)});
});
let browser, url;
async function page(baseline=false, options={}) {
 const c=await browser.newContext({serviceWorkers:'block',viewport:{width:1440,height:900},...options});
 await c.addInitScript(()=>{let seed=42;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);});
 const p=await c.newPage();p.on('pageerror',e=>results.errors.push(e.message));
 p.setDefaultTimeout(15000);
 // Réseau tiers exclu des comparaisons : même fallback de police des deux côtés.
 await p.route(/https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//,r=>r.abort());
 if(baseline) for(const f of ['script.js','style.css','mobile.css','index.html']) await p.route(f==='index.html'?'**/':`**/${f}*`,r=>r.fulfill({path:path.join(root,'audit/corrections-reference',f),contentType:f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html'}));
 return {c,p};
}
async function race(baseline) {
 const {c,p}=await page();
 let source=fs.readFileSync(path.join(root,baseline?'audit/corrections-reference/script.js':'script.js'),'utf8');
 source=source.replace('function loadImg(src) {','function loadImg(src) { if(window.raceMode) return new Promise(resolve=>window.jobs.push(resolve));');
 source=source.replace('Promise.resolve(null)', "loadImg('test')");
 source=source.replace('function drawWrapped(canvas, data, mode, imgs) {','function drawWrapped(canvas, data, mode, imgs) { if(window.raceMode){window.draws.push({year:data.year,avatar:imgs.avatar});return;}');
 await p.route('**/script.js*',r=>r.fulfill({body:source,contentType:'text/javascript'}));
 await p.goto(url);
 await p.evaluate(()=>{window.raceMode=true;window.jobs=[];window.draws=[];journal=[{d:'2024-01-01',t:'film',title:'A',status:'terminé'},{d:'2025-01-01',t:'film',title:'B',status:'terminé'}];recapYear='2024';slidouWrapped.open();});
 await p.waitForFunction(()=>jobs.length===5);
 await p.evaluate(()=>{recapYear='2025';slidouWrapped.open();});await p.waitForFunction(()=>jobs.length===10);
 await p.evaluate(()=>jobs.slice(5).forEach(r=>r('B')));await p.waitForTimeout(30);
 await p.evaluate(()=>jobs.slice(0,5).forEach(r=>r('A')));await p.waitForTimeout(30);
 const draws=await p.evaluate(()=>draws);results.checks.push({name:'wrapped-race-'+(baseline?'reference':'corrigé'),ok:baseline?draws.at(-1).avatar==='A':draws.at(-1).avatar==='B',details:draws});
 assert.equal(draws.at(-1).avatar,baseline?'A':'B');
 if(!baseline){await p.evaluate(()=>{slidouWrapped.open();});await p.waitForFunction(()=>jobs.length===15);await p.keyboard.press('Escape');const n=await p.evaluate(()=>draws.length);await p.evaluate(()=>jobs.slice(10).forEach(r=>r('C')));await p.waitForTimeout(30);check('wrapped-fermeture-invalide-chargement',await p.evaluate(()=>draws.length)===n);}
 await c.close();
}
async function main(){
 await new Promise(r=>server.listen(0,'127.0.0.1',r));url=`http://127.0.0.1:${server.address().port}/`;
 browser=await chromium.launch({channel:'chrome',headless:true});results.browser=browser.version();
 await race(true);await race(false);
 const {c,p}=await page();await p.goto(url);await p.evaluate(()=>document.fonts.ready);
 // Toutes les familles de cartes, avec review synthétique (aucune donnée source modifiée).
 for(const [name,expression] of [
  ['livre',"buildBookCard(x)"],['film',"buildFilmCard(x)"],['série',"buildSeasonCard(x,'Série',true)"],['jeu',"buildGameCard(x)"],['musique',"buildMusicCard(x)"],['manga',"buildMangaCard(x)"]]){
  await p.evaluate(expression=>{navigateTo('bibliographie');const x={id:1,title:'Test',link:'https://example.test/fiche',cover:'pfp.jpg',note:4,tags:[],review:'Review synthétique'};const card=eval(expression);document.getElementById('bibliographyContent').replaceChildren(card);},expression);
  const card=p.locator('#bibliographyContent .book-card');check('structure-'+name,await card.locator('a button').count()===0&&await card.locator('a').count()===1);
  await card.locator('a').focus();await p.keyboard.press('Tab');check('focus-review-'+name,await card.locator('.review-btn').evaluate(e=>e===document.activeElement));
  await p.keyboard.press('Enter');check('review-'+name,await p.locator('#review-popup-text').innerText()==='Review synthétique');await p.keyboard.press('Escape');check('retour-review-'+name,await card.locator('.review-btn').evaluate(e=>e===document.activeElement));
  await c.route('https://example.test/**',r=>r.fulfill({body:'fiche'}));const pop=c.waitForEvent('page');await card.locator('a').focus();await p.keyboard.press('Enter');const q=await pop;await q.close();check('fiche-'+name,true);
  await p.mouse.move(0,0);const mousePop=c.waitForEvent('page');await card.locator('a').click({position:{x:10,y:10}});await (await mousePop).close();check('fiche-souris-'+name,true);
 }
 await p.evaluate(()=>{navigateTo('anime');animeFiltered=[{id:1,title:'Test anime',img:'pfp.jpg',note:4,tags:[],review:'Anime review'}];animeDisplayed=0;document.getElementById('animeContent').innerHTML='';renderAnimeBatch();});check('structure-anime',await p.locator('#animeContent a button').count()===0);await p.locator('#animeContent .review-btn').click();check('review-anime',await p.locator('#review-popup-text').innerText()==='Anime review');await p.keyboard.press('Escape');
 await p.evaluate(()=>{navigateTo('apropos');const s=getBudgieState();s.pistachio.bonheur=s.cielazur.bonheur=40;saveBudgieState(s);updateTamagotchiUI();});
 for(const bird of ['pistachio','cielazur']){const cage=p.locator('#cage-'+bird);await cage.focus();await p.keyboard.press('Enter');await p.keyboard.press('Space');check('cage-clavier-'+bird,await p.evaluate(b=>getBudgieState()[b].bonheur>49,bird));check('focus-cage-'+bird,await cage.evaluate(e=>e===document.activeElement));}
 for(const id of ['btn-nourrir','btn-jouer','btn-dormir']) {await p.locator('#'+id).focus();await p.keyboard.press('Enter');}check('commandes-perruches',await p.evaluate(()=>['pistachio','cielazur'].every(b=>['faim','bonheur','energie'].every(k=>Number.isFinite(getBudgieState()[b][k])))));
 await p.evaluate(()=>navigateTo('musique'));await p.locator('#player-play').focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>!audio.paused);check('lecture-aria',await p.locator('#player-play').getAttribute('aria-pressed')==='true');
 await p.waitForFunction(()=>Number.isFinite(audio.duration)&&audio.duration>0);await p.locator('#player-play').click();await p.locator('#player-bar').focus();await p.keyboard.press('Home');await p.waitForFunction(()=>!audio.seeking);await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>!audio.seeking);check('progression-clavier',await p.evaluate(()=>Math.abs(audio.currentTime-Math.min(5,audio.duration))<0.2),await p.evaluate(()=>({time:audio.currentTime,duration:audio.duration})));await p.keyboard.press('End');await p.keyboard.press('Home');check('home',await p.evaluate(()=>audio.currentTime<2));await p.locator('#player-play').click();
 await p.locator('#player-next').focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>!audio.paused);check('piste-focus',await p.locator('#player-next').evaluate(e=>e===document.activeElement));await p.locator('#player-play').click();check('pause-aria',await p.locator('#player-play').getAttribute('aria-pressed')==='false');await p.locator('#player-prev').click();check('piste-en-pause',await p.evaluate(()=>audio.paused&&!isPlaying));
 await p.evaluate(()=>navigateTo('home'));await p.locator('#toggle-recap-btn').click();await p.locator('#wrapped-open-btn').click();await p.waitForFunction(()=>!document.querySelector('.wrapped-dl').disabled);const dl=p.waitForEvent('download');await p.locator('.wrapped-dl').click();await (await dl).saveAs(path.join(out,'wrapped.png'));const png=PNG.sync.read(fs.readFileSync(path.join(out,'wrapped.png')));check('png-valide',png.width>0&&png.height>0,{width:png.width,height:png.height});await p.keyboard.press('Escape');check('wrapped-focus',await p.locator('#wrapped-open-btn').evaluate(e=>e===document.activeElement));
 // Extraction des fonctions privées pour reproduire les défauts soumis à autorisation.
 const src=fs.readFileSync(path.join(root,'script.js'),'utf8');const h=src.slice(src.indexOf('  function normMap('),src.indexOf('  // Aplatit les 7 listes'));
 const highlight=new Function('escapeHtml',h+';return highlight;')(s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'));
 results.highlight=['Été indien','Amélie','école'].map(text=>({text,html:highlight(text,[text==='Été indien'?'indien':text==='Amélie'?'amelie':'cole'])}));
 for(const [text,tokens,expected] of [['Été indien',['indien'],'Été <mark>indien</mark>'],['école',['cole'],'é<mark>cole</mark>'],['e\u0301cole',['ecole'],'<mark>e\u0301cole</mark>'],['😀 Été',['ete'],'😀 <mark>Été</mark>'],['Été',['ete','te'],'<mark>Été</mark>'],['Amélie',['amelie'],'<mark>Amélie</mark>']])check('surlignage-'+text,highlight(text,tokens)===expected);
 results.calendar=await p.evaluate(()=>{const out=[];for(const year of ['2023','2024','2025','2026']){buildRecapHeatmap(year,[]);const cells=[...document.querySelectorAll('#recap-heatmap .hm-cell:not(.hm-off)')];for(const date of [year+'-01-01',year+'-01-31',year+'-02-01',year+'-02-28',...(year==='2024'?[year+'-02-29']:[]),year+'-03-01',year+'-12-31']){const index=(Date.parse(date)-Date.parse(year+'-01-01'))/86400000;out.push({date,title:cells[index].title});}}return out;});
 check('dates-limites-et-bissextile',results.calendar.every(x=>parseInt(x.title)===+x.date.slice(-2)),results.calendar);
 check('dates-journal',await p.evaluate(()=>[...new Set(journal.map(e=>e.d.slice(0,4)))].every(year=>{buildRecapHeatmap(year,journal.filter(e=>e.d.startsWith(year)));const cells=[...document.querySelectorAll('#recap-heatmap .hm-cell:not(.hm-off)')];return journal.filter(e=>e.d.startsWith(year)).every(e=>{const index=(Date.parse(e.d)-Date.parse(year+'-01-01'))/86400000;return parseInt(cells[index].title)===+e.d.slice(-2);});})));
 check('recherche-et-navigation',await p.evaluate(()=>{navigateTo('bibliographie');return document.querySelector('.page.active').id==='page-bibliographie'&&Object.keys(filterData(books,'zzzz-no-match-987')).length===0;}));
 await c.close();
 const mobile=await page(false,{viewport:{width:390,height:844},hasTouch:true,isMobile:true});await mobile.p.goto(url);await mobile.p.locator('#search-toggle').tap();await mobile.p.locator('#palette-close').tap();check('fermeture-mobile-toucher',await mobile.p.locator('#search-palette').evaluate(e=>!e.classList.contains('open')));check('retour-focus-mobile',await mobile.p.locator('#search-toggle').evaluate(e=>e===document.activeElement));await mobile.p.locator('#search-toggle').focus();await mobile.p.keyboard.press('Enter');await mobile.p.locator('#palette-close').focus();await mobile.p.keyboard.press('Enter');check('fermeture-mobile-clavier',await mobile.p.locator('#search-palette').evaluate(e=>!e.classList.contains('open')));await mobile.p.locator('#search-toggle').tap();await mobile.p.screenshot({path:path.join(out,'recherche-mobile-approuvee.png')});await mobile.c.close();
 // Comparaison aux fichiers présents au début de cette intervention.
 for(const width of (process.argv.includes('--functional')?[]:[390,1440]))for(const theme of ['light','dark'])for(const name of ['bibliographie','ecrans','jeux','musique','anime','manga','apropos']){
  const shots=[];
  for(const baseline of [true,false]){const {c,p}=await page(baseline,{viewport:{width,height:900}});await p.addInitScript(t=>{localStorage.setItem('theme',t);localStorage.setItem('slidou_budgie_state',JSON.stringify({pistachio:{faim:80,bonheur:80,energie:80},cielazur:{faim:80,bonheur:80,energie:80},lastUpdate:Date.now()}));},theme);await p.goto(url);await p.evaluate(()=>document.fonts.ready);await p.evaluate(n=>navigateTo(n),name);await p.waitForTimeout(500);await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});await p.mouse.move(0,0);await p.locator('.page.active img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));await p.waitForTimeout(300);shots.push(PNG.sync.read(await p.screenshot({path:path.join(out,`${name}-${width}-${theme}-${baseline?'reference':'corrigé'}.png`)})));await c.close();}
  let changed=0;for(let i=0;i<shots[0].data.length;i+=4)if([0,1,2].some(k=>shots[0].data[i+k]!==shots[1].data[i+k]))changed++;results.visual.push({name,width,theme,changedPixels:changed});
 }
 const offline=await browser.newContext();const q=await offline.newPage();await q.goto(url);await q.evaluate(()=>navigator.serviceWorker.ready);await q.reload();await offline.setOffline(true);await q.reload();check('hors-ligne-shell',await q.locator('#home-calendar-grid .calendar-day').count()>0);await offline.close();
 check('aucune-erreur-js',results.errors.length===0,results.errors);
}
if(require.main===module)main().catch(e=>{results.fatal=e.stack;process.exitCode=1}).finally(async()=>{if(browser)await browser.close();server.close();fs.writeFileSync(path.join(out,process.argv.includes('--functional')?'functional.json':'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));});
module.exports={server,page,async init(){await new Promise(r=>server.listen(0,'127.0.0.1',r));url=`http://127.0.0.1:${server.address().port}/`;browser=await chromium.launch({channel:'chrome',headless:true});return {browser,url};}};
