import {pathways,boards,makePlan,readPlan,savePlan,makePaper} from './gcse.js';
const $=selector=>document.querySelector(selector);
const node=(tag,text,className)=>{const e=document.createElement(tag);e.textContent=text;if(className)e.className=className;return e;};
let plan=null,paper=[],answers=false;
function message(text){$('#plan-message').textContent=text;}
function weakTopics(){
 const field=$('#weak-topics');field.replaceChildren(node('legend','Topics to prioritise (optional)'));
 for(const topic of pathways[$('#pathway').value].topics){const label=node('label','');const input=document.createElement('input');input.type='checkbox';input.name='weak';input.value=topic;label.append(input,document.createTextNode(' '+topic));field.append(label);}
}
function persist(){let saved=false;try{saved=savePlan(window.localStorage,plan);}catch{}message(saved?'Saved on this browser.':'Browser saving is unavailable. Print your plan before leaving this page.');}
function renderPlan(){
 if(!plan){$('#plan-summary').textContent='Your plan will appear here.';$('#plan-sessions').replaceChildren();$('#print-plan').disabled=true;return;}
 $('#print-plan').disabled=false;
 $('#plan-summary').textContent=`${pathways[plan.pathway].label} · ${boards[plan.board].label} · ${plan.sessions.length} sessions · ${plan.sessions.length*plan.minutes} minutes total · ${plan.completed.length} completed`;
 const list=$('#plan-sessions');list.replaceChildren();let week=0;
 for(const session of plan.sessions){
  if(session.week!==week){week=session.week;list.append(node('h3',`Week ${week}`));}
  const card=node('article','','plan-session');const label=node('label','');const input=document.createElement('input');input.type='checkbox';input.checked=plan.completed.includes(session.id);input.setAttribute('aria-label',`Complete ${session.topic} on ${session.id}`);
  input.addEventListener('change',()=>{plan.completed=input.checked?[...plan.completed.filter(id=>id!==session.id),session.id]:plan.completed.filter(id=>id!==session.id);persist();renderPlan();const restored=[...$('#plan-sessions').querySelectorAll('input')].find(el=>el.getAttribute('aria-label')===input.getAttribute('aria-label'));restored?.focus();});
  const date=new Date(session.id+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'});
  label.append(input,document.createTextNode(`${date} · ${session.minutes} min · ${session.topic}`));card.append(label,node('p',session.task));list.append(card);
 }
}
$('#pathway').addEventListener('change',weakTopics);weakTopics();
const today=new Date();$('#plan-start').value=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
try{plan=readPlan(window.localStorage);}catch{}
if(plan){$('#pathway').value=plan.pathway;$('#exam-board').value=plan.board;$('#plan-start').value=plan.start;$('#plan-weeks').value=String(plan.weeks);$('#plan-minutes').value=String(plan.minutes);weakTopics();for(const input of document.querySelectorAll('[name=day]'))input.checked=plan.days.includes(Number(input.value));for(const input of document.querySelectorAll('[name=weak]'))input.checked=plan.weak.includes(input.value);message('Your saved timetable is restored.');}
renderPlan();
$('#plan-form').addEventListener('submit',event=>{
 event.preventDefault();try{
 if(plan && !window.confirm('Replace your current timetable and its completion ticks?'))return;
 plan=makePlan({pathway:$('#pathway').value,board:$('#exam-board').value,start:$('#plan-start').value,weeks:Number($('#plan-weeks').value),minutes:Number($('#plan-minutes').value),days:[...document.querySelectorAll('[name=day]:checked')].map(e=>Number(e.value)),weak:[...document.querySelectorAll('[name=weak]:checked')].map(e=>e.value)});
 persist();renderPlan();
 }catch(error){message(error.message);}
});
$('#clear-plan').addEventListener('click',()=>{
 if(!window.confirm('Clear your saved timetable and completion ticks?'))return;
 try{window.localStorage.removeItem('herts-gcse-plan-v1');plan=null;renderPlan();message('Saved timetable cleared.');}catch{message('Could not clear browser storage.');}
});
function print(section){document.body.dataset.print=section;window.print();}
window.addEventListener('afterprint',()=>delete document.body.dataset.print);
$('#print-plan').addEventListener('click',()=>print('plan'));
for(const [key,board] of Object.entries(boards)){
 const card=node('article','','paper-card');card.append(node('span',board.label.toUpperCase(),'paper-code'),node('h3','GCSE Maths papers'),node('p','Foundation & Higher · question papers and mark schemes'));
 const link=node('a',`Open ${board.label} library ↗`,'paper-link');link.href=board.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`Open ${board.label} official paper library in a new tab`);card.append(link,node('p',key==='ocr'?'OCR J560: Foundation papers 1–3; Higher papers 4–6. Papers 2 and 5 are non-calculator.':'Choose GCSE Maths, your tier, exam series and matching mark scheme. Paper 1 is non-calculator; papers 2 and 3 are calculator.','paper-hint'));$('#gcse-resources').append(card);
}
$('#make-paper').addEventListener('click',()=>{
 try{paper=makePaper($('#paper-pathway').value);answers=false;$('#paper-output').hidden=false;$('#paper-answers').textContent='Show worked answers';$('#paper-answers').setAttribute('aria-pressed','false');$('#paper-summary').textContent=`${pathways[$('#paper-pathway').value].label} · ${paper.length} questions · ${paper.reduce((n,q)=>n+q.marks,0)} indicative marks · Not an official past paper`;
 const list=$('#original-questions');list.replaceChildren();
 for(const [i,q]of paper.entries()){const item=node('li','','original-question');const body=node('div','','question-body');body.append(node('p',`${i+1}. ${q.prompt} [${q.marks} marks]`),node('div','','working-space'));const solution=node('div','','answer');solution.hidden=true;solution.append(node('strong',q.answer),node('p',q.explanation));body.append(solution);item.append(body);list.append(item);}
 $('#paper-message').textContent='Fresh practice paper generated. It stays in this tab; print to keep a copy.';
 }catch(error){$('#paper-message').textContent=error.message;}
});
$('#paper-answers').addEventListener('click',()=>{answers=!answers;for(const solution of document.querySelectorAll('#original-questions .answer'))solution.hidden=!answers;$('#paper-answers').textContent=answers?'Hide worked answers':'Show worked answers';$('#paper-answers').setAttribute('aria-pressed',String(answers));});
$('#print-paper').addEventListener('click',()=>print('paper'));
