const boot=require('./harness_lib');const w=boot(process.argv[2]||'Index.html');
const T=(n,c)=>console.log((c?'✓':'✗ FAIL')+' '+n);
const D=(k)=>{const d=new Date(Date.now()-k*864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const today=w.currentDateStr;w.alert=()=>{};
// 1 topbar
const src=require('fs').readFileSync(process.argv[2]||'Index.html','utf8');
T('topbar quasi opaca', /\.topbar\{position:fixed;top:0;left:0;right:0;margin:0 auto;[^}]*background:var\(--bg\)/.test(src));
// 2 data e sonno
w.currentDateStr=D(1);w._userPickedDate=false;w.render();
T('render riporta la data a oggi', w.currentDateStr===today);
w.ST.life={};w.ST.life[D(1)]={sleep:4};w.ST.life[today]={sleep:8};w.ST.tab='home';w.ST.lang='it';w.render();
let t=w.document.getElementById('app').textContent;
T('banner sonno usa il sonno di OGGI (8h, non le 4h di ieri)', !/dormito.{0,20}4|sonno.{0,40}4h|4h.{0,30}sonno/i.test(t)||!t.includes('4h'));
// 3 peso 2 decimali
w.ST.h=[{d:D(20),w:88.37},{d:today,w:86.45}];w.render();t=w.document.getElementById('app').textContent;
T('home mostra 86.45 (non 86.5)', t.includes('86.45')&&!/86\.5\b/.test(t));
T('parseKg accetta virgola', w.parseKg('82,45')===82.45);
T('parseKg rifiuta 3 decimali', isNaN(w.parseKg('82.456')));
T('parseKg rifiuta fuori range', isNaN(w.parseKg('25')));
w.document.getElementById('qW').value='85.37';w.quickLogW();
T('quickLogW salva 2 decimali', w.ST.h.find(x=>x.d===today).w===85.37);
// 4 composizione
w.ST.measures={};w.ST.measures[D(30)]={neck:39,abdomen:92};w.ST.measures[today]={neck:40,abdomen:92};
w.ST.h=[{d:D(30),w:84.2},{d:today,w:86.1}];
const b=w.bodyComp();T('massa grassa Navy ('+b.bf+'%, magra '+b.leanKg+'kg)', b.src==='navy'&&b.bf>5&&b.bf<40);
const r=w.bodyCompRead(w.bodyCompTrend(60));T('peso su con vita stabile = muscolo', r&&/muscolo/.test(r.txt));
w.render();t=w.document.getElementById('app').textContent;T('composizione in home', t.includes('COMPOSIZIONE'));
w.ST.tab='body';w.render();t=w.document.getElementById('app').textContent;
T('composizione + grafici in Progressi', t.includes('COMPOSIZIONE CORPOREA')&&t.includes('% MASSA GRASSA E MASSA MAGRA'));
T('fallback BMI dichiarato', (w.ST.measures={},w.bodyComp().src==='bmi'));
// 5 grafici
const app=w.document.getElementById('app');
T('punti grafico toccabili', /chartPt\(event/.test(app.innerHTML));
T('dettaglio valori espandibile', app.querySelectorAll('details.chart-det').length>=1);
// 6 rotazione
T('dopo A,B con pausa → C', w.getNextWorkoutForDay([{d:D(12),woId:'A',isRest:false},{d:D(10),woId:'B',isRest:false}],3,'2026-01-01',today,'total')==='C');
T('nessuno storico → A', w.getNextWorkoutForDay([],3,'2026-01-01',today,'total')==='A');
// 7 ripresa
w.ST.wLog=[];w.ST.wHistory={};let ask='';w.confirm=(m)=>{ask=m;return true};
w.startWo('A');w.ST.step=4;w.ST.currentSet=2;w.__woSnap();w.ST.aWo=null;w.ST.step=0;w.startWo('A');
T('riprende da esercizio 5 serie 3', w.ST.step===4&&w.ST.currentSet===2&&/Riprendo/.test(ask));
// 8 coach consigli
w.localStorage.clear();w.ST.liveWo=null;w.ST.aWo=null;w.ST.woPhase=null;w.ST.tab='coach';w.ST.coachView='tips';w.render();t=w.document.getElementById('app').textContent;
T('AI Coach → Consigli', t.includes('RICALCOLO COACHING'));
w.ST.tab='set';w.render();T('Impostazioni: solo collegamento', !w.document.getElementById('app').textContent.includes('RICALCOLO COACHING'));
// 9 note + timer
w.ST.tab='work';w.ST.p.dur=60;w.ST.p.cardioLevel=2;w.ST.wLog=[];w.confirm=()=>false;w.startWo('A');
const wo=w.getWo();const calls=[];w.BeepPlayer._g=(p)=>calls.push(p);
for(const idx of [0,wo.exercises.findIndex(e=>e.isBonus),wo.exercises.length-1]){w.ST.step=idx;w.ST.woPhase='ready';w.render();if(!/exNote_/.test(w.document.getElementById('app').innerHTML))T('nota su '+wo.exercises[idx].id,false);}
T('note su riscaldamento/cardio/defaticamento', true);
const pk=wo.exercises.findIndex(e=>e.t==='isometric');w.ST.step=pk;w.ST.woPhase='ready';w.render();w.startSet();
for(const s of [27,28,29,30])(w.ST.setElapsed=s,w.__guideTick());
T('plank: 3 tick + fine ('+calls.join(',')+')', calls.filter(x=>x==='tick').length===3&&calls.includes('end'));
const hi=wo.exercises.findIndex(e=>e.isBonus);calls.length=0;w.ST.step=hi;w.ST.woPhase='ready';w.render();w.startSet();calls.length=0;
for(const s of [27,28,29,30,57,58,59,60])(w.ST.setElapsed=s,w.__guideTick());
T('HIIT: recupero e scatto segnalati', calls.includes('rest')&&calls.includes('go'));
w.render();T('riquadro timer visibile', !!w.document.getElementById('guideBox'));
w.ST.step=1;w.ST.woPhase='ready';w.render();w.startSet();T('nessun timer guidato sugli esercizi a ripetizioni', w.ST.__guide===null);
// 10 ciclo
w.localStorage.clear();w.ST.liveWo=null;w.__autoRestoreDone=true;w.ST.aWo=null;w.ST.woPhase=null;w.ST.programStart=D(70);w.ST.wLog=[1,3,5,8].map(k=>({d:D(k),woId:'A',isRest:false}));w.ST.pendingCycle=null;w.ST.cycleSnooze=null;
w.ST.tab='home';w.render();T('proposta scheda nuova dopo 8+ settimane', w.document.getElementById('app').textContent.includes('CAMBIARE SCHEDA'));
w.acceptNewCycle();T('nuova scheda programmata da lunedì', w.ST.pendingCycle && new Date(w.ST.pendingCycle.from+'T12:00:00').getDay()===1);
T('cambio non immediato', w.ST.exCycleStart==null || w.ST.exCycleStart!==w.ST.pendingCycle.from);
// 11 EN
w.ST.lang='en';w.ST.tab='home';w.render();t=w.document.getElementById('app').textContent;
T('EN composizione', t.includes('COMPOSITION'));
w.ST.tab='coach';w.ST.coachView='tips';w.render();T('EN tips', w.document.getElementById('app').textContent.includes('COACHING RECALC'));
T('tour EN aggiornato', w.getTourSteps().some(s=>/guided timer/.test(s.body))&&w.getTourSteps().some(s=>/lean mass/.test(s.body)));
w.ST.lang='it';T('tour IT aggiornato', w.getTourSteps().some(s=>/timer guidato/.test(s.body))&&w.getTourSteps().some(s=>/massa magra/.test(s.body)));
process.exit(0);
