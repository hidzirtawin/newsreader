/**
 * app.js — UI orchestration for Tawin Newsreader.
 */

import {
  STRATEGY_META,
  TOPIC_PRESETS,
  LIVE_CACHE_TTL,
  RADIO_STATIONS,
  PODCAST_SHOWS,
  normalizeDomain,
} from './config.js';
import {
  addCustomFeed,
  addCustomTopic,
  allFeeds,
  deleteDomainRule,
  exportSettings,
  getAllRules,
  getAllTopics,
  getDomainRule,
  getFeed,
  getSettings,
  getTopic,
  getVisibleTopics,
  readLiveCache,
  readPodcastCache,
  removeCustomFeed,
  removeCustomTopic,
  resetDomainRules,
  safeGet,
  safeSet,
  saveLiveCache,
  savePodcastCache,
  saveSettings,
  setDomainRule,
} from './store.js';
import {
  applyRule,
  curateArticles,
  dedupeArticles,
  fetchPodcastShow,
  fetchTopicArticles,
  formatRelativeTime,
  getSnapshotForTopic,
  isWallhopDomain,
  loadPodcastSnapshot,
} from './feedService.js';
import { checkArchive } from './archive.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const els = {
  menuToggleBtn: $('#menuToggleBtn'),
  headerMenu: $('#headerMenuDropdown'),
  refreshBtn: $('#refreshBtn'),
  openQuickUrlBtn: $('#openQuickUrlBtn'),
  hideLockedCheckbox: $('#hideLockedCheckbox'),
  autoRefreshCheckbox: $('#autoRefreshCheckbox'),
  showBriefsCheckbox: $('#showBriefsCheckbox'),
  newStoriesBtn: $('#newStoriesBtn'),
  openRulesBtn: $('#openRulesBtn'),
  openCustomizeBtn: $('#openCustomizeBtn'),
  exportSettingsBtn: $('#exportSettingsBtn'),
  installAppBtn: $('#installAppBtn'),

  topicsBar: $('#topicsBar'),
  sportsSubnav: $('#sportsSubnav'),
  editorialHeading: $('#editorialHeading'),
  feedSortSelect: $('#feedSortSelect'),
  sourceViewBar: $('#sourceViewBar'),
  sourceViewName: $('#sourceViewName'),
  sourceBackBtn: $('#sourceBackBtn'),
  feedStatus: $('#feedStatus'),
  loadingState: $('#loadingState'),
  errorState: $('#errorState'),
  errorMessage: $('#errorMessage'),
  retryFeedBtn: $('#retryFeedBtn'),
  filteredEmptyState: $('#filteredEmptyState'),
  showLockedHeadlinesBtn: $('#showLockedHeadlinesBtn'),
  feedList: $('#feedList'),
  feedUpdateStatus: $('#feedUpdateStatus'),
  feedSourcesDetails: $('#feedSourcesDetails'),
  feedSourcesSummary: $('#feedSourcesSummary'),
  feedSourcesList: $('#feedSourcesList'),
  retrySourcesBtn: $('#retrySourcesBtn'),

  rulesModal: $('#rulesModal'),
  closeRulesBtn: $('#closeRulesBtn'),
  closeRulesDoneBtn: $('#closeRulesDoneBtn'),
  addRuleForm: $('#addRuleForm'),
  inputRuleDomain: $('#inputRuleDomain'),
  selectRuleStrategy: $('#selectRuleStrategy'),
  ruleFormError: $('#ruleFormError'),
  rulesSearch: $('#rulesSearch'),
  rulesCount: $('#rulesCount'),
  rulesList: $('#rulesList'),
  resetRulesBtn: $('#resetRulesBtn'),

  customizeModal: $('#customizeModal'),
  closeCustomizeBtn: $('#closeCustomizeBtn'),
  closeCustomizeDoneBtn: $('#closeCustomizeDoneBtn'),
  exportSettingsModalBtn: $('#exportSettingsModalBtn'),
  topicsSettingsList: $('#topicsSettingsList'),
  tabButtons: $$('.modal-tab-btn'),
  panelTopics: $('#panel-topics'),
  panelNewTopic: $('#panel-new-topic'),
  panelSources: $('#panel-sources'),

  addTopicForm: $('#addTopicForm'),
  selectTopicPreset: $('#selectTopicPreset'),
  inputTopicLabel: $('#inputTopicLabel'),
  inputTopicKeywords: $('#inputTopicKeywords'),
  topicSourceSearch: $('#topicSourceSearch'),
  topicSourceChecklist: $('#topicSourceChecklist'),
  selectVisibleSourcesBtn: $('#selectVisibleSourcesBtn'),
  clearVisibleSourcesBtn: $('#clearVisibleSourcesBtn'),
  newTopicError: $('#newTopicError'),
  newTopicSubmitBtn: $('#newTopicSubmitBtn'),
  newTopicSpinner: $('#newTopicSpinner'),

  addSourceForm: $('#addSourceForm'),
  inputSourceName: $('#inputSourceName'),
  inputSourceUrl: $('#inputSourceUrl'),
  newSourceError: $('#newSourceError'),
  sourceSearch: $('#sourceSearch'),
  sourcesCount: $('#sourcesCount'),
  sourceLibraryStatus: $('#sourceLibraryStatus'),
  sourcesCatalog: $('#sourcesCatalog'),

  switcherModal: $('#switcherModal'),
  closeSwitcherBtn: $('#closeSwitcherBtn'),
  closeSwitcherDoneBtn: $('#closeSwitcherDoneBtn'),
  switcherFavicon: $('#switcherFavicon'),
  switcherDomain: $('#switcherDomain'),
  strategyOptionsList: $('#strategyOptionsList'),
  switcherSavedNote: $('#switcherSavedNote'),

  quickUrlModal: $('#quickUrlModal'),
  closeQuickUrlBtn: $('#closeQuickUrlBtn'),
  closeQuickUrlDoneBtn: $('#closeQuickUrlDoneBtn'),
  quickUrlForm: $('#quickUrlForm'),
  inputQuickUrl: $('#inputQuickUrl'),
  quickUrlPasteBtn: $('#quickUrlPasteBtn'),
  quickUrlClearBtn: $('#quickUrlClearBtn'),
  quickUrlStrategySelect: $('#quickUrlStrategySelect'),
  quickUrlHint: $('#quickUrlHint'),
  quickUrlBanner: $('#quickUrlBanner'),
  quickUrlFavicon: $('#quickUrlFavicon'),
  quickUrlDomainName: $('#quickUrlDomainName'),
  quickUrlBadge: $('#quickUrlBadge'),
  quickUrlRuleSource: $('#quickUrlRuleSource'),
  quickUrlRemember: $('#quickUrlRemember'),
  quickUrlRememberDomain: $('#quickUrlRememberDomain'),
  quickUrlError: $('#quickUrlError'),
  quickUrlOpenBtn: $('#quickUrlOpenBtn'),

  toast: $('#appToast'),
  toastMessage: $('#toastMessage'),
  toastActionLink: $('#toastActionLink'),

  editorialActions: $('#editorialActions'),
  readerView: $('#readerView'),
  readerBackBtn: $('#readerBackBtn'),
  readerCloseBtn: $('#readerCloseBtn'),
  readerToolbarSource: $('#readerToolbarSource'),
  readerToolbarState: $('#readerToolbarState'),
  readerProgressBar: $('#readerProgressBar'),
  readerScroll: $('#readerScroll'),
  readerKicker: $('#readerKicker'),
  readerTitle: $('#readerTitle'),
  readerMeta: $('#readerMeta'),
  readerNotice: $('#readerNotice'),
  readerStatus: $('#readerStatus'),
  readerBody: $('#readerBody'),
  readerFallback: $('#readerFallback'),
  readerFallbackText: $('#readerFallbackText'),
  readerArchiveBtn: $('#readerArchiveBtn'),
  readerRetryBtn: $('#readerRetryBtn'),
  audioDock: $('#audioDock'),
  audioPlayer: $('#audioPlayer'),
  dockPlayBtn: $('#dockPlayBtn'),
  dockKicker: $('#dockKicker'),
  dockTitle: $('#dockTitle'),
  dockLive: $('#dockLive'),
  dockProgress: $('#dockProgress'),
  dockSeek: $('#dockSeek'),
  dockCurrentTime: $('#dockCurrentTime'),
  dockDuration: $('#dockDuration'),
  dockBackBtn: $('#dockBackBtn'),
  dockForwardBtn: $('#dockForwardBtn'),
  dockRate: $('#dockRate'),
  dockVolume: $('#dockVolume'),
  dockCloseBtn: $('#dockCloseBtn'),
};

const state = {
  topicId: '',
  articles: [],
  results: [],
  sort: 'curated',
  hideLocked: false,
  loading: false,
  fromSnapshot: false,
  liveFailed: false,
  lastUpdated: '',
  emptyReason: '',
  fetchToken: 0,
  archiveRunning: false,
  switcherDomain: '',
  swiperRule: null,
  quickUrlTouched: false,
  installPrompt: null,
  newTopicSelection: new Set(),
  newTopicSearch: '',
  sourceSearch: '',
  lastFocus: null,
  toastTimer: null,
  toastHideTimer: null,
  listenMode: '',
  podcastEpisodes: [],
  podcastEpisodeMap: {},
  podcastUpdatedMap: {},
  podcastShowId: '',
  podcastUpdatedAt: '',
  podcastLoading: false,
  podcastError: '',
  podcastRequest: 0,
  snapshotVersion: '',
  sourceView: null,
  sourceReturnTopic: '',
  player: { type: '', id: '', playing: false, title: '', kicker: '' },
  pendingArticles: null,
  pendingNewCount: 0,
  pendingFetchedAt: '',
  polling: false,
  autoRefreshTimer: null,
  lastAutoPoll: 0,
  lastChecked: 0,
  readerOpen: false,
  readerToken: 0,
  readerArticle: null,
  readerStack: [],
  publisherUrls: {},
  publisherUrlsPromise: null,
};

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
}

function cleanSummary(value) {
  const text = String(value || '').trim();
  return /^(null|undefined|none)$/i.test(text) ? '' : text;
}

function initialFor(text) {
  const match = String(text || '').match(/[a-z0-9]/i);
  return match ? match[0].toUpperCase() : 'N';
}

function hueFor(text) {
  let hash = 0;
  for (const char of String(text || '')) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

function faviconMarkup(article) {
  return `<span class="favicon-fallback" style="--fav-hue:${hueFor(article.domain)}" aria-hidden="true">${esc(initialFor(article.source))}</span>`;
}

function badgeClass(article) {
  if (article.briefOnly) return 'badge-brief';
  if (article.status === 'locked') return 'badge-locked';
  if (article.status === 'checking') return 'badge-checking';
  if (article.status === 'bypassed') return 'badge-bypassed';
  return 'badge-free';
}

function badgeLabel(article) {
  return article.badge || 'Free';
}

function badgeMarkup(article, onDark = false) {
  const classes = ['badge', badgeClass(article)];
  if (onDark) classes.push('badge-hero');
  classes.push('badge-action');
  return `<button type="button" class="${classes.join(' ')}" data-badge-for="${esc(article.id)}" data-domain="${esc(article.domain)}" title="Change how ${esc(article.domain)} opens" aria-label="Reading rule: ${esc(badgeLabel(article))}. Change rule for ${esc(article.domain)}.">${esc(badgeLabel(article))}<svg class="badge-caret" viewBox="0 0 10 6" width="8" height="5" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>`;
}

function sourceGroupMarkup(article) {
  const time = formatRelativeTime(article.pubDate);
  const source = article.feedId
    ? `<button type="button" class="news-card-source source-link" data-source-feed="${esc(article.feedId)}" title="More from ${esc(article.source)}">${esc(article.source)}</button>`
    : `<span class="news-card-source">${esc(article.source)}</span>`;
  return `<div class="source-group">${faviconMarkup(article)}${source}${time ? `<span class="news-card-time" data-pubdate="${esc(article.pubDate)}">${esc(time)}</span>` : ''}</div>`;
}

function mediaMarkup(article, eager = false) {
  const label = article.source || 'News';
  return `<div class="media">
    <span class="media-fallback"><span class="media-fallback-label">${esc(label)}</span><span class="media-fallback-letter">${esc(initialFor(article.source))}</span></span>
    <img src="${esc(article.imageUrl)}" alt="" loading="${eager ? 'eager' : 'lazy'}" decoding="async">
  </div>`;
}

function titleMarkup(article, className) {
  if (article.status === 'locked') {
    return `<span class="${className}">${esc(article.title)}</span>`;
  }
  return `<a class="${className}" href="${esc(article.targetUrl || article.url)}" rel="noopener noreferrer">${esc(article.title)}</a>`;
}

function lockedHint(article) {
  if (article.status === 'locked') return '<span class="locked-hint">No archive copy available</span>';
  if (article.status === 'checking') return '<span class="locked-hint">Checking archive…</span>';
  return '';
}

function cardMarkup(article, variant) {
  const hasPhoto = Boolean(article.imageUrl);
  const classes = ['news-card', `flip-${variant}`];
  if (!hasPhoto) classes.push('no-photo');
  if (article.status === 'locked') classes.push('is-locked');
  const onDark = (variant === 'hero' || variant === 'banner') && hasPhoto;
  const articleAttr = `data-card-id="${esc(article.id)}" data-article-url="${esc(article.url)}"`;

  if (variant === 'hero' || variant === 'banner') {
    const articleSummary = cleanSummary(article.summary);
    const summary = variant === 'hero' && articleSummary
      ? `<p class="news-card-summary">${esc(articleSummary)}</p>` : '';
    return `<article class="${classes.join(' ')}" ${articleAttr}>
      ${hasPhoto ? mediaMarkup(article, true) : ''}
      ${hasPhoto ? '<div class="overlay"></div>' : ''}
      <div class="flip-${variant}-content">
        <span class="flip-tag">${esc(state.currentLabel || 'Top Stories')}</span>
        ${titleMarkup(article, `flip-${variant}-title`)}
        ${summary}
        <div class="flip-${variant}-meta">
          ${sourceGroupMarkup(article)}
          ${lockedHint(article)}
          ${badgeMarkup(article, onDark)}
        </div>
      </div>
    </article>`;
  }

  if (variant === 'tile') {
    return `<article class="${classes.join(' ')}" ${articleAttr}>
      ${hasPhoto ? mediaMarkup(article) : ''}
      <div class="flip-tile-body">
        ${titleMarkup(article, 'flip-tile-title')}
        <div class="flip-tile-meta">
          ${sourceGroupMarkup(article)}
          ${badgeMarkup(article)}
        </div>
      </div>
    </article>`;
  }

  return `<article class="${classes.join(' ')}" ${articleAttr}>
    <div class="flip-row-body">
      ${titleMarkup(article, 'flip-row-title')}
      <div class="flip-row-meta">
        ${sourceGroupMarkup(article)}
        ${lockedHint(article)}
        ${badgeMarkup(article)}
      </div>
    </div>
    ${hasPhoto ? mediaMarkup(article) : ''}
  </article>`;
}

function buildLayout(articles) {
  if (!articles.length) return '';
  const ordered = [...articles];
  // Strict recency order: the lead story is always the newest story.
  const [hero] = ordered.splice(0, 1);
  const grid = ordered.splice(0, 2);
  const rows = ordered.splice(0, 4);
  const banner = ordered.shift();
  const remaining = ordered;

  let html = cardMarkup(hero, 'hero');
  if (grid.length) {
    html += `<div class="flip-grid">${grid.map((article) => cardMarkup(article, 'tile')).join('')}</div>`;
  }
  if (rows.length) {
    html += `<div class="flip-rows-container">${rows.map((article) => cardMarkup(article, 'row')).join('')}</div>`;
  }
  if (banner) html += cardMarkup(banner, 'banner');
  if (remaining.length) {
    html += `<div class="flip-rows-container">${remaining.map((article) => cardMarkup(article, 'row')).join('')}</div>`;
  }
  return html;
}

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */

function hideToast() {
  els.toast.classList.remove('visible');
  clearTimeout(state.toastHideTimer);
  state.toastHideTimer = setTimeout(() => {
    els.toast.hidden = true;
    els.toastActionLink.hidden = true;
    els.toastActionLink.removeAttribute('href');
  }, 220);
}

function showToast(message, { href = '', duration = 4200, label = 'Open article ↗' } = {}) {
  clearTimeout(state.toastTimer);
  clearTimeout(state.toastHideTimer);
  els.toastMessage.textContent = message;
  if (href) {
    els.toastActionLink.href = href;
    els.toastActionLink.textContent = label;
    els.toastActionLink.hidden = false;
  } else {
    els.toastActionLink.hidden = true;
    els.toastActionLink.removeAttribute('href');
  }
  els.toast.hidden = false;
  requestAnimationFrame(() => els.toast.classList.add('visible'));
  state.toastTimer = setTimeout(hideToast, duration);
}

/* ------------------------------------------------------------------ */
/* In-app reader                                                       */
/* ------------------------------------------------------------------ */

const READER_MARKERS = [
  'subscribe to continue reading',
  'subscribe to read',
  'to continue reading this article',
  'already a subscriber',
  'sign in to read',
  'log in to continue',
  'create a free account to continue',
  'you have reached your limit',
  'access denied',
  'just a moment',
  'are you a robot',
  'security systems have detected',
  'unusual activity on this connection',
  'enable javascript and cookies',
  '403 forbidden',
];

function googleNewsId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'news.google.com') return '';
    return parsed.pathname.match(/^\/(?:rss\/)?(?:articles|read)\/([^/]+)/)?.[1] || '';
  } catch {
    return '';
  }
}

