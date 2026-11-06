const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S94+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=94);
const w=require('./harness_lib')(file);w.saveU=()=>Promise.resolve(true);w.saveBg=()=>{};w.save=()=>Promise.resolve();const D=w.document,app=()=>D.getElementById('app');
try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
const iso=(d)=>d.toISOString().slice(0,10),add=(s,n)=>iso(new Date(new Date(s+'T12:00:00').getTime()+n*864e5));
// ── 1RM per esercizio ──
w.ST.tab='stats';w.ST.statsView='calc1rm';w.ST.calc1RMInput={weight:'100',reps:'5',sets:'1',ex:''};w.ST.rmLog={};w.render();
T('1RM: scelta esercizio facoltativa',!!D.getElementById('rmEx')&&D.getElementById('rmEx').options[0].value==='');
T('1RM: senza esercizio niente confronto',!D.getElementById('rmCmp'));
const exId=Object.keys(w.eval('EX')).find(k=>/panca/i.test(w.eval('EX')[k].name)&&w.eval('EX')[k].t!=='isometric');
w.ST.wHistory={'2026-10-01':{[exId]:{ok:1,kg:90,actualReps:5}}};w.render();
w.__rmUpd('ex',exId);let cmp=D.getElementById('rmCmp');
T('1RM: confronto col record (nuovo record)',!!cmp&&/Nuovo record/.test(cmp.textContent),cmp&&cmp.textContent.slice(0,90));
w.__rmUpd('weight','80');cmp=D.getElementById('rmCmp');T('1RM: percentuale del record',/Sei al \d+%/.test(cmp.textContent));
w.__rmUpd('weight','100');w.__rmSave();T('1RM: salvato nello storico',(w.ST.rmLog[exId]||[]).length===1&&w.ST.rmLog[exId][0].v===116.7);
T('1RM: dopo il salvataggio il tasto lo conferma',/Salvato nello storico/.test(D.getElementById('rmCmp').textContent));
T('1RM: la stima salvata conta come record',w.getBest1RM(exId).value===116.7&&w.getBest1RM(exId).manual===true);
T('1RM: compare tra i record',/stima salvata/.test(app().textContent));
w.ST.lang='en';w.render();T('1RM EN',/Saved to history/.test(D.getElementById('rmCmp').textContent)&&/No exercise/.test(D.getElementById('rmEx').textContent));w.ST.lang='it';
// ── giorni nella configurazione iniziale ──
const p0=w.ST.p;w.ST.p=null;w.render();
T('setup: chip dei giorni',app().querySelectorAll('#wrapIDays .td-chip').length===7&&app().querySelectorAll('#wrapIDays .td-chip.on').length===3);
const ch=app().querySelectorAll('#wrapIDays .td-chip');w.__tdToggle(ch[0]);w.__tdToggle(ch[6]);
T('setup: tocchi aggiornano le sessioni',D.getElementById('iSess').value==='3'&&app().querySelectorAll('#wrapIDays .td-chip.on').length===3);
D.getElementById('iSess').value='4';w.__tdFromSess('iSess','wrapIDays');T('setup: cambio sessioni → giorni standard',app().querySelectorAll('#wrapIDays .td-chip.on').length===4);
D.getElementById('iSess').value='3';w.__tdFromSess('iSess','wrapIDays');w.__tdToggle(app().querySelectorAll('#wrapIDays .td-chip')[0]);w.__tdToggle(app().querySelectorAll('#wrapIDays .td-chip')[1]);
const want=[...app().querySelectorAll('#wrapIDays .td-chip.on')].map(b=>+b.dataset.d);
D.getElementById('iW').value='85';D.getElementById('gW').value='80';
const r=w.initProgram();const chk=()=>T('setup: giorni salvati nel profilo',!!w.ST.p&&JSON.stringify(w.ST.p.trainDays)===JSON.stringify(want),JSON.stringify(w.ST.p&&w.ST.p.trainDays)+' vs '+JSON.stringify(want));
const rest=()=>{
w.ST.p=p0;
// ── giorni reali diversi ──
const today=w.eval('currentDateStr');w.ST.p.sessions=3;w.ST.p.trainDays=[0,2,4];w.ST.p.tdSugSkip=null;
const L=[];for(let i=1;i<=20;i++){const d=add(today,-i),dw=(new Date(d+'T12:00:00').getDay()+6)%7;[1,3,5].includes(dw)&&L.push({d,woId:'A'});}
w.ST.wLog=L;const h=w.__tdHabit();T('rileva i giorni reali (mar, gio, sab)',!!h&&h.sug.join()==='1,3,5',h&&h.sug.join());
w.ST.tab='home';w.render();T('Home: proposta di aggiornare i giorni',!!D.getElementById('tdHabit')&&/mar, gio, sab/.test(D.getElementById('tdHabit').textContent));
w.__tdHabitNo();T('"No, grazie" → non ricompare',!D.getElementById('tdHabit'));
w.ST.p.tdSugSkip=null;w.render();w.__tdHabitOk();T('"Aggiorna" imposta i giorni',w.ST.p.trainDays.join()==='1,3,5'&&!D.getElementById('tdHabit'));
w.ST.wLog=L.slice(0,2);w.ST.p.trainDays=[0,2,4];T('pochi allenamenti → nessuna proposta',w.__tdHabit()===null);
// ── scarico spiegato ──
T('scarico: testo con numeri reali',/carichi più leggeri del 30%/.test(src)&&/2 serie da 12-15 per ogni esercizio/.test(src)&&/3 serie da 8-10 per ogni esercizio/.test(src)&&/30% lighter loads/.test(src));
const g=w.getSetsReps;w.isDeloadWeek=()=>true;const dc=g('compound','cut',5,'total'),di=g('isolation','cut',5,'total'),db=g('compound','bulk',5,'total');T('scarico: i numeri spiegati sono quelli applicati',dc.sets===2&&dc.reps==='12-15'&&dc.rest===60&&di.sets===2&&db.sets===3&&db.reps==='8-10'&&db.rest===90);
// ── domenica ──
let sun=today;while(new Date(sun+'T12:00:00').getDay()!==0)sun=add(sun,1);const mon=add(sun,-6);
w._userPickedDate=true;w.eval("currentDateStr='"+sun+"'");w.ST.wLog=[{d:mon,woId:'A'},{d:add(mon,2),woId:'B'}];w.ST.h=[{d:add(mon,-3),w:90},{d:add(sun,-1),w:89.4}];w.ST.p.t='cut';w.ST.p.nutritionOff=false;w.ST.nutri={[mon]:{k:2000,p:100},[add(mon,1)]:{k:1900,p:120}};w.ST.tab='home';w.render();
const ws=D.getElementById('weekSum');T('domenica: riepilogo della settimana',!!ws&&/2\/3/.test(ws.textContent)&&/89,4 kg/.test(ws.textContent)&&/-0,6/.test(ws.textContent)&&/110 g/.test(ws.textContent),ws&&ws.textContent.replace(/\s+/g,' '));
T('domenica: consiglio (allenamenti mancanti)',/punta a 3 allenamenti/.test(ws.textContent));
w.ST.lang='en';w.render();T('riepilogo EN',/YOUR WEEK/.test(D.getElementById('weekSum').textContent)&&/Workouts/.test(D.getElementById('weekSum').textContent));w.ST.lang='it';
w.eval("currentDateStr='"+add(sun,1)+"'");w.render();T('lunedì: nessun riepilogo',!D.getElementById('weekSum'));w._userPickedDate=false;w.eval("currentDateStr='"+today+"'");
// ── coach in allenamento ──
w.ST.p.coachMode=false;const wk=w.ST.wLog;w.ST.wLog=[];w.ST.tab='work';
try{w.startWo&&w.startWo('A');}catch(_){}
if(!w.ST.aWo){w.ST.aWo='A';w.ST.step=0;w.ST.woPhase='ready';w.ST.currentSet=1;}
w.render();let b=[...app().querySelectorAll('button')].find(x=>/__coachWoToggle/.test(x.getAttribute('onclick')||''));
T('allenamento: tasto coach visibile',!!b);
w.__coachWoToggle();T('allenamento: coach acceso',w.ST.p.coachMode===true);
w.__coachWoToggle();T('allenamento: coach spento',w.ST.p.coachMode===false);
w.ST.woPhase='rest';w.render();T('tasto coach anche durante il recupero',[...app().querySelectorAll('button')].some(x=>/__coachWoToggle/.test(x.getAttribute('onclick')||'')));
w.ST.aWo=null;w.ST.wLog=wk;
console.log('feat94   ok='+ok+' fail='+fail);process.exit(fail?1:0);};
r&&typeof r.then==='function'?r.then(()=>{chk();rest();}):(chk(),rest());
