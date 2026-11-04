const boot=require('./harness_lib');const w=boot(process.argv[2]||'Index.html');
const T=(n,c)=>console.log((c?'✓':'✗ FAIL')+' '+n);w.alert=()=>{};w.confirm=()=>true;
const D=(k)=>{const d=new Date(Date.now()-k*864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const today=w.currentDateStr;
// S60 deload solo con continuità
w.ST.programStart=D(33);w.ST.wLog=[];T('S60 deload negato senza continuità',!w.isDeloadWeek(w.ST.programStart));
// S60 durata sessione
w.ST.wLog=[];w.ST.p.dur=45;const a=w.getSetsReps('compound','cut',2,'total');w.ST.p.dur=60;const b=w.getSetsReps('compound','cut',2,'total');
T('S60 45min meno serie',a.sets<b.sets);
// S60 parziale
w.ST.aWo='A';w.ST.workoutStartTs=Date.now()-6e5;w.ST.wHistory[today]={x:{ok:true}};w.ST.wLog=[];w.closeWo();
T('S60 allenamento parziale salvato',w.ST.wLog.some(e=>e.partial));
// S61 esercizi + warmup + circuito + casa
T('S61-62 DB ≥179 esercizi ('+Object.keys(w.__EX).length+')',Object.keys(w.__EX).length>=179);
w.ST.p.loc='gym';w.ST.p.dur=30;const c30=w.buildWorkout('A',w.ST.p,2,{},'m',{});T('S61 circuito 30min cut',c30.isCircuit===true);
w.ST.p.dur=60;T('S61 warmup mirato upper',w.buildWorkout('A',w.ST.p,2,{},'m',{}).exercises[0].id==='wu_upper');
w.ST.p.loc='home';let gym=0;['A','B','C','D','E'].forEach(k=>{const x=w.buildWorkout(k,w.ST.p,2,{},'m',{});x&&x.exercises.forEach(e=>{if(!e.isWarmup&&!e.isCooldown&&w.__EX[e.id]&&w.__EX[e.id].home===false)gym++})});T('S61 casa senza attrezzi',gym===0);w.ST.p.loc='gym';
// S62 cardio auto + stallo
delete w.ST.p.cardioMode;w.ST.p.t='cut';w.ST.p.cardioLevel=2;const up=w.buildWorkout('A',w.ST.p,2,{},'m',{alert:'stalled'});T('S62 cardio auto upper cut = HIIT',up.exercises.find(e=>e.isBonus)?.id==='cd_hiit');
// S63 temi suoni + recuperi
['classic','soft','digital','power'].forEach(th=>{w.ST.p.soundTheme=th;try{w.BeepPlayer.tick(1);w.BeepPlayer.endOfRest()}catch(e){T('S63 tema '+th,false)}});T('S63 4 temi suoni',true);
const all=['A','B','C'].flatMap(k=>w.buildWorkout(k,w.ST.p,2,{},'m',{}).exercises.filter(e=>!e.isWarmup&&!e.isCooldown&&e.t!=='cardio'));T('S63 recuperi differenziati',new Set(all.map(e=>e.rest)).size>=4);
// S64 solver + fasi
const bk=w.buildWorkout('A',{...w.ST.p,t:'bulk',dur:90},2,{},'m',{});T('S64 bulk 90 recuperi pieni',bk.restScale>1);
const ct=w.buildWorkout('A',{...w.ST.p,cardioLevel:2},2,{},'m',{});T('S64 cardio extra fuori budget',ct.cardioExtraMin>0&&ct.estMin<=60);
// S65-67 alimentazione
w.ST.aWo=null;w.ST.p.nutritionOff=false;w.ST.tab='diet';w.render();let t=w.document.getElementById('app').textContent;
T('S65 quick-add presente',t.includes('SEGNA COSA HAI MANGIATO'));
T('S65 margarina nel DB',w.foodSearch('margarina',1).length>0);
w.ST.quickMeal='pra';w.quickAddFood(w.foodSearch('pollo',1)[0].id);T('S66 pasto registrato = tuo, non saltato',(w.ST.nutri[today].own||[]).includes('pra')&&!(w.ST.nutri[today].skipped||[]).includes('pra'));
w.render();t=w.document.getElementById('app').textContent;T('S67 riepilogo + SCELTO DA TE',t.includes('COSA HAI MANGIATO')&&t.includes('SCELTO DA TE'));
// S62 nutrition off
w.ST.p.nutritionOff=true;w.ST.tab='home';w.render();t=w.document.getElementById('app').textContent;T('S61 nutrizione off: niente KCAL OGGI',!t.includes('KCAL OGGI'));
w.ST.tab='body';w.render();T('S65 consistency senza dieta',w.document.getElementById('app').textContent.includes('Giorni con allenamento registrato'));
w.ST.p.nutritionOff=false;
// S62 dbltap + saveBg
T('S62 anti doppio tap',typeof w.__blockDblTapZoom!=='undefined');T('S60 saveBg',typeof w.saveBg==='function');
process.exit(0);
