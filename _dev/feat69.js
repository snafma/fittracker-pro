const boot=require('./harness_lib');const w=boot(process.argv[2]||'Index.html');
const T=(n,c)=>console.log((c?'✓':'✗ FAIL')+' '+n);w.alert=()=>{};w.confirm=()=>false;
const D=(k)=>{const d=new Date(Date.now()-k*864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const today=w.currentDateStr;
// ── 1. SCARICO ──
// storico: normale 80kg (8 settimane fa), scarico 56kg (5 settimane fa, flag dl), normale 82kg (2 settimane fa)
const H={};H[D(56)]={ch_man:{kg:80,unit:'kg',ok:true,dl:false}};H[D(35)]={ch_man:{kg:56,unit:'kg',ok:true,dl:true}};H[D(14)]={ch_man:{kg:82,unit:'kg',ok:true,dl:false}};H[D(3)]={ch_man:{kg:57,unit:'kg',ok:true,dl:true}};
// settimana NORMALE
w.ST.programStart=D(40);w.ST.wLog=[];
T('setup: settimana normale',!w.__dlNow());
let v=w.getLastUserValue('ch_man',H,'kg');T('normale → propone 82kg (non lo scarico da 57kg) ['+v.val+']',v.val===82&&!v.dl);
let s=w.getSuggest('ch_man',H,'kg');T('normale → suggerimento sui carichi normali ['+s.val+']',s.val===82);
// settimana di SCARICO (sett. 5 con continuità)
w.ST.programStart=D(60);{const wd=(new Date().getDay()+6)%7;w.ST.wLog=[];for(let k=1;k<=4;k++){w.ST.wLog.push({d:D(wd+7*k-1),isRest:false,woId:'A'},{d:D(wd+7*k-3),isRest:false,woId:'B'});}w.ST.wLog.sort((a,b)=>a.d<b.d?-1:1);}
T('setup: settimana scarico',w.__dlNow());
v=w.getLastUserValue('ch_man',H,'kg');T('scarico → propone l\'ultimo scarico 57kg ['+v.val+']',v.val===57&&v.dl===true);
s=w.getSuggest('ch_man',H,'kg');T('scarico → suggerimento dallo scarico precedente',s.val===57&&/SCARICO/.test(s.hint));
// scarico senza storico di scarico → normale ridotto
const H2={};H2[D(10)]={ch_man:{kg:80,unit:'kg',ok:true,dl:false}};
s=w.getSuggest('ch_man',H2,'kg');T('primo scarico → 70% del normale ['+s.val+']',s.val===55||s.val===56);
// registrazione salva il flag
w.ST.aWo='A';w.ST.step=1;w.ST.woPhase='active';w.ST.currentSet=0;w.ST.wHistory={};w.render();
const inp=w.document.getElementById('wkW');inp&&(inp.value='50');const rp=w.document.getElementById('wkReps');rp&&(rp.value='10');
w.completeSet();const ex=w.getWo().exercises[1].id;
T('registrazione in scarico ha dl=true',w.ST.wHistory[today]&&w.ST.wHistory[today][ex]&&w.ST.wHistory[today][ex].dl===true);
// legacy senza flag: dedotto dalla settimana
w.ST.programStart='2026-01-05';T('legacy: 5ª settimana riconosciuta come scarico',w.__isDlEntry('2026-02-05',{kg:50})===true&&w.__isDlEntry('2026-01-20',{kg:50})===false);
// ── 2. PAUSA ──
w.ST.programStart=D(40);w.ST.wLog=[];w.confirm=()=>false;w.startWo('A');w.ST.step=1;w.ST.woPhase='ready';w.render();
T('bottone pausa visibile',/pauseWo\(\)/.test(w.document.getElementById('app').innerHTML));
// pausa durante serie attiva
w.startSet();w.ST.setStartTs=Date.now()-20000;const st0=w.ST.workoutStartTs;
w.pauseWo();T('in pausa: overlay',w.document.getElementById('app').textContent.includes('ALLENAMENTO IN PAUSA'));
T('in pausa: timer serie fermo',w.ST.setStartTs===null&&w.ST.woPaused.setEl>=19000);
w.ST.woPaused.at-=60000; // 1 minuto di pausa
w.resumeWo();T('ripresa: overlay sparito',!w.document.getElementById('app').textContent.includes('ALLENAMENTO IN PAUSA'));
T('ripresa: serie riparte dai secondi di prima',Math.round((Date.now()-w.ST.setStartTs)/1000)>=19&&Math.round((Date.now()-w.ST.setStartTs)/1000)<=21);
T('pausa esclusa dalla durata (+60s)',w.ST.workoutStartTs-st0>=59000);
// pausa durante recupero
w.ST.woPhase='rest';w.ST.tmrEndTs=Date.now()+45000;w.pauseWo();
T('recupero in pausa: 45s rimasti',Math.round(w.ST.woPaused.restLeft/1000)===45&&w.ST.tmrEndTs===null);
w.render();T('overlay mostra recupero rimasto',/45s rimasti/.test(w.document.getElementById('app').textContent));
w.resumeWo();T('recupero riprende da 45s',w.ST.woPhase==='rest'&&Math.round((w.ST.tmrEndTs-Date.now())/1000)===45);
w.ST.woPhase='rest';w.render();T('bottone pausa anche nel recupero',/pauseWo\(\)/.test(w.document.getElementById('app').innerHTML));
// uscita da pausa
w.pauseWo();w.confirm=()=>true;w.closeWo();T('uscita da pausa pulisce stato',!w.ST.woPaused&&!w.ST.aWo);
// ── 3. HOME MASSA GRASSA / MAGRA ──
w.ST.h=[{d:today,w:86.1}];w.ST.measures={};w.ST.measures[today]={neck:40,abdomen:92};w.ST.tab='home';w.ST.lang='it';w.render();
const t=w.document.getElementById('app').textContent;const b=w.bodyComp();
T('home: MASSA GRASSA X kg scritto',t.includes('MASSA GRASSA')&&t.includes(w.fmtKg(b.fatKg)));
T('home: MASSA MAGRA X kg scritto',t.includes('MASSA MAGRA')&&t.includes(w.fmtKg(b.leanKg)));
T('home: card peso con grassa/magra',/Grassa\s*[\d.]+kg\s*·\s*Magra\s*[\d.]+kg/.test(t));
w.ST.lang='en';w.render();const e=w.document.getElementById('app').textContent;
T('EN: FAT MASS / LEAN MASS',e.includes('FAT MASS')&&e.includes('LEAN MASS'));
w.ST.aWo='A';w.ST.woPhase='ready';w.ST.step=1;w.pauseWo();T('EN: WORKOUT PAUSED',w.document.getElementById('app').textContent.includes('WORKOUT PAUSED'));
process.exit(0);
