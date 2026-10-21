const filters = [...document.querySelectorAll('[data-board]')];
const cards = [...document.querySelectorAll('[data-paper-board]')];
for (const button of filters) {
  button.addEventListener('click', () => {
    const board = button.dataset.board;
    for (const filter of filters) filter.setAttribute('aria-pressed',String(filter === button));
    for (const card of cards) card.hidden = board !== 'all' && card.dataset.paperBoard !== board;
    document.querySelector('#paper-filter-status').textContent = board === 'all' ? 'Showing all 3 exam boards.' : `Showing ${button.textContent} past paper resources.`;
  });
}
