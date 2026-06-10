const STORAGE_KEY = 'fitnessTrackerEntries';

const entryForm = document.getElementById('entryForm');
const entryDate = document.getElementById('entryDate');
const entryType = document.getElementById('entryType');
const entrySteps = document.getElementById('entrySteps');
const entryDuration = document.getElementById('entryDuration');
const entryCalories = document.getElementById('entryCalories');
const entryList = document.getElementById('entryList');
const weeklyProgress = document.getElementById('weeklyProgress');
const todaySteps = document.getElementById('todaySteps');
const todayCalories = document.getElementById('todayCalories');
const todayWorkout = document.getElementById('todayWorkout');
const clearEntries = document.getElementById('clearEntries');

function loadEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function getWeekRange() {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

function buildWeeklyMetrics(entries) {
  const weekDates = getWeekRange();
  const metrics = weekDates.map((day) => ({
    date: day,
    steps: 0,
    calories: 0,
    duration: 0
  }));

  entries.forEach((entry) => {
    const target = metrics.find((item) => item.date === entry.date);
    if (target) {
      target.steps += Number(entry.steps || 0);
      target.calories += Number(entry.calories || 0);
      target.duration += Number(entry.duration || 0);
    }
  });

  return metrics;
}

function renderWeeklyProgress(entries) {
  const metrics = buildWeeklyMetrics(entries);
  const maxValue = Math.max(...metrics.map((item) => Math.max(item.steps, item.calories, item.duration)), 1);
  weeklyProgress.innerHTML = '';

  metrics.forEach((item) => {
    const value = item.steps + item.calories + item.duration;
    const percent = Math.min(100, Math.round((value / maxValue) * 100));
    const label = `${formatDate(item.date)} · ${item.steps} steps · ${item.duration} min · ${item.calories} cal`;

    const itemEl = document.createElement('div');
    itemEl.className = 'progress-item';
    itemEl.innerHTML = `
      <label>${label}<span>${percent}%</span></label>
      <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
    `;
    weeklyProgress.appendChild(itemEl);
  });
}

function renderSummary(entries) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayEntries = entries.filter((entry) => entry.date === todayKey);
  const summary = todayEntries.reduce(
    (acc, entry) => {
      acc.steps += Number(entry.steps || 0);
      acc.calories += Number(entry.calories || 0);
      acc.duration += Number(entry.duration || 0);
      return acc;
    },
    { steps: 0, calories: 0, duration: 0 }
  );

  todaySteps.textContent = summary.steps;
  todayCalories.textContent = summary.calories;
  todayWorkout.textContent = summary.duration;
}

function renderEntryList(entries) {
  if (entries.length === 0) {
    entryList.innerHTML = '<div class="no-data">No entries yet. Add a log to get started.</div>';
    return;
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  entryList.innerHTML = '';

  sorted.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'entry-item';
    item.innerHTML = `
      <h3>${entry.type} <small>${formatDate(entry.date)}</small></h3>
      <p><strong>Steps:</strong> ${entry.steps || 0}</p>
      <p><strong>Duration:</strong> ${entry.duration || 0} min</p>
      <p><strong>Calories:</strong> ${entry.calories || 0} kcal</p>
      <p>${entry.notes || ''}</p>
    `;
    entryList.appendChild(item);
  });
}

function refreshView() {
  const entries = loadEntries();
  renderSummary(entries);
  renderWeeklyProgress(entries);
  renderEntryList(entries);
}

function setDefaultDate() {
  const today = new Date().toISOString().slice(0, 10);
  entryDate.value = today;
}

entryForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newEntry = {
    date: entryDate.value,
    type: entryType.value,
    steps: entrySteps.value ? Number(entrySteps.value) : 0,
    duration: entryDuration.value ? Number(entryDuration.value) : 0,
    calories: entryCalories.value ? Number(entryCalories.value) : 0,
    notes: ''
  };

  const entries = loadEntries();
  entries.push(newEntry);
  saveEntries(entries);
  entryForm.reset();
  setDefaultDate();
  refreshView();
});

clearEntries.addEventListener('click', () => {
  if (confirm('Clear all saved fitness entries?')) {
    localStorage.removeItem(STORAGE_KEY);
    refreshView();
  }
});

setDefaultDate();
refreshView();
