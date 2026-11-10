# QR Quest – Editor

Editor QR Questu: organizátor v ňom vytvorí quest (stanovištia, úlohy, poloha na pôdoryse),
vytlačí QR karty a na konci hry ukáže výsledkovú tabuľu.

**Živá verzia:** https://gagls-qr-quest.github.io/editor/

**Autor:** Alex (Discord: mr.alex111) · **Rola:** Editor · Mentoring TUKE × GAGLS 2026/27

## Čo modul robí

Tento modul slúži na tvorbu a správu questov, stanovíšť, úloh a tlač QR kariet pre hru.

## Ako na ňom pracovať

1. Naklonuj repozitár (GitHub Desktop alebo `git clone https://github.com/gagls-qr-quest/editor.git`).
2. Otvor priečinok vo VS Code a spusti **Live Server** (pravý klik na `index.html` → Open with Live Server).
3. Uprav kód, ulož, skontroluj v prehliadači.
4. `git add` → `git commit -m "Pridaj …"` → `git push`. O minútu je zmena na GitHub Pages.

Výstup editora musí presne dodržať [FORMAT.md](https://github.com/gagls-qr-quest/gagls-qr-quest.github.io/blob/main/FORMAT.md) –
inak ho hra a mapa neprečítajú. Rozpracovaný quest ukladaj pod kľúč `KEYS.draft` zo `shared/v1/qrq.js`.

## Súbory

```
index.html   kostra stránky
app.js       logika editora (začni tu)
style.css    vlastný vzhľad modulu
```

## Zverejnenie questu

1. V editore exportuj `quest.json`.
2. V spoločnom repozitári `gagls-qr-quest.github.io` vytvor priečinok `questy/<id>/`
   a nahraj doň `quest.json` a obrázky pôdorysov (aj cez web: Add file → Upload files).
3. Quest je online na `https://gagls-qr-quest.github.io/hra/?q=<id>`.

## Úlohy

Úlohy sú v záložke **Issues**, zoskupené podľa míľnikov. Hotová úloha = funguje, beží na GitHub Pages,
konzola je bez chýb a issue je zatvorené so screenshotom.

## Môj cieľ na pilot

_(doplníš po konzultácii vo februári)_

## Čo som sa naučil

_(doplníš na konci – toto je tvoje portfólio)_
