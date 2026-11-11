// The web app's service worker (captioai.app/app only, registered by
// src/app/app/install.ts): what lets Chrome and Edge offer "Install Captio AI".
// It only touches opening /app itself: always from the network, and the last
// copy when there's no connection. Nothing else is cached or changed.
const CACHE = "captio-app-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.mode !== "navigate") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname !== "/app") return;
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res.ok) {
        const copy = res.clone();
        event.waitUntil(caches.open(CACHE).then(c => c.put("/app", copy)));
      }
      return res;
    } catch (err) {
      const cached = await caches.match("/app");
      if (cached) return cached;
      throw err;
    }
  })());
});
