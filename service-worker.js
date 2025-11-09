/*
 * service-worker.js
 * Lightweight service worker for offline caching.
 *
 * Cache strategy: "cache-first" for app shell; fallback to network for others.
 */

const CACHE_NAME = "gaming-checklist-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/config.js",
  "/js/data.js",
  "/js/storage.js",
  "/js/icons.js",
  "/js/ui-components.js",
  "/js/game-card.js",
  "/js/features.js",
  "/js/app.js",
  "/js/pwa-init.js",
  /* Add other necessary assets here */
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
})();