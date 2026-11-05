const boot=require('./harness_lib');const file=process.argv[2]||'Index-SORGENTE.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));w.alert=()=>{};w.confirm=()=>true;w.saveU=()=>Promise.resolve(true);
const src=require('fs').readFileSync(file,'utf8');const said=[];let VO=[];const timers=[];
w.setTimeout=(f)=>{timers.push(f);return 0};
w.SpeechSynthesisUtterance=function(t){this.text=t;this.pitch=1;this.rate=1};w.speechSynthesis={speaking:false,pending:false,speak(u){said.push(u)},cancel(){},getVoices(){return VO},addEventListener(){}};
w.ST.p.coachMode=true;w.ST.lang='it';
const sayAs=(k)=>{w.ST.p.coachAvatar=k;w.Coach.say('prova',{int:true});return said[said.length-1];};
const sig=(u)=>(u.voice?u.voice.name:'-')+'/'+u.pitch+'/'+u.rate;
// iPhone tipico: una sola voce italiana installata (Alice)
VO=[{name:'Alice',lang:'it-IT',default:true,localService:true},{name:'Samantha',lang:'en-US',localService:true}];
let s=['m','f','robot','animal'].map(k=>sig(sayAs(k)));
T('una sola voce sul telefono: le 4 voci suonano comunque diverse',new Set(s).size===4,s.join(' | '));
T('uomo senza voce maschile: tono decisamente più grave',sayAs('m').pitch<=0.8);
T('donna: Alice con tono naturale',sayAs('f').voice.name==='Alice'&&sayAs('f').pitch===1);
// con voci maschili e sintetiche disponibili
VO=[{name:'Alice',lang:'it-IT',default:true},{name:'Luca',lang:'it-IT'},{name:'Eddy (italiano (Italia))',lang:'it-IT'},{name:'Federica (Migliorata)',lang:'it-IT'},{name:'Daniel',lang:'en-GB'},{name:'Samantha',lang:'en-US',default:true}];
T('uomo → Luca, tono naturale',sig(sayAs('m'))==='Luca/1/1');
T('donna → versione migliorata preferita',sayAs('f').voice.name==='Federica (Migliorata)');
T('robot → voce sintetica Eddy',/Eddy/.test(sayAs('robot').voice.name));
T('animale → voce di sistema vivace',sayAs('animal').voice.name==='Alice'&&sayAs('animal').pitch>1);
T('lingua dell\'enunciato = lingua della voce (iOS)',sayAs('m').lang==='it-IT'&&sayAs('m').voice.lang==='it-IT');
w.ST.lang='en';T('EN uomo → Daniel en-GB',sayAs('m').voice.name==='Daniel'&&sayAs('m').lang==='en-GB');T('EN donna → Samantha',sayAs('f').voice.name==='Samantha');w.ST.lang='it';
// voci non ancora caricate: riprova
VO=[];const n0=said.length;w.ST.p.coachAvatar='m';w.Coach.say('ciao',{int:true});T('voci non pronte: non parla subito con la voce sbagliata',said.length===n0&&timers.length>0);
VO=[{name:'Luca',lang:'it-IT'}];timers.splice(0).forEach(f=>{try{f()}catch(_){}});T('…e parla appena le voci arrivano, con la voce giusta',said.length===n0+1&&said[said.length-1].voice.name==='Luca');
// prova voce funziona anche a coach spento
w.ST.p.coachMode=false;const n1=said.length;w.Coach.test();T('PROVA VOCE funziona anche con il coach spento',said.length>n1&&/coach/.test(said[said.length-1].text));w.ST.p.coachMode=true;
// impostazioni mostrano la voce usata e cosa scaricare
VO=[{name:'Alice',lang:'it-IT',default:true}];w.ST.p.coachAvatar='m';w.ST.tab='set';w.render();
const c=w.document.getElementById('sec-coachmode').textContent;T('impostazioni: voce usata + consiglio di scaricare Luca',/Alice \(it-IT\)/.test(c)&&/tono e ritmo diversi/.test(c),c.match(/Voce maschile[^.]*\./)&&c.match(/Voce maschile[^.]*\./)[0]);
VO=[{name:'Luca',lang:'it-IT'}];w.render();T('con Luca installato niente consiglio',!/tono e ritmo diversi/.test(w.document.getElementById('sec-coachmode').textContent));
T('versione S78+',/build-SESSION(7[89]|8\d)/.test(src));
// S79: elenco voci disponibili e aggiornamento card
VO=[{name:'Alice',lang:'it-IT',default:true},{name:'Luca',lang:'it-IT'}];w.ST.lang='it';w.ST.p.coachMode=true;w.ST.tab='set';w.render();
{const d=w.document.querySelector('#sec-coachmode details');T('elenco voci disponibili nelle impostazioni',d&&/Voci che il telefono dà all'app \(2\)/.test(d.textContent)&&/Luca · it-IT/.test(d.textContent)&&/tono e ritmo/.test(d.textContent));}
T('versione S79+',/build-SESSION(79|8\d)/.test(src));
{VO=[{name:'Alice',lang:'it-IT',default:true},{name:'Alice',lang:'it-IT',default:true}];w.render();const d=w.document.querySelector('#sec-coachmode details');T('voci doppie mostrate una volta (base + ottimizzata)',/\(1\)|\(2\)/.test(d.textContent)&&(d.textContent.match(/Alice ·/g)||[]).length===1&&/base \+ ottimizzata/.test(d.textContent));}
{VO=[{name:'Alice',lang:'it-IT',default:true}];const P=['m','f','robot','animal'].map(k=>{w.ST.p.coachAvatar=k;w.Coach.say('x',{int:true});const u=said[said.length-1];return u.pitch;});T('solo Alice: toni ben separati (uomo ≤0.65, animale ≥1.3)',P[0]<=0.65&&P[3]>=1.3&&P[1]===1,P.join(','));}
