// FitTracker PRO — lettura delle schede da foto con AI che "vede" l'immagine
// (tabelle affiancate, scritte a penna o matita, numeri corretti a mano, note).
// Cloudflare Workers AI · modello @cf/meta/llama-4-scout-17b-16e-instruct (testo + immagini).
//
// Installazione (una volta sola, dal sito di Cloudflare):
//   1. Workers & Pages → Create → Worker → nome: fittracker-vision → Deploy
//   2. Edit code → incolla questo file → Deploy
//   3. Settings → Bindings → Add → Workers AI → nome variabile: AI → Save
//   L'indirizzo sarà https://fittracker-vision.<tuo-sottodominio>.workers.dev
//   (l'app usa già https://fittracker-vision.snafma.workers.dev)
//
// Richiesta:  POST { system, prompt, images: ["data:image/jpeg;base64,..."], max_tokens }
// Risposta:   { content: [{ type: "text", text: "..." }] }   (stesso formato del worker testuale)

const MODEL = "@cf/meta/llama-4-scout-17b-16e-instruct";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (req.method !== "POST") return new Response("fittracker-vision ok", { headers: CORS });
    try {
      const b = await req.json();
      const imgs = (Array.isArray(b.images) ? b.images : []).filter((u) => typeof u === "string" && /^data:image\//.test(u)).slice(0, 1);
      if (!imgs.length) return Response.json({ error: "no image" }, { status: 400, headers: CORS });
      const content = [{ type: "text", text: String(b.prompt || "Leggi la scheda.").slice(0, 6000) }].concat(
        imgs.map((u) => ({ type: "image_url", image_url: { url: u } })),
      );
      const r = await env.AI.run(MODEL, {
        messages: [
          { role: "system", content: String(b.system || "").slice(0, 6000) },
          { role: "user", content },
        ],
        max_tokens: Math.min(4096, Math.max(256, parseInt(b.max_tokens) || 3000)),
        temperature: 0.1,
      });
      const out = r && r.response != null ? (typeof r.response === "string" ? r.response : JSON.stringify(r.response)) : "";
      return Response.json({ content: [{ type: "text", text: out }] }, { headers: CORS });
    } catch (e) {
      return Response.json({ error: String((e && e.message) || e) }, { status: 500, headers: CORS });
    }
  },
};
