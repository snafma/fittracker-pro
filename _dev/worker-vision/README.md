# fittracker-vision — AI che legge le foto delle schede

Serve per leggere bene le schede fotografate: tabelle affiancate (A e B), scritte a penna o matita, numeri corretti a mano, note.
Senza questo worker l'app legge le foto con l'OCR del telefono (va bene per il testo stampato, non per la scrittura a mano).

## Installazione (5 minuti, dal sito di Cloudflare)
1. **Workers & Pages → Create → Create Worker**, nome **`fittracker-vision`** → **Deploy**.
2. **Edit code**: cancella tutto, incolla `worker.js` di questa cartella → **Deploy**.
3. **Settings → Bindings → Add → Workers AI**, nome variabile **`AI`** → **Save** (poi di nuovo Deploy se richiesto).
4. Apri `https://fittracker-vision.snafma.workers.dev`: deve comparire `fittracker-vision ok`.

L'app usa già questo indirizzo: appena il worker risponde, le foto vengono lette dall'AI con visione. Se il sottodominio è diverso da `snafma`, va aggiornato `AI_VISION_URL` nell'app.

Modello: `@cf/meta/llama-4-scout-17b-16e-instruct` (testo + immagini). Una foto per richiesta.
