const boot=require('./harness_lib');const file=process.argv[2]||'Index.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));w.alert=()=>{};w.confirm=()=>true;
w.saveU=()=>Promise.resolve(true);const app=()=>w.document.getElementById('app');
const src=require('fs').readFileSync(file,'utf8');
const W=(arr)=>arr.map(d=>({d,woId:'A',isRest:false}));
w.ST.programStart='2026-09-01';
// 4 settimane piene (5 ott - 1 nov) → settimana del 2 nov è di scarico, parte col primo allenamento
const four=['2026-10-06','2026-10-08','2026-10-13','2026-10-15','2026-10-20','2026-10-22','2026-10-27','2026-10-29'];
w.ST.wLog=W(four);
let c=w.__dlCalc('2026-11-04');T('dopo 4 settimane: scarico attivo oggi (parte con l\'allenamento di oggi)',c.on&&c.startsToday&&c.start==='2026-11-04'&&c.end==='2026-11-10',c.start+'→'+c.end);
w.ST.wLog=W([...four,'2026-11-04']);c=w.__dlCalc('2026-11-04');T('fatto il primo allenamento: scarico dal 4 al 10 novembre',c.on&&c.start==='2026-11-04'&&c.end==='2026-11-10');
T('dura 7 giorni: il 10 ancora scarico',w.__dlCalc('2026-11-10').on);
T('l\'11 finisce',!w.__dlCalc('2026-11-11').on);
w.ST.wLog=W([...four,'2026-11-04','2026-11-12']);T('allenamento dopo lo scarico: normale',!w.__dlCalc('2026-11-12').on);
// lunedì della settimana di scarico, prima di allenarsi
w.ST.wLog=W(four);c=w.__dlCalc('2026-11-02');T('lunedì: scarico pronto, parte col primo allenamento',c.on&&c.startsToday);
// settimana di scarico senza allenamenti → salta
w.ST.wLog=W(four);c=w.__dlCalc('2026-11-10');T('settimana di scarico senza allenamenti → saltata',!c.on&&c.skipped&&c.skipped.from==='2026-11-02',JSON.stringify(c.skipped));
w.ST.wLog=W([...four,'2026-11-10']);c=w.__dlCalc('2026-11-10');T('rientro dopo la settimana vuota: niente scarico, avviso',!c.on&&!!c.skipped&&c.weeksLeft>=3,c.weeksLeft);
w._userPickedDate=true;w.currentDateStr='2026-11-10';w.ST.p.nutritionOff=false;w.ST.tab='home';w.render();T('avviso "settimana di scarico saltata" in home',/Settimana di scarico saltata/.test(app().textContent));
w.ST.p.dlSkipSeen=c.skipped.from;w.render();T('avviso chiudibile',!/Settimana di scarico saltata/.test(app().textContent));
// continuità persa: 2 settimane, una vuota, 2 settimane → niente scarico
w.ST.wLog=W(['2026-10-06','2026-10-13','2026-10-27','2026-11-03']);T('settimana vuota in mezzo azzera il conteggio',!w.__dlCalc('2026-11-09').on);
// scarico che parte a metà settimana
w.ST.wLog=W([...four,'2026-11-05']);c=w.__dlCalc('2026-11-09');T('parte giovedì 5 → dura fino a mercoledì 11',c.on&&c.start==='2026-11-05'&&c.end==='2026-11-11');
// banner con date
w.currentDateStr='2026-11-04';w.ST.wLog=W([...four,'2026-11-04']);w.ST.deloadDismissed=null;w.render();
T('banner scarico con le date',/SETTIMANA DI SCARICO/.test(app().textContent)&&/al /.test(app().textContent));
T('isDeloadWeek dinamico usato dai carichi',w.getSetsReps('compound','cut',3,'total').note&&/Deload/.test(w.getSetsReps('compound','cut',3,'total').note));
w.ST.wLog=[];T('senza allenamenti: niente scarico',!w.isDeloadWeek(w.ST.programStart));

