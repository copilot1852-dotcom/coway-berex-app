// Service Worker for PWA standalone mode — cache-first with network fallback
const CACHE_NAME = 'birex-v3-20260601-policy';
const CACHE_FILES = [
  './',
  './index.html'
];

// Install: pre-cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for navigation, network-first with cache fallback for resources
self.addEventListener('fetch', e => {
  const req = e.request;

  // Skip non-GET requests
  if (req.method !== 'GET') return;

  // Navigation requests (HTML pages)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          // Cache fresh copy
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Other resources: network-first, fallback to cache
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