function loadPublisherUrls() {
  if (!state.publisherUrlsPromise) {
    state.publisherUrlsPromise = fetch('./data/publisher-url-cache.json', { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : {}))
      .then((data) => {
        state.publisherUrls = data && typeof data === 'object' ? data : {};
        return state.publisherUrls;
      })
      .catch(() => ({}));
  }
  return state.publisherUrlsPromise;
}

function resolveReaderArticle(article) {
  let url = article.url || '';
  let domain = article.domain || '';
  if (googleNewsId(url)) {
    const cached = state.publisherUrls[googleNewsId(url)];
    if (cached?.url) {
      url = cached.url;
      try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch { /* keep */ }
    }
  }
  return { ...article, url, domain };
}

async function fetchReaderText(url, timeoutMs = 8000) {
  const proxies = [
    {
      build: (target) => `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`,
      read: async (response) => {
        const payload = await response.json();
        if (typeof payload?.contents === 'string') return payload.contents;
        throw new Error('No contents');
      },
      timeoutMs: 8000,
    },
    {
      build: (target) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(target)}`,
      read: (response) => response.text(),
      timeoutMs: 4000,
    },
  ];

  for (const proxy of proxies) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(proxy.timeoutMs || timeoutMs, timeoutMs));
    try {
      const response = await fetch(proxy.build(url), {
        signal: controller.signal,
        headers: { Accept: '*/*' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await proxy.read(response);
      if (text && text.length > 40) return text;
    } catch {
      // Try the next proxy.
    } finally {
      clearTimeout(timer);
    }
  }
  return '';
}

function readerMetaContent(doc, names) {
  for (const name of names) {
    const node = doc.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
    const value = node?.getAttribute('content');
    if (value) return value.trim();
  }
  return '';
}

function readJsonLd(doc) {
  const output = { body: '', title: '', byline: '', description: '', date: '', site: '' };
  const scripts = [...doc.querySelectorAll('script[type="application/ld+json"]')];

  function walk(node) {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node !== 'object') return;
    if (typeof node.articleBody === 'string' && node.articleBody.length > output.body.length) output.body = node.articleBody;
    if (typeof node.text === 'string' && node.text.length > output.body.length && String(node['@type'] || '').includes('Article')) output.body = node.text;
    if (!output.title && typeof node.headline === 'string') output.title = node.headline;
    if (!output.byline && typeof node.author === 'string') output.byline = node.author;
    if (!output.byline && node.author?.name) output.byline = node.author.name;
    if (!output.description && typeof node.description === 'string') output.description = node.description;
    if (!output.date && typeof node.datePublished === 'string') output.date = node.datePublished;
    if (!output.site && typeof node.publisher?.name === 'string') output.site = node.publisher.name;
    Object.values(node).forEach(walk);
  }

  for (const script of scripts) {
    try { walk(JSON.parse(script.textContent)); } catch { /* ignore malformed metadata */ }
  }
  return output;
}

function textToParagraphs(text) {
  return String(text || '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${esc(paragraph)}</p>`)
    .join('');
}

function extractArticle(html, baseUrl) {
  if (!html) return null;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const json = readJsonLd(doc);
  const meta = {
    title: readerMetaContent(doc, ['og:title', 'twitter:title']) || doc.title || '',
    byline: readerMetaContent(doc, ['author', 'article:author']),
    description: readerMetaContent(doc, ['og:description', 'twitter:description', 'description']),
    image: readerMetaContent(doc, ['og:image', 'twitter:image']),
    site: readerMetaContent(doc, ['og:site_name']),
    date: readerMetaContent(doc, ['article:published_time', 'datePublished']),
  };

  if (json.body && json.body.length > 700) {
    return {
      title: json.title || meta.title,
      byline: json.byline || meta.byline,
      siteName: json.site || meta.site,
      publishedTime: json.date || meta.date,
      image: meta.image,
      content: textToParagraphs(json.body),
      textContent: json.body,
      textLength: json.body.length,
      kind: 'jsonld',
      url: baseUrl,
    };
  }

  let readable = null;
  try {
    if (typeof window.Readability === 'function') {
      const clone = new DOMParser().parseFromString(html, 'text/html');
      readable = new window.Readability(clone, { charThreshold: 60 }).parse();
    }
  } catch { /* fall through */ }

  if (readable?.content && (readable.textContent || '').trim().length > 220) {
    const textContent = (readable.textContent || '').trim();
    return {
      title: readable.title || meta.title,
      byline: readable.byline || meta.byline,
      siteName: readable.siteName || meta.site,
      publishedTime: readable.publishedTime || meta.date,
      image: meta.image,
      content: readable.content,
      textContent,
      textLength: textContent.length,
      kind: 'reader',
      url: baseUrl,
    };
  }

  const container = doc.querySelector('article, main, [role="main"]') || doc.body;
  const paragraphs = [...container.querySelectorAll('p')]
    .map((node) => node.textContent.replace(/\s+/g, ' ').trim())
    .filter((text) => text.length > 60);
  const textContent = paragraphs.join('\n\n');
  if (textContent.length > 120) {
    return {
      title: meta.title,
      byline: meta.byline,
      siteName: meta.site,
      publishedTime: meta.date,
      image: meta.image,
      content: textToParagraphs(textContent),
      textContent,
      textLength: textContent.length,
      kind: 'fallback',
      url: baseUrl,
    };
  }

  if (meta.description) {
    return {
      title: meta.title,
      byline: meta.byline,
      siteName: meta.site,
      publishedTime: meta.date,
      image: meta.image,
      content: `<p>${esc(meta.description)}</p>`,
      textContent: meta.description,
      textLength: meta.description.length,
      kind: 'meta',
      url: baseUrl,
    };
  }

  return null;
}

function assessExtraction(extraction) {
  if (!extraction) return { usable: false, good: false, blocked: false, length: 0 };
  const lower = String(extraction.textContent || '').toLowerCase();
  const length = Number(extraction.textLength) || String(extraction.textContent || '').length;
  const blocked = READER_MARKERS.some((marker) => lower.includes(marker));
  return {
    usable: length >= 220 && !blocked,
    good: length >= 900 && !blocked,
    blocked,
    length,
  };
}

async function tryWayback(url) {
  if (!url || /news\.google\.com/.test(url)) return null;
  try {
    const api = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
    const text = await fetchReaderText(api, 6000);
    if (!text) return null;
    const data = JSON.parse(text);
    const closest = data?.archived_snapshots?.closest;
    if (!closest?.available || !closest.url) return null;
    const snapshot = String(closest.url).replace(/^http:/, 'https:');
    const html = await fetchReaderText(snapshot, 9000);
    const extraction = extractArticle(html, snapshot);
    if (!extraction) return null;
    return { ...extraction, kind: 'archive' };
  } catch {
    return null;
  }
}

async function tryArchiveIs(url) {
  if (!url || /news\.google\.com/.test(url)) return null;
  try {
    const snapshot = `https://archive.is/newest/${url}`;
    const html = await fetchReaderText(snapshot, 6000);
    const extraction = extractArticle(html, snapshot);
    return extraction ? { ...extraction, kind: 'archive' } : null;
  } catch {
    return null;
  }
}

async function trySmry(url) {
  if (!url || /news\.google\.com/.test(url)) return null;
  try {
    const target = `https://smry.ai/${url}`;
    const html = await fetchReaderText(target, 7000);
    if (!html || /not supported by smry/i.test(html)) return null;
    const extraction = extractArticle(html, target);
    if (!extraction) return null;
    return { ...extraction, kind: 'summary' };
  } catch {
    return null;
  }
}

function sanitizeReaderHtml(html, baseUrl) {
  const container = document.createElement('div');
  container.innerHTML = html || '';
  container.querySelectorAll('script, style, iframe, frame, object, embed, form, input, button, select, textarea, link, meta, noscript, svg, video, audio, source, track, canvas, nav, footer, aside').forEach((node) => node.remove());
  container.querySelectorAll('[class*="advert"], [id*="advert"], [class*="newsletter"], [class*="paywall"], [class*="subscribe"]').forEach((node) => node.remove());

  container.querySelectorAll('*').forEach((element) => {
    for (const attribute of [...element.attributes]) {
      if (/^on/i.test(attribute.name) || ['style', 'srcset', 'sizes', 'id'].includes(attribute.name)) {
        element.removeAttribute(attribute.name);
      }
    }
    if (element.tagName === 'A') {
      let href = element.getAttribute('href') || '';
      try { href = new URL(href, baseUrl).href; } catch { href = ''; }
      if (/^https?:/i.test(href)) element.dataset.readerHref = href;
      element.setAttribute('href', '#');
      element.removeAttribute('target');
    }
    if (element.tagName === 'IMG') {
      let src = element.getAttribute('src') || element.getAttribute('data-src') || '';
      try { src = new URL(src, baseUrl).href; } catch { src = ''; }
      if (!/^https?:/i.test(src) || /(sprite|spacer|pixel|tracking|1x1|avatar|favicon)/i.test(src)) {
        element.remove();
        return;
      }
      element.setAttribute('src', src);
      element.setAttribute('loading', 'lazy');
      element.setAttribute('decoding', 'async');
      element.removeAttribute('data-src');
    }
  });

  container.querySelectorAll('p').forEach((paragraph) => {
    if (!paragraph.textContent.trim() && !paragraph.querySelector('img')) paragraph.remove();
  });
  return container.innerHTML;
}

function setReaderHeader(article) {
  const source = article.source || article.domain || 'Reader';
  els.readerToolbarSource.textContent = source;
  els.readerToolbarState.textContent = 'Opening…';
  els.readerKicker.textContent = source.toUpperCase();
  els.readerTitle.textContent = article.title || 'Article';
  els.readerMeta.textContent = [article.source, article.pubDate ? formatRelativeTime(article.pubDate) : ''].filter(Boolean).join(' · ');
  document.title = `${article.title || 'Article'} | Tawin Newsreader`;
}

function readerLoading(message, keepBody = false) {
  els.readerToolbarState.textContent = 'Loading';
  els.readerStatus.hidden = false;
  els.readerStatus.textContent = message;
  els.readerNotice.hidden = true;
  els.readerFallback.hidden = true;
  if (!keepBody) els.readerBody.innerHTML = '';
  els.readerProgressBar.style.width = '0%';
}

