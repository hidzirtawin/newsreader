/**
 * Tawin Newsreader service worker.
 * Keeps the app shell and bundled editions available offline while letting
 * live feeds and streams go straight to the network.
 */

const VERSION = 'newsreader-v10';
const SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/config.js',
  './js/store.js',
  './js/feedService.js',
  './js/archive.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './data/news.json',
  './data/podcasts.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.allSettled(SHELL.map((path) => cache.add(path)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(VERSION);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (fallbackUrl ? cache.match(fallbackUrl) : null) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  if (/\/data\/(news|podcasts)\.json$/.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (/\.(css|js|mjs|svg|png|ico|webmanifest)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});
