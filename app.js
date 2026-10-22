import { readSaved, writeSaved, SAVE_KEY } from './storage.js';
import { checkAnswer } from './marking.js';
import { generateWorksheet, topics } from './generator.js';
const form = document.querySelector('#generator');
const list = document.querySelector('#questions');
const answerButton = document.querySelector('#answers');
let revealed = false;
let currentQuestions = [];
let currentTopic;
let lastResults = [];
let currentDifficulty;
let savingEnabled = true;
function saveWork() {
  if (!savingEnabled) return;
  let success = false;
  try { success = writeSaved(window.localStorage, {topic:currentTopic,difficulty:currentDifficulty,questions:currentQuestions,answers:[...list.querySelectorAll('input')].map(input => input.value)}); } catch {}
  document.querySelector('#save-status').textContent = success ? 'Saved on this browser · no account needed' : 'Saving unavailable — keep this tab open to retain your work.';
}
function hideSummary() { document.querySelector('#revision').hidden = true; }

function render(saved = null) {
  try {
    const data = new FormData(form), topic = data.get('topic'), difficulty = data.get('difficulty'), count = Number(data.get('count'));
    const questions = saved ? saved.questions : generateWorksheet(topic,difficulty,count);
    currentDifficulty = difficulty;
    currentQuestions = questions; currentTopic = topic; lastResults = []; hideSummary();
    document.querySelector("#score").hidden = true; document.querySelector("#retry").hidden = true;
    document.querySelector("#mark").textContent = "Mark my answers ✓";
    list.replaceChildren();
    for (const [index, question] of questions.entries()) {
      const item = document.createElement('li');
      const number = document.createElement('span'); number.className = 'question-number'; number.textContent = String(index+1).padStart(2,'0');
      const body = document.createElement('div'); body.className = 'question-body';
      const prompt = document.createElement('p'); prompt.textContent = question.prompt;
      const space = document.createElement('div'); space.className = 'working-space'; space.setAttribute('aria-hidden','true');
      const answer = document.createElement('div'); answer.className = 'answer'; answer.hidden = true;
      const result = document.createElement('strong'); result.textContent = question.answer;
      const explanation = document.createElement('p'); explanation.textContent = question.explanation;
      const input = document.createElement('input'); input.className = 'student-answer'; input.type = 'text'; input.autocomplete = 'off'; input.maxLength = 100; input.value = saved?.answers[index] ?? ''; input.placeholder = question.decimalPlaces === 4 ? 'To 4 decimal places' : 'Your answer'; input.setAttribute('aria-label', `Your answer to question ${index+1}`);
      const feedback = document.createElement('p'); feedback.className = 'feedback'; feedback.id = `feedback-${index}`; input.setAttribute('aria-describedby',feedback.id);
      input.addEventListener('input', () => { feedback.textContent = ''; item.removeAttribute('data-result'); document.querySelector('#score').hidden = true; document.querySelector('#retry').hidden = true; hideSummary(); saveWork(); });
      answer.append(result,explanation);
      if (topic === 'mixed') { const tag = document.createElement('span'); tag.className = 'topic-tag'; tag.textContent = topics[question.topic]; body.append(tag); }
      body.append(prompt,space,input,feedback,answer); item.append(number,body); list.append(item);
    }
    revealed = false; answerButton.textContent = 'Show answers'; answerButton.setAttribute('aria-pressed','false');
    document.querySelector('#worksheet-title').textContent = `${topics[topic] ?? 'Mixed revision'}, one step at a time.`;
    document.querySelector('#summary').textContent = `${count} questions · ${difficulty[0].toUpperCase()+difficulty.slice(1)} level`;
    document.querySelector('#announcement').textContent = `Generated ${count} ${difficulty} ${(topics[topic] ?? 'mixed revision').toLowerCase()} questions.`;
    document.querySelector('#error').textContent = '';
    saveWork();
  } catch (error) { document.querySelector('#error').textContent = error.message; }
}
form.addEventListener('submit', event => { event.preventDefault(); savingEnabled = true; render(); });
answerButton.addEventListener('click', () => {
  revealed = !revealed;
  document.querySelectorAll('.answer').forEach(answer => answer.hidden = !revealed);
  answerButton.textContent = revealed ? 'Hide answers' : 'Show answers'; answerButton.setAttribute('aria-pressed',String(revealed));
});
document.querySelector('#print').addEventListener('click', () => window.print());
let restored;
try { restored = readSaved(window.localStorage); } catch {}
if (restored) {
  form.querySelector(`[name="topic"][value="${restored.topic}"]`).checked = true;
  form.querySelector('#difficulty').value = restored.difficulty;
  form.querySelector('#count').value = String(restored.questions.length);
}
render(restored);
if (restored) document.querySelector('#save-status').textContent = 'Welcome back — your worksheet and answers are restored.';

