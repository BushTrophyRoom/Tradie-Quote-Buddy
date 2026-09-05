const CACHE_NAME = 'tradie-quote-buddy-v11';
const APP_SHELL = [
  './',
  './index.html',
  './app-v7.js?v=9',
  './quote-terms.js',
  './manifest.webmanifest?v=9',
  './icon.svg'
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
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (cached ? Promise.resolve(cached) : fetch(event.request)).then(response => {
        var url = new URL(event.request.url);
        if (url.origin === self.location.origin && url.pathname.endsWith('/app-v7.js')) {
          return response.text().then(function(text) {
            var injected = text + "\n(function(){var s=document.createElement('script');s.src='./quote-terms.js';s.defer=false;document.head.appendChild(s);})();\n";
            return new Response(injected, {headers:{'Content-Type':'application/javascript; charset=utf-8'}});
          });
        }
        if (!cached && response && response.ok && url.origin === self.location.origin) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
