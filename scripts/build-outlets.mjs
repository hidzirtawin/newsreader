import { writeFile } from 'node:fs/promises';

const BASE = 'https://nowallnews.com';
const EXCLUDED = [
  'nowallnews.com', 'nowallmed.com', 'google.com', 'youtube.com', 'facebook.com',
  'twitter.com', 'instagram.com', 'bsky.app', 'x.com', 'apple.com', 'spotify.com',
  'alternativeto.net', 'cloudflareinsights.com', 'googlesyndication.com', 'w3.org',
  'schema.org', 'creativecommons.org', 'gstatic.com', 'googleusercontent.com',
];

function decode(value = '') {
  return value
    .replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function titleCase(slug) {
  return slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function get(url, timeout = 20000) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' },
    signal: AbortSignal.timeout(timeout),
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function outletDomain(html) {
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  const domains = [...text.matchAll(/\b((?:[a-z0-9-]+\.)+[a-z]{2,})\b/gi)]
    .map((match) => match[1].toLowerCase())
    .filter((domain) => !EXCLUDED.some((item) => domain === item || domain.endsWith(`.${item}`)));
  return domains[0] || '';
}

function outletCountry(html) {
  const match = html.match(/href="\/country\/([^"/]+)\/"/i);
  return match ? titleCase(match[1]) : 'All outlets';
}

async function pool(items, concurrency, worker) {
  let cursor = 0;
  const results = [];
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      try { results[index] = await worker(items[index]); }
      catch (error) { results[index] = { error: error.message }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

const index = await get(`${BASE}/outlets/`);
const links = [...index.matchAll(/<a\s+href="(\/outlets\/([^"/]+)\/)"[^>]*>([^<]+)<\/a>/gi)]
  .map((match) => ({ path: match[1], slug: match[2], name: decode(match[3]).trim() }))
  .filter((item, index, all) => all.findIndex((other) => other.path === item.path) === index);

console.log(`Outlets found: ${links.length}`);

const pages = await pool(links, 6, async (item) => {
  const html = await get(`${BASE}${item.path}`);
  return {
    ...item,
    domain: outletDomain(html),
    group: outletCountry(html),
  };
});

const seen = new Set();
const outlets = [];
for (const page of pages) {
  if (!page || page.error || !page.domain) continue;
  if (seen.has(page.domain)) continue;
  seen.add(page.domain);
  outlets.push({
    id: `nw-${page.slug}`,
    name: page.name,
    domain: page.domain,
    group: page.group,
    url: `https://news.google.com/rss/search?q=site%3A${encodeURIComponent(page.domain)}&hl=en-US&gl=US&ceid=US%3Aen`,
    googleNews: true,
    directory: true,
  });
}
outlets.sort((a, b) => a.name.localeCompare(b.name));

const content = `/* Generated from nowallnews.com/outlets/ — all listed outlets. */\nexport const OUTLET_DIRECTORY = ${JSON.stringify(outlets, null, 2)};\n`;
await writeFile('js/outletDirectory.js', content);
console.log(`Wrote ${outlets.length} outlets to js/outletDirectory.js`);
const failed = pages.filter((page) => page?.error || !page?.domain).length;
console.log(`Skipped ${failed} pages without a publisher domain.`);
