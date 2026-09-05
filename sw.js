// Disable the old service worker so it cannot keep serving stale app code.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));await self.registration.unregister();const clients=await self.clients.matchAll({type:'window'});clients.forEach(c=>c.navigate(c.url));})()));
