/*
 * MyBase service worker.
 *
 * Strategy:
 *   - Navigations: network-first. Always try the live app shell so deploys are
 *     picked up immediately; fall back to the cached shell when offline.
 *   - Static assets (Vite emits content-hashed, immutable files): cache-first.
 *     Once cached they never change, so serving from cache is safe and fast.
 *
 * The cache is versioned; bump CACHE_VERSION to invalidate on the next deploy.
 * All URLs are scoped under the GitHub Pages base path /mybase/.
 */

const CACHE_VERSION = 'v1'
const CACHE_NAME = `mybase-${CACHE_VERSION}`
const BASE = '/mybase/'
const APP_SHELL = `${BASE}index.html`

// Pre-cache the app shell so the app boots offline after the first visit.
const PRECACHE_URLS = [BASE, APP_SHELL, `${BASE}manifest.webmanifest`, `${BASE}favicon.svg`]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle same-origin GET requests. Let everything else hit the network.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return
  }

  // App navigations: network-first with an offline fallback to the cached shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(APP_SHELL, copy))
          return response
        })
        .catch(() => caches.match(APP_SHELL, { ignoreSearch: true }).then((cached) => cached ?? caches.match(BASE))),
    )
    return
  }

  // Static assets: cache-first, then populate the cache on a miss.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached
      }

      return fetch(request).then((response) => {
        // Only cache successful, basic (same-origin) responses.
        if (response.ok && response.type === 'basic') {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }

        return response
      })
    }),
  )
})
