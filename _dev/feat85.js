const boot=require('./harness_lib');const file=process.argv[2]||'Index-SORGENTE.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));let alerts=[];w.alert=(m)=>alerts.push(m);w.confirm=()=>true;w.saveU=()=>Promise.resolve(true);
w._userPickedDate=true;w.currentDateStr='2026-11-05';const src=require('fs').readFileSync(file,'utf8');const app=()=>w.document.getElementById('app');
w.AU.profile=Object.assign({},w.AU.profile||{},{fn:'Marcello',ln:'Rossi'});
// 1) niente SCATTA FOTO, resta IMPORTA
w.ST.tab='set';w.ST.p.nutritionOff=false;w.render();let H=app().innerHTML;
T('tolto SCATTA FOTO (l\'import da foto apre già la fotocamera)',!/SCATTA FOTO/.test(H)&&/IMPORTA DA FOTO O PDF/.test(H));
// 2) community nelle integrazioni
let tx=app().textContent;const pi=tx.indexOf('INTEGRAZIONI E IMPORTAZIONI'),pc=tx.indexOf('CONDIVISIONE COMMUNITY'),pn=tx.indexOf('SEZIONE ALIMENTAZIONE');
T('condivisione community spostata in Integrazioni',pc>pi&&pi>pn,pc+' '+pi);
w.ST.p.nutritionOff=true;w.render();T('community nascosta se l\'alimentazione è spenta',!/CONDIVISIONE COMMUNITY/.test(app().textContent));w.ST.p.nutritionOff=false;
// 3) notifiche coerenti
w.Notification={permission:'granted',requestPermission:async()=>'granted'};w.ST.notifPrefs={...(w.ST.notifPrefs||{}),master:false};w.render();tx=app().textContent;
T('notifiche spente: niente "attive" verde',!/Notifiche attive/.test(tx)&&!/abilitate dal browser/.test(tx)&&/notifiche dell'app sono spente/.test(tx));
w.ST.notifPrefs.master=true;w.render();T('notifiche accese: "Notifiche attive"',/Notifiche attive/.test(app().textContent));
// 4) nome e coerenza del coach
T('nome dell\'utente dal profilo',w.__firstName()==='Marcello');
w.ST.p={...w.ST.p,t:'cut',g:80,targetD:'2027-06-01'};w.ST.h=[{d:'2026-10-22',w:90.3},{d:'2026-10-29',w:90.2},{d:'2026-11-05',w:90.1}];w.ST.goalPaceSnooze=null;
w.ST.wLog=[{d:'2026-10-27',woId:'A',isRest:false},{d:'2026-10-29',woId:'B',isRest:false},{d:'2026-10-31',woId:'C',isRest:false},{d:'2026-11-03',woId:'A',isRest:false},{d:'2026-11-05',woId:'B',isRest:false}];
w.ST.tab='home';w.render();H=app().innerHTML;tx=app().textContent;
T('home: UN solo messaggio sull\'obiettivo (card del coach)',w.document.querySelectorAll('#app .coach-card').length===1&&(tx.match(/Fattibile, ma serve più impegno/g)||[]).length===1);
T('coach del giorno: nome, costanza e peso lento nello stesso messaggio',/Marcello, gli allenamenti vanno alla grande \(5 nelle ultime 2 settimane\), ma il peso scende piano/.test(tx),tx.match(/Marcello[^.]*\./)&&tx.match(/Marcello[^.]*\./)[0]);
T('niente frasi in contrasto ("costanza" generica + "fatichi" in due card)',!/Due settimane piene di costanza/.test(tx));
T('bottone cardio nel messaggio del coach',/FAI UNA SESSIONE SOLO CARDIO/.test(tx));
w.ST.tab='coach';w.ST.coachView='tips';w.render();T('AI Coach › Consigli: stesso messaggio',/Fattibile, ma serve più impegno/.test(app().textContent)&&/Marcello, gli allenamenti/.test(app().textContent));
w.ST.p.targetD='2027-12-31';w.ST.h=[{d:'2026-10-22',w:91.5},{d:'2026-11-05',w:90.1}];w.ST.tab='home';w.render();
const m=w.getMotivationalMsg({status:'ok'},w.ST,90.1,{kcal:2000},{});T('obiettivo in linea: messaggio normale col nome',m&&/^Marcello, /.test(m.msg),m&&m.msg.slice(0,60));
const said=[];w.SpeechSynthesisUtterance=function(t){this.text=t};w.speechSynthesis={speak(u){said.push(u.text)},cancel(){},getVoices(){return[{name:'Alice',lang:'it-IT'}]},addEventListener(){}};
w.ST.p.coachMode=true;w.Coach.test();T('il coach vocale usa il nome',said.some(s=>/Ciao Marcello!/.test(s)));w.ST.p.coachMode=false;
// 5) account
const calls=[];w.FBAuth=Object.assign({},w.FBAuth||{},{auth:{currentUser:{email:'m@x.it',emailVerified:false,displayName:''}},setName:async(u,n)=>calls.push('name:'+n),sendVerify:async()=>calls.push('verify'),reload:async()=>{w.FBAuth.auth.currentUser.emailVerified=true;calls.push('reload')},changeEmail:async(pw,e)=>calls.push('email:'+pw+':'+e),resetPw:async(e)=>calls.push('reset:'+e)});
w.ST.tab='profile';w.render();H=app().innerHTML;tx=app().textContent;
T('profilo: card nome ed email con email NON VERIFICATA',/NOME E EMAIL/.test(tx)&&/m@x\.it/.test(tx)&&/NON VERIFICATA/.test(tx)&&/INVIA EMAIL DI VERIFICA/.test(tx));
T('profilo: scorciatoie alle 5 sezioni',['pf-account','pf-body','pf-security','pf-privacy','pf-danger'].every(i=>w.document.getElementById(i))&&(H.match(/scrollIntoView/g)||[]).length>=5);
const ord=[...app().querySelectorAll('[id^="pf-"]')].map(x=>x.id).filter(x=>x!=='pf-news').join(',');T('ordine: nome ed email, dati fisici, sicurezza, privacy, elimina',ord==='pf-account,pf-body,pf-security,pf-privacy,pf-danger',ord);
(async()=>{
w.document.getElementById('acFn').value='Marco';w.document.getElementById('acLn').value='Bianchi';await w.saveAccountName();
T('salva nome e cognome (profilo + account)',w.AU.profile.fn==='Marco'&&w.AU.profile.ln==='Bianchi'&&calls.includes('name:Marco Bianchi'));
await w.sendVerifyEmail();T('invia email di verifica',calls.includes('verify')&&alerts.some(a=>/Email di verifica inviata/.test(a)));
await w.checkVerified();T('dopo il link: verificata',alerts.some(a=>/Email verificata/.test(a)));w.render();T('badge VERIFICATA',/✓ VERIFICATA/.test(app().textContent));
w.document.getElementById('acNewEm').value='nuova@x.it';w.document.getElementById('acPw').value='Pass1!';await w.changeAccountEmail();T('cambio email con conferma sulla nuova casella',calls.includes('email:Pass1!:nuova@x.it'));
alerts=[];w.document.getElementById('acNewEm').value='nonvalida';await w.changeAccountEmail();T('email non valida bloccata',alerts.some(a=>/email valida/.test(a)));
await w.sendResetFromProfile();T('password dimenticata: email di reset',calls.includes('reset:m@x.it'));
T('login: recupero password presente',/log_forgot/.test(src)&&/doForgotStep1/.test(src));
// 6) condividi app
w.ST.tab='share';w.render();tx=app().textContent;H=app().innerHTML;
T('condividi: grande CONDIVIDI + 4 canali + link + QR + come si installa',/CONDIVIDI/.test(tx)&&/WhatsApp/.test(tx)&&/Telegram/.test(tx)&&/Messaggi/.test(tx)&&/Email/.test(tx)&&/IL TUO LINK/.test(tx)&&!!w.document.getElementById('shQr')&&/COME SI INSTALLA/.test(tx));
T('messaggio personalizzato col nome',/Marco ti invita a provare FitTracker PRO/.test(tx));
let opened=null;w.open=(u)=>{opened=u};w.shareOpen('wa');T('WhatsApp con messaggio',/wa\.me\/\?text=Marco%20ti%20invita/.test(opened),opened&&opened.slice(0,60));
T('tour IT/EN aggiornato',/Nel Profilo, diviso in sezioni/.test(src)&&/In Profile, split into sections/.test(src));
T('versione S85+',/build-SESSION(8[5-9]|9\d)/.test(src));
})();
setTimeout(()=>{w.FBAuth.auth.currentUser.emailVerified=false;w.ST.tab='profile';w.render();const sec=w.document.getElementById('pf-security'),bd=w.document.getElementById('pf-body');
T('cambia password nella sezione Sicurezza',(!/CAMBIA PASSWORD/.test(app().textContent))||(/CAMBIA PASSWORD/.test(sec.textContent)&&!/CAMBIA PASSWORD/.test(bd.textContent)));},300);