function readerDateLabel(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderReaderExtraction(extraction, article, assessment) {
  els.readerStatus.hidden = true;
  els.readerFallback.hidden = true;
  els.readerToolbarState.textContent = extraction.kind === 'archive' ? 'Archived copy' : 'Reader view';
  els.readerTitle.textContent = extraction.title || article.title || 'Article';
  const byline = extraction.byline && !/^(https?:\/\/|www\.)/i.test(extraction.byline.trim())
    ? extraction.byline.trim()
    : '';
  const meta = [
    byline,
    extraction.siteName,
    readerDateLabel(extraction.publishedTime || article.pubDate),
  ].filter(Boolean);
  els.readerMeta.textContent = meta.join(' · ');

  let notice = '';
  if (extraction.kind === 'archive') notice = 'Archived copy — the publisher page is blocked or paywalled.';
  else if (extraction.kind === 'summary') notice = 'Reader summary — the full article could not be retrieved from the publisher.';
  else if (!assessment.good) notice = 'Partial reader view — the publisher is serving truncated content.';
  if (notice) {
    els.readerNotice.hidden = false;
    els.readerNotice.textContent = notice;
  } else {
    els.readerNotice.hidden = true;
  }

  els.readerBody.innerHTML = sanitizeReaderHtml(extraction.content, extraction.url);
  els.readerScroll.scrollTop = 0;
  els.readerProgressBar.style.width = '0%';
  document.title = `${extraction.title || article.title} | Tawin Newsreader`;
}

const READER_EMBED_BLOCKED = [
  'nytimes.com',
  'bloomberg.com',
  'wsj.com',
  'ft.com',
  'heraldsun.com.au',
  'theaustralian.com.au',
  'news.google.com',
];

function canEmbedReaderService(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return !READER_EMBED_BLOCKED.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

function renderReaderService(article) {
  els.readerStatus.hidden = true;
  els.readerToolbarState.textContent = 'Reader service';
  els.readerNotice.hidden = true;
  els.readerFallback.hidden = true;
  const preview = cleanSummary(article.summary) ? `<div class="reader-preview">${textToParagraphs(cleanSummary(article.summary))}</div>` : '';
  els.readerBody.innerHTML = `${preview}<div class="reader-service-shell">
    <div class="reader-service-bar" id="readerServiceStatus">Loading full text</div>
    <iframe id="readerServiceFrame" name="readerServiceFrame" title="Article reader" sandbox="allow-same-origin" style="display:none"></iframe>
    <form id="readerServiceForm" method="POST" action="./reader-frame" target="readerServiceFrame" hidden>
      <input type="hidden" name="url" value="${esc(article.url)}">
      <input type="hidden" name="provider" value="${isWallhopDomain(article.domain) ? 'wallhop' : 'jina'}">
    </form>
  </div>`;
  const frame = document.getElementById('readerServiceFrame');
  const form = document.getElementById('readerServiceForm');
  const status = document.getElementById('readerServiceStatus');
  if (!frame || !form || !status) {
    renderReaderFallback(article, null, { checking: false });
    return;
  }

  let settled = false;
  const fail = (message) => {
    if (settled) return;
    settled = true;
    renderReaderFallback(article, null, { checking: false });
    els.readerFallbackText.textContent = message;
  };

  frame.addEventListener('load', () => {
    if (settled) return;
    let doc = null;
    try { doc = frame.contentDocument; } catch { doc = null; }
    if (!doc || !doc.documentElement || doc.URL === 'about:blank') return;

    settled = true;
    const html = doc.documentElement.outerHTML;
    const extraction = extractArticle(html, article.url);
    const assessment = assessExtraction(extraction);
    if (extraction && assessment.usable) {
      renderReaderExtraction(extraction, article, assessment);
      return;
    }

    const node = doc.querySelector('article, main, [role="main"]') || doc.body;
    const text = (node?.innerText || '').trim();
    const lower = text.toLowerCase();
    const blocked = READER_MARKERS.some((marker) => lower.includes(marker));
    if (node && text.length >= 400 && !blocked) {
      els.readerStatus.hidden = true;
      els.readerFallback.hidden = true;
      els.readerToolbarState.textContent = 'Publisher view';
      els.readerNotice.hidden = false;
      els.readerNotice.textContent = 'Publisher view inside Tawin Newsreader.';
      els.readerBody.innerHTML = sanitizeReaderHtml(node.innerHTML, article.url);
      return;
    }
    fail('The publisher blocks full-text reading. Only the publisher summary is available.');
  });

  form.submit();
  setTimeout(() => fail('The reader service timed out. Try again or read the publisher summary.'), 20000);
}


function renderReaderPlainService(article) {
  els.readerStatus.hidden = true;
  els.readerToolbarState.textContent = 'Reader service';
  els.readerNotice.hidden = false;
  els.readerNotice.textContent = 'Reader text via Jina Reader, displayed inside Tawin Newsreader. Reload once for the fully formatted reader.';
  els.readerFallback.hidden = false;
  els.readerFallbackText.textContent = 'If the reader service does not display the article, try an archived copy or reload.';
  els.readerArchiveBtn.hidden = false;
  els.readerRetryBtn.hidden = false;
  els.readerBody.innerHTML = `<div class="reader-service-shell">
    <div class="reader-service-bar" id="readerServiceStatus">Loading full text</div>
    <iframe id="readerTextFrame" name="readerTextFrame" class="reader-service-frame" title="Article text" sandbox="" referrerpolicy="no-referrer"></iframe>
    <form id="readerTextForm" method="POST" action="https://r.jina.ai/" target="readerTextFrame" hidden>
      <input type="hidden" name="url" value="${esc(article.url)}">
      <input type="hidden" name="respondWith" value="text">
    </form>
  </div>`;
  document.getElementById('readerTextForm')?.submit();
  const frame = document.getElementById('readerTextFrame');
  const status = document.getElementById('readerServiceStatus');
  frame?.addEventListener('load', () => {
    if (status) {
      status.textContent = 'Full text via reader service';
      status.classList.add('is-ready');
    }
  }, { once: true });
  els.readerScroll.scrollTop = 0;
  els.readerProgressBar.style.width = '0%';
  document.title = `${article.title || 'Article'} | Tawin Newsreader`;
}

function renderReaderFallback(article, extraction, { checking = false } = {}) {
  els.readerStatus.hidden = true;
  els.readerToolbarState.textContent = checking ? 'Checking archive' : 'Publisher summary';
  els.readerNotice.hidden = true;
  els.readerFallback.hidden = false;
  const summary = cleanSummary(article.summary) || (extraction?.textLength < 400 ? extraction?.textContent : '');
  els.readerBody.innerHTML = summary ? textToParagraphs(summary) : '';
  els.readerFallbackText.textContent = checking
    ? 'Only the publisher summary is available so far. Checking for an archived copy of the full article…'
    : summary
      ? 'Only the publisher summary is available. The full article is blocked or paywalled, and no archived copy was found.'
      : 'This publisher blocks full-text reading and no archived copy was found. The headline and source are preserved above.';
  els.readerArchiveBtn.hidden = checking;
  els.readerRetryBtn.hidden = checking;
}

async function loadReaderContent(article, { archiveOnly = false } = {}) {
  const token = ++state.readerToken;
  const resolved = resolveReaderArticle(article);
  state.readerArticle = resolved;
  setReaderHeader(resolved);

  // Free sites: show the full reader service immediately, then upgrade to a
  // styled extraction if the publisher HTML can be parsed in the background.
  if (!archiveOnly && canEmbedReaderService(resolved.url)) {
    try {
      if (navigator.serviceWorker?.controller) renderReaderService(resolved);
      else renderReaderPlainService(resolved);
    } catch {
      renderReaderFallback(resolved, null, { checking: false });
    }
    return;
  }

  // Paywalled or blocked sites: show the publisher summary immediately.
  // Archive lookup is deliberately on demand so the reader never stalls.
  if (!archiveOnly) {
    renderReaderFallback(resolved, null, { checking: false });
    return;
  }

  renderReaderFallback(resolved, null, { checking: true });
  const archive = await Promise.race([
    tryWayback(resolved.url),
    new Promise((resolve) => setTimeout(() => resolve(null), 10000)),
  ]);
  if (token !== state.readerToken) return;
  if (archive) {
    const archiveAssessment = assessExtraction(archive);
    if (archiveAssessment.usable) {
      renderReaderExtraction(archive, resolved, archiveAssessment);
      return;
    }
  }

  const archived = await tryArchiveIs(resolved.url);
  if (token !== state.readerToken) return;
  if (archived) {
    const archivedAssessment = assessExtraction(archived);
    if (archivedAssessment.usable) {
      renderReaderExtraction(archived, resolved, archivedAssessment);
      return;
    }
  }

  renderReaderFallback(resolved, null, { checking: false });

}

function openReader(article, { fromLink = false } = {}) {
  if (!article) return;
  if (!state.readerOpen) {
    state.readerOpen = true;
    state.readerStack = [];
    state.readerPreviousTitle = document.title;
    state.readerLastFocus = document.activeElement;
    document.body.classList.add('reader-open');
    els.readerView.hidden = false;
    if (location.hash !== '#read') history.pushState({ reader: true }, '', '#read');
  }
  if (fromLink && state.readerArticle) {
    state.readerStack.push(state.readerArticle);
  }
  els.readerScroll.scrollTop = 0;
  els.readerProgressBar.style.width = '0%';
  els.readerBody.innerHTML = '';
  els.readerFallback.hidden = true;
  els.readerNotice.hidden = true;
  loadReaderContent(article);
}

function finalizeReaderClose() {
  if (!state.readerOpen) return;
  state.readerOpen = false;
  state.readerToken += 1;
  state.readerStack = [];
  state.readerArticle = null;
  els.readerView.hidden = true;
  document.body.classList.remove('reader-open');
  if (location.hash === '#read') {
    history.replaceState(null, '', location.pathname + location.search);
  }
  document.title = state.readerPreviousTitle || document.title;
  state.readerLastFocus?.focus?.({ preventScroll: true });
}

function closeReader() {
  if (history.state?.reader) history.back();
  else finalizeReaderClose();
}

function readerBack() {
  if (state.readerStack.length) {
    const previous = state.readerStack.pop();
    els.readerScroll.scrollTop = 0;
    loadReaderContent(previous);
    return;
  }
  closeReader();
}

/* ------------------------------------------------------------------ */
/* Menu                                                                */
/* ------------------------------------------------------------------ */

function closeMenu() {
  els.headerMenu.classList.remove('open');
  els.menuToggleBtn.classList.remove('active');
  els.menuToggleBtn.setAttribute('aria-expanded', 'false');
  els.headerMenu.setAttribute('aria-hidden', 'true');
}

function toggleMenu() {
  const open = !els.headerMenu.classList.contains('open');
  els.headerMenu.classList.toggle('open', open);
  els.menuToggleBtn.classList.toggle('active', open);
  els.menuToggleBtn.setAttribute('aria-expanded', String(open));
  els.headerMenu.setAttribute('aria-hidden', String(!open));
}

/* ------------------------------------------------------------------ */
/* Modal management                                                    */
/* ------------------------------------------------------------------ */

function anyModalOpen() {
  return $$('.modal-overlay.open').length > 0;
}

function closeAllModals() {
  $$('.modal-overlay.open').forEach((modal) => closeModal(modal));
}

function openModal(modal) {
  if (!modal) return;
  closeAllModals();
  state.lastFocus = document.activeElement;
  modal.classList.add('open');
  modal.removeAttribute('inert');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const focusTarget = modal.querySelector('.modal-close, input:not([type="hidden"]), select, button');
    focusTarget?.focus({ preventScroll: true });
  });
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('inert', '');
  modal.setAttribute('aria-hidden', 'true');
  if (!anyModalOpen()) {
    document.body.style.overflow = '';
    state.lastFocus?.focus?.({ preventScroll: true });
  }
}

/* ------------------------------------------------------------------ */
/* Topics bar                                                          */
/* ------------------------------------------------------------------ */

function renderTopicsBar() {
  const topics = getVisibleTopics();
  if (!topics.length) {
    els.topicsBar.innerHTML = '<span class="feed-status-line">No topics visible. Open Customize to add one.</span>';
    return;
  }
  const current = getTopic(state.topicId);
  els.topicsBar.innerHTML = topics.map((topic) => {
    const active = topic.id === state.topicId || (topic.id === 'sports' && current?.sports);
    return `<button type="button" class="topic-pill${active ? ' active' : ''}" data-topic="${esc(topic.id)}">${esc(topic.label)}</button>`;
  }).join('');
  if (!current?.sports && !topics.some((topic) => topic.id === state.topicId)) {
    loadTopic(topics[0].id);
  }
}

function renderSportsNav(topic = null) {
  const current = topic || getTopic(state.topicId);
  const show = current?.id === 'sports' || Boolean(current?.sports);
  if (!show) {
    els.sportsSubnav.hidden = true;
    els.sportsSubnav.innerHTML = '';
    return;
  }
  const items = getAllTopics().filter((item) => item.id === 'sports' || item.sports);
  els.sportsSubnav.innerHTML = items.map((item) => (
    `<button type="button" class="sports-pill${item.id === current.id ? ' active' : ''}" data-sport-topic="${esc(item.id)}">${esc(item.id === 'sports' ? 'All sport' : item.label)}</button>`
  )).join('');
  els.sportsSubnav.hidden = false;
  const active = els.sportsSubnav.querySelector('.sports-pill.active');
  if (active) {
    const left = active.offsetLeft - (els.sportsSubnav.clientWidth / 2) + (active.clientWidth / 2);
    els.sportsSubnav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }
}

function updateTopicHeader(topic) {
  state.currentLabel = topic.label;
  els.editorialHeading.textContent = (topic.title || topic.label).toUpperCase();
  document.title = `${topic.title || topic.label} | Tawin Newsreader`;
  els.feedSortSelect.value = state.sort;
  const listen = topic.type === 'radio' || topic.type === 'podcasts';
  els.editorialActions.hidden = listen;
  renderSportsNav(topic);
  const active = els.topicsBar.querySelector('.topic-pill.active');
  if (active) {
    const left = active.offsetLeft - (els.topicsBar.clientWidth / 2) + (active.clientWidth / 2);
    els.topicsBar.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }
}

function chooseInitialTopic() {
  const topics = getVisibleTopics();
  if (!topics.length) return '';
  const saved = safeGet('newsreader_last_topic');
  if (saved) {
    if (topics.some((topic) => topic.id === saved)) return saved;
    const savedTopic = getTopic(saved);
    if (savedTopic?.sports) return saved;
  }
  return topics[0].id;
}

/* ------------------------------------------------------------------ */
/* Feed states                                                         */
/* ------------------------------------------------------------------ */

function hideFeedStates() {
  els.loadingState.hidden = true;
  els.errorState.hidden = true;
  els.filteredEmptyState.hidden = true;
}

function showLoading() {
  hideFeedStates();
  els.feedList.hidden = true;
  els.loadingState.hidden = false;
  setRefreshSpinning(true);
}

function showError(message) {
  hideFeedStates();
  els.feedList.hidden = true;
  els.errorMessage.textContent = message || 'The feed could not be loaded.';
  els.errorState.hidden = false;
  setRefreshSpinning(false);
}

function showFilteredEmpty() {
  hideFeedStates();
  els.feedList.hidden = true;
  els.filteredEmptyState.hidden = false;
  setRefreshSpinning(false);
}

function setRefreshSpinning(spinning) {
  state.loading = spinning;
  els.refreshBtn.classList.toggle('is-loading', spinning);
  els.refreshBtn.setAttribute('aria-busy', String(spinning));
}

function setStatus(text, warning = false) {
  if (!text) {
    els.feedStatus.hidden = true;
    els.feedStatus.textContent = '';
    return;
  }
  els.feedStatus.hidden = false;
  els.feedStatus.textContent = text;
  els.feedStatus.classList.toggle('is-warning', warning);
}

function sourceResultsMarkup() {
  if (!state.results?.length) {
    els.feedSourcesDetails.hidden = true;
    return;
  }
  const okCount = state.results.filter((result) => result.ok).length;
  els.feedSourcesSummary.textContent = `Sources · ${okCount}/${state.results.length} loaded`;
  els.feedSourcesList.innerHTML = state.results.map((result) => {
    const count = result.ok ? `${result.count} ${result.count === 1 ? 'story' : 'stories'}` : 'Unavailable';
    return `<li><span>${esc(result.name)}</span><span class="source-state ${result.ok ? 'ok' : 'failed'}">${esc(count)}</span></li>`;
  }).join('');
  els.feedSourcesDetails.hidden = false;
}

