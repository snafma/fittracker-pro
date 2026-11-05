const boot=require('./harness_lib');const file=process.argv[2]||'Index.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));w.alert=()=>{};w.confirm=()=>true;
w.saveU=()=>Promise.resolve(true);w._userPickedDate=true;
const app=()=>w.document.getElementById('app');
// opzioni
w.ST.tab='set';w.ST.p.dur=20;w.render();
const eDur=[...app().querySelectorAll('#eDur option')].map(o=>o.value);
T('impostazioni: durate 15/20/30/45/60/90',['15','20','30','45','60','90'].every(v=>eDur.includes(v)),eDur.join(','));
T('impostazioni: 20 selezionato',app().querySelector('#eDur').value==='20');
const eSess=[...app().querySelectorAll('#eSess option')].map(o=>o.value);
T('impostazioni: sessioni 1..6',['1','2','3','4','5','6'].every(v=>eSess.includes(v)));
T('impostazioni: "1 sessione" al singolare',/1 sessione</.test(app().innerHTML));
T('impostazioni: card coach',!!app().querySelector('#sec-coachmode')&&/MODALITÀ COACH/.test(app().textContent));
const src=require('fs').readFileSync(file,'utf8');
T('onboarding: 15/20/30 minuti',/<option value="?15"?>15 minuti/.test(src)&&/<option value="?30"?>30 minuti/.test(src));

// risolutore sessioni brevi
const real=(wo)=>wo.exercises.filter(e=>!e.isWarmup&&!e.isCooldown&&!e.isExtra);
let okAll=true,rows=[];
for(const t of ['cut','bulk'])for(const dur of [15,20,30,45,60])for(const id of ['A','B','C','D','E']){
  w.ST.p.dur=dur;const p={...w.ST.p,t,dur,cardioLevel:2,loc:'gym'};const wo=w.buildWorkout(id,p,3,{},'m',{});
  const ex=real(wo),minSets=Math.min(...ex.map(e=>parseInt(e.sets)||3));
  const fits=wo.estMin<=dur+(t==='bulk'&&dur<=20?6:3);
  if(ex.length<3||minSets<2||(!fits&&dur>=30))okAll=false;
  if(id==='A')rows.push(`${t}/${dur}: ${ex.length} es, ~${wo.estMin} min, serie min ${minSets}${wo.isCircuit?', circuito':''}${wo.cardioExtraMin?', +'+wo.cardioExtraMin+' cardio':''}`);
}
T('15-90 min: sempre ≥3 esercizi, ≥2 serie, nei tempi (≥30)',okAll);rows.forEach(r=>console.log('   '+r));
{w.ST.p.dur=15;const p={...w.ST.p,t:'cut',dur:15,cardioLevel:3};const wo=w.buildWorkout('A',p,3,{},'m',{});
T('15 min cut: warm-up express e circuito',wo.exercises[0].id==='wu_quick'&&wo.isCircuit);
T('15 min: cardio intenso resta extra',wo.cardioExtraMin>0&&wo.exercises.some(e=>e.isExtra));}
{w.ST.p.dur=60;const a=w.buildWorkout('A',{...w.ST.p,t:'cut',dur:60},3,{},'m',{});w.ST.p.dur=30;const b=w.buildWorkout('A',{...w.ST.p,t:'cut',dur:30},3,{},'m',{});w.ST.p.dur=60;
T('30 min tiene più esercizi di prima grazie alla stima del circuito',real(b).length>=4,real(b).length);
T('60 min invariato rispetto a prima (6 esercizi)',real(a).length===6,real(a).length);}

// rotazione su cosa manca
const D=(s)=>s;const L=(arr)=>arr.map(([d,id])=>({d,woId:id,isRest:false}));
// mercoledì 2026-11-04
T('3/sett: lun A → oggi B',w.getNextWorkoutForDay(L([['2026-11-02','A']]),3,'2026-01-01','2026-11-04','total')==='B');
T('3/sett: sett. scorsa solo A,B → lunedì C',w.getNextWorkoutForDay(L([['2026-10-27','A'],['2026-10-29','B']]),3,'2026-01-01','2026-11-02','total')==='C');
T('3/sett: sett. completa A,B,C → lunedì A (la più vecchia)',w.getNextWorkoutForDay(L([['2026-10-26','A'],['2026-10-28','B'],['2026-10-30','C']]),3,'2026-01-01','2026-11-02','total')==='A');
T('5/sett: A,B,C già fatte → A (manca la 2ª)',w.getNextWorkoutForDay(L([['2026-11-02','A'],['2026-11-03','B'],['2026-11-04','C']]),5,'2026-01-01','2026-11-05','total')==='A');
T('5/sett: A,B,C,A → B',w.getNextWorkoutForDay(L([['2026-11-02','A'],['2026-11-03','B'],['2026-11-04','C'],['2026-11-05','A']]),5,'2026-01-01','2026-11-06','total')==='B');
T('1/sett: corpo completo D',w.getNextWorkoutForDay(L([['2026-10-28','D']]),1,'2026-01-01','2026-11-04','total')==='D');
T('focus gambe 2/sett: B poi E',w.getNextWorkoutForDay(L([['2026-11-02','B']]),2,'2026-01-01','2026-11-04','lower')==='E');
T('già fatta oggi → stessa scheda',w.getNextWorkoutForDay(L([['2026-11-04','C']]),3,'2026-01-01','2026-11-04','total')==='C');
T('mai la stessa due volte di fila se c\'è alternativa',w.getNextWorkoutForDay(L([['2026-10-26','A'],['2026-10-28','B'],['2026-10-30','C'],['2026-11-02','C']]),3,'2026-01-01','2026-11-04','total')!=='C');

