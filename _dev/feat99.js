const fs=require('fs');const file=process.argv[2]||'Index-SORGENTE.html';const src=fs.readFileSync(file,'utf8');let ok=0,fail=0;
const T=(n,c,x)=>{c?ok++:fail++;console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));};
T('versione S99+',+src.match(/build-SESSION(\d+)-BOOT/)[1]>=99);
const w=require('./harness_lib')(file);try{w.localStorage.setItem('ft_news_seen_v','999');}catch(_){}
const P=(t)=>w.__parseWorkoutLocal(t),S=(r)=>r.map(x=>x.name+': '+x.exercises.map(e=>e.name+' '+e.sets+'x'+e.reps+(e.rest!=null?' r'+e.rest:'')+(e.kg!=null?' '+e.kg+'kg':'')).join(', ')).join(' || ');
// 1) PDF reale (Google Sheets): 3 schede una sotto l'altra, colonna muscolo, recupero senza "rec"
const pages=JSON.parse(fs.readFileSync(__dirname+'/fixtures/scheda-abc-pdf.json','utf8'));
const txt=pages.map(p=>w.__pdfRows(p)).join('\n');
T('PDF: colonne separate da più spazi',/Panca piana bilancere o manubri {2,}3x12 {2,}30''/.test(txt));
let r=P(txt);
T('PDF: 3 schede (A, B, C)',r.length===3&&/SCHEDA A/.test(r[0].name)&&/SCHEDA C/.test(r[2].name),r.map(x=>x.name).join('|'));
T('PDF: tutti i 22 esercizi, nessuno perso',r.reduce((s,x)=>s+x.exercises.length,0)===22,r.map(x=>x.exercises.length).join('+'));
T('PDF: gruppo muscolare non diventa esercizio né prefisso',!r.some(x=>x.exercises.some(e=>/^(Petto|Schiena|Spalle|Gambe|Polpacci|Bicipiti|Tricipiti|Addominali|MUSCOLO)/.test(e.name))));
const pi=r[0].exercises[1];T('PDF: serie, ripetizioni e recupero (30\'\')',pi.name==='Panca inclinata bilancere o manubri'&&pi.sets===3&&pi.reps==='10'&&pi.rest===30,JSON.stringify(pi));
T('PDF: recupero 40\'\'',r[0].exercises[3].rest===40);
T('PDF: tempo "3x30\'\'" = 30 secondi',r[2].exercises[2].reps==='30s'&&r[2].exercises[2].rest===30);
T('PDF: "almeno 6" tenuto nelle note',/almeno 6/.test(r[0].exercises[6].note||''));
// 2) tabelle affiancate con colonne separate SERIE / RIP / REC / KG
r=P(['GIORNO 1                                         GIORNO 2','ESERCIZIO          SERIE  RIP   REC   KG        ESERCIZIO        SERIE  RIP   REC','Panca piana        4      8     90    60        Squat            4      6     2\'','Lat machine        3      12    60    45        Leg curl         3      12    60','Croci cavi         3      15    45              Calf raise       4      15    45'].join('\n'));
T('affiancate: due schede con i loro nomi',r.length===2&&r[0].name==='GIORNO 1'&&r[1].name==='GIORNO 2',S(r));
T('affiancate: serie, ripetizioni, recupero e carico dalle colonne',r[0].exercises[0].sets===4&&r[0].exercises[0].reps==='8'&&r[0].exercises[0].rest===90&&r[0].exercises[0].kg===60&&r[1].exercises[0].rest===120&&r[1].exercises[2].name==='Calf raise',S(r));
// 3) intestazioni inglesi, colonna note
r=P(['WORKOUT A','Exercise                 Sets   Reps    Rest    Notes','Bench press              4      8-10    90s     slow eccentric','Barbell row              4      10      90s'].join('\n'));
T('intestazioni inglesi + note',r.length===1&&r[0].exercises.length===2&&r[0].exercises[0].reps==='8-10'&&r[0].exercises[0].rest===90&&/slow eccentric/.test(r[0].exercises[0].note||''),S(r)+' '+JSON.stringify(r[0]&&r[0].exercises[0].note));
// 4) foto (OCR a spazi singoli): intestazione, gruppo muscolare in testa alla riga
r=P(['SCHEDA A','MUSCOLO ALLENATO ESERCIZIO RIPETIZIONI RIPOSO','Panca piana 3x12 30\'\'','Petto Panca inclinata manubri 3x10 1\'30\'\'','Schiena','Rematore 3x12 40"'].join('\n'));
T('foto: intestazione e muscolo ignorati, recupero letto',r.length===1&&r[0].exercises.length===3&&r[0].exercises[1].name==='Panca inclinata manubri'&&r[0].exercises[1].rest===90&&r[0].exercises[2].rest===40&&r[0].exercises[0].rest===30,S(r));
// 5) schede una sotto l'altra con intestazioni diverse
r=P(['Allenamento A','Esercizio   Serie x Rip   Recupero','Squat   4x8   2\'','Allenamento B','Esercizio   Serie   Ripetizioni   Riposo','Stacco   5   5   3\''].join('\n'));
T('una sotto l\'altra, intestazioni diverse',r.length===2&&r[0].exercises[0].rest===120&&r[1].exercises[0].sets===5&&r[1].exercises[0].reps==='5'&&r[1].exercises[0].rest===180,S(r));
// 6) testo semplice invariato
r=P('Panca piana 4x10\nRematore 4x8');T('testo semplice invariato',r.length===1&&r[0].exercises.length===2);
// 7) gergo da palestra riconosciuto
const EX=w.eval('EX'),M=(n)=>(w.__matchExercise(n)[0]||{}).id;
T('gergo: Dip, Spinte seduto, Sopra la testa, Curl martello, Punta piede seduto, Affondi gamba dietro',M('Dip')==='tri_dips'&&M('Spinte seduto')==='sh_db_press_seated'&&M('Sopra la testa da seduto')==='tri_oh'&&M('Curl in piedi martello')==='bi_mar'&&M('Seduto sempre punta piede su rialzo')==='lg_calf_seated'&&M('Affondi con gamba dietro appoggiata')==='lg_bulgarian',[M('Dip'),M('Spinte seduto'),M('Sopra la testa da seduto'),M('Curl in piedi martello'),M('Seduto sempre punta piede su rialzo'),M('Affondi con gamba dietro appoggiata')].join());
const r0=w.__parseWorkoutLocal(txt);const d0=w.__toDraft(r0[0],0);T('PDF: nome scheda proposto',d0.suggestName==='SCHEDA A');
console.log('feat99   ok='+ok+' fail='+fail);process.exit(fail?1:0);
