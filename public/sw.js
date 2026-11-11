const CACHE_NAME = "agung-portfolio-v1";
const PRECACHE = ["/", "/icon.svg", "/site.webmanifest", "/img/hero-intro-poster.webp"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
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

  // Immutable hashed assets (/assets/*.js, *.woff2) -> Cache-First
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  // Document navigasi & gambar -> Stale-While-Revalidate / Network-First fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request).then(c => c || caches.match("/")))
    );
    return;
  }

  if (url.pathname.startsWith("/img/")) {
    event.respondWith(
      caches.match(request).then(cached => {
        const net = fetch(request)
          .then(res => {
            if (res.status === 200) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then(c => c.put(request, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || net;
      })
    );
  }
});
