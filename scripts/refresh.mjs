#!/usr/bin/env node
/**
 * refresh.mjs — fetch every configured feed directly from the publisher and
 * write the bundled offline snapshots used by the static app.
 *
 * Run with: npm run refresh
 */

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FEEDS, PODCAST_SHOWS, TOPICS } from '../js/config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'data');
const IMAGE_CACHE = path.join(DATA, 'image-cache.json');
const PUBLISHER_CACHE = path.join(DATA, 'publisher-url-cache.json');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const FEED_LIMIT = 18;
const TOPIC_LIMIT = 42;
const IMAGE_BUDGET = 130;

function decodeEntities(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function unwrapCdata(value = '') {
  return value.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1');
}

function cleanText(value = '') {
  return decodeEntities(unwrapCdata(value))
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tagValue(block, name) {
  const pattern = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i');
  const match = block.match(pattern);
  return match ? cleanText(match[1]) : '';
}

function rawTagValue(block, name) {
  const pattern = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i');
  const match = block.match(pattern);
  return match ? unwrapCdata(match[1]) : '';
}

function tagAttr(block, name, attr) {
  const pattern = new RegExp(`<${name}\\b[^>]*\\b${attr}=["']([^"']+)["'][^>]*>`, 'i');
  const match = block.match(pattern);
  return match ? decodeEntities(match[1]).trim() : '';
}

function absoluteUrl(candidate, base) {
  if (!candidate) return '';
  let value = decodeEntities(String(candidate)).trim();
  if (!value || value.startsWith('data:') || value.startsWith('blob:')) return '';
  if (value.startsWith('//')) value = `https:${value}`;
  try {
    const resolved = new URL(value, base);
    return /^https?:$/.test(resolved.protocol) ? resolved.href : '';
  } catch {
    return '';
  }
}

function isLikelyImage(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (/\.(svg|gif|mp3|m4a|aac|mp4|webm|pdf)(\?|$)/.test(lower)) return false;
  if (/(sprite|spacer|pixel|tracking|1x1|avatar|favicon|logo|icon|badge|button)/.test(lower)) return false;
  return true;
}

function extractLink(block) {
  const links = [...block.matchAll(/<link\b([^>]*)>([\s\S]*?)<\/link>/gi)]
    .concat([...block.matchAll(/<link\b([^>]*)\/>/gi)].map((match) => [match[0], match[1], '']));
  for (const [, attrs, inner] of links) {
    const rel = (attrs.match(/\brel=["']([^"']+)["']/i) || [])[1] || '';
    const href = (attrs.match(/\bhref=["']([^"']+)["']/i) || [])[1] || '';
    if (href && (!rel || rel === 'alternate')) return decodeEntities(href);
    if (!href && inner?.trim()) return cleanText(inner);
  }
  const guid = tagValue(block, 'guid');
  return guid || '';
}

function extractImage(block, base) {
  const candidates = [];
  for (const name of ['media:content', 'media:thumbnail', 'itunes:image', 'image', 'enclosure']) {
    const pattern = new RegExp(`<${name}\\b([^>]*)>`, 'gi');
    let match;
    while ((match = pattern.exec(block))) {
      const attrs = match[1];
      const url = (attrs.match(/\b(?:url|href)=["']([^"']+)["']/i) || [])[1];
      if (!url) continue;
      const type = (attrs.match(/\btype=["']([^"']+)["']/i) || [])[1] || '';
      if (name === 'enclosure' && !type.startsWith('image') && !/\.(jpe?g|png|webp|avif)(\?|$)/i.test(url)) continue;
      if (type && !type.startsWith('image') && name !== 'enclosure') continue;
      candidates.push(absoluteUrl(url, base));
    }
  }
  const html = [
    rawTagValue(block, 'content:encoded'),
    rawTagValue(block, 'content'),
    rawTagValue(block, 'description'),
    rawTagValue(block, 'summary'),
  ].join(' ');
  const imgPattern = /<img[^>]+(?:src|data-src)=["']([^"']+)["']/gi;
  let imgMatch;
  while ((imgMatch = imgPattern.exec(html))) candidates.push(absoluteUrl(imgMatch[1], base));
  return candidates.find(isLikelyImage) || '';
}

function cleanTitle(title, source) {
  let value = cleanText(title).replace(/\u00a0/g, ' ');
  if (!value) return 'Untitled';
  for (const suffix of [source, String(source || '').replace(/^The\s+/i, '')].filter(Boolean)) {
    const escaped = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    value = value.replace(new RegExp(`\\s+[-|–—]\\s+${escaped}$`, 'i'), '').trim();
  }
  return value;
}

function hashId(value) {
  return `art-${createHash('sha1').update(String(value)).digest('hex').slice(0, 12)}`;
}

function parseFeed(xml, feed) {
  const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  if (!blocks.length) {
    blocks.push(...[...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]));
  }
  const articles = [];
  const limit = feed.googleNews ? 8 : FEED_LIMIT;
  for (const block of blocks.slice(0, limit)) {
    const link = absoluteUrl(extractLink(block), feed.url);
    if (!link) continue;
    const rawTitle = tagValue(block, 'title');
    if (!rawTitle) continue;
    const dateRaw = tagValue(block, 'pubDate') || tagValue(block, 'published') || tagValue(block, 'updated') || tagValue(block, 'dc:date');
    const timestamp = Date.parse(dateRaw);
    let summary = cleanText(
      tagValue(block, 'description') || tagValue(block, 'summary') || tagValue(block, 'content:encoded') || tagValue(block, 'content')
    ).slice(0, 260);
    if (/^(null|undefined|none)$/i.test(summary)) summary = '';
    const googleSource = tagValue(block, 'source');
    let doi = (tagValue(block, 'dc:identifier') || tagValue(block, 'prism:doi') || tagValue(block, 'doi') || '').match(/10\.\d{4,9}\/[^\s,;&]+/)?.[0] || '';
    if (!doi) {
      const fromLink = link.match(/10\.\d{4,9}\/[^?#&]+/)?.[0] || '';
      if (fromLink) doi = fromLink.replace(/[.,;]+$/, '');
    }
    if (!doi && /nature\.com\/articles\//.test(link)) {
      const natureId = link.match(/nature\.com\/articles\/([^/?#]+)/)?.[1];
      if (natureId) doi = `10.1038/${natureId}`;
    }
    if (!doi && /bmj\.com\/content\//.test(link)) {
      const bmjId = link.match(/bmj\.com\/content\/[^/]+\/([^/?#]+)/)?.[1];
      if (bmjId) doi = `10.1136/${bmjId}`;
    }
    articles.push({
      id: hashId(link),
      title: cleanTitle(rawTitle, feed.name),
      source: feed.googleNews && googleSource ? googleSource : feed.name,
      feedId: feed.id,
      domain: feed.domain,
      url: link,
      video: Boolean(feed.video) || /youtube\.com\/watch/i.test(link),
      summary,
      doi,
      section: tagValue(block, 'prism:section') || tagValue(block, 'section') || '',
      imageUrl: extractImage(block, link),
      pubDate: Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : '',
    });
  }
  return articles;
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    for (const key of [...parsed.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_|ref|source)/i.test(key)) parsed.searchParams.delete(key);
    }
    return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, '').toLowerCase();
  } catch {
    return String(url || '').split('?')[0].replace(/\/$/, '').toLowerCase();
  }
}

function titleKey(title) {
  return String(title || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90);
}

function similarity(left, right) {
  const a = new Set(titleKey(left).split(' ').filter((word) => word.length > 2));
  const b = new Set(titleKey(right).split(' ').filter((word) => word.length > 2));
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const word of a) if (b.has(word)) shared += 1;
  return (2 * shared) / (a.size + b.size);
}

function dedupe(articles) {
  const seen = new Set();
  const output = [];
  for (const article of articles) {
    const key = normalizeUrl(article.url);
    if (!key || seen.has(key)) continue;
    if (output.some((existing) => similarity(existing.title, article.title) >= 0.74)) continue;
    seen.add(key);
    output.push(article);
  }
  return output;
}

function freshArticles(articles) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const dates = articles.map((article) => Date.parse(article.pubDate)).filter(Number.isFinite);
  const newest = dates.length ? Math.max(...dates) : now;
  const cutoff = Math.max(newest - 14 * day, now - 30 * day);
  let fresh = articles.filter((article) => {
    const time = Date.parse(article.pubDate);
    return !Number.isFinite(time) || time >= cutoff;
  });
  if (fresh.length < 12) {
    const relaxed = Math.max(newest - 30 * day, now - 60 * day);
    fresh = articles.filter((article) => {
      const time = Date.parse(article.pubDate);
      return !Number.isFinite(time) || time >= relaxed;
    });
  }
  return fresh.length ? fresh : articles;
}

const RESEARCH_FRONT_TITLE = /^\[(editorial|comment|correspondence|perspectives?|viewpoint|letter|obituary|book review|in focus|spotlight|world report|media watch|department of error)\]/i;
const RESEARCH_FRONT_SECTION = /^(editorial|comment|correspondence|perspective|viewpoint|letter|obituary|book review|in focus|spotlight|world report|media watch|department of error)$/i;

function isResearchFrontMatter(article) {
  return RESEARCH_FRONT_TITLE.test(article.title || '') || RESEARCH_FRONT_SECTION.test(article.section || '');
}

async function resolveResearchOpenAccess(snapshot) {
  const articles = snapshot?.research?.articles || [];
  const withDoi = articles.filter((article) => article.doi).slice(0, 60);
  if (!withDoi.length) return;
  console.log(`Resolving open-access copies for ${withDoi.length} studies…`);
  await pool(withDoi, 4, async (article) => {
    try {
      const response = await fetch(`https://api.openalex.org/works/https://doi.org/${encodeURIComponent(article.doi)}`, {
        headers: { 'User-Agent': 'TawinNewsreader/1.0 (https://hidzirtawin.github.io/newsreader/)', Accept: 'application/json' },
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) return;
      const data = await response.json();
      const openAccess = data.open_access || {};
      const best = data.best_oa_location || {};
      article.oaUrl = openAccess.oa_url || best.landing_page_url || best.pdf_url || '';
      article.oaPdf = best.pdf_url || '';
      article.oaStatus = openAccess.oa_status || '';
    } catch {
      // OpenAlex should never block the edition.
    }
  });
  console.log(`Open access: ${articles.filter((article) => article.oaUrl).length}/${articles.length} studies`);
}

function balanceBySource(articles, limit) {
  const selected = [];
  const selectedIds = new Set();
  const counts = new Map();
  for (const article of articles) {
    const count = counts.get(article.source) || 0;
    if (count >= 2) continue;
    selected.push(article);
    selectedIds.add(article.id);
    counts.set(article.source, count + 1);
  }
  for (const article of articles) {
    if (selected.length >= limit) break;
    if (selectedIds.has(article.id)) continue;
    selected.push(article);
    selectedIds.add(article.id);
  }
  return selected
    .sort((left, right) => (Date.parse(right.pubDate) || 0) - (Date.parse(left.pubDate) || 0))
    .slice(0, limit);
}

async function pool(items, concurrency, worker) {
  let cursor = 0;
  const results = new Array(items.length);
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      try {
        results[index] = await worker(items[index], index);
      } catch (error) {
        results[index] = { error };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

async function requestFeed(feed, userAgent) {
  const response = await fetch(feed.url, {
    headers: { 'User-Agent': userAgent, Accept: '*/*' },
    signal: AbortSignal.timeout(25000),
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  return parseFeed(text, feed);
}

async function fetchFeed(feed) {
  let firstError = null;
  try {
    const articles = await requestFeed(feed, USER_AGENT);
    if (articles.length) return articles;
  } catch (error) {
    firstError = error;
  }
  // Some publishers only serve RSS to curl-style clients. Retry quietly.
  try {
    return await requestFeed(feed, 'curl/8.7.1');
  } catch (error) {
    throw firstError || error;
  }
}

async function fetchPageImage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
    signal: AbortSignal.timeout(9000),
    redirect: 'follow',
  });
  if (!response.ok) return '';
  const type = response.headers.get('content-type') || '';
  if (!type.includes('html')) return '';
  const html = (await response.text()).slice(0, 500000);
  const patterns = [
    /<meta[^>]+(?:property|name)=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+(?:property|name)=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']twitter:image(?::src)?["']/i,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const candidate = absoluteUrl(match[1], response.url);
      if (candidate && isLikelyImage(candidate)) return candidate;
    }
  }
  return '';
}

async function enrichImages(topics, imageCache) {
  const candidates = [];
  const seen = new Set();
  const noImageTopics = new Set(TOPICS.filter((topic) => topic.noImages).map((topic) => topic.id));
  for (const topic of topics) {
    if (noImageTopics.has(topic.id)) continue;
    for (const article of topic.articles.slice(0, 18)) {
      if (article.imageUrl || seen.has(article.url)) continue;
      seen.add(article.url);
      candidates.push(article);
      if (candidates.length >= IMAGE_BUDGET) break;
    }
    if (candidates.length >= IMAGE_BUDGET) break;
  }

  console.log(`Fetching article images for ${candidates.length} stories…`);
  let completed = 0;
  await pool(candidates, 6, async (article) => {
    const cached = imageCache[article.url];
    if (cached && (Date.now() - cached.at) < 7 * 24 * 60 * 60 * 1000) {
      article.imageUrl = cached.imageUrl || '';
    } else {
      try {
        const image = await fetchPageImage(article.url);
        if (image) {
          article.imageUrl = image;
          imageCache[article.url] = { imageUrl: image, at: Date.now() };
        }
      } catch {
        // A slow publisher page should never stop the snapshot.
      }
    }
    completed += 1;
    if (completed % 15 === 0) console.log(`  images: ${completed}/${candidates.length}`);
  });
}

function googleArticleId(value) {
  try {
    const url = new URL(value);
    if (url.hostname !== 'news.google.com') return '';
    return url.pathname.match(/^\/(?:rss\/)?(?:articles|read)\/([^/]+)/)?.[1] || '';
  } catch {
    return '';
  }
}

function buildGoogleBatchBody(items) {
  const context = [
    ['X', 'X', ['X', 'X'], null, null, 1, 1, 'US:en', null, 1, null, null, null, null, null, 0, 1],
    'X', 'X', 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0,
  ];
  const envelopes = items.map((item, index) => {
    const inner = [
      'garturlreq',
      context,
      item.id,
      Number(item.timestamp),
      item.signature,
    ];
    return ['Fbv4je', JSON.stringify(inner), null, String(index)];
  });
  return `f.req=${encodeURIComponent(JSON.stringify([envelopes]))}`;
}

function parseGoogleBatch(text) {
  let body = text;
  if (body.includes('\n\n')) body = body.split('\n\n').slice(1).join('\n\n');
  body = body.trim().replace(/^\)\]\}'\s*/, '');
  const rows = JSON.parse(body);
  const pairs = [];
  for (const row of rows) {
    if (!Array.isArray(row) || row[0] !== 'wrb.fr' || row[1] !== 'Fbv4je') continue;
    let payload = row[2];
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch { continue; }
    }
    if (!Array.isArray(payload) || payload[0] !== 'garturlres' || !payload[1]) continue;
    let requestId = null;
    for (const cell of row.slice(3).reverse()) {
      if (cell !== null && cell !== undefined) { requestId = String(cell); break; }
    }
    pairs.push({ requestId, url: payload[1] });
  }
  return pairs;
}

async function resolveGoogleFeedArticles(feedResults, cache) {
  const googleFeeds = FEEDS.filter((feed) => feed.googleNews);
  const candidates = [];
  for (const feed of googleFeeds) {
    const result = feedResults.get(feed.id);
    if (!result?.ok) continue;
    for (const article of result.articles) {
      if (!googleArticleId(article.url)) continue;
      candidates.push({ feed, article, id: googleArticleId(article.url), link: article.url });
    }
  }
  if (!candidates.length) return;

  const now = Date.now();
  const pending = [];
  for (const candidate of candidates) {
    const cached = cache[candidate.id];
    if (cached && (now - Number(cached.at || 0)) < 30 * 24 * 60 * 60 * 1000) {
      candidate.article.publisherUrl = cached.url || '';
      continue;
    }
    pending.push(candidate);
  }

  const limited = pending.slice(0, 130);
  console.log(`Resolving ${limited.length} Google News links…`);
  const signatures = await pool(limited, 4, async (candidate) => {
    try {
      const response = await fetch(`https://news.google.com/rss/articles/${candidate.id}?hl=en-US&gl=US&ceid=US:en`, {
        headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
        signal: AbortSignal.timeout(12000),
        redirect: 'follow',
      });
      if (!response.ok) return null;
      const html = await response.text();
      const signature = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
      const timestamp = html.match(/data-n-a-ts="([^"]+)"/)?.[1];
      if (!signature || !timestamp) return null;
      return { ...candidate, signature, timestamp };
    } catch {
      return null;
    }
  });

  const ready = signatures.filter(Boolean);
  let resolvedCount = 0;
  for (let start = 0; start < ready.length; start += 40) {
    const chunk = ready.slice(start, start + 40);
    try {
      const response = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
        method: 'POST',
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Referer: 'https://news.google.com/',
        },
        body: buildGoogleBatchBody(chunk),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) continue;
      const pairs = parseGoogleBatch(await response.text());
      for (const pair of pairs) {
        const index = Number(pair.requestId);
        const candidate = chunk[Number.isFinite(index) ? index : -1];
        if (!candidate || !pair.url) continue;
        const resolved = absoluteUrl(pair.url, 'https://news.google.com/');
        if (!resolved || new URL(resolved).hostname.endsWith('google.com')) continue;
        candidate.article.publisherUrl = resolved;
        cache[candidate.id] = { url: resolved, at: now };
        resolvedCount += 1;
      }
    } catch (error) {
      console.warn(`  Google News resolution failed: ${error?.message || error}`);
    }
  }
  if (ready.length) console.log(`  resolved ${resolvedCount}/${ready.length}`);

  for (const candidate of candidates) {
    const resolved = candidate.article.publisherUrl;
    if (!resolved) continue;
    try {
      const parsed = new URL(resolved);
      if (parsed.pathname === '/' || parsed.pathname === '') {
        candidate.article.discard = true;
        continue;
      }
      candidate.article.url = resolved;
      candidate.article.domain = parsed.hostname.replace(/^www\./, '');
      candidate.article.id = hashId(resolved);
    } catch {
      // Keep the Google wrapper when a publisher URL cannot be used.
    }
  }
}

