// Predvolené poschodia a stav editora
let floors = [
  { id: 'p0', name: 'Prízemie', image: 'podorys-p0.svg' },
  { id: 'p1', name: '1. poschodie', image: 'podorys-p1.svg' }
];
let stations = [];
let editingIndex = null;

// Odkazy na prvky v DOM
const questForm = document.getElementById('quest-form');
const btnLoadSample = document.getElementById('btn-load-sample');

const stationForm = document.getElementById('station-form');
const stationFormTitle = document.getElementById('station-form-title');
const stationIdInput = document.getElementById('station-id');
const stationNameInput = document.getElementById('station-name');
const stationFloorSelect = document.getElementById('station-floor');
const stationXInput = document.getElementById('station-x');
const stationYInput = document.getElementById('station-y');
const stationPointsInput = document.getElementById('station-points');
const btnSaveStation = document.getElementById('btn-save-station');
const btnCancelEdit = document.getElementById('btn-cancel-edit');

const stationsHeading = document.getElementById('stations-heading');
const stationsList = document.getElementById('stations-list');

// Pomocná funkcia pre načítanie ukážkového questu zo shared modulu
async function loadQuest(questId) {
  const candidates = [
    'https://gagls-qr-quest.github.io/shared/v1/qrq.js',
    'https://gagls-qr-quest.github.io/shared/v1/index.js',
    'https://gagls-qr-quest.github.io/shared/v1/app.js'
  ];

  for (const url of candidates) {
    try {
      const mod = await import(url);
      if (typeof mod.loadQuest === 'function') {
        return await mod.loadQuest(questId);
      }
    } catch (_) {
      // skúsime ďalší možný názov modulu
    }
  }

  // Záložné priame načítanie JSON súboru ukážky zo shared
  const res = await fetch(`https://gagls-qr-quest.github.io/shared/v1/quests/${questId}.json`);
  if (!res.ok) {
    throw new Error(`Nepodarilo sa načítať quest ${questId} (${res.status})`);
  }
  return await res.json();
}

// Pomocná funkcia pre názov poschodia
function getFloorName(floorId) {
  const found = floors.find(f => f.id === floorId);
  return found ? found.name : floorId;
}

// Aktualizácia možností v rozbaľovacom zozname poschodí
function renderFloorOptions() {
  stationFloorSelect.innerHTML = '';
  floors.forEach(floor => {
    const opt = document.createElement('option');
    opt.value = floor.id;
    opt.textContent = `${floor.name} (${floor.id})`;
    stationFloorSelect.appendChild(opt);
  });
}

