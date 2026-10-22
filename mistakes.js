import {loadMistakes,saveMistakes,mistakeTopics} from './mistake-store.js';
const $=selector=>document.querySelector(selector);
let loaded;
try{loaded=loadMistakes(window.localStorage);}catch{loaded={entries:[],error:true};}
let entries=loaded.entries, editId=null;
const fields=['source','topic','question','marks','reason','plan'];
function message(text){$('#mistake-message').textContent=text;}
function persist(next){
  if(loaded.error){message('Your log could not be read. It has not been overwritten. Check browser storage permissions or try another browser.');return false;}
  let saved=false;try{saved=saveMistakes(window.localStorage,next);}catch{}
  if(!saved){message('Could not save the change. Your existing log is unchanged. Storage may be full or unavailable.');return false;}
  entries=next;return true;
}
function resetForm(){editId=null;$('#mistake-form').reset();$('#mistake-form-title').textContent='Record a mistake';$('#save-mistake').textContent='Save mistake ↗';$('#cancel-mistake').hidden=true;}
function element(tag,text,className){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el;}
function button(text,action){const el=element('button',text);el.type='button';el.addEventListener('click',action);return el;}
function render(){
 const open=entries.filter(e=>!e.resolved);
 $('#mistake-stats').textContent=`${open.length} to retry · ${entries.length-open.length} resolved · ${open.reduce((sum,e)=>sum+e.marks,0)} marks lost on open entries`;
 $('#export-mistakes').disabled=!entries.length;
 const filter=$('#mistake-filter').value;
 const visible=entries.filter(e=>filter==='all'||(filter==='resolved'?e.resolved:!e.resolved));
 const list=$('#mistake-list');list.replaceChildren();
 if(!visible.length)list.append(element('p',entries.length?'No mistakes in this view.':'Nothing logged yet. Add a question you want to revisit.','mistake-empty'));
 for(const entry of visible){
  const card=element('article','', 'mistake-card');
  card.append(element('span',`${mistakeTopics[entry.topic]} · ${entry.resolved?'Resolved':'To retry'} · ${entry.marks} marks lost`,'paper-code'),element('h3',entry.source));
  if(entry.question)card.append(element('p',entry.question,'mistake-question'));
  card.append(element('h4','What went wrong'),element('p',entry.reason));
  if(entry.plan)card.append(element('h4','Next time'),element('p',entry.plan));
  card.append(element('p',`Added ${new Date(entry.created).toLocaleDateString('en-AU')}`,'mistake-date'));
  const actions=element('div','','mistake-actions');
  actions.append(button(entry.resolved?'Reopen for retry':'Mark resolved ✓',()=>{
   if(persist(entries.map(e=>e.id===entry.id?{...e,resolved:!e.resolved}:e))){render();message(entry.resolved?'Question reopened for retry.':'Question marked resolved.');}
  }),button('Edit',()=>{
   editId=entry.id;for(const key of fields)$('#mistake-'+key).value=String(entry[key]);
   $('#mistake-form-title').textContent='Edit mistake';$('#save-mistake').textContent='Save changes';$('#cancel-mistake').hidden=false;$('#mistake-source').focus();message('Editing this entry.');
  }),button('Delete',()=>{
   if(!window.confirm('Delete this mistake from your saved log?'))return;
   if(persist(entries.filter(e=>e.id!==entry.id))){if(editId===entry.id)resetForm();render();message('Mistake deleted.');}
  }));card.append(actions);list.append(card);
 }
}
$('#mistake-form').addEventListener('submit',event=>{
 event.preventDefault();const values=Object.fromEntries(fields.map(key=>[key,$('#mistake-'+key).value.trim()]));
 values.marks=Number(values.marks);
 if(!values.source || !values.reason || !Number.isInteger(values.marks)||values.marks<0||values.marks>100){message('Add a paper reference, what went wrong, and a whole number of marks from 0 to 100.');return;}
 const previous=entries.find(e=>e.id===editId);
 const entry={...values,id:previous?.id??window.crypto.randomUUID(),created:previous?.created??new Date().toISOString(),resolved:previous?.resolved??false};
 if(!previous && entries.length>=200){message('Your log holds up to 200 entries. Export a backup, then remove entries you no longer need.');return;}
 const next=previous?entries.map(e=>e.id===entry.id?entry:e):[entry,...entries];
 if(persist(next)){resetForm();render();message(previous?'Changes saved.':'Mistake saved. Come back and retry it when you are ready.');}
});
$('#cancel-mistake').addEventListener('click',()=>{resetForm();message('Edit cancelled.');});
$('#mistake-filter').addEventListener('change',render);
$('#export-mistakes').addEventListener('click',()=>{
 const blob=new Blob([JSON.stringify({version:1,exported:new Date().toISOString(),entries},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='herts-methods-mistake-log.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 message('Backup downloaded as JSON. Keep it somewhere safe; automatic import is not available yet.');
});
render();if(loaded.error)message('Your saved log could not be read. Existing data has not been overwritten.');
