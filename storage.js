export const SAVE_KEY = 'herts-practice-worksheet-v1';
export function readSaved(storage) {
  try {
    const saved = JSON.parse(storage.getItem(SAVE_KEY));
    if (saved?.version !== 1 || !['mixed','fractions','percentages','algebra'].includes(saved.topic) || !['easy','medium','hard'].includes(saved.difficulty) || ![5,10,20].includes(saved.questions?.length) || saved.answers?.length !== saved.questions.length) return null;
    if (!saved.questions.every(q => ['fractions','percentages','algebra'].includes(q.topic) && ['prompt','answer','explanation'].every(k => typeof q[k] === 'string' && q[k].length < 1000)) || !saved.answers.every(a => typeof a === 'string' && a.length <= 100)) return null;
    return saved;
  } catch { return null; }
}
export function writeSaved(storage, worksheet) {
  try { storage.setItem(SAVE_KEY,JSON.stringify({ ...worksheet,version:1 })); return true; } catch { return false; }
}