function parsePodcastFeed(xml, show) {
  const channel = xml.match(/<channel\b[\s\S]*?<\/channel>/i)?.[0] || xml;
  const channelImage = tagAttr(channel, 'itunes:image', 'href')
    || (channel.match(/<image\b[\s\S]*?<url>([\s\S]*?)<\/url>/i) || [])[1]
    || '';
  const fallbackImage = absoluteUrl(channelImage, show.feedUrl);
  const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]).slice(0, 36);
  return items.map((item) => {
    const audioUrl = absoluteUrl(tagAttr(item, 'enclosure', 'url'), show.feedUrl);
    if (!audioUrl) return null;
    const title = cleanTitle(tagValue(item, 'title'), show.name);
    const dateRaw = tagValue(item, 'pubDate') || tagValue(item, 'published');
    const date = Date.parse(dateRaw);
    const durationRaw = tagValue(item, 'itunes:duration');
    let duration = 0;
    if (/^\d+$/.test(durationRaw)) duration = Number(durationRaw);
    else if (durationRaw.includes(':')) {
      const parts = durationRaw.split(':').map(Number);
      duration = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
    }
    const image = tagAttr(item, 'itunes:image', 'href');
    const link = extractLink(item);
    return {
      id: hashId(tagValue(item, 'guid') || audioUrl),
      showId: show.id,
      showName: show.name,
      title,
      description: cleanText(tagValue(item, 'description') || tagValue(item, 'summary')).slice(0, 420),
      pubDate: Number.isFinite(date) ? new Date(date).toISOString() : '',
      duration,
      audioUrl,
      imageUrl: absoluteUrl(image, show.feedUrl) || fallbackImage,
      link: absoluteUrl(link, show.feedUrl),
    };
  }).filter(Boolean);
}

