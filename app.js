const startInput = document.getElementById('startNumber');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const newBtn = document.getElementById('newBtn');
const setupCard = document.getElementById('setupCard');
const counterCard = document.getElementById('counterCard');
const counter = document.getElementById('counter');
const progressBar = document.getElementById('progressBar');
const dropBoard = document.getElementById('dropBoard');
const dropTemplate = document.getElementById('dropTemplate');

let startValue = Number(localStorage.getItem('drop.startValue')) || 20;
let remaining = Number(localStorage.getItem('drop.remaining')) || 0;

startInput.value = startValue;

function clampStart(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 20;
  return Math.min(250, Math.max(1, parsed));
}

function saveState() {
  localStorage.setItem('drop.startValue', String(startValue));
  localStorage.setItem('drop.remaining', String(remaining));
}

function renderDrops() {
  dropBoard.innerHTML = '';
  const removedCount = startValue - remaining;

  for (let i = 0; i < startValue; i += 1) {
    const node = dropTemplate.content.firstElementChild.cloneNode(true);
    if (i < removedCount) node.classList.add('removed');
    node.addEventListener('click', () => removeDrop(node));
    dropBoard.appendChild(node);
  }
}

function renderCounter() {
  counter.textContent = remaining;
  const percent = startValue > 0 ? (remaining / startValue) * 100 : 0;
  progressBar.style.width = `${percent}%`;
  counterCard.classList.toggle('complete', remaining === 0);
  saveState();
}

function startGame(value = startInput.value) {
  startValue = clampStart(value);
  remaining = startValue;
  startInput.value = startValue;
  setupCard.classList.add('hidden');
  counterCard.classList.remove('hidden');
  renderDrops();
  renderCounter();
}

function removeDrop(node) {
  if (remaining <= 0 || node.classList.contains('removed')) return;
  node.classList.add('removed');
  remaining -= 1;
  renderCounter();
}

startBtn.addEventListener('click', () => startGame());
startInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') startGame();
});
resetBtn.addEventListener('click', () => startGame(startValue));
newBtn.addEventListener('click', () => {
  remaining = 0;
  saveState();
  counterCard.classList.add('hidden');
  setupCard.classList.remove('hidden');
  dropBoard.innerHTML = '';
  startInput.focus();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}

if (remaining > 0 && startValue > 0) {
  setupCard.classList.add('hidden');
  counterCard.classList.remove('hidden');
  renderDrops();
  renderCounter();
}
