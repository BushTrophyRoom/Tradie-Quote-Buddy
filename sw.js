const CACHE_NAME = 'tradie-quote-buddy-v58';
const APP_SHELL = [
  './', './index.html', './app-v7.js?v=10', './dashboard-layout.js?v=9',
  './response-actions.js?v=13', './quote-terms.js?v=2', './customer-send.js?v=8', './invoice.js?v=6', './invoice-delete-direct.js?v=2', './dashboard-invoice-stats.js?v=5', './status-sync.js?v=5', './email-routing.js?v=1', './invoice-paid.js?v=1', './bank-settings.js?v=2', './invoice-bank-live.js?v=2', './invoice-paid-live.js?v=2', './respond.html',
  './respond-v2.html?v=6', './quote-view.html', './invoice-view.html', './manifest.webmanifest?v=10', './icon.svg?v=2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({type:'window', includeUncontrolled:true}))
      .then(clients => Promise.all(clients.map(client => {
        try { return client.navigate(client.url); } catch (e) { return null; }
      })))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const isAppDocument = requestUrl.origin === self.location.origin &&
    (event.request.mode === 'navigate' || requestUrl.pathname.endsWith('/index.html'));
  const isAppScript = requestUrl.origin === self.location.origin &&
    requestUrl.pathname.match(/\.(js|css)$/);

  if (isAppDocument || isAppScript) {
    event.respondWith(
      fetch(new Request(event.request, {cache:'no-store'})).then(response => {
        if (response && response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      }).catch(() => caches.match(event.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok && requestUrl.origin === self.location.origin) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});