function renderFeed() {
  hideFeedStates();
  setRefreshSpinning(false);

  const allCurated = curateArticles(state.articles, state.sort);
  const settings = getSettings();
  const showBriefs = settings.showBriefs || state.topicId === 'briefs' || Boolean(state.sourceView);
  const hadBriefs = allCurated.some((article) => article.briefOnly);
  const curated = showBriefs ? allCurated : allCurated.filter((article) => !article.briefOnly);
  const visible = state.hideLocked ? curated.filter((article) => article.status !== 'locked') : curated;

  if (!curated.length) {
    els.feedList.hidden = false;
    if (hadBriefs && !showBriefs) {
      els.feedList.innerHTML = `<div class="state-container">
        <h2 class="state-title">Only publisher briefs here</h2>
        <p class="state-desc">These publishers block full-text reading. Open the <strong>Briefs</strong> desk to read them, or enable <strong>Show briefs in all feeds</strong> from the menu.</p>
      </div>`;
    } else {
      els.feedList.innerHTML = `<div class="state-container">
        <h2 class="state-title">Nothing to show yet</h2>
        <p class="state-desc">${esc(state.emptyReason || 'No recent stories were found for this topic.')}</p>
      </div>`;
    }
    els.feedUpdateStatus.hidden = true;
    els.feedSourcesDetails.hidden = true;
    return;
  }

  if (!visible.length) {
    showFilteredEmpty();
    els.feedUpdateStatus.hidden = true;
    return;
  }

  els.feedList.hidden = false;
  els.feedList.innerHTML = buildLayout(visible);

  const count = visible.length;
  els.feedUpdateStatus.hidden = false;
  els.feedUpdateStatus.textContent = `${count} ${count === 1 ? 'story' : 'stories'}${state.results.length ? ` · ${state.results.filter((result) => result.ok).length} sources` : ''}`;
  sourceResultsMarkup();
  scheduleArchiveChecks();
}

function visibleStoryCount() {
  const settings = getSettings();
  const showBriefs = settings.showBriefs || state.topicId === 'briefs' || Boolean(state.sourceView);
  const curated = curateArticles(state.articles, state.sort);
  return showBriefs ? curated.length : curated.filter((article) => !article.briefOnly).length;
}

function updateStatusLine() {
  if (state.loading) {
    setStatus('Refreshing live headlines…');
    return;
  }
  if (!state.articles.length) {
    setStatus('');
    return;
  }
  const stories = visibleStoryCount();
  if (!stories) {
    setStatus('');
    return;
  }
  const when = state.lastUpdated ? formatRelativeTime(state.lastUpdated) : '';
  const checked = state.lastChecked ? ` · checked ${formatRelativeTime(state.lastChecked)}` : '';
  if (state.liveFailed) {
    setStatus(`Live refresh incomplete · showing saved headlines${when ? ` (${when})` : ''}`, true);
    return;
  }
  if (state.fromSnapshot) {
    setStatus(`Saved edition${when ? ` · ${when}` : ''}${checked} · ${stories} stories`);
    return;
  }
  const okSources = state.results.filter((result) => result.ok).length;
  setStatus(`Updated ${when || 'just now'}${checked} · ${stories} stories${okSources ? ` · ${okSources} sources` : ''}`);
}

/* ------------------------------------------------------------------ */
/* Loading topics                                                      */
/* ------------------------------------------------------------------ */

async function openSourceView(feedId) {
  const feed = getFeed(feedId);
  if (!feed) return;
  if (!state.sourceView) state.sourceReturnTopic = state.topicId;
  state.sourceView = { feedId: feed.id, name: feed.name };
  state.fetchToken += 1;
  const token = state.fetchToken;
  clearPendingStories();
  closeMenu();
  if (anyModalOpen()) closeAllModals();

  els.sourceViewBar.hidden = false;
  els.sourceViewName.textContent = feed.name;
  els.editorialHeading.textContent = feed.name.toUpperCase();
  els.sportsSubnav.hidden = true;
  els.feedSourcesDetails.hidden = true;
  state.currentLabel = feed.name;
  const previous = state.articles;
  const fallback = previous.filter((article) => article.feedId === feed.id || article.domain === feed.domain);
  if (fallback.length) {
    state.articles = fallback;
    state.results = [];
    renderFeed();
    setStatus(`Showing saved stories from ${feed.name} · updating latest…`);
  } else {
    showLoading();
  }

  try {
    const payload = await fetchTopicArticles({
      id: `source-${feed.id}`,
      label: feed.name,
      title: feed.name,
      feeds: [feed.id],
    });
    if (token !== state.fetchToken) return;
    state.articles = payload.articles;
    state.results = payload.results;
    state.lastUpdated = payload.fetchedAt || new Date().toISOString();
    state.fromSnapshot = false;
    state.liveFailed = false;
    state.emptyReason = payload.emptyReason || '';
    renderFeed();
    setStatus(`Latest from ${feed.name} · ${payload.articles.length} ${payload.articles.length === 1 ? 'story' : 'stories'}`);
  } catch (error) {
    if (token !== state.fetchToken) return;
    const fallback = previous.filter((article) => article.feedId === feed.id || article.domain === feed.domain);
    if (fallback.length) {
      state.articles = fallback;
      state.results = [];
      renderFeed();
      setStatus(`Showing saved stories from ${feed.name}`, true);
    } else {
      showError(error?.message || `Could not load ${feed.name}.`);
    }
  }
}

function hideSourceView() {
  state.sourceView = null;
  els.sourceViewBar.hidden = true;
}

