const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S93+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=93);
const w=require('./harness_lib')(file);try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
w.ST.tab='stats';w.ST.statsView='calc1rm';w.ST.calc1RMInput={weight:'80',reps:'8',sets:'4'};w.render();
const card=w.document.getElementById('rm-out').closest('.card');
T('1RM: nessuna parentesi graffa vagante',!/[{}]/.test(card.textContent));
T('1RM: decimali con la virgola in italiano',/~9,5 ripetizioni/.test(card.textContent));
console.log('feat93   ok='+ok+' fail='+fail);process.exit(fail?1:0);
