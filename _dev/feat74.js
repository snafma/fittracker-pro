const boot=require('./harness_lib');const file=process.argv[2]||'Index.html';const w=boot(file);
const T=(n,c)=>console.log((c?'✓':'✗ FAIL')+' '+n);w.alert=()=>{};w.confirm=()=>true;
let saves=0;const os=w.saveU;w.saveU=()=>{saves++;return Promise.resolve(true)};
for(const mode of ['normale','allenamento']){
  w.ST.exPrefs={};w.ST.sheet=null;
  if(mode==='allenamento'){w.ST.aWo='A';w.ST.step=1;w.ST.woPhase='ready';w.ST.currentSet=0;}else{w.ST.aWo=null;w.ST.tab='work';}
  w.render();w.openSwap('A1');const cur=w.ST.sheetData.curId;const alt=w.ST.sheetData.alts.find(a=>a.id!==cur).id;
  const app=w.document.getElementById('app');
  T(mode+': attuale evidenziato all\'apertura',app.querySelector('.swopt.on')&&app.querySelector('.swopt.on').getAttribute('data-id')===cur);
  T(mode+': Conferma disattivata finché non scegli',w.document.getElementById('swapConfirmBtn').disabled===true);
  w.pickSwap(alt);
  const on=[...app.querySelectorAll('.swopt.on')].map(x=>x.getAttribute('data-id'));
  T(mode+': la selezione si sposta sul nuovo esercizio',on.length===1&&on[0]===alt);
  T(mode+': nessuna modifica prima della conferma',!w.ST.exPrefs.A1&&w.ST.sheet==='swap');
  {const bt=w.document.getElementById('swapConfirmBtn');T(mode+': Conferma attiva con nome esercizio',!bt.disabled&&bt.textContent.includes(w.__EX[alt].name));}
  w.closeSheet();T(mode+': Annulla non cambia nulla',!w.ST.exPrefs.A1&&!w.ST.sheet);
  w.openSwap('A1');w.pickSwap(alt);w.confirmSwap();
  T(mode+': Conferma salva il nuovo esercizio',w.ST.exPrefs.A1===alt&&!w.ST.sheet);
}
w.ST.aWo=null;w.ST.lang='en';w.render();w.openSwap('A1');T('EN: CANCEL / CONFIRM',/CANCEL/.test(w.document.getElementById('app').textContent)&&/CONFIRM/.test(w.document.getElementById('app').textContent));
process.exit(0);