async function loadSnapshotVersion() {
  try {
    const response = await fetch(`./data/version.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    if (data?.news) state.snapshotVersion = data.news;
  } catch { /* offline or first build */ }
}

async function pollSnapshotTopic(topic, { token = state.fetchToken, force = false, initial = false } = {}) {
  if (!topic || topic.custom) return false;
  try {
    let version = state.snapshotVersion;
    const versionResponse = await fetch(`./data/version.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (versionResponse.ok) {
      const versionData = await versionResponse.json();
      version = versionData?.news || version;
    }
    if (!force && version && version === state.snapshotVersion) {
      state.lastAutoPoll = Date.now();
      state.lastChecked = Date.now();
      if (state.articles.length) updateStatusLine();
      return true;
    }

    const response = await fetch(`./data/news.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return false;
    const snapshot = await response.json();
    const entry = snapshot?.[topic.id];
    if (!entry || !Array.isArray(entry.articles)) return false;
    if (token !== state.fetchToken) return false;

    const incoming = entry.articles
      .filter((article) => article && article.url && article.title)
      .map((article) => applyRule({
        ...article,
        domain: article.domain || normalizeDomain(article.url),
        source: article.source || 'News',
      }));
    const base = state.pendingArticles || state.articles;
    const merged = dedupeArticles([...incoming, ...base]);
    const newCount = Math.max(0, merged.length - state.articles.length);
    state.snapshotVersion = version || entry.updatedAt || state.snapshotVersion || new Date().toISOString();
    state.lastAutoPoll = Date.now();
    state.lastChecked = Date.now();
    state.results = Array.isArray(entry.results) ? entry.results : state.results;
    state.liveFailed = false;

    if (!state.articles.length && incoming.length) {
      state.articles = incoming;
      state.lastUpdated = entry.updatedAt || state.lastUpdated;
      state.fromSnapshot = true;
      renderFeed();
      updateStatusLine();
      return true;
    }

    if (newCount > 0) {
      state.pendingArticles = merged;
      state.pendingFetchedAt = entry.updatedAt || new Date().toISOString();
      showPendingStories(newCount);
      setStatus(`${newCount === 1 ? '1 new story' : `${newCount} new stories`} since your last update · tap the banner to read`, false);
      return true;
    }

    if (!state.pendingArticles) {
      state.articles = merged;
      state.lastUpdated = entry.updatedAt || state.lastUpdated;
      state.fromSnapshot = true;
    }
    sourceResultsMarkup();
    updateStatusLine();
    if (force) showToast('The latest edition is already on screen.');
    return true;
  } catch {
    return false;
  }
}

async function loadTopic(topicId, { forceLive = false } = {}) {
  const topic = getTopic(topicId);
  if (!topic) return;

  hideSourceView();
  state.topicId = topic.id;
  safeSet('newsreader_last_topic', topic.id);
  state.articles = [];
  state.results = [];
  state.lastUpdated = '';
  state.emptyReason = '';
  state.fromSnapshot = false;
  state.liveFailed = false;
  state.fetchToken += 1;
  const token = state.fetchToken;
  clearPendingStories();

  updateTopicHeader(topic);
  renderTopicsBar();
  updateTopicHeader(topic);
  closeMenu();

  if (topic.type === 'radio') {
    state.listenMode = 'radio';
    renderRadioView();
    if (forceLive) showToast('Radio streams are always live.');
    return;
  }
  if (topic.type === 'podcasts') {
    state.listenMode = 'podcasts';
    loadPodcasts({ force: forceLive });
    return;
  }
  state.listenMode = '';

  const cached = readLiveCache(topic.id);
  const cacheFresh = cached && (Date.now() - Number(cached.cachedAt || 0) < LIVE_CACHE_TTL);
  if (cacheFresh && !forceLive) {
    state.articles = (cached.articles || []).filter((article) => article?.url && article?.title).map((article) => applyRule(article));
    state.results = Array.isArray(cached.results) ? cached.results : [];
    state.lastUpdated = cached.fetchedAt || '';
    renderFeed();
    updateStatusLine();
    return;
  }

  if (!topic.custom) {
    showLoading();
    const snapshot = await getSnapshotForTopic(topic).catch(() => null);
    if (token !== state.fetchToken) return;
    if (snapshot?.articles?.length) {
      state.articles = snapshot.articles;
      state.results = snapshot.results || [];
      state.lastUpdated = snapshot.updatedAt || '';
      state.fromSnapshot = true;
      renderFeed();
      updateStatusLine();
      pollSnapshotTopic(topic, { token, initial: true }).then((polled) => {
        if (!polled && token === state.fetchToken) refreshTopic(topic, { token, background: true });
      });
      return;
    }
  }

  showLoading();
  updateStatusLine();
  const polled = await pollSnapshotTopic(topic, { token, initial: true });
  if (!polled && token === state.fetchToken) refreshTopic(topic, { token, background: false });
}

async function refreshTopic(topic, { token = state.fetchToken, background = false } = {}) {
  if (!topic) return;
  const hadArticles = state.articles.length > 0;
  const previousResults = Array.isArray(state.results) ? state.results : [];
  if (!background || !hadArticles) {
    if (!hadArticles) {
      state.articles = [];
      showLoading();
    }
    setRefreshSpinning(true);
    state.loading = true;
    updateStatusLine();
  } else {
    setRefreshSpinning(true);
    state.loading = true;
    updateStatusLine();
    if (state.fromSnapshot) {
      setStatus(`Saved edition${state.lastUpdated ? ` · ${formatRelativeTime(state.lastUpdated)}` : ''} · refreshing live…`);
    }
  }

  try {
    const payload = await fetchTopicArticles(topic);
    if (token !== state.fetchToken) return;
    const wasSnapshot = state.fromSnapshot;
    const previousUpdated = state.lastUpdated;
    const isBackground = background && hadArticles;
    const mergedResults = mergeSourceResults(previousResults, payload.results);
    const mergedArticles = dedupeArticles([
      ...(payload.articles || []),
      ...(state.pendingArticles || state.articles),
    ]);
    const newCount = Math.max(0, mergedArticles.length - state.articles.length);

    state.results = mergedResults;
    state.lastAutoPoll = Date.now();
    state.emptyReason = payload.emptyReason || '';
    state.liveFailed = false;

    if (isBackground) {
      // Never re-render a page the reader is already using. New stories wait in
      // a banner, and the current scroll position and audio are left untouched.
      if (!wasSnapshot) state.lastUpdated = payload.fetchedAt || state.lastUpdated;
      if (newCount > 0) {
        state.pendingArticles = mergedArticles;
        state.pendingFetchedAt = payload.fetchedAt || new Date().toISOString();
        showPendingStories(newCount);
        setStatus(`${newCount === 1 ? '1 new story' : `${newCount} new stories`} since your last update · tap the banner to read`, false);
        saveLiveCache(topic.id, {
          articles: mergedArticles,
          results: mergedResults,
          fetchedAt: state.pendingFetchedAt,
        });
      } else {
        if (!state.pendingArticles) state.articles = mergedArticles;
        if (wasSnapshot) {
          state.fromSnapshot = true;
          state.lastUpdated = previousUpdated;
        }
        saveLiveCache(topic.id, {
          articles: mergedArticles,
          results: mergedResults,
          fetchedAt: payload.fetchedAt || new Date().toISOString(),
        });
        sourceResultsMarkup();
        updateStatusLine();
      }
      return;
    }

    state.lastUpdated = payload.fetchedAt || new Date().toISOString();
    state.fromSnapshot = false;

    const okSources = mergedResults.filter((result) => result.ok).length;
    const sparseLive = mergedResults.length > 0 && (
      okSources < Math.ceil(mergedResults.length / 2)
      || payload.articles.length < Math.min(18, Math.ceil(state.articles.length * 0.5))
    );
    if (sparseLive && wasSnapshot && hadArticles) {
      state.fromSnapshot = true;
      state.liveFailed = true;
      state.lastUpdated = previousUpdated;
      state.results = previousResults.length ? previousResults : mergedResults;
      sourceResultsMarkup();
      updateStatusLine();
      return;
    }

    if (payload.articles.length) {
      state.articles = payload.articles;
      saveLiveCache(topic.id, {
        articles: payload.articles,
        results: mergedResults,
        fetchedAt: state.lastUpdated,
      });
      renderFeed();
      updateStatusLine();
    } else if (!hadArticles) {
      state.articles = [];
      renderFeed();
      setStatus(payload.emptyReason || 'No recent stories were found.', true);
    } else {
      showToast(payload.emptyReason || 'No new stories were found. Keeping the current edition.');
      updateStatusLine();
    }
  } catch (error) {
    if (token !== state.fetchToken) return;
    state.results = previousResults.length ? previousResults : (Array.isArray(error.results) ? error.results : []);
    if (hadArticles || state.fromSnapshot) {
      state.liveFailed = true;
      updateStatusLine();
      setRefreshSpinning(false);
      if (!(background && hadArticles)) {
        renderFeed();
        updateStatusLine();
      }
    } else {
      showError(error?.message || 'Live feeds could not be reached.');
      setStatus('');
    }
  } finally {
    if (token === state.fetchToken) {
      state.loading = false;
      setRefreshSpinning(false);
      if (state.articles.length && !state.pendingNewCount) updateStatusLine();
    }
  }

}

function refreshCurrentTopic(force = true) {
  if (state.sourceView) {
    openSourceView(state.sourceView.feedId);
    return;
  }
  if (state.listenMode === 'radio') {
    renderRadioView();
    showToast('Radio streams are always live. Pick a station to listen.');
    return;
  }
  if (state.listenMode === 'podcasts') {
    fetchPodcastShowLive(selectedPodcastShow(), { force: true });
    return;
  }
  const topic = getTopic(state.topicId);
  if (!topic) return;
  closeMenu();
  clearPendingStories();
  state.lastAutoPoll = Date.now();
  scheduleAutoRefresh();
  const token = ++state.fetchToken;
  if (!topic.custom) {
    setRefreshSpinning(true);
    pollSnapshotTopic(topic, { token, force: true })
      .then((polled) => {
        if (!polled && token === state.fetchToken) refreshTopic(topic, { token, background: false });
      })
      .finally(() => {
        if (token === state.fetchToken) {
          setRefreshSpinning(false);
          updateStatusLine();
        }
      });
    return;
  }
  refreshTopic(topic, { token, background: state.articles.length > 0 });
}

/* ------------------------------------------------------------------ */
/* Background auto-refresh                                             */
/* ------------------------------------------------------------------ */

const AUTO_REFRESH_MINUTES = 5;

function clearPendingStories() {
  state.pendingArticles = null;
  state.pendingNewCount = 0;
  state.pendingFetchedAt = '';
  els.newStoriesBtn.hidden = true;
}

function showPendingStories(count) {
  state.pendingNewCount = count;
  const label = count === 1 ? '1 new story' : `${count} new stories`;
  els.newStoriesBtn.textContent = `${label} · tap to update`;
  els.newStoriesBtn.hidden = false;
}

function applyPendingStories() {
  if (!state.pendingArticles) return;
  state.articles = state.pendingArticles;
  state.pendingArticles = null;
  state.pendingNewCount = 0;
  if (state.pendingFetchedAt) state.lastUpdated = state.pendingFetchedAt;
  state.pendingFetchedAt = '';
  state.fromSnapshot = false;
  state.liveFailed = false;
  els.newStoriesBtn.hidden = true;
  renderFeed();
  sourceResultsMarkup();
  updateStatusLine();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mergeSourceResults(previous, incoming) {
  const merged = new Map();
  for (const result of previous || []) merged.set(result.feedId, result);
  for (const result of incoming || []) {
    const existing = merged.get(result.feedId);
    if (result.ok || !existing?.ok) merged.set(result.feedId, result);
  }
  return [...merged.values()];
}

async function pollCurrentTopic() {
  if (state.polling || state.loading || state.listenMode || state.sourceView) return;
  if (document.hidden || navigator.onLine === false) return;
  const topic = getTopic(state.topicId);
  if (!topic || topic.type) return;

  state.polling = true;
  try {
    if (!topic.custom) {
      const ok = await pollSnapshotTopic(topic, { token: state.fetchToken });
      if (ok) return;
    }
    if (!state.articles.length) {
      refreshTopic(topic, { token: ++state.fetchToken, background: false });
      return;
    }

    const token = state.fetchToken;
    const payload = await fetchTopicArticles(topic, { watchOnly: true });
    if (state.topicId !== topic.id || state.listenMode || token !== state.fetchToken) return;
    if (!payload.articles.length) return;

    const base = state.pendingArticles || state.articles;
    const merged = dedupeArticles([...payload.articles, ...base]);
    const newCount = Math.max(0, merged.length - state.articles.length);
    const checkedAt = payload.fetchedAt || new Date().toISOString();
    state.results = mergeSourceResults(state.results, payload.results);
    if (!state.fromSnapshot) state.lastUpdated = checkedAt;
    state.liveFailed = false;
    state.lastAutoPoll = Date.now();
    state.lastChecked = Date.now();

    if (newCount > 0) {
      state.pendingArticles = merged;
      state.pendingFetchedAt = checkedAt;
      showPendingStories(newCount);
      setStatus(`${newCount === 1 ? '1 new story' : `${newCount} new stories`} since your last update · tap the banner to read`, false);
      saveLiveCache(topic.id, {
        articles: merged,
        results: state.results,
        fetchedAt: checkedAt,
      });
    } else {
      if (!state.pendingArticles) state.articles = merged;
      saveLiveCache(topic.id, {
        articles: merged,
        results: state.results,
        fetchedAt: checkedAt,
      });
      sourceResultsMarkup();
      updateStatusLine();
    }
  } catch {
    // Background checks fail silently; the current edition stays on screen.
  } finally {
    state.polling = false;
  }

}

function scheduleAutoRefresh() {
  clearInterval(state.autoRefreshTimer);
  state.autoRefreshTimer = null;
  const settings = getSettings();
  if (!settings.autoRefresh) return;
  const minutes = Math.max(1, Number(settings.refreshMinutes) || AUTO_REFRESH_MINUTES);
  state.autoRefreshTimer = setInterval(() => {
    if (document.hidden) return;
    if (Date.now() - state.lastAutoPoll >= minutes * 60 * 1000) pollCurrentTopic();
  }, 30000);
}

function updateVisibleTimes() {
  $$('.news-card-time', els.feedList).forEach((element) => {
    if (!element.dataset.pubdate) return;
    const time = formatRelativeTime(element.dataset.pubdate);
    if (time) element.textContent = time;
  });
}


/* ------------------------------------------------------------------ */
/* Listen: radio & podcasts                                            */
/* ------------------------------------------------------------------ */

const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

function podcastDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function shortDuration(seconds) {
  const total = Number(seconds) || 0;
  if (!total) return '';
  const hours = Math.floor(total / 3600);
  const minutes = Math.round((total % 3600) / 60);
  if (hours) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)} min`;
}

function playerIcon(playing) {
  return playing ? ICON_PAUSE : ICON_PLAY;
}

function isRadioPlaying(id) {
  return state.player.type === 'radio' && state.player.id === id && state.player.playing;
}

function isEpisodePlaying(id) {
  return state.player.type === 'podcast' && state.player.id === id && state.player.playing;
}

function renderRadioView() {
  state.listenMode = 'radio';
  hideFeedStates();
  setRefreshSpinning(false);
  els.feedList.hidden = false;
  els.feedSourcesDetails.hidden = true;
  els.feedUpdateStatus.hidden = true;

  const regions = [...new Set(RADIO_STATIONS.map((station) => station.region))];
  const stationCard = (station) => {
    const playing = isRadioPlaying(station.id);
    return `<div class="station-card${playing ? ' playing' : ''}" data-station-id="${esc(station.id)}">
      <button type="button" class="station-play" data-play-station="${esc(station.id)}" aria-label="${playing ? 'Pause' : 'Play'} ${esc(station.name)}">
        ${playerIcon(playing)}
      </button>
      <div class="station-body">
        <span class="station-name">${esc(station.name)}</span>
        <span class="station-meta">${esc(station.frequency ? `${station.frequency} · ` : '')}${esc(station.region)}${station.language ? ` · ${esc(station.language)}` : ''}</span>
      </div>
      ${playing
        ? '<span class="equalizer" aria-hidden="true"><span></span><span></span><span></span><span></span></span>'
        : '<span class="station-live">Live</span>'}
    </div>`;
  };

  els.feedList.innerHTML = `<div class="listen-view">
    <div class="listen-hero">
      <span class="listen-hero-kicker"><span class="equalizer" aria-hidden="true"><span></span><span></span><span></span><span></span></span> Live audio</span>
      <h2>News radio, live</h2>
      <p>Tap any station to listen while you browse. Popular news and current-affairs stations from Malaysia, Singapore, Australia, the UK, the US and around the world.</p>
    </div>
    ${regions.map((region) => `<section class="listen-region">
      <div class="listen-section-head">
        <h3 class="listen-section-title">${esc(region)}</h3>
        <span class="listen-section-line" aria-hidden="true"></span>
      </div>
      <div class="station-grid">${RADIO_STATIONS.filter((station) => station.region === region).map(stationCard).join('')}</div>
    </section>`).join('')}
  </div>`;

  setStatus(`Live radio · ${RADIO_STATIONS.length} stations · streams open in the player below`);
}

function selectedPodcastShow() {
  return PODCAST_SHOWS.find((show) => show.id === state.podcastShowId) || PODCAST_SHOWS[0];
}

function renderPodcastsView() {
  state.listenMode = 'podcasts';
  hideFeedStates();
  setRefreshSpinning(false);
  els.feedList.hidden = false;
  els.feedSourcesDetails.hidden = true;
  els.editorialActions.hidden = true;

  const show = selectedPodcastShow();
  state.podcastShowId = show.id;
  const episodes = state.podcastEpisodes.slice(0, 40);
  const episodeCard = (episode) => {
    const playing = isEpisodePlaying(episode.id);
    const thumb = episode.imageUrl
      ? `<img class="episode-thumb" src="${esc(episode.imageUrl)}" alt="" loading="lazy" decoding="async">`
      : '';
    return `<article class="episode-card${playing ? ' playing' : ''}" data-episode-id="${esc(episode.id)}">
      <div class="episode-thumb-wrap">
        <span class="episode-thumb-fallback" aria-hidden="true">${esc(initialFor(episode.showName || show.name))}</span>
        ${thumb}
      </div>
      <div class="episode-body">
        <h3 class="episode-title">${esc(episode.title)}</h3>
        ${episode.description ? `<p class="episode-desc">${esc(episode.description)}</p>` : ''}
        <div class="episode-meta">
          <span>${esc(show.name)}</span>
          ${podcastDate(episode.pubDate) ? `<span aria-hidden="true">·</span><span>${esc(podcastDate(episode.pubDate))}</span>` : ''}
          ${shortDuration(episode.duration) ? `<span aria-hidden="true">·</span><span>${esc(shortDuration(episode.duration))}</span>` : ''}
        </div>
      </div>
      <button type="button" class="episode-play" data-play-episode="${esc(episode.id)}" aria-label="${playing ? 'Pause' : 'Play'} ${esc(episode.title)}">
        ${playerIcon(playing)}
      </button>
    </article>`;
  };

  let listMarkup = '';
  if (episodes.length) {
    listMarkup = `<div class="podcast-list">${episodes.map(episodeCard).join('')}</div>`;
  } else if (state.podcastLoading) {
    listMarkup = '<div class="listen-empty">Loading podcast episodes…</div>';
  } else if (state.podcastError) {
    listMarkup = `<div class="listen-empty">Episodes could not be loaded right now.<br><button type="button" class="form-btn" data-retry-podcasts style="margin-top:10px;">Try again</button></div>`;
  } else {
    listMarkup = '<div class="listen-empty">No episodes are available yet.</div>';
  }

  const options = PODCAST_SHOWS.map((item) => (
    `<option value="${esc(item.id)}"${item.id === show.id ? ' selected' : ''}>${esc(item.name)} — ${esc(item.publisher || item.region || '')}</option>`
  )).join('');
  const subtitle = [show.hosts, show.publisher, show.region].filter(Boolean).join(' · ');

  els.feedList.innerHTML = `<div class="listen-view">
    <div class="listen-hero podcast-hero">
      <span class="listen-hero-kicker">Podcast · ${esc(show.category || show.region || 'Global')}</span>
      <h2>${esc(show.name)}</h2>
      <p>${esc(show.description || 'Latest episodes from this podcast.')}</p>
      <div class="podcast-picker">
        <label class="podcast-picker-label" for="podcastShowSelect">Choose a podcast</label>
        <select id="podcastShowSelect" class="podcast-select" data-podcast-show-select aria-label="Choose a podcast">
          ${options}
        </select>
        <span class="podcast-picker-meta">${esc(subtitle)}</span>
      </div>
    </div>
    <div class="listen-section-head">
      <h3 class="listen-section-title">Latest episodes</h3>
      <span class="listen-section-line" aria-hidden="true"></span>
      ${episodes.length ? `<span class="count-badge">${episodes.length}</span>` : ''}
    </div>
    ${listMarkup}
  </div>`;

  if (episodes.length) {
    const updated = state.podcastUpdatedAt ? formatRelativeTime(state.podcastUpdatedAt) : '';
    els.feedUpdateStatus.hidden = false;
    els.feedUpdateStatus.textContent = `${episodes.length} episodes${updated ? ` · updated ${updated}` : ''}`;
    setStatus(`${show.name} · ${episodes.length} episodes${updated ? ` · updated ${updated}` : ''}`);
  } else {
    els.feedUpdateStatus.hidden = true;
    setStatus(state.podcastLoading ? 'Refreshing podcast episodes…' : '');
  }
}

function sortEpisodes(episodes) {
  return [...episodes].sort((left, right) => {
    const leftTime = left.pubDate ? Date.parse(left.pubDate) : 0;
    const rightTime = right.pubDate ? Date.parse(right.pubDate) : 0;
    return rightTime - leftTime;
  });
}

function applyPodcastSelection(showId, { fetch = true } = {}) {
  const show = PODCAST_SHOWS.find((item) => item.id === showId) || PODCAST_SHOWS[0];
  state.podcastShowId = show.id;
  state.podcastEpisodes = sortEpisodes(state.podcastEpisodeMap[show.id] || []);
  state.podcastUpdatedAt = state.podcastUpdatedMap[show.id] || '';
  state.podcastLoading = !state.podcastEpisodes.length;
  state.podcastError = '';
  safeSet('newsreader_podcast_show', show.id);
  renderPodcastsView();
  if (fetch && !state.podcastEpisodes.length) fetchPodcastShowLive(show);
}

async function fetchPodcastShowLive(show, { force = false } = {}) {
  if (!show) return;
  const request = ++state.podcastRequest;
  if (show.id === state.podcastShowId) {
    state.podcastLoading = true;
    state.podcastError = '';
    renderPodcastsView();
  }
  setRefreshSpinning(true);
  try {
    const result = await fetchPodcastShow(show);
    if (request !== state.podcastRequest && !force) return;
    const episodes = sortEpisodes(result.episodes || []);
    state.podcastEpisodeMap[show.id] = episodes;
    state.podcastUpdatedMap[show.id] = result.fetchedAt || new Date().toISOString();
    savePodcastCache(show.id, {
      episodes,
      fetchedAt: result.fetchedAt,
    });
    if (show.id === state.podcastShowId) {
      state.podcastEpisodes = episodes;
      state.podcastUpdatedAt = state.podcastUpdatedMap[show.id];
      state.podcastLoading = false;
      state.podcastError = '';
      renderPodcastsView();
    }
  } catch (error) {
    if (show.id === state.podcastShowId) {
      state.podcastLoading = false;
      state.podcastError = error?.message || 'Podcast feed unavailable';
      renderPodcastsView();
      if (state.podcastEpisodes.length) showToast('Podcast refresh failed. Showing saved episodes.');
    }
  } finally {
    if (show.id === state.podcastShowId) setRefreshSpinning(false);
  }
}

async function loadPodcasts({ force = false } = {}) {
  state.listenMode = 'podcasts';
  const saved = safeGet('newsreader_podcast_show');
  const initialShow = PODCAST_SHOWS.find((show) => show.id === saved) || PODCAST_SHOWS[0];
  state.podcastShowId = initialShow.id;
  state.podcastEpisodeMap = {};
  state.podcastUpdatedMap = {};

  for (const show of PODCAST_SHOWS) {
    const cached = readPodcastCache(show.id);
    if (!cached) continue;
    state.podcastEpisodeMap[show.id] = sortEpisodes(cached.episodes || []);
    state.podcastUpdatedMap[show.id] = cached.fetchedAt || '';
  }

  const snapshot = await loadPodcastSnapshot();
  if (state.listenMode !== 'podcasts') return;
  for (const item of snapshot?.shows || []) {
    if (!item?.id || !Array.isArray(item.episodes)) continue;
    if (!state.podcastEpisodeMap[item.id]?.length) {
      state.podcastEpisodeMap[item.id] = sortEpisodes(item.episodes);
      state.podcastUpdatedMap[item.id] = snapshot.updatedAt || '';
    }
  }

  applyPodcastSelection(initialShow.id, { fetch: false });
  if (force || !state.podcastEpisodes.length) {
    fetchPodcastShowLive(selectedPodcastShow(), { force: true });
  }
}

/* ------------------------------------------------------------------ */
/* Audio player                                                        */
/* ------------------------------------------------------------------ */

function clock(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const rest = value % 60;
  if (hours) return `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

function updatePlayingCards() {
  $$('[data-station-id]', els.feedList).forEach((card) => {
    const playing = isRadioPlaying(card.dataset.stationId);
    card.classList.toggle('playing', playing);
    const button = card.querySelector('[data-play-station]');
    if (button) {
      button.innerHTML = playerIcon(playing);
      const station = RADIO_STATIONS.find((item) => item.id === card.dataset.stationId);
      button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${station?.name || 'station'}`);
    }
    const liveBadge = card.querySelector('.station-live');
    const equalizer = card.querySelector('.equalizer');
    if (playing && liveBadge) {
      liveBadge.outerHTML = '<span class="equalizer" aria-hidden="true"><span></span><span></span><span></span><span></span></span>';
    } else if (!playing && equalizer) {
      equalizer.outerHTML = '<span class="station-live">Live</span>';
    }
  });

  $$('[data-episode-id]', els.feedList).forEach((card) => {
    const playing = isEpisodePlaying(card.dataset.episodeId);
    card.classList.toggle('playing', playing);
    const button = card.querySelector('[data-play-episode]');
    if (button) {
      button.innerHTML = playerIcon(playing);
      const episode = state.podcastEpisodes.find((item) => item.id === card.dataset.episodeId);
      button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${episode?.title || 'episode'}`);
    }
  });
}

function updateDockControls() {
  const playing = state.player.playing;
  els.dockPlayBtn.innerHTML = playerIcon(playing);
  els.dockPlayBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  updatePlayingCards();
}

function showDock() {
  els.audioDock.hidden = false;
  document.body.classList.add('has-audio-dock');
  els.dockKicker.textContent = state.player.kicker;
  els.dockTitle.textContent = state.player.title;
  const radio = state.player.type === 'radio';
  els.dockLive.hidden = !radio;
  els.dockProgress.hidden = radio;
  els.dockBackBtn.hidden = radio;
  els.dockForwardBtn.hidden = radio;
  els.dockRate.hidden = radio;
  updateDockControls();
}

function startPlayback({ type, id, title, kicker, source }) {
  suppressAudioError = true;
  els.audioPlayer.pause();
  suppressAudioError = false;
  state.player = { type, id, title, kicker, playing: true };
  els.audioPlayer.src = source;
  els.audioPlayer.playbackRate = Number(els.dockRate.value) || 1;
  els.dockSeek.value = '0';
  els.dockCurrentTime.textContent = '0:00';
  els.dockDuration.textContent = '0:00';
  showDock();
  els.audioPlayer.load();
  els.audioPlayer.play().catch(() => {
    state.player.playing = false;
    updateDockControls();
    showToast('This audio stream could not be played. Please try another station.');
  });
}

function togglePlayback() {
  if (!els.audioPlayer.src) return;
  if (els.audioPlayer.paused) {
    els.audioPlayer.play().catch(() => showToast('This audio stream could not be played.'));
  } else {
    els.audioPlayer.pause();
  }
}

function playStation(station) {
  if (state.player.type === 'radio' && state.player.id === station.id) {
    togglePlayback();
    return;
  }
  startPlayback({
    type: 'radio',
    id: station.id,
    title: station.name,
    kicker: `Live radio · ${station.region}`,
    source: station.stream,
  });
}

function playEpisode(episode) {
  if (state.player.type === 'podcast' && state.player.id === episode.id) {
    togglePlayback();
    return;
  }
  startPlayback({
    type: 'podcast',
    id: episode.id,
    title: episode.title,
    kicker: episode.showName || 'Podcast',
    source: episode.audioUrl,
  });
}

let suppressAudioError = false;

els.audioPlayer.addEventListener('play', () => {
  state.player.playing = true;
  updateDockControls();
});

els.audioPlayer.addEventListener('pause', () => {
  state.player.playing = false;
  updateDockControls();
});

els.audioPlayer.addEventListener('ended', () => {
  state.player.playing = false;
  els.dockSeek.value = '0';
  updateDockControls();
});

els.audioPlayer.addEventListener('timeupdate', () => {
  if (state.player.type !== 'podcast') return;
  const duration = els.audioPlayer.duration;
  if (!Number.isFinite(duration) || duration <= 0) return;
  els.dockCurrentTime.textContent = clock(els.audioPlayer.currentTime);
  els.dockDuration.textContent = clock(duration);
  els.dockSeek.value = String((els.audioPlayer.currentTime / duration) * 100);
});

els.audioPlayer.addEventListener('loadedmetadata', () => {
  const duration = els.audioPlayer.duration;
  if (Number.isFinite(duration) && duration > 0) els.dockDuration.textContent = clock(duration);
});

els.audioPlayer.addEventListener('error', () => {
  if (suppressAudioError) return;
  if (!state.player.type) return;
  state.player.playing = false;
  updateDockControls();
  showToast('That audio stream is unavailable right now. Try another station.');
});

els.dockPlayBtn.addEventListener('click', togglePlayback);

els.dockSeek.addEventListener('input', () => {
  const duration = els.audioPlayer.duration;
  if (!Number.isFinite(duration) || duration <= 0) return;
  els.audioPlayer.currentTime = (Number(els.dockSeek.value) / 100) * duration;
});

els.dockBackBtn.addEventListener('click', () => {
  els.audioPlayer.currentTime = Math.max(0, els.audioPlayer.currentTime - 15);
});

els.dockForwardBtn.addEventListener('click', () => {
  els.audioPlayer.currentTime = Math.min(els.audioPlayer.duration || 0, els.audioPlayer.currentTime + 15);
});

els.dockRate.addEventListener('change', () => {
  els.audioPlayer.playbackRate = Number(els.dockRate.value) || 1;
});

els.dockVolume.addEventListener('input', () => {
  els.audioPlayer.volume = Number(els.dockVolume.value);
  safeSet('newsreader_volume', els.dockVolume.value);
});

els.dockCloseBtn.addEventListener('click', () => {
  suppressAudioError = true;
  els.audioPlayer.pause();
  els.audioPlayer.removeAttribute('src');
  els.audioPlayer.load();
  suppressAudioError = false;
  state.player = { type: '', id: '', playing: false, title: '', kicker: '' };
  els.audioDock.hidden = true;
  document.body.classList.remove('has-audio-dock');
  updatePlayingCards();
});

els.feedList.addEventListener('click', (event) => {
  const stationEl = event.target.closest('[data-station-id]');
  if (stationEl) {
    const station = RADIO_STATIONS.find((item) => item.id === stationEl.dataset.stationId);
    if (station) playStation(station);
    return;
  }
  const episodeEl = event.target.closest('[data-episode-id]');
  if (episodeEl) {
    const episode = state.podcastEpisodes.find((item) => item.id === episodeEl.dataset.episodeId);
    if (episode) playEpisode(episode);
    return;
  }
  if (event.target.closest('[data-retry-podcasts]')) {
    fetchPodcastShowLive(selectedPodcastShow(), { force: true });
  }
});

els.feedList.addEventListener('change', (event) => {
  const select = event.target.closest('[data-podcast-show-select]');
  if (select) applyPodcastSelection(select.value);
});


function findArticle(id) {
  return state.articles.find((article) => article.id === id) || null;
}

function openArticle(article) {
  if (!article) return;
  openReader(article);
}

/* ------------------------------------------------------------------ */
/* Archive checks                                                      */
/* ------------------------------------------------------------------ */

function updateCardDom(article) {
  const card = els.feedList.querySelector(`[data-card-id="${article.id}"]`);
  if (!card) return;

  card.classList.toggle('is-locked', article.status === 'locked');

  const badge = card.querySelector(`[data-badge-for="${article.id}"]`);
  if (badge) {
    const hasHero = badge.classList.contains('badge-hero');
    badge.className = `badge ${badgeClass(article)} badge-action${hasHero ? ' badge-hero' : ''}`;
    badge.innerHTML = `${esc(badgeLabel(article))}<svg class="badge-caret" viewBox="0 0 10 6" width="8" height="5" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
    badge.setAttribute('aria-label', `Reading rule: ${badgeLabel(article)}. Change rule for ${article.domain}.`);
  }

  const anchors = card.querySelectorAll('a[href]');
  anchors.forEach((anchor) => {
    if (article.status === 'locked') return;
    anchor.href = article.targetUrl || article.url;
  });

  const existingHint = card.querySelector('.locked-hint');
  if (article.status === 'locked' && !existingHint) {
    const meta = card.querySelector('.flip-hero-meta, .flip-banner-meta, .flip-row-meta, .flip-tile-meta');
    if (meta) {
      meta.insertAdjacentHTML('afterbegin', lockedHint(article));
    }
  } else if (article.status === 'bypassed' && existingHint) {
    existingHint.remove();
  }

  if (article.status === 'locked' && state.hideLocked) {
    card.remove();
    if (!els.feedList.querySelector('.news-card')) {
      renderFeed();
    }
  }
}

async function runArchiveChecks(token) {
  if (state.archiveRunning) return;
  const pending = state.articles
    .filter((article) => (article.strategy === 'archive_is' || article.strategy === 'wayback') && article.status === 'checking')
    .slice(0, 8);
  if (!pending.length) return;

  state.archiveRunning = true;
  try {
    let cursor = 0;
    const worker = async () => {
      while (cursor < pending.length) {
        const article = pending[cursor];
        cursor += 1;
        if (token !== state.fetchToken) return;
        const result = await checkArchive(article);
        if (token !== state.fetchToken) return;
        const current = findArticle(article.id);
        if (!current) continue;
        const index = state.articles.indexOf(current);
        if (result.available && result.archiveUrl) {
          current.status = 'bypassed';
          current.badge = 'Archived';
          current.locked = false;
          current.targetUrl = result.archiveUrl;
          current.archiveUrl = result.archiveUrl;
        } else {
          current.status = 'locked';
          current.badge = 'Locked';
          current.locked = true;
          current.targetUrl = current.url;
        }
        state.articles[index] = current;
        updateCardDom(current);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
  } finally {
    state.archiveRunning = false;
  }
}

function scheduleArchiveChecks(token = state.fetchToken) {
  if (!state.articles.some((article) => article.status === 'checking')) return;
  setTimeout(() => runArchiveChecks(token), 350);
}

function reapplyRules() {
  state.articles = state.articles.map((article) => applyRule(article));
  if (state.pendingArticles) state.pendingArticles = state.pendingArticles.map((article) => applyRule(article));
  if (state.listenMode === 'radio') {
    renderRadioView();
    return;
  }
  if (state.listenMode === 'podcasts') {
    renderPodcastsView();
    return;
  }
  renderFeed();
  updateStatusLine();
}

/* ------------------------------------------------------------------ */
/* Feed interactions                                                   */
/* ------------------------------------------------------------------ */

els.feedList.addEventListener('click', (event) => {
  const badge = event.target.closest('[data-badge-for]');
  if (badge) {
    event.preventDefault();
    event.stopPropagation();
    openSwitcher(badge.dataset.domain);
    return;
  }
  const sourceButton = event.target.closest('[data-source-feed]');
  if (sourceButton) {
    event.preventDefault();
    event.stopPropagation();
    openSourceView(sourceButton.dataset.sourceFeed);
    return;
  }
  const card = event.target.closest('[data-card-id]');
  if (!card) return;
  const article = findArticle(card.dataset.cardId);
  if (!article) return;
  if (event.target.closest('a[href]')) event.preventDefault();
  openArticle(article);
});

els.feedList.addEventListener('auxclick', (event) => {
  if (event.button === 1 && event.target.closest('[data-card-id] a[href]')) event.preventDefault();
});

els.feedList.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('[data-card-id]');
  if (!card || event.target.closest('a, button')) return;
  event.preventDefault();
  openArticle(findArticle(card.dataset.cardId));
});

els.feedList.addEventListener('error', (event) => {
  const image = event.target;
  if (image?.tagName === 'IMG') {
    image.style.display = 'none';
    image.closest('.media')?.classList.add('image-failed');
  }
}, true);

els.topicsBar.addEventListener('click', (event) => {
  const pill = event.target.closest('[data-topic]');
  if (!pill) return;
  if (state.sourceView) {
    loadTopic(pill.dataset.topic);
    return;
  }
  if (pill.dataset.topic === state.topicId) return;
  loadTopic(pill.dataset.topic);
});

els.sportsSubnav.addEventListener('click', (event) => {
  const pill = event.target.closest('[data-sport-topic]');
  if (!pill || pill.dataset.sportTopic === state.topicId) return;
  loadTopic(pill.dataset.sportTopic);
});

els.sourceBackBtn.addEventListener('click', () => {
  loadTopic(state.sourceReturnTopic || state.topicId);
});

els.feedSortSelect.addEventListener('change', () => {
  state.sort = els.feedSortSelect.value === 'oldest' ? 'oldest' : 'newest';
  saveSettings({ sort: state.sort });
  renderFeed();
  updateStatusLine();
});

els.retryFeedBtn.addEventListener('click', () => refreshCurrentTopic());
els.retrySourcesBtn.addEventListener('click', () => refreshCurrentTopic());
els.refreshBtn.addEventListener('click', () => refreshCurrentTopic());

els.showLockedHeadlinesBtn.addEventListener('click', () => {
  state.hideLocked = false;
  els.hideLockedCheckbox.checked = false;
  saveSettings({ hideLocked: false });
  renderFeed();
  updateStatusLine();
});

els.hideLockedCheckbox.addEventListener('change', () => {
  state.hideLocked = els.hideLockedCheckbox.checked;
  saveSettings({ hideLocked: state.hideLocked });
  renderFeed();
  updateStatusLine();
});

els.autoRefreshCheckbox.addEventListener('change', () => {
  const enabled = els.autoRefreshCheckbox.checked;
  saveSettings({ autoRefresh: enabled });
  scheduleAutoRefresh();
  showToast(enabled ? 'Auto-refresh on. Checking for new stories every 5 minutes.' : 'Auto-refresh off. Use Refresh headlines to check manually.');
});

els.showBriefsCheckbox.addEventListener('change', () => {
  saveSettings({ showBriefs: els.showBriefsCheckbox.checked });
  renderFeed();
  updateStatusLine();
  showToast(els.showBriefsCheckbox.checked
    ? 'Publisher briefs are now included in every feed.'
    : 'Publisher briefs are now confined to the Briefs desk.');
});

els.newStoriesBtn.addEventListener('click', applyPendingStories);

/* ------------------------------------------------------------------ */
/* Rules modal                                                         */
/* ------------------------------------------------------------------ */

function strategyOptions(selected = '', includeAuto = false) {
  const options = [];
  if (includeAuto) options.push('<option value="auto">Auto — use the saved publisher rule</option>');
  for (const [key, meta] of Object.entries(STRATEGY_META)) {
    options.push(`<option value="${esc(key)}"${key === selected ? ' selected' : ''}>${esc(meta.label)}</option>`);
  }
  return options.join('');
}

function renderRulesList() {
  const filter = els.rulesSearch.value.trim().toLowerCase();
  const all = getAllRules();
  const entries = Object.entries(all)
    .filter(([domain, rule]) => {
      if (!filter) return true;
      return domain.toLowerCase().includes(filter) || String(rule.label || '').toLowerCase().includes(filter);
    })
    .sort(([leftDomain], [rightDomain]) => leftDomain.localeCompare(rightDomain));

  els.rulesCount.textContent = `${Object.keys(all).length} rules`;
  if (!entries.length) {
    els.rulesList.innerHTML = '<p class="rule-placeholder">No publishers match that filter.</p>';
    return;
  }
  els.rulesList.innerHTML = entries.map(([domain, rule]) => {
    const isCustom = Boolean(rule.updatedAt);
    return `<div class="rule-row${isCustom ? ' is-custom' : ''}" data-rule-row="${esc(domain)}">
      <div class="rule-domain">
        <span class="rule-domain-name">${esc(rule.label || domain)}</span>
        <span class="rule-domain-meta">${esc(domain)}${isCustom ? '<span class="rule-paywall">custom</span>' : ''}<span class="rule-paywall">${esc(rule.paywall || 'unknown')}</span></span>
      </div>
      <select class="form-select rule-select" data-rule-domain="${esc(domain)}" aria-label="Reading rule for ${esc(domain)}">
        ${strategyOptions(rule.strategy)}
      </select>
      ${isCustom ? `<button type="button" class="rule-delete" data-delete-rule="${esc(domain)}" title="Remove custom rule" aria-label="Remove custom rule for ${esc(domain)}">×</button>` : '<span class="rule-delete" aria-hidden="true"></span>'}
    </div>`;
  }).join('');
}

function openRules() {
  closeMenu();
  els.selectRuleStrategy.innerHTML = strategyOptions('direct');
  renderRulesList();
  openModal(els.rulesModal);
}

els.openRulesBtn.addEventListener('click', openRules);
els.closeRulesBtn.addEventListener('click', () => closeModal(els.rulesModal));
els.closeRulesDoneBtn.addEventListener('click', () => closeModal(els.rulesModal));
els.rulesSearch.addEventListener('input', renderRulesList);

els.rulesList.addEventListener('change', (event) => {
  const select = event.target.closest('[data-rule-domain]');
  if (!select) return;
  const domain = select.dataset.ruleDomain;
  const rule = getDomainRule(domain);
  setDomainRule(domain, { strategy: select.value, paywall: rule.paywall, label: rule.label });
  renderRulesList();
  reapplyRules();
  showToast(`Saved ${domain} → ${STRATEGY_META[select.value]?.label || select.value}`);
});

els.rulesList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete-rule]');
  if (!button) return;
  const domain = button.dataset.deleteRule;
  deleteDomainRule(domain);
  renderRulesList();
  reapplyRules();
  showToast(`Removed the custom rule for ${domain}.`);
});

