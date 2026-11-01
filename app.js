// Modul EDITOR – tvorba questu, QR karty a výsledky
// ------------------------------------------------------------------
// Spoločné funkcie (načítanie questu, adresy, kľúče úložiska) sú v shared/v1/qrq.js.
// Formát dát: https://github.com/gagls-qr-quest/gagls-qr-quest.github.io/blob/main/FORMAT.md
//
// Editor vyrába súbor quest.json. Rozpracovaný quest ukladá do localStorage
// pod kľúčom KEYS.draft – hra a mapa ho potom otvoria s ?q=draft.
// ------------------------------------------------------------------
import { loadQuest } from 'https://gagls-qr-quest.github.io/shared/v1/qrq.js';

const obsah = document.querySelector('#obsah');

/** Vytvorí odsek s textom (cez textContent, nie innerHTML). */
function odsek(text, trieda = '') {
  const p = document.createElement('p');
  p.textContent = text;
  if (trieda) p.className = trieda;
  return p;
}

async function spusti() {
  try {
    const quest = await loadQuest('ukazka');

    const json = document.createElement('pre');
    json.className = 'qrq-code';
    json.textContent = JSON.stringify(quest, null, 2);

    // TODO (úloha z 3. stretnutia): formulár pre základné údaje questu
    //   (id, názov, úvod, režim) a tlačidlo „Stiahnuť quest.json“.
    obsah.replaceChildren(
      odsek(`Ukážkový quest „${quest.title}“ má ${quest.floors.length} poschodia a počet stanovíšť ${quest.stations.length}.`),
      odsek('Takto vyzerá v JSON – presne tento súbor bude editor vyrábať:', 'qrq-muted'),
      json,
    );
  } catch (chyba) {
    obsah.replaceChildren(odsek(chyba.message, 'qrq-error'));
    console.error(chyba);
  }
}

spusti();
