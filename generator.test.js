import test from 'node:test';
import assert from 'node:assert/strict';
import {generateQuestion,generateWorksheet,topics} from './generator.js';
function seeded(seed=12345){return ()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);}
for(const topic of Object.keys(topics))for(const level of ['easy','medium','hard'])test(`${topic} ${level}: unique questions and checked numerical answers`,()=>{
 const sheet=generateWorksheet(topic,level,20,seeded());assert.equal(sheet.length,20);assert.equal(new Set(sheet.map(q=>q.prompt)).size,20);
 for(const q of sheet){
  const {a,b,x,n,p,k,successes,level:l}=q.parameters;let expected;
  if(topic==='functions')expected=l===0?a*x*x+b:l===1?a*Math.exp(x*b/10):a*Math.log(x)+b;
  if(topic==='calculus')expected=l===0?2*a*x+b:l===1?a*x*x*x/3+b*x:3*a*(a*x+b)**2;
  if(topic==='statistics'){const phat=successes/n;expected=l===0?phat:Math.sqrt(phat*(1-phat)/n)*(l===2?1.96:1);if(l===2)assert.ok(successes>=5 && n-successes>=5);}
  if(topic==='probability'){
   if(l===0)expected=n*p;
   else {let distribution=[1];for(let trial=0;trial<n;trial++){const next=Array(distribution.length+1).fill(0);distribution.forEach((v,i)=>{next[i]+=v*(1-p);next[i+1]+=v*p;});distribution=next;}expected=l===1?distribution[k]:distribution.slice(0,k+1).reduce((a,b)=>a+b,0);}
  }
  assert.ok(Number.isFinite(Number(q.answer)));assert.ok(Math.abs(Number(q.answer)-expected)<0.000050001);assert.ok(q.explanation.length>20);
 }
});
test('invalid inputs and insufficient randomness fail clearly',()=>{
 assert.throws(()=>generateQuestion('unknown'));assert.throws(()=>generateQuestion('calculus','unknown'));
 assert.throws(()=>generateWorksheet('calculus','easy',0));assert.throws(()=>generateWorksheet('calculus','easy',5,()=>0));
});