els.addRuleForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const domain = els.inputRuleDomain.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  if (!domain || !domain.includes('.')) {
    els.ruleFormError.hidden = false;
    els.ruleFormError.textContent = 'Enter a publisher domain such as wsj.com.';
    return;
  }
  els.ruleFormError.hidden = true;
  const existing = getDomainRule(domain);
  setDomainRule(domain, {
    strategy: els.selectRuleStrategy.value,
    paywall: existing.paywall || 'custom',
    label: existing.label || domain,
  });
  els.inputRuleDomain.value = '';
  renderRulesList();
  reapplyRules();
  showToast(`Saved a reading rule for ${domain}.`);
});

els.resetRulesBtn.addEventListener('click', () => {
  if (!window.confirm('Reset every publisher rule to the built-in defaults?')) return;
  resetDomainRules();
  renderRulesList();
  reapplyRules();
  showToast('Publisher rules reset to defaults.');
});

/* ------------------------------------------------------------------ */
/* Strategy switcher                                                   */
/* ------------------------------------------------------------------ */

function openSwitcher(domainInput) {
  const domain = String(domainInput || '').replace(/^www\./, '');
  if (!domain) return;
  state.switcherDomain = domain;
  const rule = getDomainRule(domain);
  els.switcherDomain.textContent = domain;
  els.switcherFavicon.textContent = initialFor(domain);
  els.switcherFavicon.style.setProperty('--fav-hue', hueFor(domain));
  els.switcherSavedNote.textContent = rule.isCustom ? 'Uses a custom rule' : 'Uses the default rule';
  renderSwitcherOptions(rule.strategy);
  openModal(els.switcherModal);
}

