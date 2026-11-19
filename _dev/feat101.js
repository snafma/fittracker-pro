const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S101+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=101);
const w=require('./harness_lib')(file);w.saveU=()=>Promise.resolve(true);w.save=()=>Promise.resolve();w.saveBg=()=>{};const D=w.document,app=()=>D.getElementById('app');
try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
const C=w.Coach;T('Coach con hype/chatter/tap/homeTalk',!!(C&&C.hype&&C.chatter&&C.tap&&C.homeTalk));
let said=[];const _s=C.say.bind(C);C.say=function(t,o){said.push({t,o:o||{}});};
// testo mostrato senza i segni di pausa, voce con le pause
C.hype('Forza! | Serie 2: | vai!');const a=said.pop();
T('testo mostrato pulito (niente "|")',a.t==='Forza! Serie 2: vai!',a.t);
T('voce con pausa e tono carico',/\.\.\. /.test(a.o.sp)&&!/\|/.test(a.o.sp)&&a.o.mood==='hype',a.o.sp);
C.say=_s;w.ST.p.coachMode=true;C.muted=false;C.say('Ciao | prova',{sp:'Ciao... prova'});

C.say=function(t,o){said.push({t,o:o||{}});};
// chiacchiera: in allenamento parla dopo pochi secondi di silenzio, con frasi diverse
w.ST.aWo='A';w.ST.step=1;w.ST.currentSet=0;w.ST.woPhase='active';w.ST.woPaused=false;w.ST.__guide=false;C.count=()=>false;
const got=new Set();for(let i=0;i<8;i++){C._lastTalk=Date.now()-1e4;said=[];C.chatter();said.length&&got.add(said[0].t);}
T('serie: incoraggia dopo ~8 s di silenzio',got.size>0);
T('serie: frasi varie, non sempre la stessa',got.size>=4,got.size);
said=[];C._lastTalk=Date.now()-2e3;C.chatter();T('non si parla addosso (pochi secondi dall\'ultima frase)',said.length===0);
w.ST.woPhase='rest';w.ST.tmr=60;said=[];C._lastTalk=Date.now()-1e4;C.chatter();T('recupero: parla (quanto manca, respirazione…)',said.length===1&&!/\|/.test(said[0].t),said[0]&&said[0].t);
const rs=new Set();for(let i=0;i<10;i++){C._lastTalk=Date.now()-1e4;said=[];C.chatter();said.length&&rs.add(said[0].t);}
T('recupero: varietà',rs.size>=4,rs.size);
w.ST.woPaused=true;said=[];C._lastTalk=Date.now()-6e4;C.chatter();T('in pausa: silenzio',said.length===0);w.ST.woPaused=false;
C.muted=true;said=[];C.chatter();T('silenziato: niente chiacchiera',said.length===0);C.muted=false;
w.ST.lang='en';w.ST.woPhase='active';said=[];C._lastTalk=Date.now()-1e4;C.chatter();T('EN',said.length===1&&!/[àèìòù]/.test(said[0].t),said[0]&&said[0].t);w.ST.lang='it';
// home: il coach resta visibile e parla al tocco
w.ST.aWo=null;w.ST.tab='home';w.ST.sheet=null;C._finUntil=0;C.syncDock();
T('coach visibile in Home',D.getElementById('coachDock').classList.contains('on'));
said=[];C.tap();T('tocco in Home → messaggio del giorno',said.length===1&&/calorie|riposo|allena/.test(said[0].t),said[0]&&said[0].t);
w.ST.tab='diet';C.syncDock();T('fuori dalla Home non resta',!D.getElementById('coachDock').classList.contains('on'));
w.ST.p.coachMode=false;w.ST.tab='home';C.syncDock();T('modalità coach spenta → non compare',!D.getElementById('coachDock').classList.contains('on'));
// kcal bruciate oggi
const d=w.eval('currentDateStr');w.ST.wLog=[{d,kcal:300},{d,kcal:999,isRest:true},{d:'2000-01-01',kcal:500}];
w.ST.activities={[d]:[{kcal:200}]};w.ST.life=w.ST.life||{};w.ST.life[d]=Object.assign({},w.ST.life[d],{steps:10000});
const b=w.__burnToday();T('kcal oggi = allenamenti + sport + passi',b.wo===300&&b.sport===200&&b.steps>300&&b.tot===b.wo+b.sport+b.steps,JSON.stringify(b));
w.render();const k=D.getElementById('home-kpi');
T('Home: riquadro KCAL bruciate al posto di STREAK',!!k&&/bruciate oggi/.test(k.textContent)&&!/STREAK/.test(k.textContent)&&k.textContent.includes(String(b.tot)));
const tile=[...k.children].find(x=>/bruciate/.test(x.textContent));T('tocco → Statistiche',/ST\.tab='stats'/.test(tile.getAttribute('onclick')||''));
console.log('feat101  ok='+ok+' fail='+fail);process.exit(fail?1:0);
