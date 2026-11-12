# FitTracker PRO

App web (PWA) per allenamento, alimentazione e progressi fisici, in italiano e inglese.
Si installa sul telefono come una vera app e funziona anche offline.

👉 **Apri l'app:** https://snafma.github.io/fittracker-pro/

Versione attuale: **build-SESSION99-BOOT**

## Funzionalità

### Allenamento
- **Salta esercizio (S97)**: "⏭ Salta questo esercizio" sotto INIZIA SERIE (non per riscaldamento, defaticamento, bonus e circuiti). Prima un avviso ("non saltare: piuttosto meno ripetizioni o meno peso"); se confermato si passa al successivo, non entra nel volume né nelle calorie e il riepilogo conta solo gli esercizi fatti (`ST.exSkip`). La volta dopo un avviso giallo ricorda che era stato saltato; pesi e ripetizioni restano quelli inseriti l'ultima volta. L'avviso sparisce quando lo completi.
- **Schede da foto/PDF (S95)**: OCR in modalità blocco uniforme (righe di tabella intere) con foto in scala di grigi e contrasto; il lettore locale capisce tabelle senza "x" (`Panca 4 10`), nomi e numeri su righe diverse, colonne lette separatamente, nomi senza numeri (non più persi). Se l'AI trova meno esercizi del lettore locale, i mancanti vengono reinseriti al loro posto e segnati "da controllare".
- **Schede in tabella (S99)**: i PDF vengono ricostruiti riga per riga rispettando le distanze (`__pdfRows`), così le colonne restano separate. `__tableNorm` riconosce le intestazioni di colonna (esercizio, serie, ripetizioni, recupero, carico, note, gruppo muscolare; IT/EN, anche abbreviate tipo RIP/REC) e trasforma ogni riga in "nome serie×rip rec N kg (note)"; più gruppi di colonne sulla stessa riga = schede affiancate (con i titoli della riga sopra). Colonna del gruppo muscolare ignorata; con celle non allineate decide il contenuto (4x8, 2', 60kg). `__cleanSheet` (anche per foto a spazi singoli) toglie intestazioni e righe di solo muscolo, il muscolo in testa alla riga e legge il recupero scritto come 30'' / 1'30'' / 2'. Gergo da palestra collegato alla libreria (Dip, Spinte seduto, Sopra la testa, Curl martello, Punta piede seduto, Affondi gamba dietro…). Test su un PDF reale da Google Sheets (`_dev/fixtures/scheda-abc-pdf.json`): 22 esercizi su 22.
- **Schede affiancate (S97–S98)**: `__splitCols` separa le tabelle affiancate lette riga per riga (intestazioni tipo "SCHEDA A    SCHEDA B" oppure righe con due esercizi) prima di interpretarle; righe "A"/"B" da sole sono titoli di scheda. L'AI testuale riceve istruzioni su più schede, annotazioni a mano lette male (ignorate se senza senso, note leggibili tenute) e lingua dell'app. Le foto piccole vengono ingrandite (lato lungo almeno 1600 px) prima dell'OCR. Nessuna AI esterna sulle immagini: la scrittura a mano non letta la aggiunge l'utente. In revisione: riepilogo (esercizi trovati, scheda X di Y, "da controllare ›") con le istruzioni per correggere, duplicare e togliere. La copia di un esercizio si porta dietro tutto, anche il riconoscimento.
- **Selezione file su iPhone (S96)**: i campi file per importare (foto/PDF e fotocamera) sono fissi in `document.body`, fuori da `#app`. Prima erano dentro la pagina: tornando dal selettore l'app veniva ridisegnata e la scelta andava persa senza alcun caricamento.
- **Duplica esercizio** nelle schede: copia subito sotto, con scelta della variante (stesso gruppo muscolare) o nome personalizzato modificabile.
- **Aggiunta dalla libreria**: ricerca (anche nomi inglesi e muscoli), filtri per gruppo, un tocco aggiunge con serie/ripetizioni/recupero del proprio obiettivo e messaggio di conferma; avviso se già presente; risultato vuoto spiegato. Nome scheda e nome esercizio mancanti: campo rosso + focus; serie/recupero fuori range corretti automaticamente.
- Tasto 🎙️ nell'intestazione dell'allenamento (pronto, serie, recupero): accende o spegne il coach vocale senza uscire.
- **Focus di allenamento** con nomi nella lingua dell'app (Tutto il corpo / Full body, Parte alta / Upper body, Parte bassa / Lower body, Glutei e addome / Glutes & core, Ipertrofia massima / Max hypertrophy, Forza pura / Pure strength). Per ognuno una scheda spiega a chi serve, le schede a rotazione per il numero di allenamenti scelto e serie × ripetizioni × recupero di esercizi base e complementari, calcolati con le stesse regole dell'allenamento sull'obiettivo scelto (si aggiorna se cambi definizione/massa).
- Parte alta e Parte bassa: da 3 allenamenti a settimana la rotazione è a tre sedute, una delle quali Tutto il corpo, per mantenere la parte non prioritaria.
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
- Piano adattivo con intolleranze e tipo di dieta. Inserimento rapido in 2 tocchi e oltre 1100 alimenti (`food_db.js`), tutti con nome inglese e senza doppioni (gli id rimossi restano validi tramite `FOOD_ALIAS`); aggiunti prodotti proteici (budino, yogurt, latte, mousse, gelato, preparato per pancake), cereali già cotti, konjac, dolcificanti, bevande sportive.
- **Giorni di allenamento** anche nella configurazione iniziale (stessi chip, salvati nel profilo creato). Se non sono ancora stati scelti, in Alimentazione un avviso (una volta) mostra quelli usati e porta a impostarli. Scelti in Configurazione › Programma (chip L-M-M-G-V-S-D, sincronizzati con le sessioni/settimana; senza scelta vale lo schema standard). Calendario, piano settimanale e dieta li usano.
- **Ciclo dei carboidrati**: nei giorni di allenamento più carboidrati (+35 g definizione, +50 g massa), a riposo meno (max −45/−35 g); la media settimanale resta il target dell'obiettivo e la differenza viene solo dai carboidrati (proteine e grassi uguali).
- Proteine e grassi calcolati sul peso di riferimento (massimo quello a BMI 27): con molto grasso corporeo non vengono gonfiati. In definizione senza pesi proteine 1,6 g/kg (1,4 donne).
- Riepilogo per pasto e sezione "Sgarro". Si può disattivare del tutto.

### Home compatta
- **Domenica**: al posto del messaggio del coach, "La tua settimana": allenamenti fatti/previsti, peso e variazione sulla settimana prima, proteine medie sul target (se l'alimentazione è attiva) e un consiglio (allenamenti mancanti → proteine basse → peso nella direzione sbagliata o troppo veloce → conferma).
- **Giorni reali diversi da quelli impostati**: se nelle ultime 3 settimane (almeno 4 allenamenti) almeno metà delle sedute cade fuori dai giorni impostati, una card propone i giorni più frequenti ("Aggiorna" / "No, grazie": non ripropone la stessa scelta).
- **Settimana di scarico**: il banner spiega i numeri applicati davvero (carichi −30%; definizione 2×12-15 con 60 s, altrimenti 3×8-10 con 90 s) e perché.
- Peso, streak, acqua (o kcal se l'alimentazione è attiva) e allenamenti degli ultimi 7 giorni in **una sola riga** di 4 riquadri; composizione corporea in una riga sottile (grassa/magra, barra, lettura del trend). Il dettaglio resta in Corpo.
- **Sport outdoor** è un solo pulsante: porta in Allenamento con l'inserimento già aperto. L'inserimento propone gli **sport recenti** (un tocco), la ricerca ignora gli accenti e capisce anche i nomi inglesi, i minuti si scelgono con i tasti rapidi 15/30/45/60/90 (o scrivendoli) e per lo stesso sport ripropone i minuti dell'ultima volta.

### Statistiche PRO — calcolatore 1RM
- **Esercizio facoltativo** (prima i tuoi, poi gli altri): confronto immediato col record (nuovo record +X kg oppure % del record) e tasto "Salva nello storico" (`ST.rmLog`, ultime 20 per esercizio). Le stime salvate contano come record in `getBest1RM` e compaiono in "I tuoi 1RM record".
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

### Tour e campi obbligatori
- Tour di benvenuto: intestazione e pulsanti fissi, solo il testo scorre; i passi lunghi sono divisi in punti dentro riquadri con bordo.
- Registrazione, configurazione iniziale e Programma: se mancano campi obbligatori compare il messaggio con l'elenco, i campi diventano rossi (il rosso sparisce appena compilati) e il cursore va sul primo. I messaggi non cancellano più quanto già scritto.

### Navigazione
- **Finestre (S97)**: in ogni finestra il tasto ✕ resta fisso in alto (nelle sotto-finestre torna indietro) e la riga dei pulsanti finali (Annulla/Salva…) resta fissa in basso: non serve più scorrere per trovarli.
- **Cerca una funzione (S97)**: 🔍 in cima al menu ☰ apre una ricerca a tutto schermo con i più cercati; ~50 funzioni con parole chiave IT/EN. Il tocco porta alla sezione giusta e la evidenzia; se non trova nulla propone parole più semplici o il coach AI.

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
