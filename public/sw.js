const SHELL_CACHE = "agung-shell-v7";
const IMG_CACHE = "agung-img-v7";
const MAX_IMG_ENTRIES = 60;
const PRECACHE_ASSETS = ["/", "/theme-init.js", "/icon.svg", "/icon-192.png", "/apple-touch-icon.png", "/site.webmanifest", "/img/hero-intro-poster.webp?v=2"];

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  const excess = keys.length - maxItems;
  await Promise.all(keys.slice(0, excess).map(k => cache.delete(k)));
}

const isCacheableBasic = res => Boolean(res && res.ok && res.status === 200 && res.type === "basic");

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
  if ((url.protocol !== "http:" && url.protocol !== "https:") || url.origin !== self.location.origin) return;

  // Abaikan partial video stream / non-cacheable endpoints
  if (url.pathname.startsWith("/video/")) return;

  // Shell scripts & icons (/theme-init.js, /icon.svg, /icon-192.png, /apple-touch-icon.png, /site.webmanifest) -> Stale-While-Revalidate di SHELL_CACHE
  if (
    url.pathname === "/theme-init.js" ||
    url.pathname === "/site.webmanifest" ||
    url.pathname === "/icon.svg" ||
    url.pathname === "/icon-192.png" ||
    url.pathname === "/icon-512.png" ||
    url.pathname === "/apple-touch-icon.png"
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        const net = fetch(request)
          .then(res => {
            if (isCacheableBasic(res)) {
              const copy = res.clone();
              caches.open(SHELL_CACHE).then(c => c.put(request, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || net;
      })
    );
    return;
  }

  // Immutable hashed assets (/assets/*.js, *.css, *.woff2) -> Cache-First di SHELL_CACHE
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (isCacheableBasic(res)) {
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
          if (isCacheableBasic(res)) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then(c => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request).then(c => c || caches.match("/")))
    );
    return;
  }

  // Gambar -> Stale-While-Revalidate di IMG_CACHE dengan bounded FIFO eviction
  if (url.pathname.startsWith("/img/")) {
    event.respondWith(
      caches.match(request).then(cached => {
        const net = fetch(request)
          .then(res => {
            if (isCacheableBasic(res)) {
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
