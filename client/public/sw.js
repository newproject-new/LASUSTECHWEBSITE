/**
 * Service Worker — Offline & Cache Strategy
 *
 * This service worker enables the portal to function in low-bandwidth or
 * intermittent-connectivity environments by caching key resources locally.
 *
 * Two distinct caching strategies are applied:
 *
 * 1. API routes (/api/*) — Network-first with cache fallback:
 *    Try the live network first to get fresh data. If the request succeeds,
 *    cache the response for offline reuse (GET requests only). If the network
 *    fails (e.g. no internet), serve the last cached response. If no cache
 *    exists, return a structured 503 JSON error so the UI can handle it.
 *
 * 2. Static assets (JS, CSS, HTML) — Cache-first:
 *    Serve from cache immediately for speed. If not cached, fetch from the
 *    network and store the result. This ensures fast repeat loads on slow
 *    connections by avoiding unnecessary round trips.
 */

const CACHE_NAME = 'lasustech-v1';

// Core static assets pre-cached on service worker install.
// These are the minimum files needed to render the app shell offline.
const STATIC_ASSETS = ['/', '/static/js/main.chunk.js', '/static/css/main.chunk.css'];

// On install: pre-cache static assets and activate immediately without waiting
// for existing tabs to close (skipWaiting).
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {}); // Non-fatal: some chunks may have hashed filenames
    })
  );
  self.skipWaiting();
});

// On activate: delete any old cache versions to free storage and avoid
// serving stale assets after a portal update. Then claim all open clients
// so the new service worker takes effect immediately.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: Network-first for API calls
  // Fresh data is always preferred; cache serves as an offline safety net.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).then(response => {
        // Cache successful GET responses so they are available offline
        if (response.ok && request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => caches.match(request).then(cached => cached || new Response('{"error":"Offline"}', {
        status: 503, headers: { 'Content-Type': 'application/json' }
      })))
    );
    return;
  }

  // Strategy 2: Cache-first for static assets
  // Serve from cache instantly; fetch and cache on miss.
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      }
      return response;
    }))
  );
});

// Listen for SKIP_WAITING messages sent from the React app after a new
// service worker is detected, allowing the update to activate without
// requiring a full page reload.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
