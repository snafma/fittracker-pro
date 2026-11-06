# FitTracker PRO

App web (PWA) per allenamento, alimentazione e progressi fisici, in italiano e inglese.
Si installa sul telefono come una vera app e funziona anche offline.

👉 **Apri l'app:** https://snafma.github.io/fittracker-pro/

Versione attuale: **build-SESSION90-BOOT**

## Funzionalità

### Allenamento
- **Da 1 a 6 sessioni a settimana**, con focus a scelta: tutto il corpo, parte alta, gambe, glutei, ipertrofia o forza.
- **La scheda del giorno è quella che manca**: tra le schede previste nella settimana sceglie quella dei muscoli allenati da più tempo, e non ripete la stessa due volte di fila.
- **Durata da 15 a 90 minuti**. Sotto i 40 minuti passa al **circuito a giri**: gli esercizi del gruppo (2-4) si fanno a rotazione, una serie ciascuno, 15 secondi per cambiare e recupero solo a fine giro, ripetendo il giro 2-4 volte. Recupero di fine giro e numero di giri si adattano alla durata. Sotto i 30 usa riscaldamento express e scende fino a 2 serie, con almeno 3 esercizi. Non sfora mai di più di 3 minuti fino a 30 minuti di sessione, né di più di 5 oltre.
- **Recuperi calcolati per ogni esercizio**: tipo di esercizio, muscolo, ripetizioni, obiettivo e durata scelta, con un tetto massimo (niente pause infinite).
- **Fasi definizione, massa e mantenimento**, cardio di fine sessione in aggiunta alla durata, palestra o casa.
- **Taratura**: a fine esercizio "OK" è già selezionato (si va avanti subito). "Troppo dura" o "Facile" regolano carichi, tempi e cardio, per arrivarci piano piano.
- **Settimana di scarico dinamica**: arriva dopo 4 settimane di fila di allenamento, parte col primo allenamento e dura 7 giorni. Se in quella settimana non ti alleni, salta (e l'app te lo dice).
- **Solo cardio**: sessione guidata stimata su cardio preferito, intensità, obiettivo e taratura. Si può fare al posto dei pesi o in aggiunta.
- **Più allenamenti nello stesso giorno**: la seconda sessione tiene conto di quanto hai già fatto.
- **Come fare**: ogni esercizio ha i passaggi in italiano e inglese, più un link a un video su YouTube.
- **Timer guidato** con suoni (4 temi), pausa, ripresa automatica se l'app viene chiusa, salvataggio parziale. "Esci" riporta subito al menu (il salvataggio parziale continua in background).
- **Scheda nuova ogni ~8 settimane**, con split alternato. Ogni esercizio si può sostituire.
- **Schede personalizzate**, quante vuoi, con nomi univoci. Per ogni esercizio: serie, ripetizioni, recupero, kg e note, "in uso" o "escluso". Si possono aggiungere ed eliminare esercizi ed eliminare intere schede.
- **Importa da foto o PDF** (su iPhone lo stesso tasto permette anche di scattare la foto o scegliere un file): legge una o più schede e le separa (Giorno 1, Scheda A, Lunedì, Push…), con esercizi, serie, ripetizioni, kg, recuperi e note. Il nome della scheda lo sceglie l'utente e deve essere unico (quello letto è solo un suggerimento).
  - PDF con testo: lettura diretta. Foto e PDF scansionati: OCR nel telefono (Tesseract, italiano + inglese).
  - L'AI corregge gli errori di lettura e interpreta la scheda; senza connessione all'AI c'è un lettore locale.
  - Ogni esercizio viene riconosciuto nella libreria (con passaggi e consigli) oppure resta personalizzato. Prima di salvare puoi correggere tutto.
  - In allenamento si usano solo gli esercizi "in uso"; i kg della scheda diventano il carico di partenza e le note compaiono nell'esercizio.
- **Circuiti solo quando servono** (sessioni brevi): con serie normali l'allenamento procede come sempre. Anche nel circuito ogni esercizio ha i suoi kg e le sue ripetizioni.
- **Modalità Coach (voce)**:
  - spiega ogni esercizio e come funziona il circuito, dà l'obiettivo della serie (carico e ripetizioni), un richiamo tecnico e di respirazione, conta le ripetizioni e scandisce timer e intervalli;
  - nei recuperi consiglia se salire o restare sul carico, a fine esercizio confronta con l'ultima volta, a metà allenamento controlla il ritmo;
  - alla fine fa i complimenti e riepiloga minuti, volume (confrontato con l'ultima volta della stessa scheda), calorie, record e rispetto dei tempi; dà il consiglio di recupero per la fase (definizione/massa), annuncia la prossima sessione e saluta;
  - avatar a scelta (uomo, donna, robot, orso), con voce maschile (molto grave se il telefono ha solo una voce femminile), femminile, e acuta e vivace per robot e orso; usa sempre la versione ottimizzata della voce, se c'è;
  - usa le voci del telefono (meglio le versioni "migliorate", es. Luca e Alice). Se ne manca una, adatta tono e ritmo così le quattro voci restano distinguibili. Nelle impostazioni mostra quale voce sta usando e l'elenco delle voci che il telefono rende disponibili all'app (su iPhone, nelle app web installate, iOS di solito dà solo la voce predefinita: in quel caso gli avatar si distinguono per tono e ritmo).

### Alimentazione
- Piano adattivo con intolleranze e tipo di dieta. Inserimento rapido in 2 tocchi e oltre 1000 alimenti (`food_db.js`).
- Riepilogo per pasto e sezione "Sgarro". Si può disattivare del tutto.

### Home compatta
- Peso, streak, acqua (o kcal se l'alimentazione è attiva) e allenamenti degli ultimi 7 giorni in **una sola riga** di 4 riquadri; composizione corporea in una riga sottile (grassa/magra, barra, lettura del trend). Il dettaglio resta in Corpo.
- **Sport outdoor** è un solo pulsante: porta in Allenamento con l'inserimento già aperto. L'inserimento propone gli **sport recenti** (un tocco), la ricerca ignora gli accenti e capisce anche i nomi inglesi, i minuti si scelgono con i tasti rapidi 15/30/45/60/90 (o scrivendoli) e per lo stesso sport ripropone i minuti dell'ultima volta.

### Statistiche PRO — calcolatore 1RM
- Peso, ripetizioni e **serie**: si scrive senza che la tastiera si chiuda (si aggiorna solo il risultato). Con più serie la fatica si accumula: ogni serie in più vale +0,5 ripetizioni a cedimento (massimo +3), poi formula di Epley. Accetta anche la virgola.

### Obiettivo di peso alla data
- Il ritmo viene calcolato sui giorni reali tra le pesate (non sul loro numero) e confrontato con quello necessario e con il **ritmo massimo sano** (dimagrimento ~1% del peso a settimana, 0,5-1,2 kg; massa 0,5 kg).
- **Fattibile ma lento**: avviso "obiettivo ancora raggiungibile" con cosa fare (in definizione: una sessione solo cardio in più, passi, dieta nel weekend), senza proporre di cambiare data.
- **Impossibile** (servirebbe più del ritmo sano): avviso chiaro con data realistica proposta, da accettare o cambiando configurazione.

### Coach coerente
- Un solo messaggio del giorno: se l'obiettivo di peso è in ritardo o impossibile, il coach parla di quello (unendo i complimenti per la costanza negli allenamenti), con il tasto per una sessione solo cardio. La stessa card (stile Progressi) compare in Home, AI Coach › Consigli e Progressi, con bordo verde se sei in linea, arancione se serve attenzione (fattibile ma in ritardo), rosso se l'obiettivo non è raggiungibile.
- Coach vocale, consigli e messaggi chiamano l'utente per nome.

### Grafica
Stile moderno e arrotondato "Apple" sul tema scuro: card con gradiente e ombra morbida, campi e menu a tendina arrotondati con freccia, menu laterale con icone in riquadri e voce attiva evidenziata, fogli dal basso con maniglia, segmenti a pillola, pulsanti con effetto alla pressione, schermate di allenamento e timer rifinite. Nessuna sfocatura sulla barra in alto (su iPhone la rende sfocata). Il tema chiaro non cambia.
- Ogni menu ha un'intestazione colorata con icona, titolo e sottotitolo (stile "Condividi app"); le navigazioni rapide sono a riquadri colorati.
- Avvio e login nello stesso stile: icona dell'app, sfondo sfumato, testi normali (non tutto maiuscolo); "accesso in corso" usa la stessa schermata dell'avvio. Il numero di versione resta piccolo in fondo all'avvio (solo il numero: le novità sono nelle note di rilascio).

### Accesso sempre ricordato
- La sessione di Firebase viene salvata subito sul telefono (prima localStorage, poi IndexedDB) e letta all'avvio prima di mostrare qualsiasi schermata.
- Se eri già dentro, all'apertura vedi "Bentornato" finché la sessione e i dati non sono pronti: mai più il login per qualche secondo. Se iOS segnala prima "nessun utente", l'app aspetta qualche secondo prima di decidere. Il login compare solo se sei uscito davvero (o dopo 15 secondi senza risposta, con un messaggio chiaro).

### Profilo e account
- Scorciatoie alle sezioni: Nome ed email · Dati fisici · Sicurezza (cambio password, logout) · Privacy · Novità · Elimina account.
- **Novità a tutto schermo**: alla prima apertura di una nuova versione le novità compaiono una volta a tutto schermo; chiuse con "Ho capito" non tornano più (memorizzato sul telefono e sull'account).
- **Novità e versioni**: mostra la versione attuale con le sue novità; le versioni precedenti si caricano solo se le chiedi ("Mostra versioni precedenti").
- Nome e cognome; email con stato "verificata", invio dell'email di verifica (link di Firebase) e cambio email con conferma sulla nuova casella; reset della password via email dal profilo e dal login.

### Condividi l'app
- Tasto unico "Condividi" (menu del telefono), WhatsApp, Telegram, Messaggi, Email, link da copiare, anteprima del messaggio personalizzato con il nome, QR da far inquadrare e istruzioni di installazione.

### Configurazione
Divisa in famiglie con navigazione rapida: Programma e obiettivi (con orari) · Allenamento (focus, preferenze, le mie schede) · Coach e suoni · Alimentazione (si può spegnere: il resto resta visibile) · Notifiche · Integrazioni e importazioni (Salute, bilance, calendario, CSV, condivisione community) · App (tema, lingua, tour).

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
