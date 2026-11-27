/**
 * Tawin Newsreader service worker.
 * Keeps the app shell and bundled editions available offline while letting
 * live feeds and streams go straight to the network.
 */

const VERSION = 'newsreader-v31';
const SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/config.js',
  './js/store.js',
  './js/feedService.js',
  './js/archive.js',
  './js/vendor/Readability.js',
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


function escapeAttribute(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

async function proxyReader(request) {
  const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };
  try {
    const form = await request.formData();
    const target = String(form.get('url') || '');
    const provider = String(form.get('provider') || 'jina');
    if (!/^https?:\/\//i.test(target)) {
      return new Response('<h1>Invalid article URL</h1>', { status: 400, headers });
    }

    const fetchJina = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);
      try {
        const response = await fetch('https://r.jina.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: new URLSearchParams({ url: target, respondWith: 'html', base: 'final' }).toString(),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Reader service HTTP ${response.status}`);
        return await response.text();
      } finally {
        clearTimeout(timer);
      }
    };

    const fetchWallhop = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch(`https://wallhop.io/raw/${target}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`WallHop HTTP ${response.status}`);
        return await response.text();
      } finally {
        clearTimeout(timer);
      }
    };

    let html = '';
    if (provider === 'wallhop') {
      try {
        html = await fetchWallhop();
        const blocked = !html || html.length < 1500 || /(are you a robot|security verification|access denied)/i.test(html.slice(0, 12000));
        if (blocked) html = await fetchJina();
      } catch {
        html = await fetchJina();
      }
    } else {
      html = await fetchJina();
    }

    if (!html || html.length < 200) throw new Error('Reader service returned no article');
    html = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<script\b[^>]*\/>/gi, '')
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');
    if (!/<base\s/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${escapeAttribute(target)}">`);
    }
    return new Response(html, {
      headers: {
        ...headers,
        'Content-Security-Policy': "default-src 'self' https: data: blob:; script-src 'none'; style-src 'self' https: 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' https: data:; media-src 'self' https:; connect-src 'self' https:; frame-src 'none';",
      },
    });
  } catch (error) {
    return new Response(`<h1>Reader unavailable</h1><p>${escapeAttribute(error?.message || 'Unknown error')}</p>`, {
      status: 502,
      headers,
    });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method === 'POST' && url.origin === self.location.origin && url.pathname.endsWith('/reader-frame')) {
    event.respondWith(proxyReader(request));
    return;
  }
  if (request.method !== 'GET') return;
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
