/**
 * feedService.js — RSS/Atom retrieval, parsing, deduplication and article
 * normalization.
 *
 * Publishers do not send CORS headers, so requests travel through a small
 * waterfall of public read-only proxies. A bundled snapshot keeps the app
 * usable when those proxies are unavailable.
 */

import {
  BRIEF_ONLY_DOMAINS,
  WALLHOP_DOMAINS,
  FEED_LIMIT,
  TOPIC_ARTICLE_LIMIT,
  getFeedById,
  normalizeDomain,
} from './config.js';
import { getDomainRule, getSettings, getFeed, readArchiveCache } from './store.js';

const PROXIES = [
  {
    name: 'allorigins',
    timeoutMs: 7500,
    build: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    read: async (response) => {
      const payload = await response.json();
      if (typeof payload?.contents === 'string') return payload.contents;
      throw new Error('Proxy returned no contents');
    },
  },
  {
    name: 'codetabs',
    timeoutMs: 3500,
    build: (url) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
    read: (response) => response.text(),
  },
];

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

async function fetchThroughProxies(url, { timeoutMs = 7500, parse } = {}) {
  let lastError = null;
  for (const proxy of PROXIES) {
    const { signal, done } = timeoutSignal(Math.min(proxy.timeoutMs || timeoutMs, timeoutMs));
    try {
      const response = await fetch(proxy.build(url), {
        signal,
        headers: { Accept: '*/*' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await proxy.read(response);
      if (!text || text.length < 40) throw new Error('Empty response');
      const parsed = parse(text);
      if (parsed && parsed.length) {
        return { items: parsed, proxy: proxy.name };
      }
      throw new Error('No usable items');
    } catch (error) {
      lastError = error;
    } finally {
      done();
    }
  }
  throw lastError || new Error('Feed unavailable');
}

/* ------------------------------------------------------------------ */
/* Parsing helpers                                                     */
/* ------------------------------------------------------------------ */

function firstTag(node, names) {
  for (const name of names) {
    const found = node.getElementsByTagName(name);
    if (found.length) return found[0];
  }
  return null;
}

function tagText(node, names) {
  const el = firstTag(node, names);
  if (!el) return '';
  return (el.textContent || '').trim();
}

function decodeEntities(input) {
  if (!input) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input.replace(/<br\s*\/?>/gi, ' ').replace(/<\/(p|div|li)>/gi, ' ');
  return textarea.value;
}

function stripHtml(input) {
  if (!input) return '';
  try {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    doc.querySelectorAll('script, style, noscript, iframe').forEach((node) => node.remove());
    return (doc.body?.textContent || '').replace(/\s+/g, ' ').trim();
  } catch {
    return decodeEntities(input.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  }
}

function cleanTitle(raw, source) {
  let title = decodeEntities(String(raw || '')).replace(/\s+/g, ' ').trim();
  if (!title) return 'Untitled';
  title = title.replace(/\u00a0/g, ' ');
  const suffixes = [source, source?.replace(/^The\s+/i, '')].filter(Boolean);
  for (const suffix of suffixes) {
    const escaped = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    title = title.replace(new RegExp(`\\s+[-|–—]\\s+${escaped}$`, 'i'), '').trim();
  }
  return title || 'Untitled';
}

function absoluteUrl(candidate, base) {
  if (!candidate) return '';
  let value = decodeEntities(String(candidate)).trim();
  if (!value || value.startsWith('data:') || value.startsWith('blob:')) return '';
  if (value.startsWith('//')) value = `https:${value}`;
  try {
    const resolved = new URL(value, base || undefined);
    if (!/^https?:$/.test(resolved.protocol)) return '';
    return resolved.href;
  } catch {
    return '';
  }
}

function isLikelyImage(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (/\.(svg|gif)(\?|$)/.test(lower)) return false;
  if (/(sprite|spacer|pixel|tracking|1x1|avatar|favicon|logo|icon|badge|button)/.test(lower)) return false;
  return true;
}

function extractImage(node, baseUrl) {
  const candidates = [];

  for (const tag of ['media:content', 'media:thumbnail', 'itunes:image', 'image']) {
    for (const el of node.getElementsByTagName(tag)) {
      const url = el.getAttribute('url') || el.getAttribute('href');
      if (url) candidates.push({ url, width: Number(el.getAttribute('width')) || 0 });
    }
  }
  for (const el of node.getElementsByTagName('enclosure')) {
    const type = (el.getAttribute('type') || '').toLowerCase();
    const url = el.getAttribute('url');
    if (url && (type.startsWith('image') || /\.(jpe?g|png|webp|avif)(\?|$)/i.test(url))) {
      candidates.push({ url, width: 0 });
    }
  }
  const html = [
    tagText(node, ['content:encoded', 'content', 'description', 'summary']),
  ].join(' ');
  const imgRegex = /<img[^>]+(?:src|data-src)=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html))) {
    candidates.push({ url: match[1], width: 0 });
  }

  const sorted = candidates
    .map((candidate) => ({ ...candidate, url: absoluteUrl(candidate.url, baseUrl) }))
    .filter((candidate) => candidate.url && isLikelyImage(candidate.url))
    .sort((a, b) => b.width - a.width);

  return sorted[0]?.url || '';
}

function extractLink(node) {
  const linkEl = firstTag(node, ['link']);
  if (linkEl) {
    const href = linkEl.getAttribute('href');
    if (href) return href;
    const text = (linkEl.textContent || '').trim();
    if (text) return text;
  }
  const linkNodes = node.getElementsByTagName('link');
  for (const candidate of linkNodes) {
    const rel = candidate.getAttribute('rel');
    const href = candidate.getAttribute('href');
    if (href && (!rel || rel === 'alternate')) return href;
  }
  const guid = firstTag(node, ['guid']);
  if (guid && guid.getAttribute('isPermaLink') !== 'false') {
    return (guid.textContent || '').trim();
  }
  return '';
}

function hashId(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `art-${(hash >>> 0).toString(36)}`;
}

function parseFeedText(text, feed) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Feed XML could not be parsed');

  let nodes = Array.from(doc.getElementsByTagName('item'));
  if (!nodes.length) nodes = Array.from(doc.getElementsByTagName('entry'));

  const items = [];
  for (const node of nodes.slice(0, FEED_LIMIT)) {
    const rawTitle = tagText(node, ['title']);
    const rawLink = extractLink(node);
    if (!rawTitle || !rawLink) continue;
    const sourceName = tagText(node, ['source']) || feed.name;
    const summaryHtml = tagText(node, ['description', 'summary', 'content', 'content:encoded']);
    let summary = stripHtml(summaryHtml).slice(0, 260);
    if (/^(null|undefined|none)$/i.test(summary)) summary = '';
    const pubDateRaw = tagText(node, ['pubDate', 'published', 'updated', 'dc:date']);
    const parsedDate = Date.parse(pubDateRaw);
    items.push({
      title: cleanTitle(rawTitle, sourceName || feed.name),
      link: absoluteUrl(rawLink, feed.url),
      summary,
      imageUrl: extractImage(node, absoluteUrl(rawLink, feed.url) || feed.url),
      pubDate: Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString() : '',
      source: sourceName || feed.name,
    });
  }
  return items;
}

