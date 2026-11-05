const boot=require('./harness_lib');const file=process.argv[2]||'Index-SORGENTE.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));w.alert=()=>{};w.confirm=()=>true;w.saveU=()=>Promise.resolve(true);
w._userPickedDate=true;w.currentDateStr='2026-11-05';const src=require('fs').readFileSync(file,'utf8');const app=()=>w.document.getElementById('app');
const said=[];w.SpeechSynthesisUtterance=function(t){this.text=t;this.pitch=1;this.rate=1};w.speechSynthesis={speaking:false,pending:false,speak(u){said.push(u)},cancel(){},getVoices(){return[{name:'Alice',lang:'it-IT',default:true}]},addEventListener(){}};
const last=()=>said.length?said[said.length-1].text:'';
w.ST.p={...w.ST.p,t:'cut',dur:30,cardioLevel:0,sessions:3,focus:'total',loc:'gym',coachMode:false};w.ST.wLog=[];w.ST.wHistory={};w.ST.exFeel={};
// 1) struttura del circuito
let wo=w.buildWorkout('A',w.ST.p,3,{},'m',{});const R=wo.exercises.filter(e=>!e.isWarmup&&!e.isCooldown&&!e.isExtra&&e.t!=='cardio');
T('30 min in definizione: circuito a gruppi',wo.isCircuit&&wo.circuits&&wo.circuits.length>=1&&R.every(e=>e.circ),wo.circuits&&wo.circuits.map(g=>g.length).join('+'));
T('gruppi da 2 a 4 esercizi',wo.circuits.every(g=>g.length>=2&&g.length<=4));
T('15s per cambiare esercizio, recupero a fine giro',R.every(e=>e.rest===15&&e.circ.change===15&&e.circ.roundRest>=30),R[0].circ.roundRest);
let bad=[];for(const t of ['cut','maintain'])for(const dur of [15,20,30])for(const id of ['A','B','C','D','E']){w.ST.p.dur=dur;const x=w.buildWorkout(id,{...w.ST.p,t,dur},3,{},'m',{});if(x.estMin>dur+3)bad.push(t+dur+id+'='+x.estMin);}
T('circuiti nei tempi (max +3 min)',!bad.length,bad.join(' '));w.ST.p.dur=30;
// 2) flusso: una serie per esercizio a rotazione, giri ripetuti
w.ST.p.dur=30;w.startWo('A');w.ST.woPaused=null;wo=w.getWo();const G=wo.circuits[0];
w.ST.step=G[0];w.ST.currentSet=0;w.ST.woPhase='ready';
const seq=[],rests=[];let guard=0;
while(guard++<60&&w.ST.woPhase!=='exercise_done'){seq.push(w.ST.step+':'+w.ST.currentSet);w.startSet();const a=w.document.getElementById('wkW');a&&(a.value='20');const r=w.document.getElementById('wkReps');r&&(r.value='10');w.completeSet();if(w.ST.woPhase==='rest'){rests.push(w.ST.circRest+w.ST.tmr);w.skipRest();}}
const sets=G.map(i=>parseInt(wo.exercises[i].sets));const exp=[];for(let r=0;r<Math.max(...sets);r++)G.forEach((i,p)=>{if(sets[p]>r)exp.push(i+':'+r)});
T('ordine: es.1 → es.2 → es.3, poi giro successivo',seq.join(',')===exp.join(','),seq.join(','));
T('cambio 15s tra esercizi, recupero lungo solo a fine giro',rests.filter(x=>/^change15$/.test(x)).length===exp.length-Math.max(...sets)&&rests.filter(x=>/^round/.test(x)).length===Math.max(...sets)-1,rests.join(','));
T('fine circuito: schermata finale sull\'ultimo esercizio del gruppo',w.ST.woPhase==='exercise_done'&&w.ST.step===G[G.length-1]);
T('tutti gli esercizi del circuito registrati',G.every(i=>(w.ST.wHistory['2026-11-05']||{})[wo.exercises[i].id]));
w.render();T('striscia circuito con giri e esercizi',/CIRCUITO/.test(app().textContent)&&/Circuito completato/.test(app().textContent));
T('sensazioni per ogni esercizio del circuito, OK già scelto',(app().innerHTML.match(/data-def="1"/g)||[]).length===G.length);
w.advanceExercise();T('avanti → esercizio dopo il circuito',w.ST.step===G[G.length-1]+1&&w.ST.woPhase==='ready');
T('OK registrato da solo per gli esercizi del circuito',G.every(i=>{const f=w.ST.exFeel[wo.exercises[i].id];return f&&f.f==='ok'&&f.auto}));
// ripresa a metà circuito
w.ST.step=G[1];w.ST.currentSet=1;w.__woSnap();const sn=w.__woSnapGet();T('ripresa a metà circuito: esercizio e giro salvati',sn.step===G[1]&&sn.set===1);
// 3) OK predefinito anche fuori dai circuiti
w.ST.p.dur=60;w.ST.p.t='bulk';w.ST.exFeel={};w.startWo('B');w.ST.woPaused=null;w.ST.step=1;w.ST.woPhase='exercise_done';w.render();
T('fine esercizio: OK già evidenziato',/data-def="1"/.test(app().innerHTML)&&/#4ade80;background:#4ade8022/.test(app().innerHTML));
const id1=w.getEx().id;w.advanceExercise();T('avanti senza toccare → OK salvato',w.ST.exFeel[id1]&&w.ST.exFeel[id1].f==='ok');
w.ST.step=2;w.ST.woPhase='exercise_done';const id2=w.getEx().id;w.setFeel(id2,'hard');w.advanceExercise();T('se scelgo "troppo dura" resta quella',w.ST.exFeel[id2].f==='hard');
// cardio: OK di default fa salire piano il livello
w.ST.cardioFit={i:2,ok:1};w.ST.p.t='cut';w.ST.p.dur=45;w.ST.p.cardioLevel=2;w.startWo('A');w.ST.woPaused=null;const wc=w.getWo();w.ST.step=wc.exercises.findIndex(e=>e.isExtra);w.ST.woPhase='exercise_done';w.advanceExercise();
T('cardio con OK di default: livello sale piano (2 OK → +1)',w.ST.cardioFit.i===3&&w.ST.cardioFit.ok===0,JSON.stringify(w.ST.cardioFit));
// 4) Esci: torna subito al menu anche se il cloud è lento
w.saveU=()=>new Promise(()=>{});w.startWo('C');w.ST.woPaused=null;w.ST.tab='work';w.render();w.closeWo();
T('ESCI: allenamento chiuso e menu mostrato subito',!w.ST.aWo&&!/ESCI DALL'ALLENAMENTO|wo-head/.test(app().innerHTML));
w.__autoRestoreDone=false;w.__autoRestoreWo();T('…e non si riapre da solo',!w.ST.aWo);
w.saveU=()=>Promise.resolve(true);
// 5) coach professionale
w.ST.p.coachMode=true;w.ST.p.coachAvatar='m';w.ST.p.t='bulk';w.ST.p.dur=60;w.ST.wHistory={'2026-10-29':{}};
w.startWo('A');w.ST.woPaused=null;let W=w.getWo();const ex=W.exercises[1];w.ST.wHistory['2026-10-29'][ex.id]={kg:40,actualReps:8,unit:'kg',ok:true};
w.Coach.prev=null;w.Coach.tick();w.Coach.tick();w.ST.step=1;w.ST.woPhase='ready';w.Coach.tick();
w.ST.woPhase='active';w.ST.setElapsed=0;w.ST.__guide=null;w.Coach.tick();
T('coach: obiettivo concreto prima della serie (chili e ripetizioni)',/chili/.test(last())&&/ripetizioni/.test(last())&&/Serie 1 di/.test(last()),last());
T('coach: consiglio di respirazione/tecnica alla prima serie',/Inspira|Addome|Controlla/.test(last()));
const tgt=Math.round(w.parseMeanReps(ex.reps));const half=Math.floor(tgt/2);
for(let s2=1;s2<=3*half+1;s2++){w.ST.setElapsed=s2;w.Coach.tick();}
T('coach: richiamo tecnico a metà serie',said.some(u=>new RegExp('^'+half+'\\. ').test(u.text)),said.slice(-3).map(u=>u.text).join(' | '));
w.ST.wHistory['2026-11-05']={[ex.id]:{kg:42.5,actualReps:8,unit:'kg',ok:true}};w.ST.woPhase='exercise_done';w.Coach.tick();
T('coach: confronto con l\'ultima volta',/più 2,5 chili/.test(last())&&/resta su OK/.test(last()),last());
w.ST.step=2;w.ST.currentSet=0;w.ST.woPhase='ready';w.Coach.tick();w.ST.woPhase='active';w.Coach.tick();w.ST.woPhase='rest';w.ST.tmr=90;w.ST.currentSet=1;w.Coach.tick();
const ex2=W.exercises[2];w.ST.wHistory['2026-11-05'][ex2.id]={kg:30,actualReps:20,unit:'kg',ok:true};w.ST.tmr=44;w.Coach.tick();
T('coach: a metà recupero consiglio sul carico',/aggiungi un po' di carico/.test(last()),last());
// circuito parlato
w.ST.p.t='cut';w.ST.p.dur=30;w.startWo('C');w.ST.woPaused=null;W=w.getWo();const g0=W.circuits[0];w.Coach.prev={a:'C',st:0,set:0,ph:'exercise_done',p:false};w.ST.step=g0[0];w.ST.currentSet=0;w.ST.woPhase='ready';w.Coach.tick();
T('coach circuito: spiega come funziona',/Circuito/.test(last())&&/15 secondi per cambiare/.test(last())&&/giri/.test(last()),last().slice(0,140));
w.startSet();w.Coach.tick();w.completeSet();w.Coach.tick();T('coach circuito: "Cambio! Ora …"',/Cambio! Ora/.test(last()),last());
// finale
w.ST.wLog=[{d:'2026-10-29',woId:'A',t:'A',vol:3000,isRest:false},{d:'2026-11-05',woId:'A',t:'A',vol:3300,isRest:false,estMin:50}];w.ST.p.t='bulk';
w.Coach.prev={a:'A',st:5,set:0,ph:'exercise_done',p:false};w.ST.aWo=null;w.ST.sheet='workoutDone';w.ST.sheetData={vol:3300,kcal:350,dur:52,exCount:7,prCount:1};w.Coach.tick();
T('finale pro: volume vs ultima volta, record, calorie, tempi, consiglio, prossima sessione',/più 10 per cento/.test(last())&&/record personale/.test(last())&&/350 calorie/.test(last())&&/Tempi rispettati/.test(last())&&/proteine/.test(last())&&/Prossima sessione/.test(last()),last());
// voce uomo
w.ST.p.coachAvatar='m';w.Coach.say('x',{int:true});const u=said[said.length-1];T('uomo: tono al minimo e ritmo più lento',u.pitch===0.5&&u.rate<=0.86,u.pitch+'/'+u.rate);
T('tour IT/EN aggiornato',/circuito a giri/.test(src)&&/circuit in rounds/.test(src)&&/già selezionato OK/.test(src));
T('versione S82',/build-SESSION82/.test(src));