// taratura carichi
w.currentDateStr='2026-11-04';
const H={'2026-10-28':{ch_test:{kg:50,unit:'kg',ok:true,actualReps:10}},'2026-11-04':{ch_test:{kg:50,unit:'kg',ok:true,actualReps:8}}};
const base=w.getSuggest('ch_test',H,'kg').val;
w.ST.exFeel={ch_test:{f:'hard',d:'2026-11-04'}};const hard=w.getSuggest('ch_test',H,'kg');
T('troppo dura → carico -10%',hard.val<=46&&hard.val>=44&&/troppo dura/.test(hard.hint),hard.val);
w.ST.exFeel={ch_test:{f:'easy',d:'2026-11-04'}};const easy=w.getSuggest('ch_test',H,'kg');
T('facile → sale',easy.val>50,easy.val);
w.ST.exFeel={ch_test:{f:'ok',d:'2026-11-04'}};T('giusta → progressione normale',w.getSuggest('ch_test',H,'kg').val===base);
w.ST.exFeel={ch_test:{f:'hard',d:'2026-10-20'}};T('sensazione vecchia ignorata',w.getSuggest('ch_test',H,'kg').val===base);
const Hs={'2026-11-04':{pl:{sec:60,unit:'sec',ok:true}}};w.ST.exFeel={pl:{f:'hard',d:'2026-11-04'}};
T('plank troppo duro → secondi ridotti',w.getSuggest('pl',Hs,'sec').val===50,w.getSuggest('pl',Hs,'sec').val);

