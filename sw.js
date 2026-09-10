const CACHE_NAME = 'tradie-quote-buddy-v65';
const APP_SHELL = [
  './', './index.html', './app-v7.js?v=10', './dashboard-layout.js?v=9',
  './response-actions.js?v=13', './quote-terms.js?v=2', './customer-send.js?v=8', './invoice.js?v=6', './invoice-delete-direct.js?v=2', './dashboard-invoice-stats.js?v=5', './status-sync.js?v=5', './email-routing.js?v=1', './invoice-paid.js?v=1', './bank-settings.js?v=2', './invoice-bank-live.js?v=2', './invoice-paid-live.js?v=1', './invoice-fix.js?v=64', './invoice-edit.js?v=11', './respond.html',
  './respond-v2.html?v=6', './quote-view.html', './invoice-view.html', './manifest.webmanifest?v=10', './icon.svg?v=2', './update-check.js?v=1'
];
async function freshAppDocument(request){
  const response=await fetch(new Request(request,{cache:'no-store'}));
  if(!response || !response.ok)return response;
  const type=response.headers.get('content-type')||'';
  if(!type.includes('text/html'))return response;
  let html=await response.text();
  html=html.replace(/invoice-fix\.js\?v=\d+/g,'invoice-fix.js?v=64');
  if(!html.includes('invoice-fix.js')){const tag='<script src="./invoice-fix.js?v=64"></script>';if(/<\/body>/i.test(html))html=html.replace(/<\/body>/i,tag+'</body>');else html+=tag}
  if(!html.includes('update-check.js')){const tag='<script src="./update-check.js?v=1" defer></script>';if(/<\/body>/i.test(html))html=html.replace(/<\/body>/i,tag+'</body>');else html+=tag}
  const headers=new Headers(response.headers);headers.set('cache-control','no-store, max-age=0');headers.set('x-dustyboots-build','v65');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:headers});
}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll({type:'window',includeUncontrolled:true})).then(clients=>Promise.all(clients.map(client=>{try{return client.navigate(client.url)}catch(e){return null}}))))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const requestUrl=new URL(event.request.url),sameOrigin=requestUrl.origin===self.location.origin;const isAppDocument=sameOrigin&&(event.request.mode==='navigate'||requestUrl.pathname.endsWith('/index.html'));const isAppScript=sameOrigin&&requestUrl.pathname.match(/\.(js|css)$/);if(isAppDocument){event.respondWith(freshAppDocument(event.request).then(response=>{if(response&&response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(event.request,response.clone())).catch(()=>{});return response}).catch(()=>caches.match(event.request).then(c=>c||caches.match('./index.html'))));return}if(isAppScript){event.respondWith(fetch(new Request(event.request,{cache:'no-store'})).then(response=>{if(response&&response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(event.request,response.clone())).catch(()=>{});return response}).catch(()=>caches.match(event.request)));return}event.respondWith(caches.match(event.request).then(cached=>{if(cached)return cached;return fetch(event.request).then(response=>{if(response&&response.ok&&sameOrigin)caches.open(CACHE_NAME).then(cache=>cache.put(event.request,response.clone())).catch(()=>{});return response})}).catch(()=>caches.match('./index.html')))});