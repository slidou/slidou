// Local-only audit. Uses an installed Playwright, no production or user profile.
const fs = require('fs'), path = require('path'), http = require('http');
const {createRequire} = require('module');
const req = createRequire(process.env.PLAYWRIGHT_MODULE || 'C:/Users/akrmm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium,firefox,webkit} = req('playwright');
const root = path.resolve(__dirname,'..'), phase = process.argv[2] || 'after';
const out = path.join(root,'audit');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.json':'application/json'};
const server=http.createServer((r,s)=>{let p;try{p=path.resolve(root,'.'+decodeURIComponent(new URL(r.url,'http://localhost').pathname));}catch{s.writeHead(400).end();return;}if(!p.startsWith(root+path.sep)&&p!==root){s.writeHead(403).end();return;}if(p===root)p=path.join(root,'index.html');fs.readFile(p,(e,b)=>{if(e){s.writeHead(404).end();return;}s.writeHead(200,{'Content-Type':mime[path.extname(p).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});s.end(b);});});
const results={phase,browsers:[],pages:[],errors:[],scenarios:[]};
const pages=['home','bibliographie','ecrans','jeux','musique','anime','manga','statistiques','apropos'];
async function main(){await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/`;
 let browser;
 for(const [name,type,opts] of [['chrome',chromium,{channel:'chrome'}],['edge',chromium,{channel:'msedge'}],['firefox',firefox,{}],['webkit',webkit,{}]]){
  try{const b=await type.launch({headless:true,...opts});results.browsers.push({name,version:b.version()});if(name==='chrome')browser=b;else{const p=await b.newPage();await p.goto(url);await p.evaluate(()=>navigateTo('anime'));await b.close();}}catch(e){results.browsers.push({name,unavailable:e.message.split('\n')[0]});}
 }
 if(!browser)throw Error('Chrome unavailable');
 if(phase==='targeted'){
  const {PNG}=req('pngjs');results.stableVisual=[];
  for(const width of [390,1440]){const shots=[];for(const baseline of [true,false]){
   const c=await browser.newContext({serviceWorkers:'block',viewport:{width,height:width===390?844:900}});const q=await c.newPage();
   if(baseline)await q.route('**/script.js?*',route=>route.fulfill({contentType:'text/javascript',body:require('child_process').execFileSync('git',['show','HEAD:script.js'],{encoding:'utf8'})}));
   await q.goto(url);await q.evaluate(()=>document.fonts.ready);await q.evaluate(()=>navigateTo('statistiques'));await q.waitForTimeout(2500);const file=path.join(out,'screenshots',`stable-${baseline?'before':'after'}-stats-${width}.png`);shots.push(PNG.sync.read(await q.screenshot({path:file,animations:'disabled'})));await c.close();}
   let changed=0;for(let i=0;i<shots[0].data.length;i+=4)if([0,1,2].some(k=>shots[0].data[i+k]!==shots[1].data[i+k]))changed++;results.stableVisual.push({width,changedPixels:changed});
  }
 }
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1440,height:900}});
 await context.addInitScript(()=>{Date.now=()=>1794916800000;let seed=42;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);});
 const p=await context.newPage();p.on('pageerror',e=>results.errors.push(e.message));
 await p.goto(url);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
 results.performance=await p.evaluate(()=>({navigation:performance.getEntriesByType('navigation')[0].toJSON(),paint:performance.getEntriesByType('paint').map(x=>x.toJSON()),resources:performance.getEntriesByType('resource').map(x=>({name:x.name.split('/').pop(),bytes:x.transferSize,duration:x.duration}))}));
 for(const [width,height] of (phase==='targeted'?[]:[[320,640],[390,844],[844,390],[768,1024],[1024,768],[1440,900],[1920,1080]])){
  await p.setViewportSize({width,height});
  for(const name of pages){await p.evaluate(n=>navigateTo(n),name);await p.waitForTimeout(350);results.pages.push(await p.evaluate(({name,width,height})=>({name,width,height,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.querySelectorAll('.page.active img')].filter(i=>i.complete&&!i.naturalWidth).length,dom:document.querySelectorAll('*').length}),{name,width,height}));
   if([390,1440].includes(width))await p.screenshot({path:path.join(out,'screenshots',`${phase}-${name}-${width}.png`),animations:'disabled'});
  }
 }
 await p.setViewportSize({width:1440,height:900});
 for(const [name,id] of [['bibliographie','biblio'],['ecrans','ecrans'],['jeux','jeux'],['musique','musique'],['anime','anime'],['manga','manga']]){await p.evaluate(n=>navigateTo(n),name);await p.locator('#search-'+id).fill('zzzz-no-match-987');results.scenarios.push({name:'empty-search-'+name,ok:await p.locator('.page.active').innerText().then(t=>t.includes('aucun résultat'))});await p.locator('#search-'+id).fill('');}
 await p.keyboard.press('Control+k');await p.locator('#palette-input').fill('<img src=x onerror=alert(1)>');await p.waitForTimeout(200);results.scenarios.push({name:'search-html-escaped',ok:await p.locator('#palette-results img').count()===0});await p.keyboard.press('Escape');
 // Search must survive every sort, including both screen subpages.
 for(const sub of ['films','series']){await p.evaluate(()=>navigateTo('ecrans'));await p.locator(`[data-subpage="${sub}"]`).click();await p.locator('#search-ecrans').fill('zzzz-no-match-987');await p.locator('#ecrans-sort button').filter({hasText:'note'}).click();results.scenarios.push({name:'screen-sort-preserves-search-'+sub,ok:await p.locator('#'+sub+'Content .book-card').count()===0});}
 await p.evaluate(()=>navigateTo('anime'));await p.locator('#anime-tags button').filter({hasText:/^favorite/}).click();results.scenarios.push({name:'anime-favorites',ok:await p.locator('#animeContent .top-item').count()===10});await p.reload();results.scenarios.push({name:'preferences-reload',ok:await p.locator('#anime-tags button').filter({hasText:/^favorite/}).getAttribute('aria-pressed')==='true'});await p.locator('#anime-tags button').filter({hasText:/^tous/}).click();
 await p.evaluate(()=>navigateTo('apropos'));for(const id of ['btn-nourrir','btn-jouer','btn-dormir'])await p.locator('#'+id).click();results.scenarios.push({name:'birds-actions',ok:await p.evaluate(()=>{const s=getBudgieState();return ['pistachio','cielazur'].every(b=>['faim','bonheur','energie'].every(k=>s[b][k]>=0&&s[b][k]<=100))})});
 await p.evaluate(()=>navigateTo('home'));await p.locator('#toggle-recap-btn').click();await p.locator('#wrapped-open-btn').click();await p.waitForTimeout(1200);const download= p.waitForEvent('download');await p.locator('.wrapped-dl').click();const d=await download;await d.saveAs(path.join(out,`${phase}-wrapped.png`));results.scenarios.push({name:'wrapped-export',ok:true});await p.keyboard.press('Escape');
 await p.evaluate(()=>navigateTo('musique'));await p.locator('#player-play').click();await p.waitForTimeout(300);await p.locator('#player-next').click();await p.waitForTimeout(300);results.scenarios.push({name:'next-keeps-playing',ok:await p.evaluate(()=>!audio.paused&&isPlaying)});
 await p.locator('#player-prev').click();await p.waitForTimeout(300);results.scenarios.push({name:'previous-keeps-playing',ok:await p.evaluate(()=>!audio.paused&&isPlaying)});await p.locator('#player-play').click();await p.locator('#player-next').click();results.scenarios.push({name:'next-preserves-pause',ok:await p.evaluate(()=>audio.paused&&!isPlaying)});
 await p.evaluate(()=>navigateTo('home'));if(await p.locator('#toggle-recap-btn').getAttribute('aria-expanded')==='true')await p.locator('#toggle-recap-btn').click();await p.locator('.calendar-day.has-data').first().focus();await p.keyboard.press('Enter');results.focusDebug=await p.evaluate(()=>({active:document.activeElement.outerHTML.slice(0,200),modals:[...document.querySelectorAll('[aria-modal="true"]')].map(x=>({id:x.id,cls:x.className,display:getComputedStyle(x).display,rects:x.getClientRects().length}))}));await p.keyboard.press('Tab');results.scenarios.push({name:'calendar-focus-contained',ok:await p.locator('#calendar-popup').evaluate(e=>e.contains(document.activeElement))});await p.keyboard.press('Escape');results.scenarios.push({name:'calendar-focus-restored',ok:await p.locator('.calendar-day.has-data').first().evaluate(e=>e===document.activeElement)});
 await p.setViewportSize({width:390,height:844});await p.locator('#menu-toggle').click();await p.keyboard.press('Shift+Tab');results.scenarios.push({name:'mobile-menu-focus-contained',ok:await p.locator('#mobile-plus-sheet').evaluate(e=>e.contains(document.activeElement))});await p.keyboard.press('Escape');await p.locator('#mobile-nav [data-page="anime"]').click();await p.locator('#load-more-anime').click();results.scenarios.push({name:'anime-load-more',ok:await p.locator('#animeContent .anime-card').count()===100});
 for(const [name,setup] of [['storage-denied',()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError')}})}],['invalid-prefs',()=>localStorage.setItem('slidou-prefs','{"anime":{"tags":42}}')],['invalid-birds',()=>localStorage.setItem('slidou_budgie_state','{"pistachio":{},"cielazur":{"faim":"bad"},"lastUpdate":"bad"}')]]){
 const c=await browser.newContext({serviceWorkers:'block'});await c.addInitScript(setup);const q=await c.newPage(),errors=[];q.on('pageerror',e=>errors.push(e.message));await q.goto(url);try{await q.evaluate(()=>navigateTo('apropos'));}catch(e){errors.push(e.message)}const finite=await q.evaluate(()=>{try{const s=getBudgieState();return ['pistachio','cielazur'].every(b=>['faim','bonheur','energie'].every(k=>Number.isFinite(s[b][k])))}catch{return false}});results.scenarios.push({name,ok:errors.length===0&&finite,errors,finite});await c.close();}
 for(const season of ['halloween','noel','valentin']){await p.goto(url+'?season='+season);results.scenarios.push({name:'season-'+season,ok:await p.locator('body').evaluate((e,s)=>e.classList.contains('season-'+s),season)});}
 await context.close();
 const c=await browser.newContext();const q=await c.newPage();await q.goto(url);await q.evaluate(()=>navigator.serviceWorker.ready);await q.reload();await c.setOffline(true);await q.reload();results.scenarios.push({name:'offline-reload',ok:await q.locator('#home-calendar-grid .calendar-day').count()>0});await c.close();await browser.close();
}
main().catch(e=>{results.fatal=e.stack;process.exitCode=1}).finally(()=>{if(results.scenarios.some(x=>!x.ok)||results.errors.length)process.exitCode=1;fs.writeFileSync(path.join(out,phase+'.json'),JSON.stringify(results,null,2));server.close();console.log(JSON.stringify({phase,scenarios:results.scenarios,errors:results.errors,fatal:results.fatal},null,2));});
