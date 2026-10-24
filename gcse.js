export const pathways={
 '3to5':{label:'Grade 3 → 5',tier:'Foundation',topics:['Fractions and decimals','Percentages','Ratio and proportion','Linear equations','Angles and area','Probability and averages']},
 '5to7':{label:'Grade 5 → 7',tier:'Higher',topics:['Indices and standard form','Quadratics','Simultaneous equations','Trigonometry','Compound change','Probability without replacement']}
};
export const boards={edexcel:{label:'Edexcel',url:'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.coursematerials.html'},aqa:{label:'AQA',url:'https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/assessment-resources'},ocr:{label:'OCR',url:'https://www.ocr.org.uk/qualifications/gcse/mathematics-j560-from-2015/assessment/'}};
export function makePlan({pathway,board,start,weeks,minutes,days,weak=[]}){
 if(!pathways[pathway]||!boards[board]||!/^\d{4}-\d{2}-\d{2}$/.test(start)||![2,4,6,8,12].includes(weeks)||![20,30,45,60].includes(minutes)||!Array.isArray(days)||!days.length||new Set(days).size!==days.length||days.some(d=>!Number.isInteger(d)||d<0||d>6))throw new Error('Choose a valid programme, start date and at least one study day.');
 const first=new Date(start+'T12:00:00Z');if(!Number.isFinite(+first)||first.toISOString().slice(0,10)!==start)throw new Error('Choose a real start date.');
 const topics=pathways[pathway].topics,priority=[...new Set(weak)].filter(t=>topics.includes(t));
 const ordered=[...priority,...topics.filter(t=>!priority.includes(t))], sessions=[];
 for(let offset=0;offset<weeks*7;offset++){
  const date=new Date(+first+offset*86400000);if(!days.includes(date.getUTCDay()))continue;
  const i=sessions.length,week=Math.floor(offset/7)+1;
  const review=i>0 && (i+1)%3===0;
  const topic=ordered[(i-Math.floor(i/3))%ordered.length];
  const retrieval=Math.min(5,Math.floor(minutes/5)),mark=Math.min(10,Math.floor(minutes/4)),practice=minutes-retrieval-mark;
  sessions.push({id:date.toISOString().slice(0,10),week,topic:review?'Mixed review and mistake retry':topic,minutes,task:review?`${retrieval} min: recall key facts. ${practice} min: mixed questions from topics already studied; retry missed questions. ${mark} min: mark and update your mistake notes.`:`${retrieval} min: recall a method. ${practice} min: practise ${topic.toLowerCase()}. ${mark} min: mark, correct and write one takeaway.`});
 }
 return {version:1,pathway,board,start,weeks,minutes,days,weak:priority,sessions,completed:[]};
}
export function readPlan(storage){try{const raw=JSON.parse(storage.getItem('herts-gcse-plan-v1'));if(!raw)return null;const rebuilt=makePlan(raw);rebuilt.completed=Array.isArray(raw.completed)?raw.completed.filter(id=>rebuilt.sessions.some(s=>s.id===id)):[];return rebuilt;}catch{return null;}}
export function savePlan(storage,plan){try{storage.setItem('herts-gcse-plan-v1',JSON.stringify(plan));return true;}catch{return false;}}
export function makePaper(pathway,random=Math.random){
 if(!pathways[pathway])throw new Error('Choose a programme.');
 const pick=(a,b)=>a+Math.floor(random()*(b-a+1)),questions=[],seen=new Set();
 for(let attempt=0;questions.length<12&&attempt<1000;attempt++){
  const kind=questions.length%6,a=pick(2,12),b=pick(2,9),c=pick(2,8);let prompt,value,steps,dp=0;
  if(pathway==='3to5'){
   if(kind===0){prompt=`Calculate ${a}/${b} + ${c}/${b}. Give a decimal to 3 decimal places.`;value=(a+c)/b;dp=3;steps=`Add numerators over the common denominator: (${a} + ${c})/${b}. Divide and round.`;}
   if(kind===1){prompt=`A jacket costs £${a*10}. It is reduced by ${b*5}%. Find the sale price.`;value=a*10*(1-b*5/100);dp=2;steps=`Multiply the original price by 1 − ${b*5}/100.`;}
   if(kind===2){prompt=`Share £${(a+b)*c} in the ratio ${a}:${b}. How much does the first person receive?`;value=a*c;steps=`There are ${a+b} parts, worth £${c} each. The first person receives ${a} parts.`;}
   if(kind===3){prompt=`Solve ${a}x + ${b} = ${a*c+b}. Give the value of x.`;value=c;steps=`Subtract ${b}, then divide by ${a}.`;}
   if(kind===4){prompt=`A triangle has base ${a} cm and perpendicular height ${b} cm. Find its area in cm².`;value=a*b/2;steps=`Area = ½ × base × perpendicular height = ½ × ${a} × ${b}.`;}
   if(kind===5){prompt=`A bag has ${a} red and ${b} blue counters. One is drawn at random. Find P(red) as a decimal to 3 decimal places.`;value=a/(a+b);dp=3;steps=`P(red) = red counters / total counters = ${a}/${a+b}.`;}
  }else{
   if(kind===0){prompt=`Calculate (${a} × 10³) × (${b} × 10²). Give an ordinary number.`;value=a*b*1e5;steps=`Multiply coefficients and add powers: ${a*b} × 10⁵. Convert to an ordinary number.`;}
   if(kind===1){prompt=`Solve x² − ${a+b}x + ${a*b} = 0. Give the larger root.`;value=Math.max(a,b);steps=`Factor as (x − ${a})(x − ${b}) = 0. The roots are ${a} and ${b}; select the larger.`;}
   if(kind===2){prompt=`Solve x + y = ${a+b} and ${c}x + y = ${c*a+b}. Give x.`;value=a;steps=`Subtract the first equation from the second: ${c-1}x = ${(c-1)*a}. Divide by ${c-1}.`;}
   if(kind===3){const angle=b*5;prompt=`A right-angled triangle has hypotenuse ${a+10} cm. Find the side opposite ${angle}°, to 3 decimal places.`;value=(a+10)*Math.sin(angle*Math.PI/180);dp=3;steps=`Use sin(${angle}°) = opposite/hypotenuse in degree mode. Opposite = ${a+10}sin(${angle}°).`;}
   if(kind===4){prompt=`£${a*100} grows by ${b}% per year, compounded annually. Find its value after ${c} years, to the nearest penny.`;value=a*100*(1+b/100)**c;dp=2;steps=`Multiply by (1 + ${b}/100)^${c}, then round the final value to 2 decimal places.`;}
   if(kind===5){prompt=`A bag has ${a} red and ${b} blue counters. Two are drawn without replacement. Find P(both red) to 3 decimal places.`;value=a/(a+b)*(a-1)/(a+b-1);dp=3;steps=`Multiply P(first red) × P(second red | first red): ${a}/${a+b} × ${a-1}/${a+b-1}.`;}
  }
  if(!seen.has(prompt)){seen.add(prompt);questions.push({prompt,answer:dp?value.toFixed(dp):String(value),explanation:steps,marks:2,kind,parameters:{a,b,c},dp});}
 }
 if(questions.length!==12)throw new Error('Could not make a unique paper. Try again.');
 return questions;
}
