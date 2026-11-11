const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S95+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=95);
T('OCR: righe intere (psm 6)',/tessedit_pageseg_mode: "6"/.test(src)||/tessedit_pageseg_mode:"6"/.test(src));
const w=require('./harness_lib')(file);w.saveU=()=>Promise.resolve(true);w.saveBg=()=>{};w.save=()=>Promise.resolve();const D=w.document,app=()=>D.getElementById('app');
try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
const P=(t)=>w.__parseWorkoutLocal(t),names=(r)=>r.flatMap(x=>x.exercises.map(e=>e.name));
// 1) tabella senza "x"
let r=P('Panca piana 4 10 90"\nRematore bilanciere 4 8\nLat machine 3 12\nCurl manubri 3 10');
T('tabella "nome serie reps": 4 esercizi',names(r).length===4&&r[0].exercises[0].sets===4&&r[0].exercises[0].reps==='10'&&r[0].exercises[2].reps==='12',JSON.stringify(names(r)));
// 2) nomi e numeri su righe alternate
r=P('Panca piana\n4x10\nCroci ai cavi\n3x12\nPush down\n3x15');
T('nome e numeri su righe diverse',names(r).join('|')==='Panca piana|Croci ai cavi|Push down'&&r[0].exercises[1].reps==='12',names(r).join('|'));
// 3) colonne lette separatamente
r=P('Squat\nLeg press\nAffondi\nCalf raise\n4x8\n4x10\n3x12\n4x15');
T('colonne separate: nessun esercizio perso, numeri in ordine',names(r).length===4&&r[0].exercises[0].reps==='8'&&r[0].exercises[3].reps==='15'&&r[0].exercises[2].sets===3,JSON.stringify(r[0].exercises.map(e=>e.name+':'+e.sets+'x'+e.reps)));
// 4) nome senza numeri tra due esercizi completi
r=P('Panca piana 4x10\nPullover manubrio\nDip alle parallele 3x10');
T('nome senza numeri non viene perso',names(r).length===3&&names(r)[1]==='Pullover manubrio',names(r).join('|'));
// 5) "Pull down" non è un titolo
r=P('Giorno 1\nPull down 3x12\nPush press 4x6\nGiorno 2\nStacco 5x5');
T('"Pull down"/"Push press" restano esercizi; giorni separati',r.length===2&&r[0].exercises.length===2&&r[1].exercises[0].name==='Stacco',JSON.stringify(r.map(x=>x.name+':'+x.exercises.length)));
// 6) note
r=P('Panca 4x8\nNota: fermo 2s al petto');T('note agganciate',/fermo 2s/.test(r[0].exercises[0].note||''));
// 7) unione AI + locale
w.fetch=async()=>({json:async()=>({content:[{text:JSON.stringify({workouts:[{name:'A',exercises:[{name:'Panca piana',sets:4,reps:'10'},{name:'Curl manubri',sets:3,reps:'10'}]}]})}]})});
(async()=>{
const ws=await w.__interpretWorkoutText('Panca piana 4x10\nRematore bilanciere 4x8\nLat machine 3x12\nCurl manubri 3x10');
const nn=ws[0].exercises.map(e=>e.name);
T('AI + locale: recupera gli esercizi saltati dall\'AI, in ordine',nn.length===4&&nn[1]==='Rematore bilanciere'&&nn[2]==='Lat machine'&&ws[0].exercises[1].chk===true&&!ws[0].exercises[0].chk,nn.join('|'));
const d=w.__toDraft(ws[0],0);T('bozza: esercizio recuperato segnato da controllare',d.exercises[1].chk===true&&!d.exercises[0].chk);
w.ST.sheet='customWorkout';w.ST.sheetData={draft:d,isNew:true,imported:true,qIdx:1,qTot:1};w.ST.tab='work';w.render();
T('avviso "da controllare" visibile',/letto con meno sicurezza/.test(app().textContent));
// ── duplica ──
const n0=d.exercises.length;w.duplicateExerciseInDraft(0);
T('duplica: copia subito sotto',d.exercises.length===n0+1&&d.exercises[1].dup===true&&d.exercises[1].exId===d.exercises[0].exId);
T('duplica: tasto per ogni esercizio',app().querySelectorAll('button[onclick^="duplicateExerciseInDraft"]').length===d.exercises.length);
T('duplica: scelta variante o nome proprio',/COPIA: SCEGLI LA VARIANTE/.test(app().textContent));
w.__cwSetVar(1,'__custom');T('copia → personalizzato con nome modificabile',d.exercises[1].isCustom&&/variante/.test(d.exercises[1].customName)&&!!app().querySelector('input[oninput^="updateExerciseInDraft(1,\'customName\'"]'));
w.updateExerciseInDraft(1,'customName','Panca presa stretta');T('rinomina copia',d.exercises[1].customName==='Panca presa stretta');
const alt=Object.keys(w.eval('EX')).find(k=>w.eval('EX')[k].cat==='chest'&&k!==d.exercises[0].exId);w.__cwSetVar(1,alt);T('copia → altra variante della libreria',d.exercises[1].exId===alt&&!d.exercises[1].isCustom);
// ── libreria ──
T('libreria: ricerca + filtri muscolo',!!D.getElementById('cwLibQ')&&D.getElementById('cwLibChips').children.length===12&&!D.getElementById('cwExSelect'));
w.__cwLibQ('panca');const nres=D.getElementById('cwLibRes').querySelectorAll('button').length;T('libreria: ricerca filtra senza ridisegnare',nres>0&&D.getElementById('cwLibQ').isConnected,nres);
w.__cwLibQ('xyzzy');T('libreria: nessun risultato spiegato',/Nessun esercizio trovato per «xyzzy»/.test(D.getElementById('cwLibRes').textContent)&&/crea il tuo/.test(D.getElementById('cwLibRes').textContent));
w.__cwLibQ('');w.__cwLibCat('biceps');const ids=[...D.getElementById('cwLibRes').querySelectorAll('button')].map(b=>b.getAttribute('onclick').match(/'(.+)'/)[1]);T('libreria: filtro bicipiti',ids.length>0&&ids.every(k=>w.eval('EX')[k].cat==='biceps'));
const n1=d.exercises.length;w.__cwLibAdd(ids[0]);T('libreria: un tocco aggiunge',d.exercises.length===n1+1&&d.exercises[n1].exId===ids[0]);
T('libreria: messaggio di conferma',/Aggiunto/.test(D.getElementById('cwLibMsg').textContent));
T('libreria: segnala "già nella scheda"',/già nella scheda/.test(D.getElementById('cwLibRes').textContent));
w.confirm=()=>false;w.__cwLibAdd(ids[0]);T('libreria: doppione solo se confermato',d.exercises.length===n1+1);
w.ST.lang='en';w.render();T('libreria EN',/Search: bench/.test(D.getElementById('cwLibQ').getAttribute('placeholder'))&&/Biceps/.test(D.getElementById('cwLibChips').textContent)&&/Duplicate/.test(app().textContent));w.ST.lang='it';w.render();
// ── messaggi ──
D.getElementById('cwName').value='';w.saveCustomWorkout();T('salva senza nome: campo in rosso e focus',D.getElementById('cwName').classList.contains('req-miss')&&D.activeElement.id==='cwName'&&/nome della scheda/.test(D.getElementById('reqMsg').textContent));
w.openExerciseCreator();D.getElementById('cwExName').value='';w.saveCustomExerciseToDraft();T('crea esercizio senza nome: campo in rosso',D.getElementById('cwExName').classList.contains('req-miss'));
const n2=d.exercises.length;D.getElementById('cwExName').value='Alzate cinesi';D.getElementById('cwExSets').value='25';D.getElementById('cwExRest').value='-5';w.saveCustomExerciseToDraft();
T('crea esercizio: valori fuori range corretti invece di bloccare',d.exercises.length===n2+1&&d.exercises[n2].sets===10&&d.exercises[n2].rest===0,JSON.stringify(d.exercises[n2]));
T('crea esercizio: conferma',/Creato e aggiunto/.test((D.getElementById('cwLibMsg')||{}).textContent||''));
w.closeSheet&&w.closeSheet();
console.log('feat95   ok='+ok+' fail='+fail);process.exit(fail?1:0);})();
