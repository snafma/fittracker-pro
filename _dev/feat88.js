const boot=require('./harness_lib');const file=process.argv[2]||'Index-SORGENTE.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));w.saveU=()=>Promise.resolve(true);w.confirm=()=>true;w._userPickedDate=true;w.currentDateStr='2026-11-05';
const src=require('fs').readFileSync(file,'utf8');const app=()=>w.document.getElementById('app');
w.AU.profile={...(w.AU.profile||{}),fn:'Marcello'};
const card=(tab,view)=>{w.ST.tab=tab;view&&(w.ST.coachView=view);w.render();const c=app().querySelectorAll('.coach-card');return {n:c.length,c:c[0]};};
const set=(targetD,h)=>{w.ST.p={...w.ST.p,t:'cut',g:80,targetD};w.ST.h=h;};
// arancione: fattibile ma lento
set('2027-06-01',[{d:'2026-10-22',w:90.3},{d:'2026-10-29',w:90.2},{d:'2026-11-05',w:90.1}]);
let a=card('home'),b=card('coach','tips'),c=card('body');
T('stessa card in Home, AI Coach › Consigli e Progressi',a.n===1&&b.n===1&&c.n===1&&a.c.textContent===b.c.textContent&&b.c.textContent===c.c.textContent);
T('fattibile ma lento → bordo ARANCIONE',/border-left:4px solid var\(--ora\)/.test(a.c.getAttribute('style')));
T('stile Progressi: etichetta, target, testo col nome, ritmo/mancano/giorni',/Fattibile/.test(a.c.textContent)&&/Target/.test(a.c.textContent)&&/Marcello/.test(a.c.textContent)&&/Ritmo attuale/.test(a.c.textContent)&&/Giorni a target/.test(a.c.textContent));
// rosso: impossibile
set('2026-12-01',[{d:'2026-10-22',w:90.3},{d:'2026-11-05',w:90.1}]);a=card('home');T('impossibile → bordo ROSSO',/var\(--red\)/.test(a.c.getAttribute('style'))&&/Impossibile/.test(a.c.textContent));
// verde: in linea
set('2027-06-01',[{d:'2026-10-22',w:91.0},{d:'2026-11-05',w:90.1}]);a=card('home');T('in linea → bordo VERDE',/var\(--gre\)/.test(a.c.getAttribute('style')),a.c&&a.c.textContent.slice(0,40));
// nessun obiettivo con data: messaggio motivazionale nello stesso stile, verde
w.ST.p.targetD=null;a=card('home');T('senza data obiettivo: messaggio del coach, stesso stile, verde',a.n===1&&/var\(--gre\)/.test(a.c.getAttribute('style'))&&/Marcello/.test(a.c.textContent));
// intestazioni stile Condividi
for(const tb of ['work','stats','coach','set','profile']){w.ST.tab=tb;w.render();T('intestazione colorata in '+tb,!!app().querySelector('.pg-hero .pg-ico')&&!!app().querySelector('.pg-hero .pg-tt'));}
w.ST.tab='home';w.render();T('Home senza intestazione extra',!app().querySelector('.pg-hero'));
w.ST.tab='set';w.render();T('navigazione rapida a riquadri colorati (Configurazione)',app().querySelectorAll('.qnav .qtile').length>=7);
w.ST.tab='profile';w.render();T('navigazione rapida a riquadri colorati (Profilo)',app().querySelectorAll('.qnav .qtile').length>=5);
T('tour IT/EN aggiornato',/bordo verde se va bene, arancione se serve attenzione/.test(src)&&/green border if all is well/.test(src));
T('versione S88',/build-SESSION(8[8-9]|9\d)/.test(src));