/* ------------------------------------------------------------------ */
/* Article construction                                                */
/* ------------------------------------------------------------------ */

export function buildStrategyUrl(strategy, originalUrl) {
  if (!originalUrl) return '';
  switch (strategy) {
    case 'smry': return `https://smry.ai/${originalUrl}`;
    case 'removepaywall': return `https://www.removepaywall.com/search?url=${encodeURIComponent(originalUrl)}`;
    case 'unwall': return `https://unwall.app/${originalUrl}`;
    case 'freedium': return `https://freedium-mirror.cfd/${originalUrl}`;
    case 'reader': return `https://r.jina.ai/${originalUrl}`;
    case 'archive_is': return `https://archive.is/newest/${originalUrl}`;
    case 'archive_ph': return `https://archive.ph/newest/${originalUrl}`;
    case 'wayback': return `https://web.archive.org/web/*/${originalUrl}`;
    case 'wallhop': return `https://wallhop.io/raw/${originalUrl}`;
    case 'printfriendly': return `https://www.printfriendly.com/print?url=${encodeURIComponent(originalUrl)}`;
    case 'google_translate': {
      try {
        const parsed = new URL(originalUrl);
        const host = parsed.hostname.replace(/\./g, '-');
        return `https://${host}.translate.goog${parsed.pathname}?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en`;
      } catch {
        return originalUrl;
      }
    }
    case 'direct':
    default: return originalUrl;
  }
}

export function isBriefOnlyDomain(domainInput) {
  const domain = normalizeDomain(domainInput);
  return BRIEF_ONLY_DOMAINS.some((item) => domain === item || domain.endsWith(`.${item}`));
}

