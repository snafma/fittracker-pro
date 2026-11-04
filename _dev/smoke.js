const boot=require('./harness_lib');const w=boot(process.argv[2]||'Index.html');
const tabs=['home','work','diet','shopping','stats','measures','body','coach','social','profile','set','share'];let f=0;
for(const lang of ['it','en'])for(const tb of tabs){try{w.ST.lang=lang;w.ST.tab=tb;w.ST.sheet=null;w.render();if(w.document.getElementById('app').textContent.length<50){console.log('✗',lang,tb,'vuoto');f++}}catch(e){console.log('✗',lang,tb,e.message.split('\n')[0]);f++}}
console.log(f?'❌ FAIL '+f:'✅ SMOKE OK (24 render)');process.exit(0);
