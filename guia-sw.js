/* guia-sw.js (COMPLETO) */

const CACHE_NAME = "guia-manejo-v7";

const FILES = [
  "./",
  "./guia.html",
  "./guia-manifest.json",
  "./guia-sw.js",

  // HERO
  "./hero22.png",

  // ÍCONES (ajuste se seus nomes forem outros)
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Só lida com GET
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // Cacheia respostas válidas (mesma origem)
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
          return res;
        })
        .catch(() => {
          // Fallback simples (se offline e não achou nada)
          return caches.match("./guia.html");
        });
    })
  );
});
