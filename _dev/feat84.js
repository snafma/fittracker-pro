const boot=require('./harness_lib');const file=process.argv[2]||'Index-SORGENTE.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));let alerts=[];w.alert=(m)=>alerts.push(m);w.confirm=()=>true;w.saveU=()=>Promise.resolve(true);
w._userPickedDate=true;w.currentDateStr='2026-11-05';const src=require('fs').readFileSync(file,'utf8');const app=()=>w.document.getElementById('app');
w.ST.p={...w.ST.p,t:'cut',dur:60,sessions:3,focus:'total',customWorkouts:[{id:'cw_x',name:'Allenamento A',emoji:'🛠️',exercises:[{exId:'ch_bench_barbell',sets:3,reps:'8',rest:90}]}]};
const OCR=`Scheda A\nPanca piana 4x8 70kg\nCroci ai cavi 3x12 15kg`;
(async()=>{
w.__readWorkoutFile=async()=>OCR;w.fetch=async()=>{throw new Error('off')};
await w.importWorkoutFiles({files:[{name:'IMG_0001.jpg',type:'image/jpeg'}]});
const d=w.ST.sheetData.draft;T('import: nome vuoto, lo sceglie l\'utente (suggerito "Scheda A")',d.name===''&&d.suggestName==='Scheda A');
w.render();const nm=w.document.getElementById('cwName');T('campo nome con suggerimento',nm&&nm.value===''&&/Dai un nome unico, es\. Scheda A/.test(nm.getAttribute('placeholder')));
T('messaggio: dai un nome unico',/Dai alla scheda un nome unico/.test(w.document.body.innerHTML));
alerts=[];w.saveCustomWorkout();T('senza nome non salva',(alerts.length>0||!!w.document.getElementById('reqMsg'))&&w.ST.sheet==='customWorkout');
nm.value='allenamento a';alerts=[];w.saveCustomWorkout();T('nome già esistente non salva',alerts.some(a=>/Esiste già/.test(a)));
nm.value='Gambe e Spalle';w.saveCustomWorkout();T('nome unico → salvata',w.ST.p.customWorkouts.some(x=>x.name==='Gambe e Spalle')&&!w.ST.sheet);
// stesso file caricato di nuovo: altro nome scelto dall'utente
await w.importWorkoutFiles({files:[{name:'IMG_0001.jpg',type:'image/jpeg'}]});w.render();w.document.getElementById('cwName').value='Allenamento B';w.saveCustomWorkout();
T('stesso file, nome diverso: due schede distinte',w.ST.p.customWorkouts.filter(x=>/Gambe e Spalle|Allenamento B/.test(x.name)).length===2);
// fotocamera
w.ST.tab='set';w.render();T('elenco schede: IMPORTA DA FOTO (su iPhone offre anche la fotocamera)',/IMPORTA DA FOTO O PDF/.test(app().textContent)&&!!app().querySelector('[onclick*="__pickWorkoutFiles"]')&&(()=>{const k=w.HTMLInputElement.prototype.click;w.HTMLInputElement.prototype.click=function(){};w.__pickWorkoutFiles();w.HTMLInputElement.prototype.click=k;return /image/.test(w.document.getElementById('ftImpFiles').accept);})());
w.openCustomWorkoutEditor();w.render();T('editor: IMPORTA DA FOTO',/IMPORTA DA FOTO O PDF/.test(w.document.body.innerHTML));w.closeSheet();
let got=null;const imp=w.importWorkoutFiles;w.importWorkoutFiles=async(x)=>{got=x.files.length};
w.cameraShot({files:[{name:'a.jpg'}]});w.cameraShot({files:[{name:'b.jpg'}]});
T('2 foto scattate: pannello con ALTRA PAGINA e LEGGI',/2 FOTO PRONTE/.test(w.document.getElementById('camOv').textContent)&&/ALTRA PAGINA/.test(w.document.getElementById('camOv').textContent));
w.readCameraShots();T('LEGGI → importa tutte le foto',got===2&&!w.document.getElementById('camOv'));w.importWorkoutFiles=imp;
// obiettivo peso
const H=(arr)=>arr.map(([d,kg])=>({d,w:kg}));
w.ST.p.targetD='2027-06-01';w.ST.p.g=80;w.ST.p.t='cut';
w.ST.h=H([['2026-10-22',90.3],['2026-10-25',90.3],['2026-10-28',90.2],['2026-10-31',90.1],['2026-11-03',90.0],['2026-11-05',90.0]]);
let s=w.getTargetSummary(w.ST.h,w.ST.p);
T('90→80 entro 1/6/2027 a ritmo lento: fattibile, serve più impegno',s.feasible&&!s.impossible&&/Fattibile/.test(s.label)&&/più cardio|solo cardio/.test(s.advice),s.label+' | '+s.currentRate+' vs '+s.requiredRate);
T('ritmo calcolato sui giorni (non sul numero di pesate)',Math.abs(parseFloat(s.currentRate)-0.15)<0.03,s.currentRate);
T('nessuna proposta di cambiare data se è fattibile',!w.checkTargetAdjustment(w.ST.h,w.ST.p).needsShift);
w.ST.tab='home';w.ST.goalPaceSnooze=null;w.render();T('home: "fattibile, ma serve più impegno" + bottone cardio',/Fattibile, ma serve più impegno/.test(app().textContent)&&/SESSIONE SOLO CARDIO/.test(app().textContent));
w.ST.p.targetD='2026-12-01';s=w.getTargetSummary(w.ST.h,w.ST.p);const c=w.checkTargetAdjustment(w.ST.h,w.ST.p);
T('90→80 entro 1/12/2026: impossibile',s.impossible&&/Impossibile/.test(s.label)&&c.needsShift&&c.suggestedDate>'2027-01-01',c.suggestedDate);
w.render();T('home: "obiettivo impossibile alla data" con data proposta',/OBIETTIVO IMPOSSIBILE ALLA DATA/.test(app().textContent)&&/Data proposta/.test(app().textContent));
w.ST.p.targetD='2027-06-01';w.ST.h=H([['2026-10-22',91.2],['2026-11-05',90.0]]);s=w.getTargetSummary(w.ST.h,w.ST.p);
T('ritmo buono (0,6 kg/sett): in anticipo, nessun avviso',['on_track','fast'].includes(s.status)&&!s.feasible&&!s.impossible,s.status);
w.ST.p.t='bulk';w.ST.p.g=95;w.ST.h=H([['2026-10-22',90],['2026-11-05',90.05]]);s=w.getTargetSummary(w.ST.h,w.ST.p);
T('massa: fattibile ma lento → consigli su calorie e costanza',s.feasible&&/calorie/.test(s.advice));
w.ST.p.g=110;s=w.getTargetSummary(w.ST.h,w.ST.p);T('massa +20 kg in 7 mesi: impossibile (max sano 0,5 kg/sett)',s.impossible);
T('tour IT/EN aggiornato',/ancora raggiungibile ti dico come recuperare/.test(src)&&/still reachable I tell you how to catch up/.test(src)&&/scattata dall'app/.test(src));
T('versione S84+',/build-SESSION(8[4-9]|9\d)/.test(src));
})();
// ── configurazione riorganizzata ──
setTimeout(()=>{
w.ST.tab='set';w.ST.p.nutritionOff=true;w.render();let tx=app().textContent;
T('alimentazione OFF: sezione allenamento e "Le mie schede" visibili',!!app().querySelector('#sec-training')&&/LE MIE SCHEDE/.test(tx)&&/FOCUS DI ALLENAMENTO/.test(tx));
T('alimentazione OFF: dettagli alimentazione nascosti',!/INTOLLERANZE ALIMENTARI/.test(tx)&&/SEZIONE ALIMENTAZIONE/.test(tx));
w.ST.p.nutritionOff=false;w.render();tx=app().textContent;T('alimentazione ON: tutto visibile',/INTOLLERANZE ALIMENTARI/.test(tx)&&/LE MIE SCHEDE/.test(tx));
const ids=[...app().querySelectorAll('[id^="sec-"]')].map(x=>x.id).filter(x=>['sec-program','sec-training','sec-coachsnd','sec-nutrition','sec-notifications','sec-integr','sec-advanced'].includes(x));
T('famiglie in ordine: Programma, Allenamento, Coach e suoni, Alimentazione, Notifiche, Integrazioni, App',ids.join(',')==='sec-program,sec-training,sec-coachsnd,sec-nutrition,sec-notifications,sec-integr,sec-advanced',ids.join(','));
const pos=(re)=>tx.search(re);
T('suoni e coach nella famiglia Coach e suoni',pos(/COACH E SUONI/)<pos(/SUONI TIMER/)&&pos(/SUONI TIMER/)<pos(/MODALITÀ COACH/)&&pos(/MODALITÀ COACH/)<pos(/SEZIONE ALIMENTAZIONE/));
T('integrazioni e importazioni in un menu a parte',pos(/INTEGRAZIONI E IMPORTAZIONI/)>pos(/NOTIFICHE/)&&/Bilancia|Salute|CSV/.test(tx.slice(pos(/INTEGRAZIONI E IMPORTAZIONI/))));
T('niente più bottone "AI Coach →" nelle configurazioni',!/AI Coach →/.test(app().innerHTML)&&!/onclick="ST.tab='coach';render\(\)"/.test(app().innerHTML.slice(0,8000)));
T('navigazione rapida con le 7 famiglie',app().querySelectorAll('[onclick*="scrollIntoView"]').length>=7);
T('tour aggiornato su configurazione',/Configurazione è divisa in famiglie/.test(src)&&/Settings are grouped/.test(src));
},50);
