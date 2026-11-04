const boot=require('./harness_lib');const file=process.argv[2]||'Index.html';const w=boot(file);
const T=(n,c,x)=>console.log((c?'✓':'✗ FAIL')+' '+n+(x!==undefined?' ['+x+']':''));w.alert=()=>{};w.confirm=()=>true;w.saveU=()=>Promise.resolve(true);
w._userPickedDate=true;const said=[];w.SpeechSynthesisUtterance=function(t){this.text=t};w.speechSynthesis={speaking:false,pending:false,speak(u){said.push(u.text)},cancel(){},getVoices(){return[{name:'Luca',lang:'it-IT'},{name:'Daniel',lang:'en-GB'}]},addEventListener(){}};
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const days={1:[0],2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,3,4],6:[0,1,2,3,4,5]};
let errs=[];
// 1) rotazione + scarico su 10 settimane, tutte le frequenze e i focus
for(const s of [1,2,3,4,5,6])for(const focus of ['total','upper','lower','glutes','strength']){
  w.ST.wLog=[];w.ST.wHistory={};w.ST.programStart='2026-08-31';w.ST.p={...w.ST.p,sessions:s,focus};
  const rot=w.getRotation(s,focus),need={};rot.forEach(k=>need[k]=(need[k]||0)+1);
  let dlWeeks=[],bad=0;
  for(let wk=0;wk<10;wk++){const got={};let dl=false;
    for(const di of days[s]){const d=new Date('2026-08-31T12:00:00');d.setDate(d.getDate()+wk*7+di);const ds=ymd(d);w.currentDateStr=ds;
      const id=w.getNextWorkoutForDay(w.ST.wLog,s,w.ST.programStart,ds,focus);if(!id){bad++;continue}
      dl=dl||w.isDeloadWeek(w.ST.programStart);
      w.ST.wLog.push({d:ds,woId:id,t:id,isRest:false,dur:50});got[id]=(got[id]||0)+1;}
    if(JSON.stringify(Object.keys(need).sort().map(k=>need[k]))!==JSON.stringify(Object.keys(need).sort().map(k=>got[k]||0)))bad++;
    dl&&dlWeeks.push(wk+1);}
  const exp=[5,10];if(bad||JSON.stringify(dlWeeks)!==JSON.stringify(exp))errs.push(`s${s} ${focus}: bad=${bad} scarico=${dlWeeks}`);
}
T('10 settimane, 1-6 sessioni, ogni focus: ogni settimana tutte le schede previste, scarico in sett. 5 e 10',!errs.length,errs.slice(0,4).join(' | '));
if(process.env.PART==='1')process.exit(0);
// 2) allenamento completo per ogni scheda, IT/EN, coach acceso, con pause, sensazioni, uscita e fine
errs=[];w.ST.wLog=[];w.ST.wHistory={};w.ST.programStart='2026-09-01';w.currentDateStr='2026-11-04';
for(const lang of ['it','en'])for(const dur of [15,45,90])for(const id of ['A','B','C','D','E','CARDIO']){
  try{w.ST.lang=lang;w.ST.p={...w.ST.p,dur,coachMode:true,sessions:3,focus:'total'};w.localStorage.removeItem('ft_wo_pending_v1');
    w.ST.wLog=w.ST.wLog.filter(x=>x.d!=='2026-11-04');w.ST.liveWo=null;
    w.Coach.prev=null;w.Coach.tick();w.startWo(id);w.ST.woPaused=null;w.Coach.tick();
    const wo=w.getWo();
    for(let st=0;st<wo.exercises.length;st++){
      w.ST.step=st;w.ST.currentSet=0;w.ST.woPhase='ready';w.render();w.Coach.tick();
      const ex=w.getEx();const sets=parseInt(ex.sets)||1;
      for(let k=0;k<sets;k++){w.startSet();w.ST.setElapsed=7;w.render();w.Coach.tick();
        const i1=w.document.getElementById('wkW');i1&&(i1.value='20');const i2=w.document.getElementById('wkReps');i2&&(i2.value='10');
        if(st===1&&k===0){w.pauseWo();w.Coach.tick();w.resumeWo();}
        w.completeSet();w.Coach.tick();if(w.ST.woPhase==='rest'){w.ST.tmr=8;w.Coach.tick();w.skipRest();w.Coach.tick();}}
      if(w.ST.woPhase==='exercise_done'){w.render();w.setFeel(ex.id,['hard','ok','easy'][st%3]);}
      if(st<wo.exercises.length-1){w.ST.step=st;w.ST.woPhase='exercise_done';w.advanceExercise();}
    }
    w.ST.step=wo.exercises.length-1;w.ST.woPhase='exercise_done';w.ST.workoutStartTs=Date.now()-dur*6e4;w.advanceExercise();w.Coach.tick();
    if(!w.ST.wLog.some(x=>x.d==='2026-11-04'&&x.woId===id&&!x.partial))errs.push('non salvato '+lang+dur+id);
    if(!(w.ST.sheet==='workoutDone'))errs.push('niente riepilogo '+id);
    w.ST.sheet=null;w.render();
  }catch(e){errs.push(lang+dur+id+': '+e.message+' '+(e.stack||'').split('\n')[1]);}
}
T('allenamenti completi (5 schede + cardio × 15/45/90 min × IT/EN) con coach, pause, sensazioni',!errs.length,errs.slice(0,3).join(' | '));
T('coach ha parlato in entrambe le lingue',said.some(s=>/Sono il tuo coach/.test(s))&&said.some(s=>/I'm your coach/.test(s)));
T('coach finale con calorie',said.some(s=>/calorie consumate/.test(s))&&said.some(s=>/calories burned/.test(s)));
if(process.env.PART==='2')process.exit(0);
// 3) tutte le schermate IT/EN, con e senza alimentazione, con scarico attivo
errs=[];
for(const lang of ['it','en'])for(const nOff of [false,true])for(const tab of ['home','work','stats','body','set','coach','diet']){
  try{w.ST.lang=lang;w.ST.p.nutritionOff=nOff;w.ST.tab=tab;w.ST.aWo=null;w.render();
    const t=w.document.getElementById('app').textContent;if(/undefined|NaN|\[object Object\]/.test(t.replace(/undefined_/g,'')))errs.push(lang+tab+(nOff?'-noNutri':'')+': '+(t.match(/.{30}(undefined|NaN|\[object Object\]).{20}/)||[''])[0]);}
  catch(e){errs.push(lang+tab+': '+e.message);}
}
T('tutte le schermate senza errori né "undefined/NaN"',!errs.length,errs.slice(0,4).join(' | '));
