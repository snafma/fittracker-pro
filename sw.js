// ── FitTracker PRO Service Worker v2 (sessione 58) ──
// File: sw.js (nome esattamente in minuscolo, accanto a index.html)
// v1 (sessione 8): notifiche persistenti
// v2 (sessione 58): + caching → apertura istantanea e funzionamento offline
//
// Strategia cache:
//  • Pagina (index.html): NETWORK-FIRST → gli aggiornamenti arrivano sempre
//    appena pubblichi; la cache serve solo quando sei offline.
//  • food_db.js, manifest, icona: STALE-WHILE-REVALIDATE → risposta immediata
//    dalla cache, aggiornamento in background.
//  • Google Fonts: CACHE-FIRST → i font non cambiano mai.

const SW_VERSION = 'ft-sw-v2';
const CACHE_NAME = 'ft-cache-v2';

// ── INSTALL: skip waiting per attivare subito la nuova versione ──
self.addEventListener('install', (e) => {
  console.log('[SW]', SW_VERSION, 'installato');
  self.skipWaiting();
});

// ── ACTIVATE: pulizia cache vecchie + claim immediato dei client ──
self.addEventListener('activate', (e) => {
  console.log('[SW]', SW_VERSION, 'attivato');
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// ── FETCH: caching ──
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // mai cachare POST (Firestore, API AI)

  const url = new URL(req.url);

  // Mai intercettare Firebase/Firestore/API AI: passano dirette
  if (url.hostname.includes('googleapis.com') && !url.hostname.startsWith('fonts')) return;
  if (url.hostname.includes('firebaseio.com') || url.hostname.includes('anthropic.com')) return;
  if (url.hostname.includes('workers.dev')) return;
  if (url.hostname.includes('openfoodfacts')) return;
  if (url.hostname.includes('gstatic.com') && !url.hostname.startsWith('fonts')) return;

  // 1) Navigazione (la pagina stessa): network-first, cache come fallback offline
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (_) {
        const cached = await caches.match(req);
        return cached || new Response('<h1>Offline</h1><p>Riconnettiti per usare FitTracker.</p>', { headers: { 'Content-Type': 'text/html' } });
      }
    })());
    return;
  }

  // 2) Google Fonts: cache-first (immutabili)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (_) { return new Response('', { status: 504 }); }
    })());
    return;
  }

  // 3) Asset stessa origine (food_db.js, manifest, icone): stale-while-revalidate
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const cached = await caches.match(req);
      const fetchPromise = fetch(req).then(fresh => {
        if (fresh && fresh.ok) {
          caches.open(CACHE_NAME).then(c => c.put(req, fresh.clone()));
        }
        return fresh;
      }).catch(() => null);
      return cached || (await fetchPromise) || new Response('', { status: 504 });
    })());
  }
});

// ── NOTIFICATION CLICK: apre o focusa la web app ──
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // Se c'è già una finestra aperta, la focusa
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      // Altrimenti apre nuova finestra (scope = cartella dell'app su GitHub Pages)
      if (self.clients.openWindow) return self.clients.openWindow(self.registration.scope);
    })
  );
});

// ── MESSAGE: schedula notifiche dal main thread ──
self.addEventListener('message', (e) => {
  if (!e.data || !e.data.type) return;

  if (e.data.type === 'schedule-notification') {
    const { title, body, when, tag } = e.data;
    const ms = when - Date.now();
    if (ms > 0 && ms < 86400000 * 7) { // max 7 giorni
      setTimeout(() => {
        self.registration.showNotification(title || 'FitTracker', {
          body: body || '',
          tag: tag || ('ft-' + Date.now()),
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="%23c5f135"/><text x="48" y="60" font-family="Arial Black" font-size="40" fill="%23000" text-anchor="middle">FT</text></svg>',
          requireInteraction: false
        });
      }, ms);
    }
  }

  if (e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── PUSH: predisposto per future integrazioni Firebase Cloud Messaging ──
self.addEventListener('push', (e) => {
  let data = { title: 'FitTracker', body: 'Apri l\'app per dettagli' };
  try {
    if (e.data) data = e.data.json();
  } catch(_) {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'FitTracker', {
      body: data.body || '',
      tag: data.tag || 'ft-push',
      requireInteraction: false
    })
  );
});
