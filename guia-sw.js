const CACHE_NAME="guia-manejo-v3";
const FILES=[
"./guia.html",
"./guia-manifest.json",
"./icon-192.png",
"./icon-512.png"
];

self.addEventListener("install",e=>{
e.waitUntil(
caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES))
);
});

self.addEventListener("fetch",e=>{
e.respondWith(
caches.match(e.request).then(res=>res||fetch(e.request))
);
});