document.querySelector('#mark').addEventListener('click', () => {
  const items = [...list.children];
  lastResults = items.map((item,index) => {
    const result = checkAnswer(item.querySelector('input').value,currentQuestions[index].answer,false, currentQuestions[index].decimalPlaces === 4 ? 0.000050001 : 1e-9);
    item.dataset.result = result;
    item.querySelector('.feedback').textContent = {correct:'✓ Correct — nicely done!',incorrect:'↻ Not quite. Try again or check the worked answer.',blank:'Add an answer to this question.',simplify:'Almost! Your value is right; simplify your fraction.'}[result];
    return result;
  });
  const correct = lastResults.filter(result => result === 'correct').length;
  const score = document.querySelector('#score'); score.hidden = false;
  score.textContent = `${correct} / ${items.length} correct · ${Math.round(correct/items.length*100)}%. ${correct === items.length ? 'Great work! Generate a new worksheet or stretch yourself with a harder level.' : 'Use the feedback below each question, then retry the ones you missed.'}${revealed ? ' Answers are visible — this is a practice check.' : ''}`;
  document.querySelector('#retry').hidden = correct === items.length;
  const revision = document.querySelector('#revision'); revision.replaceChildren(); revision.hidden = false;
  const heading = document.createElement('h3'); heading.textContent = 'Your revision focus'; revision.append(heading);
  for (const [topic, label] of Object.entries(topics)) {
    const indexes = currentQuestions.flatMap((q,i) => q.topic === topic ? [i] : []);
    if (!indexes.length) continue;
    const passed = indexes.filter(i => lastResults[i] === 'correct').length;
    const row = document.createElement('div'); row.className = 'revision-row';
    const text = document.createElement('span'); text.textContent = `${label}: ${passed}/${indexes.length} correct`;
    const progress = document.createElement('progress'); progress.max = indexes.length; progress.value = passed; progress.setAttribute('aria-label', `${label} correct answers`);
    row.append(text,progress);
    if (passed < indexes.length) {
      const practice = document.createElement('button'); practice.type = 'button'; practice.textContent = `Practise ${label.toLowerCase()} ↗`;
      practice.addEventListener('click', () => { form.querySelector(`[name="topic"][value="${topic}"]`).checked = true; savingEnabled = true; render(); document.querySelector('#worksheet-title').scrollIntoView?.({behavior:'smooth',block:'start'}); }); row.append(practice);
    }
    revision.append(row);
  }
  saveWork();
});
document.querySelector('#retry').addEventListener('click', () => {
  let first;
  [...list.children].forEach((item,index) => {
    if (lastResults[index] !== 'correct') {
      const input = item.querySelector('input'); input.value = ''; first ??= input;
      item.querySelector('.feedback').textContent = ''; item.removeAttribute('data-result');
    }
    item.querySelector('.answer').hidden = true;
  });
  revealed = false; answerButton.textContent = 'Show answers'; answerButton.setAttribute('aria-pressed','false');
  document.querySelector('#score').hidden = true; document.querySelector('#retry').hidden = true;
  document.querySelector('#mark').textContent = 'Check my answers again ✓';
  hideSummary(); saveWork();
  first?.focus();
});

document.querySelector('#clear-save').addEventListener('click', () => {
  try {
    window.localStorage.removeItem(SAVE_KEY); savingEnabled = false;
    document.querySelector('#save-status').textContent = 'Saved work cleared. This worksheet stays open; generating a new one enables saving again.';
  } catch { document.querySelector('#save-status').textContent = 'Browser storage is unavailable.'; }
});
