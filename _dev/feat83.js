const boot=require('./harness_lib');const file=process.argv[2]||'Index-SORGENTE.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));let alerts=[];w.alert=(m)=>alerts.push(m);w.confirm=()=>true;w.saveU=()=>Promise.resolve(true);
w._userPickedDate=true;w.currentDateStr='2026-11-05';const src=require('fs').readFileSync(file,'utf8');const app=()=>w.document.getElementById('app');
w.ST.p={...w.ST.p,t:'bulk',dur:60,sessions:3,focus:'total',loc:'gym',customWorkouts:[]};w.ST.wHistory={};
// 0) circuito solo quando serve, con kg e ripetizioni segnabili
let wo=w.buildWorkout('A',w.ST.p,3,{},'m',{});T('serie normali (60 min massa): niente circuito',!wo.isCircuit&&wo.exercises.every(e=>!e.circ));
w.ST.p.t='cut';w.ST.p.dur=30;w.startWo('A');w.ST.woPaused=null;wo=w.getWo();w.ST.step=wo.circuits[0][1];w.ST.woPhase='ready';w.startSet();w.render();
T('circuito: campi kg e ripetizioni presenti per ogni esercizio',!!w.document.getElementById('wkW')&&!!w.document.getElementById('wkReps'));
w.document.getElementById('wkW').value='22,5'.replace(',','.');w.document.getElementById('wkReps').value='9';const cid=w.getEx().id;w.completeSet();
T('circuito: kg e ripetizioni registrati per l\'esercizio',w.ST.wHistory['2026-11-05'][cid].kg===22.5&&w.ST.wHistory['2026-11-05'][cid].actualReps===9);
w.closeWo();w.ST.p.t='bulk';w.ST.p.dur=60;
// 1) lettore locale
const OCR=`SCHEDA MASSA - Marco
Giorno 1
1. Panca piana con bilanciere 4x8 70kg rec 2'
Croci ai cavi 3 x 12 15 kg rec 60"
Lat machine 4x10 50 kg (presa larga)
Nota: fermo 1 secondo al petto
Giorno 2
Squat 5x5 100kg rec 3'
Pressa 45° 4 serie da 12 140 kg
Plank 3x45" `;
const L=w.__parseWorkoutLocal(OCR);
T('lettore locale: 2 schede separate (Giorno 1 / Giorno 2)',L.length===2&&L[0].name==='Giorno 1'&&L[1].name==='Giorno 2',L.map(x=>x.name+':'+x.exercises.length).join(' '));
const p0=L[0].exercises[0];T('serie, ripetizioni, kg e recupero letti',p0.sets===4&&p0.reps==='8'&&p0.kg===70&&p0.rest===120,JSON.stringify(p0));
T('recupero in secondi (60") e kg con spazio',L[0].exercises[1].rest===60&&L[0].exercises[1].kg===15&&L[0].exercises[1].reps==='12');
T('note tra parentesi e "Nota:" sulla riga sotto',/presa larga/.test(L[0].exercises[2].note)&&/fermo 1 secondo/.test(L[0].exercises[2].note),L[0].exercises[2].note);
T('"4 serie da 12" e tenute in secondi',L[1].exercises[1].sets===4&&L[1].exercises[1].reps==='12'&&L[1].exercises[1].kg===140&&L[1].exercises[2].reps==='45s',JSON.stringify(L[1].exercises.slice(1)));
// 2) riconoscimento esercizi
const m1=w.__matchExercise('Panca piana con bilanciere'),m2=w.__matchExercise('Lat machine'),m3=w.__matchExercise('Rotazioni del pippo strano');
T('riconosce panca piana',m1.length&&/panca piana/i.test(w.__EX[m1[0].id].name),m1[0]&&w.__EX[m1[0].id].name);
T('riconosce lat machine',m2.length&&/lat/i.test(w.__EX[m2[0].id].name));
T('esercizio sconosciuto → personalizzato',!m3.length||m3[0].sc<0.5);
// 3) interpretazione con AI (simulata) e fallback
w.fetch=async()=>({json:async()=>({content:[{text:'```json\n{"workouts":[{"name":"Push","exercises":[{"name":"Panca piana","sets":4,"reps":"6-8","kg":72.5,"rest":"2\'30","note":"tempo 3-1-1"},{"name":"Alzate laterali","sets":3,"reps":"15","kg":null,"rest":60,"note":null}]}]}\n```'}]})});
let ws=await0();async function await0(){return null}
(async()=>{
ws=await w.__interpretWorkoutText('qualcosa letto 4x8');T('AI: JSON interpretato (recupero 2\'30 = 150s)',ws.length===1&&ws[0].via==='ai'&&ws[0].exercises[0].kg===72.5&&ws[0].exercises[0].rest===150,JSON.stringify(ws[0].exercises[0]));
w.fetch=async()=>{throw new Error('offline')};ws=await w.__interpretWorkoutText(OCR);T('AI non raggiungibile → lettore locale',ws.length===2&&ws[0].via==='local');
// 4) import completo (lettura file simulata)
w.ST.p.customWorkouts=[{id:'cw_1',name:'Giorno 1',emoji:'🛠️',exercises:[{exId:Object.keys(w.__EX).find(k=>w.__EX[k].cat==='chest'),sets:3,reps:'10',rest:90}]}];
w.__readWorkoutFile=async()=>OCR;w.ST.tab='set';
await w.importWorkoutFiles({files:[{name:'scheda.jpg',type:'image/jpeg'}]});
T('dopo l\'import si apre l\'editor con la scheda letta',w.ST.sheet==='customWorkout'&&w.ST.sheetData.imported&&w.ST.sheetData.qTot===2);
T('nome univoco (esiste già "Giorno 1")',w.ST.sheetData.draft.name==='Giorno 1 2',w.ST.sheetData.draft.name);
w.render();const h=app().innerHTML+w.document.body.innerHTML;
T('editor: kg, note, in uso, letto/riconosciuto come',/>KG</.test(h)&&/NOTE/.test(h)&&/IN USO/.test(h)&&/RICONOSCIUTO COME/.test(h)&&/Scheda letta dal file \(1 di 2\)/.test(h));
const d=w.ST.sheetData.draft;T('kg e note precompilati',d.exercises[0].kg===70&&/presa larga/.test(d.exercises[2].note));
w.updateExerciseInDraft(0,'kg','72,5');w.updateExerciseInDraft(0,'note','scendi lento');T('modifico kg e note',d.exercises[0].kg===72.5&&d.exercises[0].note==='scendi lento');
w.toggleDraftActive(1);T('escludo un esercizio',d.exercises[1].active===false);
const c0=d.exercises[2].cands;w.setDraftMatch(2,'__custom');T('cambio riconoscimento → personalizzato',d.exercises[2].isCustom&&d.exercises[2].customName==='Lat machine');
c0.length&&w.setDraftMatch(2,c0[0]);T('…e di nuovo dalla libreria',!c0.length||(!d.exercises[2].isCustom&&d.exercises[2].exId===c0[0]));
w.removeExerciseFromDraft(1);T('elimino un esercizio',d.exercises.length===2);
w.document.getElementById('cwName').value='giorno 1';alerts=[];w.saveCustomWorkout();T('nome già usato (maiuscole/minuscole) → bloccato',alerts.some(a=>/Esiste già/.test(a))&&w.ST.sheet==='customWorkout');
w.document.getElementById('cwName').value='Petto Marco';w.saveCustomWorkout();
T('salvata e si apre la seconda scheda letta',w.ST.p.customWorkouts.some(x=>x.name==='Petto Marco')&&w.ST.sheet==='customWorkout'&&w.ST.sheetData.qIdx===2&&w.ST.sheetData.draft.name==='Giorno 2');
w.ST.sheetData.draft.exercises.forEach((e,i)=>i>0&&(e.active=false));w.render();w.document.getElementById('cwName').value='Gambe Marco';w.saveCustomWorkout();
T('seconda salvata, coda finita',w.ST.p.customWorkouts.some(x=>x.name==='Gambe Marco')&&!w.ST.sheet);
const g=w.ST.p.customWorkouts.find(x=>x.name==='Gambe Marco');w.ST.tab='set';w.render();T('elenco: esercizi in uso/esclusi',/1 in uso, 2 esclusi/.test(app().textContent));
// 5) allenamento con scheda importata
const pm=w.ST.p.customWorkouts.find(x=>x.name==='Petto Marco');const bw=w.buildWorkout(pm.id,w.ST.p,3,{},'m',{});const R=bw.exercises.filter(e=>!e.isWarmup&&!e.isCooldown);
T('allenamento: solo esercizi in uso, note visibili',R.length===2&&/Nota della scheda: scendi lento/.test(R[0].cues[0]));
const sg=w.getSuggest(R[0].id,{},'kg');T('carico di partenza dai kg della scheda',sg.val===72.5&&/Dalla tua scheda/.test(sg.hint),JSON.stringify(sg));
const gw=w.buildWorkout(g.id,w.ST.p,3,{},'m',{});T('scheda con esclusi: solo quelli in uso',gw.exercises.filter(e=>!e.isWarmup&&!e.isCooldown).length===1);
w.deleteCustomWorkout(g.id);T('elimino una scheda intera',!w.ST.p.customWorkouts.some(x=>x.id===g.id));
T('importa da foto/PDF anche dall\'elenco schede',/IMPORTA DA FOTO O PDF/.test(app().textContent));
T('tour IT/EN aggiornato',/importare le tue schede da foto o PDF/.test(src)&&/import your programs from a photo or PDF/.test(src));
T('versione S83+',/build-SESSION(8[3-9]|9\d)/.test(src));
})();
