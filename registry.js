const registryList = document.getElementById('registryList');
const registryEmpty = document.getElementById('registryEmpty');
const clearRegistryBtn = document.getElementById('clearRegistryBtn');

function getRegistry() {
  const raw = localStorage.getItem('drop.registry');
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRegistry(registry) {
  localStorage.setItem('drop.registry', JSON.stringify(registry));
}

function renderRegistry() {
  const registry = getRegistry();
  registryList.innerHTML = '';

  if (registry.length === 0) {
    registryEmpty.classList.remove('hidden');
    return;
  }

  registryEmpty.classList.add('hidden');

  registry.forEach((entry, index) => {
    const row = document.createElement('article');
    row.className = 'registry-row';

    const label = document.createElement('div');
    label.className = 'registry-label';
    label.textContent = `Drop set #${registry.length - index} (${entry.startValue} drops)`;

    const dateWrap = document.createElement('label');
    dateWrap.className = 'registry-date-wrap';
    dateWrap.textContent = 'Popped date';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = entry.poppedDate || '';
    dateInput.addEventListener('change', () => {
      const next = getRegistry();
      if (!next[index]) return;
      next[index].poppedDate = dateInput.value;
      saveRegistry(next);
      renderRegistry();
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'secondary registry-remove';
    removeBtn.textContent = 'Delete';
    removeBtn.addEventListener('click', () => {
      const next = getRegistry();
      next.splice(index, 1);
      saveRegistry(next);
      renderRegistry();
    });

    dateWrap.appendChild(dateInput);
    row.append(label, dateWrap, removeBtn);
    registryList.appendChild(row);
  });
}

clearRegistryBtn.addEventListener('click', () => {
  saveRegistry([]);
  renderRegistry();
});

renderRegistry();
