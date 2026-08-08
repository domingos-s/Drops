const calendarGrid = document.getElementById('calendarGrid');
const calendarMonth = document.getElementById('calendarMonth');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const totalDrops = document.getElementById('totalDrops');
const daysLogged = document.getElementById('daysLogged');

const now = new Date();
let viewYear = now.getFullYear();
let viewMonth = now.getMonth();

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

function getDailyCounts() {
  return getRegistry().reduce((counts, entry) => {
    if (!entry.poppedDate) return counts;
    counts[entry.poppedDate] = (counts[entry.poppedDate] || 0) + 1;
    return counts;
  }, {});
}

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function renderCalendar() {
  const counts = getDailyCounts();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-`;
  const monthEntries = Object.entries(counts).filter(([key]) => key.startsWith(monthPrefix));

  totalDrops.textContent = monthEntries.reduce((sum, [, count]) => sum + count, 0);
  daysLogged.textContent = monthEntries.length;
  calendarMonth.textContent = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(viewYear, viewMonth, 1));
  calendarGrid.innerHTML = '';

  for (let i = 0; i < firstDay; i += 1) {
    const spacer = document.createElement('div');
    spacer.className = 'calendar-day calendar-day-empty';
    calendarGrid.appendChild(spacer);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = dateKey(viewYear, viewMonth, day);
    const count = counts[key] || 0;
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    if (key === todayKey) cell.classList.add('calendar-today');

    const dayNumber = document.createElement('span');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = day;
    cell.appendChild(dayNumber);

    if (count > 0) {
      const badge = document.createElement('span');
      badge.className = 'calendar-drop-count';
      badge.textContent = count;
      badge.setAttribute('aria-label', `${count} drop${count === 1 ? '' : 's'}`);
      cell.appendChild(badge);
    }
    calendarGrid.appendChild(cell);
  }
}

prevMonthBtn.addEventListener('click', () => {
  viewMonth -= 1;
  if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
  renderCalendar();
});
nextMonthBtn.addEventListener('click', () => {
  viewMonth += 1;
  if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
  renderCalendar();
});

renderCalendar();