export function isWallhopDomain(domainInput) {
  const domain = normalizeDomain(domainInput);
  return WALLHOP_DOMAINS.some((item) => domain === item || domain.endsWith(`.${item}`));
}

export function applyRule(article) {
  const rule = getDomainRule(article.domain);
  const briefOnly = isBriefOnlyDomain(article.domain);
  const base = {
    ...article,
    rule,
    strategy: rule.strategy,
    locked: false,
    badge: 'Free',
    status: 'free',
    targetUrl: buildStrategyUrl(rule.strategy, article.url),
    archiveUrl: '',
  };

  // Google News wrappers cannot be passed to reader/archive services; open the
  // wrapper directly so the browser can follow Google's redirect to the publisher.
  if (/^https?:\/\/news\.google\.com\//i.test(article.url || '')) {
    return {
      ...base,
      strategy: 'direct',
      status: briefOnly ? 'bypassed' : 'free',
      badge: briefOnly ? 'Brief' : 'Open',
      briefOnly,
      targetUrl: article.url,
      locked: false,
    };
  }

  if (rule.strategy === 'archive_is' || rule.strategy === 'wayback') {
    const cached = readArchiveCache(article.url, rule.strategy);
    if (cached?.available && cached.archiveUrl) {
      base.status = 'bypassed';
      base.badge = 'Archived';
      base.archiveUrl = cached.archiveUrl;
      base.targetUrl = cached.archiveUrl;
    } else if (cached && cached.available === false) {
      base.status = 'locked';
      base.badge = 'Locked';
      base.locked = true;
      base.targetUrl = article.url;
    } else {
      base.status = 'checking';
      base.badge = 'Checking';
      base.targetUrl = article.url;
    }
  } else if (rule.strategy === 'smry') {
    base.status = 'bypassed';
    base.badge = 'SMRY';
  } else if (rule.strategy === 'removepaywall') {
    base.status = 'bypassed';
    base.badge = 'Bypass';
  } else if (rule.strategy === 'unwall') {
    base.status = 'bypassed';
    base.badge = 'UnWall';
  } else if (rule.strategy === 'freedium') {
    base.status = 'bypassed';
    base.badge = 'Freedium';
  } else if (rule.strategy === 'reader') {
    base.status = 'bypassed';
    base.badge = 'Reader';
  } else if (rule.strategy === 'wallhop') {
    base.status = 'bypassed';
    base.badge = 'WallHop';
  } else if (rule.strategy === 'google_translate') {
    base.status = 'bypassed';
    base.badge = 'Translate';
  } else if (rule.strategy === 'printfriendly') {
    base.status = 'bypassed';
    base.badge = 'Print';
  } else if (rule.strategy === 'archive_ph') {
    base.status = 'bypassed';
    base.badge = 'Archive';
  }

  if (briefOnly && base.status !== 'locked') {
    base.briefOnly = true;
    base.status = 'bypassed';
    base.badge = 'Brief';
  }

  return base;
}

function normalizeUrlForCompare(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_|ref|source)/i.test(key)) url.searchParams.delete(key);
    }
    return `${url.origin}${url.pathname}`.replace(/\/$/, '').toLowerCase();
  } catch {
    return String(value || '').split('?')[0].replace(/\/$/, '').toLowerCase();
  }
}

function titleKey(title) {
  return String(title || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90);
}

function titleSimilarity(a, b) {
  const left = new Set(titleKey(a).split(' ').filter((word) => word.length > 2));
  const right = new Set(titleKey(b).split(' ').filter((word) => word.length > 2));
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const word of left) if (right.has(word)) shared += 1;
  return (2 * shared) / (left.size + right.size);
}

export function dedupeArticles(articles) {
  const seenUrls = new Set();
  const output = [];
  for (const article of articles) {
    const urlKey = normalizeUrlForCompare(article.url);
    if (!urlKey || seenUrls.has(urlKey)) continue;
    const duplicate = output.some((existing) => titleSimilarity(existing.title, article.title) >= 0.72);
    if (duplicate) continue;
    seenUrls.add(urlKey);
    output.push(article);
  }
  return output;
}

export function sortByDate(articles, direction = 'newest') {
  return [...articles].sort((a, b) => {
    const left = a.pubDate ? Date.parse(a.pubDate) : 0;
    const right = b.pubDate ? Date.parse(b.pubDate) : 0;
    return direction === 'oldest' ? left - right : right - left;
  });
}