// recuperi coerenti e durata rispettata
let bad=[],maxShort=0;
for(const t of ['cut','bulk'])for(const focus of ['total','hyp','strength','lower'])for(const loc of ['gym','home'])for(const dur of [15,20,30,45,60,90])for(const id of ['A','B','C','D','E'])for(const wk of [1,9]){
  w.ST.p.dur=dur;const wo=w.buildWorkout(id,{...w.ST.p,t,dur,focus,loc,cardioLevel:2},wk,{},'m',{});
  const tol=dur<=30?3:5;if(wo.estMin>dur+tol)bad.push(t+focus+dur+id+'='+wo.estMin);
  const ex=wo.exercises.filter(e=>!e.isWarmup&&!e.isCooldown&&!e.isExtra);if(ex.length<3)bad.push('esercizi '+t+dur+id);
  if(dur<=20)maxShort=Math.max(maxShort,...ex.map(e=>e.rest));
  if(ex.some(e=>e.rest>240))bad.push('pausa lunga '+t+dur+id);
}
T('mai oltre la durata + margine (15→18, 30→33, oltre +5)',!bad.length,bad.slice(0,4).join(' '));
T('15-20 minuti: recuperi al massimo 90s',maxShort<=90,maxShort);
w.ST.p.dur=60;
{const P={...w.ST.p,t:'bulk',dur:60,focus:'strength'},Q={...w.ST.p,t:'cut',dur:60,focus:'total'};
 const a=w.buildWorkout('B',P,9,{},'m',{}).exercises.find(e=>e.id&&e.slot==='B1'),b=w.buildWorkout('B',Q,1,{},'m',{}).exercises.find(e=>e.slot==='B1');
 T('poche ripetizioni pesanti → più recupero di tante ripetizioni',a.rest>b.rest,a.reps+'/'+a.rest+'s vs '+b.reps+'/'+b.rest+'s');}
{const wo=w.buildWorkout('A',{...w.ST.p,t:'cut',dur:60},1,{},'m',{});const ex=wo.exercises.filter(e=>!e.isWarmup&&!e.isCooldown&&!e.isExtra);
 T('recupero mostrato = recupero stimato (isolamenti ≤90s, multiarticolari ≤180s)',ex.every(e=>e.t==='compound'?e.rest<=180:e.rest<=90));}