function renderSwitcherOptions(selected) {
  els.strategyOptionsList.innerHTML = Object.entries(STRATEGY_META).map(([key, meta]) => `
    <button type="button" class="strategy-option${key === selected ? ' selected' : ''}" data-strategy="${esc(key)}" role="radio" aria-checked="${key === selected}">
      <span class="strategy-radio" aria-hidden="true"></span>
      <span>
        <span class="strategy-option-title">${esc(meta.label)}${key === selected ? '<span class="strategy-current-tag">Current</span>' : ''}</span>
        <span class="strategy-option-desc">${esc(meta.desc)}</span>
      </span>
    </button>
  `).join('');
}

els.strategyOptionsList.addEventListener('click', (event) => {
  const option = event.target.closest('[data-strategy]');
  if (!option) return;
  const domain = state.switcherDomain;
  const rule = getDomainRule(domain);
  setDomainRule(domain, { strategy: option.dataset.strategy, paywall: rule.paywall, label: rule.label });
  renderSwitcherOptions(option.dataset.strategy);
  els.switcherSavedNote.textContent = `Saved for ${domain}`;
  reapplyRules();
  showToast(`${domain} now opens with ${STRATEGY_META[option.dataset.strategy]?.label || option.dataset.strategy}.`);
});

els.closeSwitcherBtn.addEventListener('click', () => closeModal(els.switcherModal));
els.closeSwitcherDoneBtn.addEventListener('click', () => closeModal(els.switcherModal));

/* ------------------------------------------------------------------ */
/* Customize modal                                                     */
/* ------------------------------------------------------------------ */

function orderedAllTopics() {
  const settings = getSettings();
  const all = getAllTopics();
  const byId = new Map(all.map((topic) => [topic.id, topic]));
  const ordered = [];
  for (const id of settings.topicOrder) {
    const topic = byId.get(id);
    if (topic && !topic.sports && !ordered.includes(topic)) ordered.push(topic);
  }
  for (const topic of all) {
    if (!topic.sports && !ordered.includes(topic)) ordered.push(topic);
  }
  return ordered;
}

function renderTopicsSettings() {
  const settings = getSettings();
  const topics = orderedAllTopics();
  els.topicsSettingsList.innerHTML = topics.map((topic, index) => {
    const visible = !settings.hiddenTopics.includes(topic.id);
    return `<div class="setting-row" data-setting-topic="${esc(topic.id)}">
      <div class="setting-order">
        <button type="button" class="order-btn" data-move="${esc(topic.id)}" data-direction="-1" aria-label="Move ${esc(topic.label)} up" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button type="button" class="order-btn" data-move="${esc(topic.id)}" data-direction="1" aria-label="Move ${esc(topic.label)} down" ${index === topics.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
      <label class="setting-check">
        <input type="checkbox" data-topic-visible="${esc(topic.id)}" ${visible ? 'checked' : ''}>
        <span class="setting-label">${esc(topic.label)}</span>
        ${topic.custom ? '<span class="setting-tag">custom</span>' : ''}
      </label>
      ${topic.custom ? `<button type="button" class="setting-delete" data-delete-topic="${esc(topic.id)}">Delete</button>` : ''}
    </div>`;
  }).join('');
}

function renderTopicSourceChecklist() {
  const query = state.newTopicSearch.trim().toLowerCase();
  const feeds = allFeeds().filter((feed) => {
    if (!query) return true;
    return feed.name.toLowerCase().includes(query) || feed.domain.toLowerCase().includes(query);
  });
  if (!feeds.length) {
    els.topicSourceChecklist.innerHTML = '<p class="source-empty">No sources match that filter.</p>';
    return;
  }
  const groups = new Map();
  for (const feed of feeds) {
    if (!groups.has(feed.group)) groups.set(feed.group, []);
    groups.get(feed.group).push(feed);
  }
  els.topicSourceChecklist.innerHTML = [...groups.entries()].map(([group, groupFeeds]) => `
    <div class="source-group-title">${esc(group)}</div>
    ${groupFeeds.map((feed) => `<label class="source-check-row">
      <input type="checkbox" data-topic-source="${esc(feed.id)}" ${state.newTopicSelection.has(feed.id) ? 'checked' : ''}>
      <span>${esc(feed.name)}</span>
      <span class="source-check-domain">${esc(feed.domain)}</span>
    </label>`).join('')}
  `).join('');
}

function renderSourcesCatalog() {
  const settings = getSettings();
  const disabled = new Set(settings.disabledFeeds);
  const query = state.sourceSearch.trim().toLowerCase();
  const feeds = allFeeds().filter((feed) => {
    if (!query) return true;
    return feed.name.toLowerCase().includes(query) || feed.domain.toLowerCase().includes(query);
  });
  const enabledCount = allFeeds().filter((feed) => !disabled.has(feed.id)).length;
  els.sourcesCount.textContent = `${enabledCount}/${allFeeds().length} enabled`;
  if (!feeds.length) {
    els.sourcesCatalog.innerHTML = '<p class="source-empty">No sources match that filter.</p>';
    return;
  }
  const groups = new Map();
  for (const feed of feeds) {
    if (!groups.has(feed.group)) groups.set(feed.group, []);
    groups.get(feed.group).push(feed);
  }
  els.sourcesCatalog.innerHTML = [...groups.entries()].map(([group, groupFeeds]) => `
    <div class="source-group-title">${esc(group)}</div>
    ${groupFeeds.map((feed) => `<div class="source-catalog-row">
      <input type="checkbox" id="source-${esc(feed.id)}" data-source-toggle="${esc(feed.id)}" ${disabled.has(feed.id) ? '' : 'checked'}>
      <label class="source-catalog-main" for="source-${esc(feed.id)}">
        <span class="source-catalog-name">${esc(feed.name)}</span>
        <span class="source-catalog-domain">${esc(feed.domain)}</span>
      </label>
      <button type="button" class="source-open-btn" data-open-source="${esc(feed.id)}">Latest</button>
      ${feed.custom ? `<button type="button" class="source-remove-btn" data-remove-source="${esc(feed.id)}">Remove</button>` : ''}
    </div>`).join('')}
  `).join('');
}

function switchCustomizePanel(panel) {
  els.tabButtons.forEach((button) => {
    const active = button.dataset.panel === panel;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  els.panelTopics.hidden = panel !== 'topics';
  els.panelNewTopic.hidden = panel !== 'new-topic';
  els.panelSources.hidden = panel !== 'sources';
  if (panel === 'sources') renderSourcesCatalog();
  if (panel === 'new-topic') renderTopicSourceChecklist();
}

function openCustomize(panel = 'topics') {
  closeMenu();
  state.newTopicSearch = '';
  state.sourceSearch = '';
  els.topicSourceSearch.value = '';
  els.sourceSearch.value = '';
  els.newTopicError.hidden = true;
  els.newSourceError.hidden = true;
  renderTopicsSettings();
  renderTopicSourceChecklist();
  renderSourcesCatalog();
  switchCustomizePanel(panel);
  openModal(els.customizeModal);
}

els.openCustomizeBtn.addEventListener('click', () => openCustomize('topics'));
els.closeCustomizeBtn.addEventListener('click', () => closeModal(els.customizeModal));
els.closeCustomizeDoneBtn.addEventListener('click', () => closeModal(els.customizeModal));

els.tabButtons.forEach((button) => {
  button.addEventListener('click', () => switchCustomizePanel(button.dataset.panel));
});

els.topicsSettingsList.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-topic-visible]');
  if (!checkbox) return;
  const settings = getSettings();
  const id = checkbox.dataset.topicVisible;
  const hidden = new Set(settings.hiddenTopics);
  if (checkbox.checked) hidden.delete(id);
  else hidden.add(id);
  saveSettings({ hiddenTopics: [...hidden] });
  renderTopicsSettings();
  renderTopicsBar();
  if (hidden.has(state.topicId)) {
    const first = getVisibleTopics()[0];
    if (first) loadTopic(first.id);
  }
});

els.topicsSettingsList.addEventListener('click', (event) => {
  const move = event.target.closest('[data-move]');
  if (move) {
    const topics = orderedAllTopics();
    const index = topics.findIndex((topic) => topic.id === move.dataset.move);
    const direction = Number(move.dataset.direction);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= topics.length) return;
    [topics[index], topics[target]] = [topics[target], topics[index]];
    saveSettings({ topicOrder: topics.map((topic) => topic.id) });
    renderTopicsSettings();
    renderTopicsBar();
    return;
  }

  const remove = event.target.closest('[data-delete-topic]');
  if (remove) {
    const id = remove.dataset.deleteTopic;
    if (!window.confirm('Delete this custom topic? Your sources and rules stay intact.')) return;
    removeCustomTopic(id);
    renderTopicsSettings();
    if (id === state.topicId) {
      const first = getVisibleTopics()[0];
      if (first) loadTopic(first.id);
    } else {
      renderTopicsBar();
    }
    showToast('Custom topic deleted.');
  }
});

/* New topic form */

function fillPresets() {
  els.selectTopicPreset.innerHTML = '<option value="">Choose a preset or write your own…</option>' + TOPIC_PRESETS.map((preset, index) => (
    `<option value="${index}">${esc(preset.label)}</option>`
  )).join('');
}

els.selectTopicPreset.addEventListener('change', () => {
  const preset = TOPIC_PRESETS[Number(els.selectTopicPreset.value)];
  if (!preset) return;
  els.inputTopicLabel.value = preset.label;
  els.inputTopicKeywords.value = preset.keywords.join(', ');
  state.newTopicSelection = new Set(preset.feeds);
  renderTopicSourceChecklist();
});

