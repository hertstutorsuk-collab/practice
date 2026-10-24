import test from 'node:test';import assert from 'node:assert/strict';
import {makePlan,makePaper,pathways,readPlan,savePlan} from './gcse.js';
const options={pathway:'3to5',board:'edexcel',start:'2026-10-26',weeks:6,minutes:30,days:[1,3,6],weak:['Linear equations']};
test('timetable respects selected dates, priority topics and review cadence',()=>{
 const plan=makePlan(options);assert.equal(plan.sessions.length,18);assert.equal(plan.sessions[0].id,'2026-10-26');assert.equal(plan.sessions[0].topic,'Linear equations');assert.equal(plan.sessions[2].topic,'Mixed review and mistake retry');
 for(const s of plan.sessions)assert.ok(options.days.includes(new Date(s.id+'T12:00:00Z').getUTCDay()));
 assert.equal(plan.sessions.at(-1).week,6);
 for(const topic of pathways['3to5'].topics)assert.ok(plan.sessions.some(s=>s.topic===topic),topic);
 for(const board of ['edexcel','aqa','ocr'])assert.equal(makePlan({...options,board}).board,board);
 assert.throws(()=>makePlan({...options,days:[]}));assert.throws(()=>makePlan({...options,start:'2026-02-30'}));assert.throws(()=>makePlan({...options,days:[1,1]}));
});
test('plan restoration validates config and preserves completion',()=>{let raw=null;const storage={getItem:()=>raw,setItem:(_,v)=>raw=v};const p=makePlan(options);p.completed=[p.sessions[0].id,'bad'];assert.equal(savePlan(storage,p),true);assert.deepEqual(readPlan(storage).completed,[p.sessions[0].id]);raw='{bad';assert.equal(readPlan(storage),null);assert.equal(savePlan({setItem(){throw Error();}},p),false);});
for(const pathway of Object.keys(pathways))test(`${pathway} original paper: coverage and independent answer checks`,()=>{
 let seed=12;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let run=0;run<10;run++){
 const sheet=makePaper(pathway,random);assert.equal(sheet.length,12);assert.equal(new Set(sheet.map(q=>q.prompt)).size,12);assert.equal(sheet.reduce((n,q)=>n+q.marks,0),24);
 for(const q of sheet){const {a,b,c}=q.parameters;let value;
 if(pathway==='3to5')value=[(a+c)/b,a*10-a*10*b*5/100,a*c,c,a*b/2,a/(a+b)][q.kind];
 else value=[a*b*100000,Math.max(a,b),a,(a+10)*Math.sin(b*5*Math.PI/180),Array.from({length:c}).reduce(v=>v*(1+b/100),a*100),a*(a-1)/((a+b)*(a+b-1))][q.kind];
 assert.ok(Math.abs(Number(q.answer)-value)<(q.dp?0.5*10**(-q.dp)+1e-8:1e-8));
 }
 }
});
