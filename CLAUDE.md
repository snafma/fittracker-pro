# FitTracker PRO — istruzioni per Claude

- Utente: Marcello. Scrive in italiano, prova su iPhone (PWA in Safari). Vuole modifiche chirurgiche e minime, niente lunghe spiegazioni.
- Si modifica SOLO `_dev/Index-SORGENTE.html`. `index.html` si rigenera con `cd _dev && npm run build`. Non va mai modificato a mano.
- A ogni modifica:
  - avanza la versione (`<meta name="ft-version">` e testo del loader `build-SESSIONxx`);
  - aggiorna il tour in italiano e in inglese;
  - aggiorna `README.md`;
  - esegui `npm test` (sorgente + minificato): deve essere tutto verde.
- Nuove funzioni: nuovi test in `_dev/featNN.js`.
- Problemi noti su iOS:
  - input con font sotto i 16px causano zoom;
  - backdrop-filter, transform e blur sulla topbar la sfocano;
  - `localStorage` va usato sempre dentro try/catch;
  - l'app viene sospesa in background.
- Le patch nei template: il sorgente contiene sequenze `\n` letterali e `\x3c!--` dentro i template. Attenzione agli apostrofi nelle stringhe tra apici singoli.
- Commit con messaggio in italiano che descrive le modifiche.