// Vykreslenie zoznamu stanovíšť
function renderStations() {
  stationsHeading.textContent = `Stanovištia (${stations.length})`;
  stationsList.innerHTML = '';

  if (stations.length === 0) {
    stationsList.innerHTML = '<p class="stations-empty">Zatiaľ nie sú pridané žiadne stanovištia.</p>';
    return;
  }

  stations.forEach((st, index) => {
    const item = document.createElement('div');
    item.className = 'station-item';

    const info = document.createElement('div');
    info.className = 'station-info';

    const titleLine = document.createElement('div');
    titleLine.className = 'station-title';
    titleLine.innerHTML = `<strong>${index + 1} · ${st.name}</strong>`;
    if (st.isNew) {
      titleLine.innerHTML += ' <span class="station-badge">nové</span>';
    }

    const metaLine = document.createElement('div');
    metaLine.className = 'station-meta';
    metaLine.textContent = `${getFloorName(st.floor)} · x ${st.x} · y ${st.y} · ${st.points} b.`;

    info.appendChild(titleLine);
    info.appendChild(metaLine);

    const actions = document.createElement('div');
    actions.className = 'station-item-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'qrq-btn qrq-btn--ghost qrq-btn--sm';
    editBtn.textContent = 'Upraviť';
    editBtn.addEventListener('click', () => startEditStation(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'qrq-btn qrq-btn--danger qrq-btn--sm';
    deleteBtn.textContent = 'Zmazať';
    deleteBtn.addEventListener('click', () => deleteStation(index));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(info);
    item.appendChild(actions);
    stationsList.appendChild(item);
  });
}

// Začatie úpravy stanovišťa
function startEditStation(index) {
  const st = stations[index];
  editingIndex = index;

  stationIdInput.value = st.id;
  stationNameInput.value = st.name;
  stationFloorSelect.value = st.floor;
  stationXInput.value = st.x;
  stationYInput.value = st.y;
  stationPointsInput.value = st.points;

  stationFormTitle.textContent = `Upraviť stanovište (${st.name})`;
  btnSaveStation.textContent = 'Uložiť zmeny';
  btnCancelEdit.hidden = false;
  stationForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Reset formulára stanovišťa do režimu pridávania
function resetStationForm() {
  editingIndex = null;
  stationForm.reset();
  stationXInput.value = 50;
  stationYInput.value = 50;
  stationPointsInput.value = 10;
  if (floors.length > 0) {
    stationFloorSelect.value = floors[0].id;
  }
  stationFormTitle.textContent = 'Stanovište';
  btnSaveStation.textContent = 'Pridať stanovište';
  btnCancelEdit.hidden = true;
}

// Zmazanie stanovišťa
function deleteStation(index) {
  if (editingIndex === index) {
    resetStationForm();
  } else if (editingIndex !== null && editingIndex > index) {
    editingIndex--;
  }
  stations.splice(index, 1);
  renderStations();
}

// Odoslanie formulára pre pridanie / uloženie stanovišťa
stationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const updatedFields = {
    id: stationIdInput.value.trim(),
    name: stationNameInput.value.trim(),
    floor: stationFloorSelect.value,
    x: Number(stationXInput.value),
    y: Number(stationYInput.value),
    points: Number(stationPointsInput.value)
  };

  if (editingIndex !== null) {
    // Pri úprave zachováme pôvodné vlastnosti (napr. code, task, hint z ukážky)
    stations[editingIndex] = {
      ...stations[editingIndex],
      ...updatedFields
    };
  } else {
    stations.push({
      ...updatedFields,
      isNew: true
    });
  }

  resetStationForm();
  renderStations();
});

btnCancelEdit.addEventListener('click', resetStationForm);

// Načítanie ukážkového questu cez loadQuest('ukazka')
btnLoadSample.addEventListener('click', async () => {
  try {
    btnLoadSample.disabled = true;
    btnLoadSample.textContent = 'Načítavam...';

    const quest = await loadQuest('ukazka');

    document.getElementById('quest-id').value = quest.id || 'ukazka';
    document.getElementById('quest-title').value = quest.title || '';
    document.getElementById('quest-intro').value = quest.intro || '';
    document.getElementById('quest-mode').value = quest.mode || 'free';

    if (Array.isArray(quest.floors) && quest.floors.length > 0) {
      floors = quest.floors;
      renderFloorOptions();
    }

    // Hlboká kópia stanovíšť, aby sa zachovali task a hint
    stations = (quest.stations || []).map(st => ({ ...st }));
    resetStationForm();
    renderStations();
  } catch (err) {
    console.error('Chyba pri načítaní ukážky:', err);
    alert('Nepodarilo sa načítať ukážkový quest. Skontroluj konzolu (F12).');
  } finally {
    btnLoadSample.disabled = false;
    btnLoadSample.textContent = 'Načítať ukážku';
  }
});

// Export do quest.json
questForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Z floors odstránime imageUrl, ktoré tam pridáva loadQuest
  const cleanFloors = floors.map(({ imageUrl, ...rest }) => rest);

  // Zo stanovíšť odstránime interný príznak isNew a poistíme číselné typy
  const cleanStations = stations.map(({ isNew, ...st }) => ({
    ...st,
    x: Number(st.x),
    y: Number(st.y),
    points: Number(st.points)
  }));

  const questData = {
    format: 'qrq-1',
    id: document.getElementById('quest-id').value.trim(),
    title: document.getElementById('quest-title').value.trim(),
    intro: document.getElementById('quest-intro').value.trim(),
    mode: document.getElementById('quest-mode').value,
    floors: cleanFloors,
    stations: cleanStations
  };

  const jsonString = JSON.stringify(questData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quest.json';
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// Počiatočná inicializácia
renderFloorOptions();
renderStations();