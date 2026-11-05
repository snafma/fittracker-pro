const boot=require('./harness_lib');const file=process.argv[2]||'Index-SORGENTE.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));w.alert=()=>{};w.confirm=()=>true;w.saveU=()=>Promise.resolve(true);
w._userPickedDate=true;w.currentDateStr='2026-11-05';const src=require('fs').readFileSync(file,'utf8');const app=()=>w.document.getElementById('app');
const user=w.AU.user;
// 1) avvio
T('auth inizializzata con persistenza (localStorage, poi IndexedDB)',/initializeAuth\(app, \{ persistence: \[browserLocalPersistence, indexedDBLocalPersistence\] \}\)/.test(src));
w.localStorage.setItem('ft_auth_hint_v1','1');w.__authSettled=false;w.AU.user=null;w.AU.loggingIn=false;w.render();
T('sessione salvata ma Firebase non ancora pronto: "Bentornato", NON il login',/Bentornato/.test(app().textContent)&&!w.document.getElementById('lP'));
w.__authNullGrace();T('primo "nessun utente" da iOS: si aspetta ancora (niente login subito)',!w.__authSettled&&/Bentornato/.test(app().textContent));
w.__authSettled=true;w.AU.tab='login';w.localStorage.removeItem('ft_auth_hint_v1');w.render();T('sessione davvero assente: login',!!w.document.getElementById('lP'));
w.__authSettled=false;w.render();T('mai entrato (nessuna sessione salvata): login subito',!!w.document.getElementById('lP'));
w.AU.user=user;w.AU.loadingData=true;w.AU.__ldStart=0;w.render();T('dati in caricamento: attesa, non app vuota',/Bentornato/.test(app().textContent));
w.AU.__ldStart=Date.now()-21000;w.render();T('dati lenti oltre 20s: si entra comunque',!/Riprendo la tua sessione/.test(app().textContent));
w.AU.loadingData=false;w.__authSettled=true;w.ST.tab='home';w.render();T('dati pronti: app',!!app().querySelector('.topbar, .content, .wrap'));
T('callback: sessione decisa solo dopo i dati, grazia per il "nessun utente"',/__authNullGrace\(\)/.test(src)&&/__authHintSet\(!0\)/.test(src)&&/loadingData/.test(src));
// 2) consiglio unico nello stesso stile
w.ST.p={...w.ST.p,t:'cut',g:80,targetD:'2027-06-01'};w.ST.h=[{d:'2026-10-22',w:90.3},{d:'2026-10-29',w:90.2},{d:'2026-11-05',w:90.1}];
w.ST.tab='home';w.render();const homeCard=[...app().querySelectorAll('div')].find(d=>/IL TUO COACH/.test(d.textContent)&&/Messaggio del giorno/.test(d.textContent)&&d.style.borderRadius==='18px');
w.ST.tab='coach';w.ST.coachView='tips';w.render();const tipsCard=[...app().querySelectorAll('div')].find(d=>/IL TUO COACH/.test(d.textContent)&&/Messaggio del giorno/.test(d.textContent)&&d.style.borderRadius==='18px');
T('Consigli: stessa card del coach della Home (stesso stile e testo)',!!homeCard&&!!tipsCard&&homeCard.getAttribute('style')===tipsCard.getAttribute('style')&&homeCard.textContent===tipsCard.textContent);
T('Consigli: niente seconda card in stile diverso',(app().textContent.match(/OBIETTIVO ANCORA RAGGIUNGIBILE/g)||[]).length===1);
// 3) stile e login
T('stile moderno caricato',!!w.document.getElementById('s86css'));
w.AU.user=null;w.__authSettled=true;w.AU.tab='login';w.render();
T('login rinnovato: icona, titolo, sottotitolo, chip',!!app().querySelector('.auth-hero .auth-ico')&&/FitTracker PRO/.test(app().querySelector('.auth-title').textContent)&&app().querySelectorAll('.auth-chips span').length===3&&!!w.document.getElementById('lU')&&!!w.document.getElementById('lP'));
w.AU.tab='reg';w.render();T('registrazione: campi invariati',['aU','aE','aP','aP2'].every(i=>w.document.getElementById(i)));
w.AU.tab='forgot';w.render();T('recupero password: campo email',!!w.document.getElementById('fgE'));
w.AU.user=user;
T('tour IT/EN aggiornato',/L'app ricorda l'accesso/.test(src)&&/The app remembers your login/.test(src));
T('versione S86',/build-SESSION86/.test(src));
