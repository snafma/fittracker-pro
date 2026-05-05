// ── FitTracker PRO Service Worker v1 (sessione 8) ──
// File: sw.js (nome esattamente in minuscolo, posizionarlo accanto a Index.html)
// Scopo: notifiche persistenti che sopravvivono alla chiusura del tab
//
// Su Android/Chrome funziona perfettamente.
// Su iOS funziona SOLO se l'app è installata come PWA (Aggiungi alla schermata Home)
// e iOS è 16.4+.

const SW_VERSION = 'ft-sw-v1';

// ── INSTALL: skip waiting per attivare subito la nuova versione ──
self.addEventListener('install', (e) => {
  console.log('[SW]', SW_VERSION, 'installato');
  self.skipWaiting();
});

// ── ACTIVATE: claim immediato dei client ──
self.addEventListener('activate', (e) => {
  console.log('[SW]', SW_VERSION, 'attivato');
  e.waitUntil(self.clients.claim());
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
      // Altrimenti apre nuova finestra
      if (self.clients.openWindow) return self.clients.openWindow('/');
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
