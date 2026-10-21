const key = 'herts-practice-name-v1';
const screen = document.querySelector('#welcome-screen');
const main = document.querySelector('main');
const input = document.querySelector('#student-name');
const remember = document.querySelector('#remember-name');
const profileButton = document.querySelector('#profile-button');
const forget = document.querySelector('#forget-profile');
let name = '';
export function cleanName(value) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g,'').trim().replace(/\s+/g,' ').slice(0,40) : '';
}
function readName() {
  try { return cleanName(window.localStorage.getItem(key)); } catch { return ''; }
}
function enter(nextName) {
  name = nextName;
  screen.hidden = true; main.hidden = false;
  document.querySelector('#personal-welcome').hidden = !name;
  document.querySelector('#greeting').textContent = name ? `Hi, ${name} 👋` : '';
  profileButton.textContent = name ? `${name} · Profile` : 'Your profile';
  if (name) document.querySelector('#greeting').focus();
  else document.querySelector('#worksheet-title').setAttribute('tabindex','-1');
}
function openProfile() {
  input.value = name; remember.checked = !!readName(); forget.hidden = !readName() && !name;
  screen.hidden = false; main.hidden = true;
  document.querySelector('#profile-error').textContent = '';
  input.focus();
}
document.querySelector('#profile-form').addEventListener('submit', event => {
  event.preventDefault();
  const nextName = cleanName(input.value);
  if (!nextName) { document.querySelector('#profile-error').textContent = 'Please enter a first name or nickname.'; input.focus(); return; }
  try {
    if (remember.checked) window.localStorage.setItem(key,nextName);
    else window.localStorage.removeItem(key);
  } catch {
    if (remember.checked) { document.querySelector('#profile-error').textContent = 'This browser cannot remember your name. Uncheck “Remember my name” to continue for this visit.'; return; }
  }
  enter(nextName);
});
document.querySelector('#guest-button').addEventListener('click', () => enter(''));
forget.addEventListener('click', () => {
  try { window.localStorage.removeItem(key); } catch { document.querySelector('#profile-error').textContent = 'Browser storage is unavailable. You can still continue as a guest.'; return; }
  input.value = ''; remember.checked = false; name = ''; forget.hidden = true;
  profileButton.textContent = 'Your profile'; input.focus();
  document.querySelector('#profile-error').textContent = 'Your saved name has been removed.';
});
profileButton.addEventListener('click',openProfile);
const savedName = readName();
if (savedName) enter(savedName); else openProfile();
