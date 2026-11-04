const boot=require('./harness_lib');const file=process.argv[2]||'Index.html';const tick=()=>new Promise(r=>setImmediate(r));(async()=>{
const T=(n,c)=>console.log((c?'✓':'✗ FAIL')+' '+n);
let w=boot(file);w.alert=()=>{};w.confirm=()=>true;
const today=w.currentDateStr;
w.ST.p.dur=60;w.ST.wLog=[];w.ST.wHistory={};w.localStorage.clear();
// ── allenamento: 50 min fa, 4 esercizi fatti, volume 3200 ──
w.startWo('B');w.ST.workoutStartTs=Date.now()-68*6e4;w.ST.step=4;w.ST.currVol=3200;
const wo=w.getWo();for(let k=1;k<4;k++){w.ST.wHistory[today]=w.ST.wHistory[today]||{};w.ST.wHistory[today][wo.exercises[k].id]={ok:true,kg:50,dl:false};}
w.__woSnap();
T('stato in corso anche nel cloud (liveWo)',w.ST.liveWo&&w.ST.liveWo.step===4&&w.ST.liveWo.vol===3200);
// pausa 18 minuti (telefonata)
w.pauseWo();w.ST.woPaused.at-=18*6e4;w.__woSnap();
// ── iOS chiude l'app: perdo memoria, resta localStorage + cloud ──
const ls=JSON.stringify(Object.assign({},w.localStorage));const snapLocal=w.localStorage.getItem('ft_wo_live_v1');
const cloud=JSON.parse(JSON.stringify({wLog:w.ST.wLog,wHistory:w.ST.wHistory,liveWo:w.ST.liveWo,p:w.ST.p,h:w.ST.h,programStart:w.ST.programStart}));
w=boot(file);w.alert=()=>{};w.confirm=()=>true;w.localStorage.setItem('ft_wo_live_v1',snapLocal);
Object.assign(w.ST,cloud);w.ST.tab='home';w.render();
T('al rientro l\'allenamento è ripristinato in PAUSA',w.ST.aWo==='B'&&w.ST.step===4&&!!w.ST.woPaused&&w.document.getElementById('app').textContent.includes('ALLENAMENTO IN PAUSA'));
T('messaggio "Ripreso dopo la chiusura"',/Ripreso dopo la chiusura/.test(w.document.getElementById("app").textContent));
w.resumeWo();
const mins=Math.round((Date.now()-w.ST.workoutStartTs)/6e4);
T('minuti totali esclusa la pausa (~50, non 1 e non 68) ['+mins+']',mins>=49&&mins<=51);
T('volume totale conservato ['+w.ST.currVol+']',w.ST.currVol===3200);
// ── SALVA E TERMINA ──
let saved=0;w.saveU=()=>{saved++;return Promise.resolve()};
w.ST.step=w.getWo().exercises.length-1;w.advanceExercise();const pending=w.localStorage.getItem('ft_wo_pending_v1');await tick();await tick();
const e=w.ST.wLog.find(x=>x.d===today&&!x.partial);
T('allenamento salvato completo ['+(e&&e.dur)+' min, '+(e&&e.vol)+' kg, '+(e&&e.kcal)+' kcal]',e&&e.dur>=49&&e.vol===3200&&e.kcal>100);
T('stato "in corso" azzerato',!w.ST.aWo&&!w.ST.liveWo&&!w.localStorage.getItem('ft_wo_live_v1'));
T('salvataggio cloud chiamato',saved>=1);
// ── caso: l'app si chiude PRIMA che il cloud confermi ──
T('protezione rimossa dopo conferma cloud',!w.localStorage.getItem('ft_wo_pending_v1'));
w=boot(file);w.alert=()=>{};w.confirm=()=>true;
if(pending)w.localStorage.setItem('ft_wo_pending_v1',pending);
w.localStorage.setItem('ft_wo_live_v1',snapLocal); // snapshot vecchio rimasto
Object.assign(w.ST,cloud);let saved2=0;w.saveU=()=>{saved2++;return Promise.resolve()};
w.ST.tab='home';w.render();await tick();await tick();
const e2=w.ST.wLog.find(x=>x.d===today&&!x.partial);
T('cloud vecchio: allenamento finito reinserito',!!e2&&e2.dur>=49);
T('NON riparte dall\'ultimo checkpoint',!w.ST.aWo);
T('risalvataggio automatico',saved2>=1);
// ── uscita volontaria: niente ripristino forzato ──
w=boot(file);w.alert=()=>{};w.confirm=()=>true;w.ST.wLog=[];w.ST.wHistory={};w.localStorage.clear();
w.startWo('A');w.ST.workoutStartTs=Date.now()-20*6e4;w.ST.step=3;w.ST.currVol=900;w.ST.wHistory[today]={x:{ok:true}};w.closeWo();
const pt=w.ST.wLog.find(x=>x.partial);T('uscita: parziale con i minuti giusti ['+(pt&&pt.dur)+']',pt&&pt.dur>=19&&pt.dur<=21&&pt.vol===900);
w.ST.tab='home';w.render();T('uscita volontaria: nessun ripristino automatico',!w.ST.aWo);
// riprendo e finisco: il parziale viene SOSTITUITO e i totali includono la parte prima dell'uscita
w.confirm=()=>true;w.startWo('A');T('ripresa dopo uscita: volume e minuti precedenti',w.ST.currVol===900&&Math.round((Date.now()-w.ST.workoutStartTs)/6e4)>=19);
w.saveU=()=>Promise.resolve();w.ST.step=w.getWo().exercises.length-1;w.advanceExercise();
T('fine: un solo allenamento, nessun parziale',w.ST.wLog.filter(x=>x.d===today&&!x.isRest).length===1&&!w.ST.wLog.some(x=>x.partial));
// ── layout ──
const src=require('fs').readFileSync(file,'utf8');
T('topbar più in basso',/\.topbar\{[^}]*padding-top:calc\(22px \+ env\(safe-area-inset-top,0px\)\)/.test(src));
T('header allenamento più in basso',/\.wo-head\{[^}]*padding:calc\(22px \+ env\(safe-area-inset-top,0px\)\)/.test(src));
process.exit(0);})();
