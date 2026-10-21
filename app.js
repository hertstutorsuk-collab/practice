import { generateWorksheet, topics } from './generator.js';
const form = document.querySelector('#generator');
const list = document.querySelector('#questions');
const answerButton = document.querySelector('#answers');
let revealed = false;
function render() {
  try {
    const data = new FormData(form), topic = data.get('topic'), difficulty = data.get('difficulty'), count = Number(data.get('count'));
    const questions = generateWorksheet(topic,difficulty,count);
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
      answer.append(result,explanation); body.append(prompt,space,answer); item.append(number,body); list.append(item);
    }
    revealed = false; answerButton.textContent = 'Show answers'; answerButton.setAttribute('aria-pressed','false');
    document.querySelector('#worksheet-title').textContent = `${topics[topic]}, one step at a time.`;
    document.querySelector('#summary').textContent = `${count} questions · ${difficulty[0].toUpperCase()+difficulty.slice(1)} level`;
    document.querySelector('#announcement').textContent = `Generated ${count} ${difficulty} ${topics[topic].toLowerCase()} questions.`;
    document.querySelector('#error').textContent = '';
  } catch (error) { document.querySelector('#error').textContent = error.message; }
}
form.addEventListener('submit', event => { event.preventDefault(); render(); });
answerButton.addEventListener('click', () => {
  revealed = !revealed;
  document.querySelectorAll('.answer').forEach(answer => answer.hidden = !revealed);
  answerButton.textContent = revealed ? 'Hide answers' : 'Show answers'; answerButton.setAttribute('aria-pressed',String(revealed));
});
document.querySelector('#print').addEventListener('click', () => window.print());
render();
