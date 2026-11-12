const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S97+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=97);
const w=require('./harness_lib')(file);w.saveU=()=>Promise.resolve(true);w.saveBg=()=>{};w.save=()=>Promise.resolve();const D=w.document,app=()=>D.getElementById('app');
try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
const P=(t)=>w.__parseWorkoutLocal(t),sum=(r)=>r.map(x=>(x.name||'-')+':'+x.exercises.map(e=>e.name+' '+e.sets+'x'+e.reps).join(',')).join(' || ');
// ── schede affiancate ──
let r=P(['SCHEDA A                      SCHEDA B','Panca piana 4x10              Squat 4x8','Rematore 4x10                 Leg press 3x12','Curl manubri 3x12             Affondi 3x10','Push down 3x15'].join('\n'));
T('due schede affiancate con intestazioni → A e B separate',r.length===2&&r[0].exercises.length===4&&r[1].exercises.length===3&&r[1].exercises[0].name==='Squat'&&r[0].exercises[3].name==='Push down',sum(r));
r=P(['Panca piana   4   10        Squat   4   8','Croci ai cavi   3   12      Leg curl   3   12','Dip   3   10                Calf raise   4   15'].join('\n'));
T('tabelle affiancate senza intestazioni → due schede',r.length===2&&r[0].exercises.length===3&&r[1].exercises.length===3&&r[1].exercises[2].name==='Calf raise'&&r[1].exercises[2].reps==='15',sum(r));
r=P('A\nPanca 4x10\nCroci 3x12\nB\nSquat 4x8\nStacco 3x5');
T('schede una sotto l\'altra con "A" e "B"',r.length===2&&r[0].name==='A'&&r[1].name==='B'&&r[1].exercises.length===2,sum(r));
r=P('Panca piana 4x10\nRematore 4x8');T('scheda singola invariata',r.length===1&&r[0].exercises.length===2);
T('istruzioni AI: più schede, penna/matita, lingua',/AFFIANCATE/.test(w.__ocrSys(true))&&/PENNA o MATITA/.test(w.__ocrSys(true))&&/in italiano/.test(w.__ocrSys())&&(w.ST.lang='en',/in inglese/.test(w.__ocrSys())));w.ST.lang='it';
// ── visione ──
(async()=>{
let posted=null;w.fetch=async(u,o)=>{posted={u,b:JSON.parse(o.body)};return {ok:true,json:async()=>({content:[{text:'Ecco: {"workouts":[{"name":"Scheda A","exercises":[{"name":"Panca piana","sets":4,"reps":"8","kg":62.5,"rest":"1\'30\\"","note":"ultima serie a cedimento (penna)"}]},{"name":"Scheda B","exercises":[{"name":"Squat","sets":"4","reps":"6","kg":"80","rest":120,"note":null}]}]}'}]})};};
w.Image=class{set src(v){setTimeout(()=>this.onload&&this.onload(),0)}get naturalWidth(){return 2000}get naturalHeight(){return 1500}};
w.HTMLCanvasElement.prototype.getContext=function(){return{drawImage(){}}};w.HTMLCanvasElement.prototype.toDataURL=function(){return 'data:image/jpeg;base64,AAAA'};
w.URL.createObjectURL=()=>'blob:x';w.URL.revokeObjectURL=()=>{};
const f=new w.File(['x'],'scheda.jpg',{type:'image/jpeg'});
await w.importWorkoutFiles({files:[f]});
T('foto → AI con visione (immagine inviata, istruzioni scritte a mano)',!!posted&&/fittracker-vision/.test(posted.u)&&posted.b.images[0].startsWith('data:image/jpeg')&&/PENNA/.test(posted.b.system));
const sd=w.ST.sheetData;T('visione: due schede, valori corretti a mano letti',w.ST.sheet==='customWorkout'&&sd.qTot===2&&sd.via==='vision'&&sd.draft.exercises[0].kg===62.5&&sd.draft.exercises[0].rest===90&&/penna/.test(sd.draft.exercises[0].note),JSON.stringify(sd.draft.exercises[0]));
T('revisione: riepilogo in cima',/1 esercizi/.test(D.getElementById('cwImpSum').textContent)&&/scheda 1 di 2/.test(D.getElementById('cwImpSum').textContent)&&/letta dalla foto con AI/.test(D.getElementById('cwImpSum').textContent));
// visione non disponibile → lettura testo
w.closeSheet();let fell=0;w.fetch=async()=>{throw new Error('net')};
const orig=w.__readWorkoutFile;
// ── finestre ──
w.ST.sheet='customWorkout';w.ST.sheetData={draft:{id:'cw_t',name:'',emoji:'💪',exercises:[]},isNew:true};w.ST.tab='work';w.render();
const sh=app().querySelector('.sh');T('finestra: ✕ sempre in alto',!!sh.querySelector('.sh-xw .sh-x'));
const act=sh.querySelector('.sh-act');T('finestra: Annulla/Salva sempre visibili in basso',!!act&&/SALVA|Salva/i.test(act.textContent));
w.__shClose();T('✕ chiude',!w.ST.sheet);
w.ST.sheet='customWorkout';w.ST.sheetData={draft:{id:'cw_t',name:'',emoji:'💪',exercises:[]},isNew:true,subSheet:'customEx'};w.render();T('sotto-finestra: ✕ torna indietro',(w.__shClose(),w.ST.sheet==='customWorkout'&&!w.ST.sheetData.subSheet));w.closeSheet();
w.goOutdoor();w.render();const s2=app().querySelector('.sh');T('anche le altre finestre hanno ✕',!!s2&&!!s2.querySelector('.sh-x'));w.closeSheet();
// ── ricerca ──
w.ST.tab='home';w.drawerOpen=true;w.render();const db=[...app().querySelectorAll('button')].find(b=>/openSearch/.test(b.getAttribute('onclick')||''));T('menu: lente "Cerca una funzione"',!!db&&/Cerca una funzione/.test(db.textContent));
w.openSearch();T('ricerca a tutto schermo con suggerimenti',!!D.getElementById('ftSrch')&&/PIÙ CERCATI/.test(D.getElementById('ftSrchRes').textContent));
const top=(q)=>{const i=w.__srchFind(q)[0];return i==null?'':w.eval('1')&&D.createElement('x')&&(w.__srchRender(q),D.querySelector('#ftSrchRes .sr-it')?D.querySelector('#ftSrchRes .sr-it').textContent:'');};
T('cerca "password"',/Cambia password/.test(top('password')));
T('cerca "giorni allenamento"',/Giorni di allenamento/.test(top('giorni allenamento')));
T('cerca "importare foto scheda"',/Importa una scheda/.test(top('importare foto scheda')));
T('cerca "massimale"',/massimale/.test(top('massimale')));
T('cerca "tema scuro"',/Tema/.test(top('tema scuro')));
w.__srchRender('xyzzy');T('nessun risultato: aiuto chiaro',/Non ho trovato/.test(D.getElementById('ftSrchRes').textContent));
const gi=w.__srchFind('giorni allenamento')[0];w.__srchGo(gi);T('tocco → porta in Configurazione',w.ST.tab==='set'&&!D.getElementById('ftSrch'));
w.__hlApply(true);T('…ed evidenzia la sezione',!!D.querySelector('.ft-hl')&&/GIORNI DI ALLENAMENTO/.test(D.querySelector('.ft-hl').textContent));w.render();T('evidenziazione resiste ai ridisegni',!!D.querySelector('.ft-hl'));
w.__srchGo(w.__srchFind('massimale')[0]);T('1RM: apre la vista giusta',w.ST.tab==='stats'&&w.ST.statsView==='calc1rm');
w.ST.lang='en';w.openSearch();w.__srchRender('password');T('ricerca EN',/Change password/.test(D.getElementById('ftSrchRes').textContent));D.getElementById('ftSrch').remove();w.ST.lang='it';
// ── salta esercizio ──
w.ST.tab='work';w.ST.wLog=[];try{w.startWo('A')}catch(_){}
if(!w.ST.aWo){w.ST.aWo='A';w.ST.step=0;w.ST.woPhase='ready';w.ST.currentSet=0;}
const W=w.getWo();let k=W.exercises.findIndex(e=>!e.isWarmup&&!e.isCooldown&&!e.circ&&!e.isBonus);w.ST.step=k;w.ST.woPhase='ready';w.ST.currentSet=0;w.render();
const sb=[...app().querySelectorAll('button')].find(b=>/__skipEx\(\)/.test(b.getAttribute('onclick')||''));T('allenamento: "Salta questo esercizio"',!!sb);
let msg='';w.confirm=(m)=>{msg=m;return false;};w.__skipEx();T('avviso: non saltare, fai meno ripetizioni',/non saltare/.test(msg)&&/meno ripetizioni/.test(msg)&&w.ST.step===k);
w.confirm=()=>true;const exId=W.exercises[k].id;const vol0=w.ST.currVol||0;w.__skipEx();
T('saltato: registrato e si passa al prossimo',w.ST.exSkip[exId]&&w.ST.exSkip[exId].d===w.eval('currentDateStr')&&w.ST.step===k+1);
T('saltato: niente volume aggiunto (calorie e totale)',(w.ST.currVol||0)===vol0);
w.ST.aWo=null;w.ST.exSkip[exId].d='2026-11-01';w.ST.aWo='A';w.ST.step=k;w.ST.woPhase='ready';w.render();
T('volta dopo: riproposto con avviso',/L'ultima volta/.test(app().textContent)&&/1 novembre/.test(app().textContent));
w.ST.aWo=null;
console.log('feat97   ok='+ok+' fail='+fail);process.exit(fail?1:0);})();
