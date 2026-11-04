# FitTracker PRO

App web (PWA) per allenamento, alimentazione e progressi fisici, in italiano e inglese.
Si installa sul telefono come una vera app e funziona anche offline.

👉 **Apri l'app:** https://snafma.github.io/fittracker-pro/

Versione attuale: **build-SESSION78-VOICES2**

## Funzionalità

### Allenamento
- **Da 1 a 6 sessioni a settimana**, con focus a scelta: tutto il corpo, parte alta, gambe, glutei, ipertrofia o forza.
- **La scheda del giorno è quella che manca**: tra le schede previste nella settimana sceglie quella dei muscoli allenati da più tempo, e non ripete la stessa due volte di fila.
- **Durata da 15 a 90 minuti**. Sotto i 40 minuti passa al circuito. Sotto i 30 usa riscaldamento express e scende fino a 2 serie, con almeno 3 esercizi. Non sfora mai di più di 3 minuti fino a 30 minuti di sessione, né di più di 5 oltre.
- **Recuperi calcolati per ogni esercizio**: tipo di esercizio, muscolo, ripetizioni, obiettivo e durata scelta, con un tetto massimo (niente pause infinite).
- **Fasi definizione, massa e mantenimento**, cardio di fine sessione in aggiunta alla durata, palestra o casa.
- **Taratura**: a fine esercizio "Troppo dura / OK / Facile" regola carichi, tempi e cardio, per arrivarci piano piano.
- **Settimana di scarico dinamica**: arriva dopo 4 settimane di fila di allenamento, parte col primo allenamento e dura 7 giorni. Se in quella settimana non ti alleni, salta (e l'app te lo dice).
- **Solo cardio**: sessione guidata stimata su cardio preferito, intensità, obiettivo e taratura. Si può fare al posto dei pesi o in aggiunta.
- **Più allenamenti nello stesso giorno**: la seconda sessione tiene conto di quanto hai già fatto.
- **Come fare**: ogni esercizio ha i passaggi in italiano e inglese, più un link a un video su YouTube.
- **Timer guidato** con suoni (4 temi), pausa, ripresa automatica se l'app viene chiusa, salvataggio parziale.
- **Scheda nuova ogni ~8 settimane**, con split alternato. Ogni esercizio si può sostituire.
- **Modalità Coach (voce)**:
  - spiega ogni esercizio, conta le ripetizioni e scandisce timer e intervalli;
  - alla fine fa i complimenti, riepiloga minuti, chili, calorie e record, poi saluta;
  - avatar a scelta (uomo, donna, robot, orso), ognuno con una voce diversa: voce maschile, femminile, sintetica AI e vivace;
  - usa le voci del telefono (meglio le versioni "migliorate", es. Luca e Alice). Se ne manca una, adatta tono e ritmo così le quattro voci restano distinguibili. Nelle impostazioni mostra quale voce sta usando.

### Alimentazione
- Piano adattivo con intolleranze e tipo di dieta. Inserimento rapido in 2 tocchi e oltre 1000 alimenti (`food_db.js`).
- Riepilogo per pasto e sezione "Sgarro". Si può disattivare del tutto.

### Progressi
- Peso, sonno, passi, composizione corporea (massa grassa e massa magra).
- Grafici toccabili, storico dettagliato, record personali, avviso di stallo.
- Consigli del coach AI (Cloudflare Workers AI).

### Dati
- Account con login (Firebase Auth) e dati sincronizzati nel cloud (Firestore) tra più dispositivi.
- Copia locale e coda di salvataggio: i dati inseriti non si perdono anche se iOS chiude l'app.

## File del repository

| File | A cosa serve |
|---|---|
| `index.html` | L'app pubblicata (minificata). È il file servito da GitHub Pages. |
| `food_db.js` | Database alimenti. |
| `sw.js` | Service worker: apertura istantanea, offline, notifiche. |
| `manifest.json`, `apple-touch-icon.png` | Installazione come app sul telefono. |
| `_dev/Index-SORGENTE.html` | Sorgente leggibile dell'app: si modifica questo, non `index.html`. |
| `_dev/build.js` | Genera `index.html` minificato dal sorgente. |
| `_dev/test.sh` e `_dev/*.js` | Controllo sintassi e test funzionali (jsdom). |

La cartella `_dev` non viene pubblicata da GitHub Pages.

## Sviluppo

```bash
cd _dev
npm install        # una volta sola
npm run build      # sorgente → ../index.html
npm test           # sintassi + test su sorgente e su index.html
```

Dopo ogni aggiornamento, sul telefono chiudi l'app dal multitasking e riaprila.