els.topicSourceSearch.addEventListener('input', () => {
  state.newTopicSearch = els.topicSourceSearch.value;
  renderTopicSourceChecklist();
});

els.topicSourceChecklist.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-topic-source]');
  if (!checkbox) return;
  if (checkbox.checked) state.newTopicSelection.add(checkbox.dataset.topicSource);
  else state.newTopicSelection.delete(checkbox.dataset.topicSource);
});

els.selectVisibleSourcesBtn.addEventListener('click', () => {
  const query = state.newTopicSearch.trim().toLowerCase();
  allFeeds()
    .filter((feed) => !query || feed.name.toLowerCase().includes(query) || feed.domain.toLowerCase().includes(query))
    .forEach((feed) => state.newTopicSelection.add(feed.id));
  renderTopicSourceChecklist();
});

els.clearVisibleSourcesBtn.addEventListener('click', () => {
  const query = state.newTopicSearch.trim().toLowerCase();
  allFeeds()
    .filter((feed) => !query || feed.name.toLowerCase().includes(query) || feed.domain.toLowerCase().includes(query))
    .forEach((feed) => state.newTopicSelection.delete(feed.id));
  renderTopicSourceChecklist();
});

els.addTopicForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const label = els.inputTopicLabel.value.trim();
  const keywords = els.inputTopicKeywords.value.split(',').map((keyword) => keyword.trim()).filter(Boolean);
  if (!label) {
    els.newTopicError.hidden = false;
    els.newTopicError.textContent = 'Give your topic a label.';
    return;
  }
  if (!state.newTopicSelection.size) {
    els.newTopicError.hidden = false;
    els.newTopicError.textContent = 'Choose at least one source for this topic.';
    return;
  }
  els.newTopicError.hidden = true;
  els.newTopicSpinner.hidden = false;
  els.newTopicSubmitBtn.disabled = true;

  const result = addCustomTopic({
    label,
    title: label,
    keywords,
    feeds: [...state.newTopicSelection],
  });

  els.newTopicSpinner.hidden = true;
  els.newTopicSubmitBtn.disabled = false;

  if (!result.ok) {
    els.newTopicError.hidden = false;
    els.newTopicError.textContent = result.error;
    return;
  }

  els.inputTopicLabel.value = '';
  els.inputTopicKeywords.value = '';
  els.selectTopicPreset.value = '';
  state.newTopicSelection.clear();
  closeModal(els.customizeModal);
  renderTopicsBar();
  loadTopic(result.topic.id);
  showToast(`Created the “${result.topic.title}” topic.`);
});

/* Sources */

els.sourceSearch.addEventListener('input', () => {
  state.sourceSearch = els.sourceSearch.value;
  renderSourcesCatalog();
});

els.sourcesCatalog.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-source-toggle]');
  if (!checkbox) return;
  const settings = getSettings();
  const disabled = new Set(settings.disabledFeeds);
  if (checkbox.checked) disabled.delete(checkbox.dataset.sourceToggle);
  else disabled.add(checkbox.dataset.sourceToggle);
  saveSettings({ disabledFeeds: [...disabled] });
  const feed = getFeed(checkbox.dataset.sourceToggle);
  els.sourceLibraryStatus.textContent = `${feed?.name || 'Source'} ${checkbox.checked ? 'enabled' : 'disabled'}.`;
  renderSourcesCatalog();
});

els.sourcesCatalog.addEventListener('click', (event) => {
  const open = event.target.closest('[data-open-source]');
  if (open) {
    closeModal(els.customizeModal);
    openSourceView(open.dataset.openSource);
    return;
  }
  const button = event.target.closest('[data-remove-source]');
  if (!button) return;
  const feed = getFeed(button.dataset.removeSource);
  if (!feed) return;
  if (!window.confirm(`Remove ${feed.name} from your source library?`)) return;
  removeCustomFeed(feed.id);
  renderSourcesCatalog();
  els.sourceLibraryStatus.textContent = `${feed.name} removed.`;
  showToast(`${feed.name} removed from the library.`);
});

els.addSourceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = els.inputSourceName.value.trim();
  const url = els.inputSourceUrl.value.trim();
  const result = addCustomFeed({ name, url });
  if (!result.ok) {
    els.newSourceError.hidden = false;
    els.newSourceError.textContent = result.error;
    return;
  }
  els.newSourceError.hidden = true;
  els.inputSourceName.value = '';
  els.inputSourceUrl.value = '';
  renderSourcesCatalog();
  els.sourceLibraryStatus.textContent = `${result.feed.name} added. Select it inside a custom topic to use it.`;
  showToast(`${result.feed.name} added to your library.`);
});

/* ------------------------------------------------------------------ */
/* Quick URL                                                           */
/* ------------------------------------------------------------------ */

function parseUrlInput(raw) {
  let value = String(raw || '').trim();
  if (!value) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) return null;
    if (!url.hostname.includes('.')) return null;
    return url;
  } catch {
    return null;
  }
}

function updateQuickUrlPreview() {
  const parsed = parseUrlInput(els.inputQuickUrl.value);
  els.quickUrlClearBtn.hidden = !els.inputQuickUrl.value;
  els.quickUrlError.hidden = true;
  els.quickUrlOpenBtn.disabled = !parsed;

  if (!parsed) {
    els.quickUrlBanner.hidden = true;
    els.quickUrlRememberDomain.textContent = 'this site';
    els.quickUrlHint.textContent = 'Paste a full article URL to see its saved rule.';
    return;
  }

  const domain = parsed.hostname.replace(/^www\./, '');
  const rule = getDomainRule(domain);
  const chosen = els.quickUrlStrategySelect.value;
  const effectiveStrategy = chosen === 'auto' ? rule.strategy : chosen;
  const meta = STRATEGY_META[effectiveStrategy] || STRATEGY_META.direct;

  els.quickUrlBanner.hidden = false;
  els.quickUrlDomainName.textContent = domain;
  els.quickUrlFavicon.textContent = initialFor(domain);
  els.quickUrlFavicon.style.setProperty('--fav-hue', hueFor(domain));
  els.quickUrlBadge.textContent = meta.badge;
  els.quickUrlBadge.className = `badge ${effectiveStrategy === 'archive_is' || effectiveStrategy === 'wayback' ? 'badge-checking' : effectiveStrategy === 'direct' ? 'badge-free' : 'badge-bypassed'}`;
  els.quickUrlRuleSource.textContent = rule.isCustom ? 'Custom rule' : 'Default rule';
  els.quickUrlRememberDomain.textContent = domain;
  els.quickUrlHint.textContent = chosen === 'auto'
    ? `Uses the saved rule for ${domain}: ${STRATEGY_META[rule.strategy]?.label || rule.strategy}.`
    : meta.desc;
}

function openQuickUrl() {
  closeMenu();
  state.quickUrlTouched = false;
  els.quickUrlError.hidden = true;
  els.quickUrlForm.reset();
  els.quickUrlRemember.checked = false;
  els.quickUrlStrategySelect.innerHTML = strategyOptions('auto', true);
  els.quickUrlStrategySelect.value = 'auto';
  els.inputQuickUrl.value = '';
  updateQuickUrlPreview();
  openModal(els.quickUrlModal);
  setTimeout(() => els.inputQuickUrl.focus(), 60);
}

els.openQuickUrlBtn.addEventListener('click', openQuickUrl);
els.closeQuickUrlBtn.addEventListener('click', () => closeModal(els.quickUrlModal));
els.closeQuickUrlDoneBtn.addEventListener('click', () => closeModal(els.quickUrlModal));

els.inputQuickUrl.addEventListener('input', updateQuickUrlPreview);
els.quickUrlStrategySelect.addEventListener('change', () => {
  state.quickUrlTouched = true;
  updateQuickUrlPreview();
});

els.quickUrlClearBtn.addEventListener('click', () => {
  els.inputQuickUrl.value = '';
  updateQuickUrlPreview();
  els.inputQuickUrl.focus();
});

els.quickUrlPasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (!text) return;
    els.inputQuickUrl.value = text.trim();
    state.quickUrlTouched = false;
    els.quickUrlStrategySelect.value = 'auto';
    updateQuickUrlPreview();
  } catch {
    els.quickUrlError.hidden = false;
    els.quickUrlError.textContent = 'Clipboard access was blocked. Paste the link into the field instead.';
  }
});

els.quickUrlForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const parsed = parseUrlInput(els.inputQuickUrl.value);
  if (!parsed) {
    els.quickUrlError.hidden = false;
    els.quickUrlError.textContent = 'Enter a valid http:// or https:// article URL.';
    return;
  }
  const domain = parsed.hostname.replace(/^www\./, '');
  const rule = getDomainRule(domain);
  const chosen = els.quickUrlStrategySelect.value;
  const strategy = chosen === 'auto' ? rule.strategy : chosen;

  if (els.quickUrlRemember.checked) {
    setDomainRule(domain, { strategy, paywall: rule.paywall, label: rule.label });
    reapplyRules();
  }

  els.quickUrlOpenBtn.disabled = true;
  try {
    closeModal(els.quickUrlModal);
    openReader({
      url: parsed.href,
      title: `Article on ${domain}`,
      source: domain,
      domain,
      pubDate: '',
      summary: '',
    });
  } finally {
    els.quickUrlOpenBtn.disabled = false;
  }
});

/* ------------------------------------------------------------------ */
/* Export & install                                                    */
/* ------------------------------------------------------------------ */

function downloadSettings() {
  const payload = exportSettings();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'newsreader-settings.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Settings exported as JSON.');
}

els.exportSettingsBtn.addEventListener('click', () => { closeMenu(); downloadSettings(); });
els.exportSettingsModalBtn.addEventListener('click', downloadSettings);

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  state.installPrompt = event;
  els.installAppBtn.style.display = 'flex';
});

els.installAppBtn.addEventListener('click', async () => {
  closeMenu();
  if (!state.installPrompt) {
    showToast('Use your browser menu and choose “Install app” or “Add to Home Screen”.');
    return;
  }
  state.installPrompt.prompt();
  await state.installPrompt.userChoice;
  state.installPrompt = null;
  els.installAppBtn.style.display = 'none';
});

window.addEventListener('appinstalled', () => {
  state.installPrompt = null;
  els.installAppBtn.style.display = 'none';
  showToast('Tawin Newsreader installed.');
});


/* ------------------------------------------------------------------ */
/* Reader events                                                       */
/* ------------------------------------------------------------------ */

els.readerBackBtn.addEventListener('click', readerBack);
els.readerCloseBtn.addEventListener('click', closeReader);

els.readerArchiveBtn.addEventListener('click', () => {
  if (state.readerArticle) loadReaderContent(state.readerArticle, { archiveOnly: true });
});

els.readerRetryBtn.addEventListener('click', () => {
  if (state.readerArticle) loadReaderContent(state.readerArticle);
});

els.readerScroll.addEventListener('scroll', () => {
  const max = els.readerScroll.scrollHeight - els.readerScroll.clientHeight;
  const percent = max > 0 ? (els.readerScroll.scrollTop / max) * 100 : 0;
  els.readerProgressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}, { passive: true });

els.readerBody.addEventListener('click', (event) => {
  const link = event.target.closest('[data-reader-href]');
  if (!link) return;
  event.preventDefault();
  const href = link.dataset.readerHref;
  if (!/^https?:/i.test(href)) return;
  let host = '';
  try { host = new URL(href).hostname.replace(/^www\./, ''); } catch { /* ignore */ }
  openReader({
    url: href,
    title: link.textContent.trim() || href,
    source: host || 'Reader',
    domain: host,
    pubDate: '',
    summary: '',
  }, { fromLink: true });
});

els.readerBody.addEventListener('error', (event) => {
  if (event.target?.tagName === 'IMG') event.target.style.display = 'none';
}, true);

window.addEventListener('popstate', () => {
  if (state.readerOpen && !history.state?.reader) finalizeReaderClose();
});

/* ------------------------------------------------------------------ */
/* Global events                                                       */
/* ------------------------------------------------------------------ */

els.menuToggleBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleMenu();
});

document.addEventListener('click', (event) => {
  if (!els.headerMenu.classList.contains('open')) return;
  if (!event.target.closest('.header-menu-container')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (state.readerOpen) {
    closeReader();
    return;
  }
  if (anyModalOpen()) {
    closeAllModals();
  } else {
    closeMenu();
  }
});

$$('.modal-overlay').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

window.addEventListener('online', () => {
  showToast('Back online. Checking for new headlines.');
  if (getSettings().autoRefresh) pollCurrentTopic();
});
window.addEventListener('offline', () => showToast('You are offline. Saved headlines will remain available.'));

function checkDueRefresh() {
  if (document.hidden) return;
  const settings = getSettings();
  if (!settings.autoRefresh) return;
  const minutes = Math.max(1, Number(settings.refreshMinutes) || AUTO_REFRESH_MINUTES);
  if (Date.now() - state.lastAutoPoll >= minutes * 60 * 1000) pollCurrentTopic();
}

document.addEventListener('visibilitychange', checkDueRefresh);
window.addEventListener('focus', checkDueRefresh);
window.addEventListener('pageshow', checkDueRefresh);

/* ------------------------------------------------------------------ */
/* Service worker                                                      */
/* ------------------------------------------------------------------ */

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(async () => {
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller && !sessionStorage.getItem('newsreader_sw_reloaded')) {
          sessionStorage.setItem('newsreader_sw_reloaded', '1');
          if (!state.readerOpen) setTimeout(() => location.reload(), 500);
        }
      })
      .catch((error) => {
        console.warn('Service worker registration failed', error);
      });
  });
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

function boot() {
  if (location.hash === '#read') history.replaceState(null, '', location.pathname + location.search);
  loadPublisherUrls();
  loadSnapshotVersion();
  const settings = getSettings();
  state.sort = settings.sort === 'oldest' ? 'oldest' : 'newest';
  if (settings.sort !== state.sort) saveSettings({ sort: state.sort });
  state.hideLocked = Boolean(settings.hideLocked);
  els.feedSortSelect.value = state.sort;
  els.hideLockedCheckbox.checked = state.hideLocked;
  els.autoRefreshCheckbox.checked = Boolean(settings.autoRefresh);
  els.showBriefsCheckbox.checked = Boolean(settings.showBriefs);
  els.selectRuleStrategy.innerHTML = strategyOptions('direct');
  fillPresets();
  scheduleAutoRefresh();

  const savedVolume = Number(safeGet('newsreader_volume'));
  els.dockVolume.value = String(Number.isFinite(savedVolume) && savedVolume > 0 ? savedVolume : 0.8);
  els.audioPlayer.volume = Number(els.dockVolume.value);

  const initial = chooseInitialTopic();
  renderTopicsBar();
  if (initial) {
    loadTopic(initial);
  } else {
    renderFeed();
  }

  setInterval(() => {
    if (state.listenMode || state.sourceView) return;
    updateVisibleTimes();
    if (!state.loading && state.articles.length && !state.pendingNewCount) updateStatusLine();
  }, 60000);
}

boot();
