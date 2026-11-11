const SHELL_CACHE = "agung-shell-v2";
const IMG_CACHE = "agung-img-v2";
const MAX_IMG_ENTRIES = 60;
const PRECACHE_ASSETS = ["/", "/icon.svg", "/site.webmanifest", "/img/hero-intro-poster.webp"];

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  const excess = keys.length - maxItems;
  await Promise.all(keys.slice(0, excess).map(k => cache.delete(k)));
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k !== SHELL_CACHE && k !== IMG_CACHE)
            .map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET" || request.headers.has("range")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Abaikan partial video stream / non-cacheable endpoints
  if (url.pathname.startsWith("/video/")) return;

  // Immutable hashed assets (/assets/*.js, *.woff2) -> Cache-First di SHELL_CACHE
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then(c => c.put(request, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  // Document navigasi -> Network-First dengan fallback cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then(c => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request).then(c => c || caches.match("/")))
    );
    return;
  }

  // Gambar -> Stale-While-Revalidate di IMG_CACHE dengan batas entri (bounded FIFO eviction)
  if (url.pathname.startsWith("/img/")) {
    event.respondWith(
      caches.match(request).then(cached => {
        const net = fetch(request)
          .then(res => {
            if (res.status === 200) {
              const copy = res.clone();
              caches
                .open(IMG_CACHE)
                .then(c => c.put(request, copy))
                .then(() => trimCache(IMG_CACHE, MAX_IMG_ENTRIES));
            }
            return res;
          })
          .catch(() => cached);
        return cached || net;
      })
    );
  }
});