// taratura cardio
w.ST.exFeel={};w.ST.cardioFit=null;
w.ST.p.dur=45;const P={...w.ST.p,t:'cut',dur:45,cardioLevel:2,cardioMode:'hiit'};
const cd0=w.buildWorkout('A',P,3,{},'m',{}).exercises.find(e=>e.isExtra);
T('HIIT standard 30/30 con come fare',/30s intensi \/ 30s/.test(cd0.steps[0])&&cd0.steps.length>=4,cd0.reps);
w.ST.aWo='A';w.ST.p=P;const wo=w.getWo();w.ST.step=wo.exercises.findIndex(e=>e.isExtra);
w.setFeel(cd0.id,'hard');
const cd1=w.buildWorkout('A',P,3,{},'m',{}).exercises.find(e=>e.isExtra);
T('HIIT troppo duro → più corto e 25/35',parseInt(cd1.reps)<parseInt(cd0.reps)&&/25s intensi \/ 35s/.test(cd1.steps[0]),cd1.reps);
const gp=w.__guidePlan(cd1);T('timer guidato legge 25/35',gp&&gp.hiit&&gp.segs[0].sec===25&&gp.segs[1].sec===35);
w.setFeel(cd0.id,'easy');T('cambio idea non somma: facile da livello di oggi → 5',w.ST.cardioFit.i===5);
w.setFeel(cd0.id,'ok');T('giusta: livello invariato',w.ST.cardioFit.i===4);
{const s=w.buildWorkout('A',{...P,cardioMode:'bike'},3,{},'m',{}).exercises.find(e=>e.isExtra);T('bici: come fare dettagliato',s.steps.length>=4&&/sellino/.test(s.steps[0]));}
w.ST.cardioFit=null;w.ST.exFeel={};
// schermata fine esercizio
w.ST.step=1;w.ST.woPhase='exercise_done';w.render();
T('fine esercizio: bottoni troppo dura/giusta/facile',/COM'È ANDATA/.test(app().textContent)&&/Troppo dura/.test(app().textContent));
w.ST.step=0;w.render();T('riscaldamento: niente bottoni',!/COM'È ANDATA/.test(app().textContent));

// come fare IT/EN
const E=w.__EX;const miss=Object.entries(E).filter(([k,e])=>['warmup','cooldown','cardio'].includes(e.cat)&&(!(e.stepsEn||[]).length||(e.stepsEn||[]).length!==(e.steps||[]).length)).map(([k])=>k);
T('riscaldamento/cardio: tutti con passi IT ed EN',!miss.length,miss.join(','));
w.ST.lang='en';{const wo=w.buildWorkout('C',{...P,dur:60},3,{},'m',{});T('EN: riscaldamento in inglese',!/Rotazioni|Camminata|Circonduzioni/.test(wo.exercises[0].steps.join(' ')),wo.exercises[0].id);}
w.ST.lang='it';
{const g=w.__guidePlan({...E.wu_cut,isWarmup:true,id:'wu_cut'});T('timer riscaldamento ancora a passi',g&&g.segs.length===6&&g.segs[0].sec===180);}

// coach
const said=[];w.SpeechSynthesisUtterance=function(t){this.text=t};w.speechSynthesis={speaking:false,pending:false,speak(u){said.push(u.text)},cancel(){},getVoices(){return[{name:'Alice',lang:'it-IT',default:true},{name:'Daniel',lang:'en-GB'}]}};
w.ST.p.coachMode=true;w.ST.aWo=null;w.Coach.prev=null;w.Coach.tick();
w.startWo('A');w.ST.woPaused=null;w.Coach.tick();
T('coach: saluto + spiegazione primo esercizio',said.some(s=>/Sono il tuo coach/.test(s)&&/riscaldamento/.test(s)),said[said.length-1]);
T('coach: avatar visibile',w.document.getElementById('coachDock').classList.contains('on')&&/data:image\/svg\+xml/.test(w.document.getElementById('coachDock').innerHTML));
w.ST.step=1;w.ST.woPhase='ready';w.Coach.tick();
T('coach: spiega l\'esercizio (serie, come si fa)',/Esercizio 2 di/.test(said[said.length-1])&&/Come si fa/.test(said[said.length-1]),said[said.length-1].slice(0,120));
w.ST.woPhase='active';w.ST.setElapsed=0;w.ST.__guide=null;w.Coach.tick();T('coach: via alla serie',/Serie 1 di/.test(said[said.length-1]));
for(const s of [1,4,7]){w.ST.setElapsed=s;w.Coach.tick();}T('coach: conta le ripetizioni',said.slice(-3).join(',')==='1,2,3',said.slice(-3).join(','));
w.ST.woPhase='rest';w.ST.tmr=60;w.ST.currentSet=1;w.Coach.tick();T('coach: incoraggia e dà il recupero',/Recupera 60 secondi/.test(said[said.length-1]));
w.ST.tmr=10;w.Coach.tick();T('coach: avviso 10 secondi',/Dieci secondi/.test(said[said.length-1]));
w.ST.woPhase='ready';w.Coach.tick();T('coach: serie successiva',/Serie 2 di/.test(said[said.length-1]));
w.ST.woPhase='exercise_done';w.Coach.tick();T('coach: complimenti e chiede com\'è andata',/Ottimo lavoro/.test(said[said.length-1])&&/troppo dura, ok o facile/.test(said[said.length-1]));
w.ST.woPaused={at:Date.now()};w.Coach.tick();T('coach: pausa',/Pausa/.test(said[said.length-1]));w.ST.woPaused=null;
// timer guidato (plank / riscaldamento)
w.ST.step=0;w.ST.woPhase='ready';w.Coach.tick();w.startSet();w.ST.setElapsed=0;w.Coach.tick();w.Coach.tick();
T('coach: legge i passi del riscaldamento',/Corda|Jumping|Camminata|Circonduzioni|Slanci|Spalle|Squat|braccia|Rotazioni|Affondi/.test(said[said.length-1]),said[said.length-1].slice(0,80));
// fine allenamento
w.ST.wLog=[];w.ST.sheet='workoutDone';w.ST.sheetData={vol:3200,kcal:300,dur:52,exCount:8,prCount:2,woName:'A'};w.ST.aWo=null;w.Coach.tick();
const fin=said[said.length-1];T('coach finale: complimenti, riepilogo, saluto',/bravissimo/.test(fin)&&/52 minuti/.test(fin)&&/2 record personali/.test(fin)&&/ciao!/.test(fin),fin.slice(0,160));
w.ST.lang='en';w.ST.aWo='A';w.ST.sheet=null;w.Coach.prev={a:'A',st:0,set:0,ph:'ready',p:false};w.ST.sheet='workoutDone';w.ST.aWo=null;w.Coach.tick();T('coach EN finale',/You did great/.test(said[said.length-1])&&/bye!/.test(said[said.length-1]));
w.ST.lang='it';
// silenzio
const n0=said.length;w.Coach.muted=true;w.Coach.say('prova');T('coach silenziato non parla',said.length===n0);w.Coach.muted=false;
w.ST.p.coachMode=false;w.Coach.say('prova');T('coach spento non parla',said.length===n0);
// persistenza
const s=w.defST();T('defST: exFeel e cardioFit','exFeel' in s&&'cardioFit' in s);
T('payload salvataggio con exFeel/cardioFit',/exFeel: ST\.exFeel|exFeel:ST\.exFeel/.test(src)&&/cardioFit: ST\.cardioFit|cardioFit:ST\.cardioFit/.test(src));
T('tour IT/EN aggiornato',/modalità Coach/.test(src)&&/Coach mode/.test(src));
T('versione S75+',/build-SESSION7[5-9]/.test(src));
