const boot=require('./harness_lib');const file=process.argv[2]||'Index.html';
const T=(n,c)=>console.log((c?'✓':'✗ FAIL')+' '+n);
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
(async()=>{
let w=boot(file);w.alert=()=>{};w.confirm=()=>true;
// cloud finto con latenza 300ms
let cloud=null,writes=0;
w.DB={s:async(k,v)=>{writes++;const snap=JSON.parse(JSON.stringify(v));await new Promise(r=>global.setTimeout(r,300));cloud=snap;return{ok:true}},g:async()=>cloud?JSON.parse(JSON.stringify(cloud)):null};
const today=w.currentDateStr;w.ST.tab='home';w.render();
// inserimenti di fila come stamattina: sonno, peso, allenamento saltato
w.document.getElementById('qS').value='7';w.quickLogS();
w.document.getElementById('qW').value='88.4';w.quickLogW();
w.logRestDay&&w.logRestDay();
await wait(1500);
T('cloud ha il sonno',cloud&&cloud.life&&cloud.life[today]&&cloud.life[today].sleep===7);
T('cloud ha il peso',cloud&&cloud.h.some(x=>x.d===today&&x.w===88.4));
T('cloud ha l\'allenamento saltato',cloud&&cloud.wLog.some(x=>x.d===today&&x.isRest));
T('nessuna richiesta persa, scritture accorpate ('+writes+')',writes>=2&&writes<=4);
T('copia locale segnata come sincronizzata',!w.__localUnsynced());
// app chiusa a metà salvataggio: il cloud non riceve nulla
const ls={};
w.DB.s=async()=>{await new Promise(()=>{})}; // si blocca per sempre (iOS sospende)
w.document.getElementById('qW').value='87.9';w.quickLogW();await wait(50);
['ft_local_backup_v1','ft_local_backup_meta_v1','ft_dev_id'].forEach(k=>ls[k]=w.localStorage.getItem(k));
T('copia locale scritta prima della rete',!!ls.ft_local_backup_v1&&JSON.parse(ls.ft_local_backup_meta_v1).synced===false);
// riapertura: login con cloud vecchio
const cloudOld=JSON.parse(JSON.stringify(cloud));
w=boot(file);Object.keys(ls).forEach(k=>ls[k]&&w.localStorage.setItem(k,ls[k]));
let resaved=null;w.DB={s:async(k,v)=>{resaved=v;return{ok:true}},g:async()=>JSON.parse(JSON.stringify(cloudOld))};
// simulo il ramo di login: recupero
const m=JSON.parse(w.localStorage.getItem('ft_local_backup_meta_v1'));const b=JSON.parse(w.localStorage.getItem('ft_local_backup_v1'));
T('al login la copia locale è più recente del cloud',m.synced===false&&b.data._savedAt>(cloudOld._savedAt||0));
const src=require('fs').readFileSync(file,'utf8');
T('login usa la copia locale non sincronizzata',/__resaveAfterLoad = !0/.test(src)||/__resaveAfterLoad=!0/.test(src));
// sincronizzazione tra dispositivi: un altro dispositivo ha salvato dopo
w.AU.user='U';w.__lastSyncedAt=1000;w.localStorage.setItem('ft_local_backup_meta_v1',JSON.stringify({user:'U',savedAt:1,synced:true}));
const remote=JSON.parse(JSON.stringify(cloudOld));remote._savedAt=Date.now();remote._dev='altro';remote.h.push({d:'2026-10-01',w:85.5});
w.DB.g=async()=>JSON.parse(JSON.stringify(remote));w.__lastPull=0;await w.__pullRemote();
T('dati più recenti dall\'altro dispositivo presi',w.ST.h.some(x=>x.w===85.5));
// stesso dispositivo/dati non più nuovi: niente sovrascrittura
w.ST.h.push({d:'2026-10-02',w:85.1});w.__lastPull=0;await w.__pullRemote();
T('nessuna sovrascrittura con dati non più recenti',w.ST.h.some(x=>x.w===85.1));
process.exit(0);})();