async function writeJson(file, value) {
  const temporary = `${file}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporary, file);
}

async function main() {
  await mkdir(DATA, { recursive: true });
  const imageCache = JSON.parse(await readFile(IMAGE_CACHE, 'utf8').catch(() => '{}'));
  const publisherCache = JSON.parse(await readFile(PUBLISHER_CACHE, 'utf8').catch(() => '{}'));
  const previousVersion = JSON.parse(await readFile(path.join(DATA, 'version.json'), 'utf8').catch(() => '{}'));
  const pruneBefore = Date.now() - 30 * 24 * 60 * 60 * 1000;
  for (const [url, entry] of Object.entries(imageCache)) {
    if (!entry || Number(entry.at || 0) < pruneBefore) delete imageCache[url];
  }
  for (const [id, entry] of Object.entries(publisherCache)) {
    if (!entry || Number(entry.at || 0) < pruneBefore) delete publisherCache[id];
  }

  const usedFeedIds = [...new Set(TOPICS.flatMap((topic) => topic.feeds || []))];
  const feeds = usedFeedIds.map((id) => FEEDS.find((feed) => feed.id === id)).filter(Boolean);
  console.log(`Fetching ${feeds.length} feeds for ${TOPICS.filter((topic) => !topic.type).length} topics…`);

  const feedResults = new Map();
  await pool(feeds, 6, async (feed) => {
    try {
      const articles = await fetchFeed(feed);
      feedResults.set(feed.id, { ok: true, articles });
      console.log(`  ${feed.name}: ${articles.length}`);
    } catch (error) {
      feedResults.set(feed.id, { ok: false, articles: [], error: error?.message || 'Unavailable' });
      console.warn(`  ${feed.name}: ${error?.message || 'failed'}`);
    }
  });

  await resolveGoogleFeedArticles(feedResults, publisherCache);
  await writeJson(PUBLISHER_CACHE, publisherCache);

  const snapshot = {};
  for (const topic of TOPICS) {
    if (topic.type) continue;
    const topicArticles = [];
    const results = [];
    for (const feedId of topic.feeds) {
      const feed = FEEDS.find((item) => item.id === feedId);
      if (!feed) continue;
      const result = feedResults.get(feedId) || { ok: false, articles: [], error: 'Not fetched' };
      const usable = (result.articles || []).filter((article) => !article.discard);
      topicArticles.push(...usable);
      results.push({
        feedId,
        name: feed.name,
        ok: result.ok,
        count: usable.length,
        error: result.error,
      });
    }
    const topicLimit = Number(topic.limit) > 0 ? Math.min(Number(topic.limit), TOPIC_LIMIT) : TOPIC_LIMIT;
    const researchArticles = topic.research ? topicArticles.filter((article) => !isResearchFrontMatter(article)) : topicArticles;
    const articles = balanceBySource(
      freshArticles(dedupe(researchArticles).sort((left, right) => (Date.parse(right.pubDate) || 0) - (Date.parse(left.pubDate) || 0))),
      topicLimit,
    );
    snapshot[topic.id] = {
      updatedAt: new Date().toISOString(),
      results,
      articles,
    };
    console.log(`${topic.label}: ${articles.length} stories`);
  }

  await resolveResearchOpenAccess(snapshot);

  const topicList = Object.entries(snapshot).map(([id, entry]) => ({ id, articles: entry.articles }))
    .filter((entry) => entry.articles.length);
  await enrichImages(topicList, imageCache);
  await writeJson(IMAGE_CACHE, imageCache);

  // Rebuild the arrays after enrichment so the snapshot includes the photos.
  for (const topic of TOPICS) {
    if (!snapshot[topic.id]) continue;
    const enriched = new Map();
    for (const entry of topicList) {
      if (entry.id !== topic.id) continue;
      for (const article of entry.articles) enriched.set(article.url, article);
    }
    snapshot[topic.id].articles = snapshot[topic.id].articles.map((article) => enriched.get(article.url) || article);
  }

  await writeJson(path.join(DATA, 'news.json'), snapshot);

  const podcastShows = [];
  const skipPodcasts = process.env.SKIP_PODCASTS === '1' || process.argv.includes('--skip-podcasts');
  for (const show of skipPodcasts ? [] : PODCAST_SHOWS) {
    try {
      const response = await fetch(show.feedUrl, {
        headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
        signal: AbortSignal.timeout(25000),
        redirect: 'follow',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const episodes = parsePodcastFeed(await response.text(), show);
      podcastShows.push({ ...show, episodes });
      console.log(`${show.name}: ${episodes.length} episodes`);
    } catch (error) {
      console.warn(`${show.name} podcast failed: ${error?.message || error}`);
      podcastShows.push({ ...show, episodes: [] });
    }
  }
  if (!skipPodcasts) {
    await writeJson(path.join(DATA, 'podcasts.json'), {
      updatedAt: new Date().toISOString(),
      shows: podcastShows,
    });
  }

  const newsVersion = new Date().toISOString();
  await writeJson(path.join(DATA, 'version.json'), {
    news: newsVersion,
    podcasts: skipPodcasts ? (previousVersion.podcasts || newsVersion) : newsVersion,
  });

  const withImages = Object.values(snapshot).flatMap((entry) => entry.articles).filter((article) => article.imageUrl).length;
  const total = Object.values(snapshot).flatMap((entry) => entry.articles).length;
  console.log(`Done. ${total} topic stories, ${withImages} with photos.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
