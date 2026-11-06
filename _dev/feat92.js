const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S92+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=92);
const boot=require('./harness_lib');const w=boot(file);w.saveU=()=>Promise.resolve(true);w.saveBg=()=>{};w.save=()=>Promise.resolve();const app=()=>w.document.getElementById('app');const D=w.document;
try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
const lab=()=>w.eval('FOCUS_LIST').map(f=>f.label).join('|');
T('nomi italiani',lab()==='Tutto il corpo|Parte alta|Parte bassa|Glutei e addome|Ipertrofia massima|Forza pura',lab());
w.ST.lang='en';T('nomi inglesi',lab()==='Full body|Upper body|Lower body|Glutes & core|Max hypertrophy|Pure strength',lab());
T('descrizione inglese',/Priority on chest/.test(w.eval('FOCUS_LIST')[1].desc));w.ST.lang='it';
// Configurazione
w.ST.tab='set';w.ST.p.focus='total';w.ST.p.t='bulk';w.ST.p.sessions=3;w.render();
let d=D.getElementById('focusDesc2');
T('Configurazione: scheda del focus con schede, serie, recupero',!!d&&/SCHEDE A ROTAZIONE/.test(d.textContent)&&/ESERCIZI BASE/.test(d.textContent)&&/recupero/.test(d.textContent));
const tot=d.textContent;
const chip=(id)=>app().querySelector(`.focus-chip2[data-focus="${id}"]`);
w.pickFocusChip(chip('strength'));const st=D.getElementById('focusDesc2').textContent;
T('Forza pura: meno ripetizioni e più recupero di Tutto il corpo',/Forza pura/.test(st)&&st!==tot,st.replace(/\s+/g,' ').slice(0,260));
const g=(f)=>w.getSetsReps('compound','bulk',1,f);T('forza: reps più basse, recupero più lungo (calcolo reale)',parseInt(g('strength').reps)<parseInt(g('total').reps)&&g('strength').rest>g('total').rest);
T('ipertrofia: una serie in più',g('hyp').sets===g('total').sets+1&&w.getSetsReps('isolation','cut',1,'hyp').sets===w.getSetsReps('isolation','cut',1,'total').sets+1);
w.pickFocusChip(chip('upper'));const up=D.getElementById('focusDesc2').textContent;
T('Parte alta: schede elencate per nome',/Petto e tricipiti → Schiena e bicipiti → Tutto il corpo/.test(up));
T('Parte alta/bassa mantengono il resto (Tutto il corpo nella rotazione)',w.getRotation(3,'upper').includes('D')&&w.getRotation(5,'lower').includes('D')&&w.getRotation(2,'upper').join()==='A,C');
D.getElementById('eT').value='cut';D.getElementById('eT').dispatchEvent(new w.Event('change',{bubbles:true}));T('cambio obiettivo aggiorna la spiegazione',/definizione/.test(D.getElementById('focusDesc2').textContent));
w.ST.lang='en';w.render();d=D.getElementById('focusDesc2').textContent;T('EN: spiegazione tutta in inglese',/MAIN LIFTS/.test(d)&&/reps/.test(d)&&!/ripetizioni|recupero|SCHEDE/.test(d),d.replace(/\s+/g,' ').slice(0,200));w.ST.lang='it';
// configurazione iniziale
const p0=w.ST.p;w.ST.p=null;w.render();const fd=D.getElementById('focusDesc');T('configurazione iniziale: stessa spiegazione',!!fd&&/Tutto il corpo/.test(fd.textContent)&&/ESERCIZI BASE/.test(fd.textContent));
const c=app().querySelector('.focus-chip[data-focus="glutes"]');c.click();T('configurazione iniziale: tocco su un focus',/Glutei e addome/.test(D.getElementById('focusDesc').textContent));
w.ST.p=p0;
// invito giorni in Alimentazione
w.ST.p.nutritionOff=false;w.ST.p.trainDays=null;w.ST.p.tdAsked=false;w.ST.p.sessions=3;w.ST.tab='diet';w.render();
T('Alimentazione: invito a scegliere i giorni',!!D.getElementById('tdAsk')&&/lun, mer, ven/.test(D.getElementById('tdAsk').textContent));
w.__tdSkip();T('"Vanno bene" → non compare più',!D.getElementById('tdAsk'));
w.ST.p.tdAsked=false;w.ST.p.trainDays=[0,2,4];w.render();T('giorni già scelti → nessun invito',!D.getElementById('tdAsk'));
w.ST.p.trainDays=null;w.render();w.__tdGo();T('"Scegli i giorni" porta in Configurazione',w.ST.tab==='set'&&!!D.getElementById('wrapEDays'));
console.log('feat92   ok='+ok+' fail='+fail);process.exit(fail?1:0);
