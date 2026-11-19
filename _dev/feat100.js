const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S100+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=100);
const w=require('./harness_lib')(file);w.saveU=()=>Promise.resolve(true);w.save=()=>Promise.resolve();w.saveBg=()=>{};const D=w.document,app=()=>D.getElementById('app');
try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
// ── scarico nelle schede personalizzate ──
w.ST.p.customWorkouts=[{id:'cw_t',name:'Mia A',emoji:'💪',exercises:[{exId:'ch_man',sets:4,reps:'8',rest:120,kg:40},{exId:'tri_push',sets:4,reps:'12',rest:60},{exId:'co_plk',sets:3,reps:'40s',rest:45}]}];
w.ST.p.t='cut';
w.__dlNow=()=>false;w.ST.aWo='cw_t';let W=w.getWo();const ex=(id)=>W.exercises.find(x=>x.id===id);
T('settimana normale: valori della scheda',ex('ch_man').sets===4&&ex('ch_man').reps==='8');
w.__dlNow=()=>true;w.isDeloadWeek=()=>true;W=w.getWo();
T('scarico: la scheda personalizzata usa serie/ripetizioni/recupero dello scarico',ex('ch_man').sets===2&&ex('ch_man').reps==='12-15'&&ex('ch_man').rest===60&&ex('tri_push').sets===2,JSON.stringify([ex('ch_man').sets,ex('ch_man').reps,ex('ch_man').rest]));
T('scarico: avviso con i valori originali',/Settimana di scarico: 2×12-15 invece di 4×8/.test(ex('ch_man').cues[0]));
T('scarico: plank (a tempo) invariato',ex('co_plk').sets===3);
w.ST.wHistory={};w.getWo();const sg=w.getSuggest('ch_man',{},'kg');T('scarico: carico della scheda −30%',sg.kg===28&&/SCARICO/.test(sg.hint),JSON.stringify(sg));
w.__dlNow=()=>false;w.isDeloadWeek=()=>false;const sg2=w.getSuggest('ch_man',{},'kg');T('normale: carico della scheda pieno',sg2.kg===40);
w.__dlNow=()=>true;w.isDeloadWeek=()=>true;w.ST.aWo='A';w.ST.p.t='cut';W=w.getWo();const st=W.exercises.filter(x=>!x.isWarmup&&!x.isCooldown&&x.t!=='cardio'&&x.t!=='isometric');
T('scarico: anche le schede dell\'app restano a 2 serie (il riempimento del tempo non le rialza)',st.length>0&&st.every(x=>x.sets===2&&x.reps==='12-15'),st.map(x=>x.sets+'x'+x.reps).join(' '));
w.ST.p.t='bulk';W=w.getWo();T('scarico in massa: 3×8-10',W.exercises.filter(x=>x.t==='compound').every(x=>x.sets<=3&&x.reps==='8-10'));w.ST.p.t='cut';
w.__dlNow=()=>false;w.isDeloadWeek=()=>false;
// ── kcal cardio sui minuti reali ──
w.ST.aWo='A';W=w.getWo();const ci=W.exercises.findIndex(x=>x.t==='cardio');T('scheda con cardio finale',ci>0,ci);
const cx=W.exercises[ci];const tg=parseInt(cx.reps)*60;w.ST.workoutStartTs=Date.now()-50*60e3;w.ST.currVol=3000;w.ST.woCardio=null;
const base=w.estimateWorkoutKcal(50,80,3000);
w.ST.step=ci;w.ST.woPhase='active';w.ST.currentSet=0;w.ST.setElapsed=tg+180;w.confirm=()=>true;w.completeSet();
const more=w.estimateWorkoutKcal(50,80,3000);
w.ST.woCardio=null;w.ST.step=ci;w.ST.woPhase='active';w.ST.setElapsed=Math.round(tg*0.5);let asked='';w.confirm=(m)=>{asked=m;return true;};w.completeSet();
const less=w.estimateWorkoutKcal(50,80,3000);
T('cardio più lungo del previsto → più kcal',more>base&&more>less,`${less} < ${base} < ${more}`);
T('stesso tempo totale: con meno cardio meno kcal',less<more);
T('finisci molto prima → "sei sicuro? non mollare"',/Stai terminando prima/.test(asked)&&/non mollare/.test(asked));
w.ST.woCardio=null;w.ST.step=ci;w.ST.woPhase='active';w.ST.setElapsed=60;w.confirm=()=>false;w.completeSet();
T('"Annulla" → il cardio continua',w.ST.woPhase==='active'&&w.ST.step===ci&&!w.ST.woCardio);
w.ST.lang='en';asked='';w.confirm=(m)=>{asked=m;return true;};w.completeSet();T('avviso EN',/don't give up/.test(asked));w.ST.lang='it';
// riepilogo finale
w.ST.woCardio=null;w.ST.step=ci;w.ST.woPhase='active';w.ST.setElapsed=tg+180;w.confirm=()=>true;w.completeSet();
w.ST.step=W.exercises.length-1;w.ST.woPhase='ready';w.advanceExercise();
T('fine allenamento: minuti di cardio rispetto al previsto',w.ST.sheet==='workoutDone'&&/\+3 min sul previsto/.test(w.ST.sheetData.cardioTxt||''),w.ST.sheetData&&w.ST.sheetData.cardioTxt);
w.render();T('riepilogo visibile',/Cardio: \d+ min/.test(app().textContent));
console.log('feat100  ok='+ok+' fail='+fail);process.exit(fail?1:0);