function freshArticles(sorted) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const dates = sorted.map((article) => Date.parse(article.pubDate)).filter(Number.isFinite);
  const newest = dates.length ? Math.max(...dates) : now;
  const cutoff = Math.max(newest - 14 * day, now - 30 * day);
  let fresh = sorted.filter((article) => {
    const time = Date.parse(article.pubDate);
    return !Number.isFinite(time) || time >= cutoff;
  });
  if (fresh.length < 12) {
    const relaxed = Math.max(newest - 30 * day, now - 60 * day);
    fresh = sorted.filter((article) => {
      const time = Date.parse(article.pubDate);
      return !Number.isFinite(time) || time >= relaxed;
    });
  }
  return fresh.length ? fresh : sorted;
}

function balanceBySource(sorted, limit) {
  const selected = [];
  const selectedIds = new Set();
  const counts = new Map();
  // Guarantee that every publisher with recent stories gets a place near the top...
  for (const article of sorted) {
    const count = counts.get(article.source) || 0;
    if (count >= 2) continue;
    selected.push(article);
    selectedIds.add(article.id);
    counts.set(article.source, count + 1);
  }
  // ...then fill the rest strictly by recency.
  for (const article of sorted) {
    if (selected.length >= limit) break;
    if (selectedIds.has(article.id)) continue;
    selected.push(article);
    selectedIds.add(article.id);
  }
  return selected
    .sort((left, right) => (Date.parse(right.pubDate) || 0) - (Date.parse(left.pubDate) || 0))
    .slice(0, limit);
}

export function curateArticles(articles, sort = 'newest') {
  const sorted = sortByDate(articles, sort === 'oldest' ? 'oldest' : 'newest');
  if (sort === 'oldest') return sorted.slice(0, TOPIC_ARTICLE_LIMIT);
  return balanceBySource(freshArticles(sorted), TOPIC_ARTICLE_LIMIT);
}

export function formatRelativeTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function keywordMatches(article, keywords) {
  if (!keywords?.length) return true;
  const haystack = `${article.title} ${article.summary || ''}`.toLowerCase();
  return keywords.some((keyword) => {
    const needle = String(keyword).toLowerCase().trim();
    if (!needle) return false;
    if (needle.length <= 3 || /^[a-z0-9]+$/i.test(needle)) {
      return new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i').test(haystack);
    }
    return haystack.includes(needle);
  });
}

