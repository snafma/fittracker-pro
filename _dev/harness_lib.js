const fs=require('fs');const {JSDOM}=require('jsdom');
module.exports=function boot(file){
const html=fs.readFileSync(file,'utf8');
const dom=new JSDOM('<!DOCTYPE html><body><div id="app"></div></body>',{url:'https://x.io/',pretendToBeVisual:true,runScripts:'dangerously'});
const w=dom.window;global.window=w;global.document=w.document;
w.scrollTo=()=>{};w.setInterval=()=>0;w.setTimeout=()=>0;w.clearInterval=()=>{};w.requestAnimationFrame=()=>0;w.confirm=()=>true;w.alert=()=>{};w.prompt=()=>'';
class A{constructor(){this.destination={};this.currentTime=0;this.state='running';}createOscillator(){return{connect(){},start(){},stop(){},frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}},type:'',detune:{value:0}};}createGain(){return{connect(){},disconnect(){},gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}}};}createBiquadFilter(){return{connect(){},type:'',frequency:{value:0,setValueAtTime(){}},Q:{value:0}};}resume(){this.state='running';return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}}
w.AudioContext=A;w.webkitAudioContext=A;w.Notification=function(){};w.Notification.permission='granted';w.Notification.requestPermission=()=>Promise.resolve('granted');
Object.defineProperty(w.navigator,'serviceWorker',{value:{register:()=>Promise.resolve({}),ready:Promise.resolve({}),addEventListener(){},controller:null},configurable:true});
w.DB={s:async()=>{},g:async()=>null};w.SS={};
const inj=c=>{const s=w.document.createElement('script');s.textContent=c;w.document.body.appendChild(s);};
inj(fs.readFileSync(require('fs').existsSync(require('path').join(__dirname,'food_db.js'))?require('path').join(__dirname,'food_db.js'):require('path').join(__dirname,'..','food_db.js'),'utf8'));
[...html.matchAll(/<script(?![^>]*type=.module.)(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].forEach(m=>inj(m[1]));
w.AU={user:'U',profile:{sx:'m',ht:178,ag:40}};w.ST=w.defST();w.ST.langChosen=true;
w.ST.p={t:'cut',g:80,targetD:'2026-12-12',sessions:3,focus:'total',diet:'omnivore',intol:[],hasGym:true,times:{col:'08:00',sp1:'10:30',pra:'13:00',sp2:'17:00',cen:'19:30'},kcal:2407,disclaimerAccepted:true,disclaimerAcceptedAt:Date.now(),tourCompleted:true};
w.ST.programStart='2026-05-01';w.ST.h=[{d:'2026-08-20',w:88}];
return w;};
