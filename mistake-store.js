export const MISTAKE_KEY = 'herts-methods-mistakes-v1';
export const mistakeTopics = {functions:'Functions',calculus:'Calculus',probability:'Probability',statistics:'Statistics',other:'Other Methods topic'};
export function validEntry(entry) {
  return !!entry && typeof entry.id === 'string' && entry.id.length>0 && entry.id.length<100 &&
    typeof entry.source === 'string' && entry.source.trim().length>0 && entry.source.length<=160 &&
    Object.hasOwn(mistakeTopics,entry.topic) && Number.isInteger(entry.marks) && entry.marks>=0 && entry.marks<=100 &&
    ['question','reason','plan'].every(key=>typeof entry[key]==='string' && entry[key].length<=2000) && !!entry.reason.trim() &&
    typeof entry.resolved === 'boolean' && typeof entry.created === 'string' && Number.isFinite(Date.parse(entry.created));
}
export function loadMistakes(storage) {
  try {
    const raw=storage.getItem(MISTAKE_KEY);
    if(raw===null)return {entries:[],error:false};
    const data=JSON.parse(raw);
    if(data?.version!==1 || !Array.isArray(data.entries) || data.entries.length>200 || !data.entries.every(validEntry) || new Set(data.entries.map(e=>e.id)).size!==data.entries.length)throw new Error('Invalid log');
    return {entries:data.entries,error:false};
  }catch{return {entries:[],error:true};}
}
export function saveMistakes(storage,entries) {
  if(entries.length>200 || !entries.every(validEntry))return false;
  try{storage.setItem(MISTAKE_KEY,JSON.stringify({version:1,entries}));return true;}catch{return false;}
}
