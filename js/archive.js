/**
 * archive.js — non-blocking archive availability checks.
 *
 * Only publishers configured with Archive.is or Wayback reach this module.
 * Checks are bounded by short timeouts so a slow archive can never hold up
 * the rest of the feed.
 */

import { readArchiveCache, writeArchiveCache } from './store.js';

const inFlight = new Map();

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

async function proxyText(target, timeoutMs) {
  const proxies = [
    {
      url: `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`,
      read: async (response) => {
        const payload = await response.json();
        return typeof payload?.contents === 'string' ? payload.contents : '';
      },
    },
    {
      url: `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(target)}`,
      read: (response) => response.text(),
    },
  ];

  let lastError = null;
  for (const proxy of proxies) {
    const { signal, done } = withTimeout(timeoutMs);
    try {
      const response = await fetch(proxy.url, { signal, headers: { Accept: 'text/plain, application/json, text/html, */*' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await proxy.read(response);
      if (text) return text;
    } catch (error) {
      lastError = error;
    } finally {
      done();
    }
  }
  throw lastError || new Error('Archive unavailable');
}

async function runCheck(article) {
  const cached = readArchiveCache(article.url, article.strategy);
  if (cached) return cached;

  if (article.strategy === 'archive_is') {
    const endpoint = `https://archive.is/timemap/${article.url}`;
    try {
      const text = await proxyText(endpoint, 6500);
      const available = /rel=["']memento["']/i.test(text) || /<memento/i.test(text);
      const result = available
        ? { available: true, archiveUrl: `https://archive.is/newest/${article.url}` }
        : { available: false };
      writeArchiveCache(article.url, article.strategy, result);
      return result;
    } catch {
      // A timeout is treated as "no readable archive" so headlines do not hang.
      const result = { available: false, timedOut: true };
      writeArchiveCache(article.url, article.strategy, result);
      return result;
    }
  }

  if (article.strategy === 'wayback') {
    const endpoint = `https://archive.org/wayback/available?url=${encodeURIComponent(article.url)}`;
    try {
      const text = await proxyText(endpoint, 6500);
      const payload = JSON.parse(text.replace(/^\uFEFF/, ''));
      const closest = payload?.archived_snapshots?.closest;
      const result = closest?.available
        ? { available: true, archiveUrl: String(closest.url).replace(/^http:/, 'https:') }
        : { available: false };
      writeArchiveCache(article.url, article.strategy, result);
      return result;
    } catch {
      const result = { available: false, timedOut: true };
      writeArchiveCache(article.url, article.strategy, result);
      return result;
    }
  }

  return { available: false };
}

export function checkArchive(article) {
  if (!article?.url) return Promise.resolve({ available: false });
  const key = `${article.strategy}:${article.url}`;
  if (inFlight.has(key)) return inFlight.get(key);
  const promise = runCheck(article).finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}
