const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S96+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=96);
const w=require('./harness_lib')(file);w.saveU=()=>Promise.resolve(true);w.save=()=>Promise.resolve();const D=w.document,app=()=>D.getElementById('app');
try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
w.ST.sheet='customWorkout';w.ST.sheetData={draft:{id:'cw_t',name:'',emoji:'💪',exercises:[]},isNew:true};w.ST.tab='work';w.render();
T('nessun campo file dentro la pagina (verrebbe perso ridisegnando)',!app().querySelector('input[type=file]'));
const lab=[...app().querySelectorAll('label')].find(l=>/IMPORTA DA FOTO O PDF/.test(l.textContent));T('tasto importa presente',!!lab&&/__pickWorkoutFiles/.test(lab.getAttribute('onclick')));
let clicked=0;const oc=w.HTMLInputElement.prototype.click;w.HTMLInputElement.prototype.click=function(){clicked++;};
w.__pickWorkoutFiles();const inp=D.getElementById('ftImpFiles');
T('campo file fisso fuori dall\'app',!!inp&&inp.parentNode===D.body&&inp.multiple&&/pdf/.test(inp.accept)&&clicked===1);
w.render();w.render();T('resta dopo i ridisegni (ritorno da secondo piano)',D.getElementById('ftImpFiles')===inp);
w.__pickWorkoutFiles();T('riusato, non duplicato',D.querySelectorAll('#ftImpFiles').length===1&&clicked===2);
let got=null;w.importWorkoutFiles=(x)=>{got=x;};
const f=new w.File(['Panca 4x10'],'scheda.png',{type:'image/png'});Object.defineProperty(inp,'files',{value:[f],configurable:true});inp.dispatchEvent(new w.Event('change'));
T('scelto il file → la lettura parte',!!got&&got.files.length===1&&got.files[0].name==='scheda.png');
w.__pickCamera();const cam=D.getElementById('ftImpCam');T('fotocamera: campo fisso con scatto diretto',!!cam&&cam.getAttribute('capture')==='environment'&&cam.parentNode===D.body);
w.HTMLInputElement.prototype.click=oc;
console.log('feat96   ok='+ok+' fail='+fail);process.exit(fail?1:0);
