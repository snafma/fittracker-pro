const boot=require('./harness_lib');const w=boot(process.argv[2]||'Index.html');
const T=(n,c)=>console.log((c?'✓':'✗ FAIL')+' '+n);w.alert=()=>{};
const D=(k)=>new Date(Date.now()-k*864e5).toISOString().slice(0,10);
const src=require('fs').readFileSync(process.argv[2]||'Index.html','utf8');
// topbar
T('drawer-ov senza sfocatura quando chiuso',/\.drawer-ov\{[^}]*visibility:hidden/.test(src)&&!/\.drawer-ov\{[^}]*backdrop-filter/.test(src));
T('topbar senza transform/backdrop',/\.topbar\{position:fixed;top:0;left:0;right:0;margin:0 auto;[^}]*\}/.test(src)&&!/\.topbar\{[^}]*(transform|backdrop)/.test(src));
T('animazione pagine senza transform',!/@keyframes fadeUp\{from\{opacity:0;transform/.test(src));
// impostazioni senza coaching
w.ST.tab='set';w.ST.lang='it';w.render();let t=w.document.getElementById('app');
T('sezione Coaching rimossa',!t.querySelector('#sec-coaching')&&!t.textContent.includes('CONSIGLI DEL COACH'));
T('nav rapida: niente bottone AI Coach (S84), famiglia Coach e suoni',!/AI Coach →/.test(t.innerHTML)&&/sec-coachsnd/.test(t.innerHTML));
// cambio scheda manuale
w.ST.programStart=D(20);w.ST.wLog=[];w.ST.pendingCycle=null;w.ST.cycleSnooze=D(-10);w.ST.aWo=null;w.ST.tab='work';w.render();t=w.document.getElementById('app');
T('in Allenamento c\'è sempre "Cambia scheda"',/requestNewCycle\(\)/.test(t.innerHTML)&&t.textContent.includes('Cambia scheda'));
w.confirm=()=>true;w.requestNewCycle();T('cambio scheda programmato',!!w.ST.pendingCycle);
w.render();t=w.document.getElementById('app');T('scheda in arrivo con "Inizia da oggi"',t.textContent.includes('Inizia da oggi')&&!/requestNewCycle\(\)/.test(t.innerHTML));
w.startCycleNow();T('anticipata a oggi: attiva subito',!w.ST.pendingCycle&&w.ST.cycleAppliedOn===w.currentDateStr&&w.ST.p.splitVariant===1);
w.render();T('banner nuova scheda attiva',w.document.getElementById('app').textContent.includes('NUOVA SCHEDA ATTIVA'));
w.ST.lang='en';w.ST.cycleAppliedOn=null;w.render();T('EN: Change program',w.document.getElementById('app').textContent.includes('Change program'));
process.exit(0);
