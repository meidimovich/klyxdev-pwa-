const CACHE_NAME = "klyxdev-cache-v2";
const OFFLINE_URL = "/offline";
const ASSETS = [
  "/offline",
  "/icon.svg",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("klyxdev-cache-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;

  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (!ASSETS.includes(url.pathname)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  );
});
