const CACHE_NAME = 'tradie-quote-buddy-v24';
const APP_SHELL = [
  './', './index.html', './app-v7.js?v=10', './dashboard-layout.js?v=3',
  './response-actions.js?v=11', './quote-terms.js?v=2', './respond.html',
  './respond-v2.html?v=3', './manifest.webmanifest?v=10', './icon.svg?v=2'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  var requestUrl = new URL(event.request.url);
  var isAppDocument = requestUrl.origin === self.location.origin && (event.request.mode === 'navigate' || requestUrl.pathname.endsWith('/index.html'));
  event.respondWith(
    (isAppDocument ? fetch(event.request).then(response => {
      if(response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match('./index.html')) : caches.match(event.request).then(cached => (cached ? Promise.resolve(cached) : fetch(event.request)).then(response => {
      var url=new URL(event.request.url);
      if(url.origin===self.location.origin && url.pathname.endsWith('/app-v7.js')) return response.text().then(text => new Response(text+'\n(function(){var s=document.createElement("script");s.src="./quote-terms.js?v=2";document.head.appendChild(s);})();\n(function(){var s=document.createElement("script");s.src="./response-actions.js?v=11";document.head.appendChild(s);})();\n',{headers:{'Content-Type':'application/javascript; charset=utf-8'}}));
      if(!cached && response && response.ok && url.origin===self.location.origin){var copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
      return response;
    })))
  );
});
