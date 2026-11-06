const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S91+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=91);

const boot=require('./harness_lib');const w=boot(file);w.saveU=()=>Promise.resolve(true);w.saveBg=()=>{};w.save=()=>Promise.resolve();const app=()=>w.document.getElementById('app');const D=w.document;
try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
// ── tour ──
w.ST.p.tourCompleted=false;w.tourStep=w.TOUR_STEPS.findIndex(s=>String(s.body).length>500);w.ST.tab='home';w.render();
const tb=D.getElementById('tourBody');
T('tour: passo lungo con area di testo scorrevole',w.tourStep>=0&&!!tb&&/overflow-y:auto/.test(tb.getAttribute('style'))&&/min-height:0/.test(tb.getAttribute('style')));
T('tour: card alta al massimo quanto lo schermo',/max-height:100%/.test(D.getElementById('tourOv').firstElementChild.getAttribute('style')));
T('tour: testo lungo diviso in riquadri con bordo',tb.children.length>=3&&/border-left:3px solid/.test(tb.children[0].getAttribute('style')),tb.children.length);
T('tour: pulsanti fuori dall\'area che scorre',!tb.querySelector('button')&&/tourNext/.test(D.getElementById('tourOv').innerHTML));
w.tourStep=0;w.render();T('tour: passo corto in un riquadro unico',D.getElementById('tourBody').children.length===1);
w.ST.lang='en';w.render();T('tour: nessun lookbehind (iOS vecchi)',!/\(\?<[=!]/.test(w.renderTour.toString()));T('tour EN',/Skip tour/.test(D.getElementById('tourOv').textContent)&&/Next/.test(D.getElementById('tourOv').textContent));w.ST.lang='it';
w.ST.p.tourCompleted=true;w.render();
// ── giorni di allenamento ──
w.ST.p.sessions=3;w.ST.p.trainDays=[1,3,5];
T('giorni scelti usati (mar/gio/sab)',w.__trainDows().join()==='1,3,5');
T('martedì allenamento, lunedì riposo',!w.isRestDayFor('2026-11-10')&&w.isRestDayFor('2026-11-09'));
T('giorni incoerenti con le sessioni → schema standard',(w.ST.p.trainDays=[1,3],w.__trainDows().join()==='0,2,4'));
w.ST.p.trainDays=[1,3,5];
const ws=w.getWeekStatus('2026-11-11',[],3,null,1,null,null);T('settimana pianificata sui giorni scelti',ws[1].planned!=='rest'&&ws[0].planned!=='A'&&ws[0].planned!=='B',ws.map(x=>x.planned).join());
w.ST.tab='set';w.render();const chips=app().querySelectorAll('#wrapEDays .td-chip');
T('Configurazione: 7 giorni selezionabili',chips.length===7&&app().querySelectorAll('#wrapEDays .td-chip.on').length===3);
w.__tdToggle(chips[0]);T('tocco su un giorno aggiorna le sessioni',D.getElementById('eSess').value==='4'&&/4 giorni/.test(D.getElementById('tdHint').textContent));
D.getElementById('eSess').value='2';w.__tdFromSess();T('cambio sessioni → giorni standard',app().querySelectorAll('#wrapEDays .td-chip.on').length===2);
// ── dieta: ciclo carbo a media settimanale invariata ──
const P=(t)=>({...w.ST.p,t});
for(const g of ['cut','bulk']){for(const k of [2,3,4,5]){const b=w.calcMacros(85,180,40,'m',P(g),k,{},0,null),tr=w.calcMacros(85,180,40,'m',P(g),k,{},0,'train'),rs=w.calcMacros(85,180,40,'m',P(g),k,{},0,'rest');
const avg=(k*tr.kcal+(7-k)*rs.kcal)/7;T(`${g} ${k} gg: allenamento > riposo, media settimanale = target (±40)`,tr.kcal>b.kcal&&rs.kcal<b.kcal&&Math.abs(avg-b.kcal)<=40,`${tr.kcal}/${rs.kcal}/${b.kcal}`);
T(`${g} ${k} gg: differenza solo dai carboidrati`,tr.prot===rs.prot&&tr.fat===rs.fat&&(tr.kcal-rs.kcal)===4*(tr.carb-rs.carb));}}
const ob=w.calcMacros(130,175,40,'m',P('cut'),3,{},0,null);T('proteine sul peso di riferimento (130 kg → < 2,2 g/kg totale)',ob.prot<Math.round(130*2.2)&&ob.prot>=150,ob.prot);
const nz=w.calcMacros(80,180,40,'m',P('cut'),0,{},0,null);T('definizione senza pesi: proteine ≥ 1,6 g/kg',nz.prot>=128,nz.prot);
T('etichetta del giorno bilingue',(w.ST.lang='en',/Training day/.test(w.calcMacros(80,180,40,'m',P('cut'),3,{},0,'train').dayLabel))&&(w.ST.lang='it',/allenamento/.test(w.calcMacros(80,180,40,'m',P('cut'),3,{},0,'train').dayLabel)));
// ── alimenti ──
const ids=new Set(),nm=new Set();let dup=0,noEn=0;w.FOOD_DB.forEach(f=>{(ids.has(f.id)||nm.has(f.name.toLowerCase()))&&dup++;ids.add(f.id);nm.add(f.name.toLowerCase());f.nameEn||noEn++;});
T('alimenti: nessun doppione',dup===0,dup);T('alimenti: tutti con nome inglese',noEn===0,noEn);
T('alimenti: nuovi prodotti (budino proteico, riso integrale cotto, konjac)',!!w.foodById('budino_proteico')&&!!w.foodById('riso_integrale_cotto')&&!!w.foodById('spaghetti_konjac'));
T('alimenti: id dei doppioni rimossi ancora validi',w.foodById('pane_integrale_2')&&w.foodById('pane_integrale_2').id==='pane_integrale');
// ── campi obbligatori ──
delete w.AU.user;w.AU.tab='reg';w.AU.msg='';w.render();
let called=0;const o=w.doReg;
D.getElementById('aU').value='marco';D.getElementById('aE').value='m@x.it';
w.doReg();const msg=D.getElementById('reqMsg');
T('registrazione: messaggio campi obbligatori',!!msg&&/campi obbligatori/.test(msg.textContent)&&/peso/.test(msg.textContent)&&/altezza/.test(msg.textContent));
T('registrazione: mancanti in rosso, compilati no',D.getElementById('aW').classList.contains('req-miss')&&!D.getElementById('aU').classList.contains('req-miss'));
T('registrazione: focus sul primo mancante',D.activeElement&&D.activeElement.id==='aP',D.activeElement&&D.activeElement.id);
const aw=D.getElementById('aW');aw.value='80';aw.dispatchEvent(new w.Event('input'));T('compilato → il rosso sparisce',!aw.classList.contains('req-miss')&&!/peso/.test(D.getElementById('reqMsg').textContent));
w.setMsg('prova');T('un messaggio non cancella quanto già scritto',D.getElementById('aU').value==='marco'&&D.getElementById('aW').value==='80');
w.AU.user='U';w.ST.p=null;w.render();D.getElementById('gW').value='';w.initProgram();
T('configurazione iniziale: peso obiettivo in rosso e focus',D.getElementById('gW').classList.contains('req-miss')&&D.activeElement.id==='gW'&&!!D.getElementById('reqMsg'));
console.log('feat91   ok='+ok+' fail='+fail);process.exit(fail?1:0);