// bottone OK
w.currentDateStr='2026-11-04';w.ST.wLog=[];w.ST.aWo='A';w.ST.step=1;w.ST.woPhase='exercise_done';w.render();
T('bottoni: Troppo dura / OK / Facile',/Troppo dura/.test(app().textContent)&&/👍OK/.test(app().textContent.replace(/\s/g,''))&&!/Giusta/.test(app().textContent));
w.setFeel(w.getEx().id,'ok');w.render();T('OK = continuiamo così',/continuiamo così/.test(app().textContent));
// video
w.ST.woPhase='ready';w.render();const a=app().querySelector('a[href*="youtube.com/results"]');
T('video "come si fa" sull\'esercizio',!!a&&/Panca|panca/.test(decodeURIComponent(a.getAttribute('href')))&&a.getAttribute('target')==='_blank');
// coach: kcal, avatar, voci
const said=[];const VO=[{name:'Alice',lang:'it-IT'},{name:'Luca',lang:'it-IT'},{name:'Google italiano',lang:'it-IT',default:true},{name:'Daniel',lang:'en-GB'},{name:'Samantha',lang:'en-US',default:true},{name:'Bubbles',lang:'en-US'}];
w.SpeechSynthesisUtterance=function(t){this.text=t};w.speechSynthesis={speaking:false,pending:false,speak(u){said.push(u)},cancel(){},getVoices(){return VO},addEventListener(){}};
w.ST.p.coachMode=true;w.ST.p.coachAvatar='m';w.ST.p.coachVoice={};
w.Coach.prev={a:'A',st:1,set:0,ph:'ready',p:false};w.ST.aWo=null;w.ST.sheet='workoutDone';w.ST.sheetData={vol:2500,kcal:340,dur:48,exCount:7,prCount:0,woName:'A'};w.Coach.tick();
let u=said[said.length-1];T('coach finale: calorie consumate',/340 calorie consumate/.test(u.text),u.text.slice(0,140));
T('uomo → voce maschile (Luca), tono naturale',u.voice&&u.voice.name==='Luca'&&u.pitch===1);
w.ST.p.coachAvatar='f';w.Coach.say('ciao',{int:true});u=said[said.length-1];T('donna → voce femminile (Alice)',u.voice.name==='Alice');
w.ST.p.coachAvatar='robot';w.Coach.say('ciao',{int:true});u=said[said.length-1];T('robot → voce acuta e vivace come l\'orso',u.pitch>1&&u.rate>1,u.voice.name+' '+u.pitch);
w.ST.p.coachAvatar='animal';w.Coach.say('ciao',{int:true});u=said[said.length-1];T('animale → voce di sistema più vivace',u.voice.name==='Google italiano'&&u.pitch>1&&u.pitch<=1.4);
w.ST.p.coachVoice={it:'Alice'};w.ST.p.coachAvatar='m';w.Coach.say('ciao',{int:true});u=said[said.length-1];T('niente scelta manuale: uomo resta voce maschile',u.voice.name==='Luca');
w.ST.lang='en';w.ST.p.coachVoice={};w.Coach.say('hi',{int:true});u=said[said.length-1];T('EN uomo → Daniel, mai voci "novelty"',u.voice.name==='Daniel'&&u.lang==='en-GB');
w.ST.lang='it';w.ST.aWo=null;w.ST.sheet=null;w.ST.tab='set';w.render();
const card=app().querySelector('#sec-coachmode');
T('impostazioni: 4 avatar',card&&card.querySelectorAll('button[onclick^="setCoachAvatar"]').length===4&&/Robot/.test(card.textContent)&&/Orso/.test(card.textContent));
T('impostazioni: niente tendina voci, voce standard indicata',!app().querySelector('#coachVoiceSel')&&/Voce maschile standard|Voce femminile standard|Voce acuta e vivace/.test(card.textContent));
w.setCoachAvatar('robot');T('avatar scelto salvato e mostrato',w.ST.p.coachAvatar==='robot'&&/svg/.test(w.document.getElementById('coachAvImg')?w.document.getElementById('coachAvImg').getAttribute('src'):w.__coachAv()));
w.render();T('robot: indicata voce acuta e vivace',/Voce acuta e vivace/.test(app().querySelector('#sec-coachmode').textContent));
T('niente più foto incorporata',!/data:image\/jpeg;base64,\/9j/.test(src));
T('coach chiede troppo dura / ok / facile',/troppo dura, ok o facile/.test(src));
T('tour IT/EN aggiornato',/scegliere l'avatar/.test(src)&&/pick the avatar/.test(src)&&/settimana di scarico parte/i.test(src));
T('versione S76+',/build-SESSION(7[6-9]|[89]\d)/.test(src));
// ── SOLO CARDIO e più allenamenti al giorno ──
const clr=()=>{try{w.localStorage.removeItem('ft_wo_pending_v1')}catch(_){}};
w._userPickedDate=true;w.currentDateStr='2026-11-04';w.ST.wLog=[];w.ST.aWo=null;w.ST.sheet=null;w.ST.p.coachMode=false;w.ST.exFeel={};w.ST.cardioFit=null;w.ST.lang='it';
w.ST.p={...w.ST.p,t:'cut',dur:45,cardioLevel:2,cardioMode:'auto',sessions:3,focus:'total'};
let cw=w.buildWorkout('CARDIO',w.ST.p,3,{},'m',{});
T('solo cardio: riscaldamento + cardio + defaticamento',cw.isCardio&&cw.exercises.length===3&&cw.exercises[0].isWarmup&&cw.exercises[2].isCooldown,cw.exercises.map(e=>e.id).join(','));
T('solo cardio in definizione con livello 2: HIIT ≤20 min con come fare',cw.cardioMode==='hiit'&&cw.mainMin<=20&&cw.exercises[1].steps.length>=4,cw.mainMin);
w.ST.p.cardioMode='bike';cw=w.buildWorkout('CARDIO',w.ST.p,3,{},'m',{});T('rispetta il cardio preferito (bici) e l\'intensità (30 min)',cw.cardioMode==='bike'&&cw.mainMin===30,cw.mainMin);
w.ST.p.dur=20;cw=w.buildWorkout('CARDIO',w.ST.p,3,{},'m',{});T('sta nella durata scelta (20 min)',cw.estMin<=20,cw.estMin);w.ST.p.dur=45;
w.ST.p.cardioMode='run';w.ST.wLog=[{d:'2026-11-03',woId:'B',t:'GAMBE',isRest:false}];cw=w.buildWorkout('CARDIO',w.ST.p,3,{},'m',{});T('dopo le gambe: basso impatto (bici)',cw.cardioMode==='bike');
w.ST.p.cardioMode='bike';w.ST.wLog=[{d:'2026-11-04',woId:'A',t:'PETTO',isRest:false,dur:45}];cw=w.buildWorkout('CARDIO',w.ST.p,3,{},'m',{});T('come extra dopo i pesi: più corto',cw.mainMin<30,cw.mainMin);
w.ST.cardioFit={i:1,ok:0};cw=w.buildWorkout('CARDIO',{...w.ST.p},3,{},'m',{});T('tarato su com\'è andata (livello basso → più corto)',cw.mainMin<21,cw.mainMin);w.ST.cardioFit=null;
// flusso completo cardio
w.ST.wLog=[];w.ST.wHistory={};w.startWo('CARDIO');w.ST.woPaused=null;
T('avvio cardio',w.ST.aWo==='CARDIO'&&w.getWo().name==='SOLO CARDIO');
w.ST.step=1;w.ST.woPhase='ready';w.render();T('schermata cardio senza "sostituisci"',!/SOSTITUISCI QUESTO/.test(app().textContent));
w.ST.step=2;w.ST.woPhase='exercise_done';w.ST.workoutStartTs=Date.now()-28*6e4;w.advanceExercise();
T('cardio salvato nello storico',w.ST.wLog.some(x=>x.woId==='CARDIO'&&x.dur>=27&&x.kcal>0));
w.ST.tab='work';w.render();T('dopo solo cardio la scheda del giorno resta da fare',/ALLENAMENTO|PETTO/.test(app().textContent)&&w.getNextWorkoutForDay(w.ST.wLog,3,w.ST.programStart,'2026-11-04','total')==='A');
w.ST.tab='home';w.render();T('home ok con cardio registrato',/PETTO|ALLENAMENTO/.test(app().textContent));
// due schede nello stesso giorno
clr();w.ST.wLog=[{d:'2026-11-04',woId:'A',t:'PETTO & TRICIPITI',isRest:false,dur:45,vol:3000}];
w.ST.tab='work';w.render();const xcard=w.document.getElementById('extraWoCard');
T('dopo la scheda: proposta di allenarsi ancora',xcard&&/allenarti ancora/.test(xcard.textContent));
T('seconda scheda = quella che manca (B), non di nuovo A',w.__nextExtraScheda()==='B'&&/startWo\('B'\)/.test(xcard.innerHTML));
w.ST.tab='home';w.render();T('home: riga "allenati ancora"',/Allenati ancora/.test(app().textContent));
w.startWo('B');w.ST.woPaused=null;T('seconda sessione parte da capo (non riprende la A)',w.ST.aWo==='B'&&w.ST.step===0);
w.ST.step=w.getWo().exercises.length-1;w.ST.woPhase='exercise_done';w.ST.workoutStartTs=Date.now()-40*6e4;w.advanceExercise();
T('due allenamenti nello stesso giorno nello storico',w.ST.wLog.filter(x=>x.d==='2026-11-04'&&!x.isRest&&!x.partial&&x.woId!=='CARDIO').length===2);
T('la prima sessione non è stata toccata',w.ST.wLog.some(x=>x.woId==='A'&&x.vol===3000));
// uscita a metà della seconda sessione: parziale solo se fatto qualcosa in QUESTA
w.ST.wLog=[{d:'2026-11-04',woId:'A',t:'PETTO',isRest:false,dur:45,vol:3000}];w.ST.wHistory={'2026-11-04':{ch_man:{ok:true,kg:30}}};
w.startWo('C');w.ST.woPaused=null;w.ST.workoutStartTs=Date.now()-6e4;w.closeWo();T('esco subito dalla 2ª: nessun parziale finto',!w.ST.wLog.some(x=>x.woId==='C'));
w.startWo('C');w.ST.woPaused=null;const c1=w.getWo().exercises[1].id;w.ST.wHistory['2026-11-04'][c1]={ok:true,kg:40};w.ST.currVol=800;w.closeWo();T('esco dalla 2ª dopo un esercizio: parziale salvato',w.ST.wLog.some(x=>x.woId==='C'&&x.partial));
// riposo non cancella
w.ST.wLog=[{d:'2026-11-04',woId:'A',t:'PETTO',isRest:false}];w.logRestDay();T('registrare riposo non cancella l\'allenamento fatto',w.ST.wLog.some(x=>x.woId==='A')&&!w.ST.wLog.some(x=>x.isRest));
// settimana: cardio registrato non rompe calendario
w.ST.wLog=[{d:'2026-11-04',woId:'CARDIO',t:'SOLO CARDIO',isRest:false,dur:28}];let okR=true;for(const tb of ['home','work','stats','body','set','coach','diet']){try{w.ST.tab=tb;w.render()}catch(e){okR=false;console.log(tb,e.message)}}T('tutte le schermate con cardio nello storico',okR);
T('EN: card cardio',(()=>{clr();w.ST.lang='en';w.ST.wLog=[];w.ST.tab='work';w.render();const ok=/Just cardio today/.test(app().textContent);w.ST.lang='it';return ok;})());
