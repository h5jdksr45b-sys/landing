/* guia-sw.js COMPLETO */

const CACHE_NAME = "guia-manejo-v20";

const CORE_ASSETS = [
  "./",
  "./guia.html",
  "./guia-manifest.json",
  "./guia-sw.js",
  "./hero22.png",
  "./icon-192.png",
  "./icon-512.png"
];

// Instala e pré-cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

// Estratégia:
// - HTML: network-first (pra atualizar de verdade)
// - outros: cache-first com atualização em background
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Só GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Só controla mesma origem
  if (url.origin !== self.location.origin) return;

  // HTML: network-first
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("./guia.html")))
    );
    return;
  }

  // Demais: cache-first + atualização
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