async function runWithConcurrency(tasks, concurrency = 3) {
  const results = new Array(tasks.length);
  let cursor = 0;
  async function worker() {
    while (cursor < tasks.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await tasks[index]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
  return results;
}

/**
 * Fetch every feed in a topic. Keeps partial successes and reports per-feed
 * source status for the "Sources" disclosure.
 */
export async function fetchTopicArticles(topic, { onProgress, watchOnly = false } = {}) {
  const settings = getSettings();
  const disabled = new Set(settings.disabledFeeds);
  let feedIds = (topic.feeds || []).filter((id) => !disabled.has(id) && getFeed(id));
  if (watchOnly) feedIds = feedIds.slice(0, 6);
  if (!feedIds.length) {
    return { articles: [], results: [], fetchedAt: new Date().toISOString(), emptyReason: 'No sources are enabled for this topic. Enable sources in the library.' };
  }

  const tasks = feedIds.map((feedId) => async () => {
    const feed = getFeed(feedId);
    try {
      const payload = await fetchThroughProxies(feed.url, { parse: (text) => parseFeedText(text, feed) });
      const articles = payload.items
        .map((item) => ({
          id: hashId(item.link),
          title: item.title,
          source: feed.name,
          feedId: feed.id,
          domain: feed.domain || normalizeDomain(item.link),
          url: item.link,
          summary: item.summary,
          imageUrl: item.imageUrl,
          pubDate: item.pubDate,
        }))
        .filter((article) => article.url);
      return { feed, ok: true, count: articles.length, articles, proxy: payload.proxy };
    } catch (error) {
      return { feed, ok: false, count: 0, articles: [], error: error?.message || 'Unavailable' };
    } finally {
      onProgress?.();
    }
  });

  const results = await runWithConcurrency(tasks, 6);
  const allArticles = results.flatMap((result) => result.articles);
  let articles = dedupeArticles(allArticles).map((article) => applyRule(article));
  if (topic.keywords?.length) {
    articles = articles.filter((article) => keywordMatches(article, topic.keywords));
  }
  articles = curateArticles(articles, 'newest');

  const successful = results.filter((result) => result.ok);
  if (!successful.length) {
    const error = new Error('Live feeds could not be reached. This can happen when public feed proxies are busy.');
    error.results = results.map(({ feed, ok, count, error: feedError }) => ({ feedId: feed.id, name: feed.name, ok, count, error: feedError }));
    throw error;
  }

  return {
    articles,
    results: results.map(({ feed, ok, count, error, proxy }) => ({ feedId: feed.id, name: feed.name, ok, count, error, proxy })),
    fetchedAt: new Date().toISOString(),
    emptyReason: articles.length ? '' : 'No recent stories matched this topic.',
  };
}

/* ------------------------------------------------------------------ */
/* Snapshot fallback                                                   */
/* ------------------------------------------------------------------ */

let snapshotPromise = null;

export function loadSnapshot() {
  if (!snapshotPromise) {
    snapshotPromise = fetch('./data/news.json', { cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        console.warn('Snapshot unavailable', error);
        return {};
      });
  }
  return snapshotPromise;
}

export async function getSnapshotForTopic(topic) {
  const snapshot = await loadSnapshot();
  const entry = snapshot?.[topic.id];
  if (!entry || !Array.isArray(entry.articles)) return null;
  const articles = entry.articles
    .filter((article) => article && article.url && article.title)
    .map((article) => applyRule({
      ...article,
      domain: article.domain || normalizeDomain(article.url),
      source: article.source || getFeedById(article.feedId)?.name || 'News',
    }));
  return {
    articles: curateArticles(articles, 'newest'),
    updatedAt: entry.updatedAt || '',
    results: entry.results || [],
    fromSnapshot: true,
  };
}

export { getFeed };

/* ------------------------------------------------------------------ */
/* Podcasts                                                            */
/* ------------------------------------------------------------------ */

function parseDuration(value) {
  if (!value) return 0;
  const raw = String(value).trim();
  if (/^\d+$/.test(raw)) return Number(raw);
  const parts = raw.split(':').map((part) => Number(part) || 0);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function parsePodcastText(text, show) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Podcast feed could not be parsed');

  const channel = doc.getElementsByTagName('channel')[0] || doc.documentElement;
  const channelImageEl = firstTag(channel, ['image']);
  const channelImage = channelImageEl
    ? absoluteUrl(tagText(channelImageEl, ['url']), show.feedUrl)
    : '';
  const itunesImage = channel.getElementsByTagName('itunes:image')[0]?.getAttribute('href') || '';
  const fallbackImage = absoluteUrl(itunesImage || channelImage, show.feedUrl);

  const items = Array.from(doc.getElementsByTagName('item'));
  return items.slice(0, 60).map((node) => {
    const title = cleanTitle(tagText(node, ['title']), show.name);
    const pubDateRaw = tagText(node, ['pubDate', 'published']);
    const timestamp = Date.parse(pubDateRaw);
    const enclosure = node.getElementsByTagName('enclosure')[0];
    const audioUrl = absoluteUrl(enclosure?.getAttribute('url'), show.feedUrl);
    const episodeImage = node.getElementsByTagName('itunes:image')[0]?.getAttribute('href');
    const description = stripHtml(tagText(node, ['description', 'summary', 'content:encoded'])).slice(0, 420);
    const guid = tagText(node, ['guid']) || audioUrl || title;
    if (!audioUrl || !title) return null;
    return {
      id: hashId(guid),
      showId: show.id,
      showName: show.name,
      title,
      description,
      pubDate: Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : '',
      duration: parseDuration(tagText(node, ['itunes:duration'])),
      audioUrl,
      imageUrl: absoluteUrl(episodeImage, show.feedUrl) || fallbackImage,
      link: absoluteUrl(extractLink(node), show.feedUrl),
    };
  }).filter(Boolean);
}

export async function fetchPodcastShow(show) {
  const payload = await fetchThroughProxies(show.feedUrl, {
    timeoutMs: 13000,
    parse: (text) => parsePodcastText(text, show),
  });
  return {
    showId: show.id,
    showName: show.name,
    episodes: payload.items,
    fetchedAt: new Date().toISOString(),
  };
}

let podcastSnapshotPromise = null;

export function loadPodcastSnapshot() {
  if (!podcastSnapshotPromise) {
    podcastSnapshotPromise = fetch('./data/podcasts.json', { cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        console.warn('Podcast snapshot unavailable', error);
        return {};
      });
  }
  return podcastSnapshotPromise;
}

