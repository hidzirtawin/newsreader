/**
 * store.js — persistence and configuration merging.
 *
 * Everything is stored in localStorage so the app remains wholly static.
 * All reads are defensive: private browsing modes and blocked storage should
 * never prevent headlines from rendering.
 */

import {
  DEFAULT_RULES,
  FEEDS,
  STORAGE,
  TOPICS,
  normalizeDomain,
} from './config.js';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function safeSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}

const DEFAULT_SETTINGS = {
  hiddenTopics: [],
  topicOrder: [],
  hideLocked: false,
  sort: 'newest',
  disabledFeeds: [],
  autoRefresh: true,
  refreshMinutes: 5,
};

export function getSettings() {
  const saved = readJSON(STORAGE.settings, {});
  return {
    ...DEFAULT_SETTINGS,
    ...(saved && typeof saved === 'object' ? saved : {}),
    hiddenTopics: Array.isArray(saved?.hiddenTopics) ? saved.hiddenTopics : [],
    topicOrder: Array.isArray(saved?.topicOrder) ? saved.topicOrder : [],
    disabledFeeds: Array.isArray(saved?.disabledFeeds) ? saved.disabledFeeds : [],
  };
}

export function saveSettings(patch) {
  const next = { ...getSettings(), ...patch };
  writeJSON(STORAGE.settings, next);
  return next;
}

/* ------------------------------------------------------------------ */
/* Domain rules                                                        */
/* ------------------------------------------------------------------ */

export function getCustomRules() {
  const saved = readJSON(STORAGE.customRules, {});
  return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
}

export function getAllRules() {
  const custom = getCustomRules();
  return { ...DEFAULT_RULES, ...custom };
}

export function getDomainRule(domainInput) {
  const domain = normalizeDomain(domainInput);
  if (!domain) {
    return { domain: 'unknown', strategy: 'direct', paywall: 'unknown', label: 'Unknown source', isCustom: false };
  }
  const custom = getCustomRules();
  if (custom[domain]) return { domain, ...custom[domain], isCustom: true };
  if (DEFAULT_RULES[domain]) return { domain, ...DEFAULT_RULES[domain], isCustom: false };
  for (const [known, rule] of Object.entries(custom)) {
    if (domain.endsWith(`.${known}`)) {
      return { domain, ...rule, isCustom: true, matchedDomain: known };
    }
  }
  for (const [known, rule] of Object.entries(DEFAULT_RULES)) {
    if (domain.endsWith(`.${known}`)) {
      return { domain, ...rule, isCustom: false, matchedDomain: known };
    }
  }
  return { domain, strategy: 'direct', paywall: 'unknown', label: domain, isCustom: false };
}

export function setDomainRule(domainInput, { strategy, paywall = 'custom', label = '' }) {
  const domain = normalizeDomain(domainInput);
  if (!domain || !domain.includes('.')) return false;
  const custom = getCustomRules();
  custom[domain] = {
    strategy,
    paywall,
    label: label || DEFAULT_RULES[domain]?.label || domain,
    updatedAt: new Date().toISOString(),
  };
  return writeJSON(STORAGE.customRules, custom);
}

export function deleteDomainRule(domainInput) {
  const domain = normalizeDomain(domainInput);
  const custom = getCustomRules();
  if (!custom[domain]) return false;
  delete custom[domain];
  writeJSON(STORAGE.customRules, custom);
  return true;
}

export function resetDomainRules() {
  try {
    localStorage.removeItem(STORAGE.customRules);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Custom feeds & topics                                               */
/* ------------------------------------------------------------------ */

export function getCustomFeeds() {
  const saved = readJSON(STORAGE.customFeeds, []);
  return Array.isArray(saved) ? saved.filter((feed) => feed && feed.id && feed.url && feed.name) : [];
}

export function allFeeds() {
  return [...FEEDS, ...getCustomFeeds()];
}

export function getFeed(feedId) {
  return allFeeds().find((feed) => feed.id === feedId) || null;
}

export function addCustomFeed({ name, url }) {
  const cleanUrl = String(url || '').trim();
  if (!/^https?:\/\//i.test(cleanUrl)) return { ok: false, error: 'Enter a full feed URL starting with http:// or https://' };
  let domain = '';
  try { domain = normalizeDomain(cleanUrl); } catch { /* ignore */ }
  if (!domain) return { ok: false, error: 'That feed URL does not look valid.' };
  const feeds = getCustomFeeds();
  if (feeds.some((feed) => feed.url === cleanUrl)) {
    return { ok: false, error: 'That feed is already in your library.' };
  }
  const feed = {
    id: `custom-${Date.now().toString(36)}`,
    name: String(name || domain).trim(),
    domain,
    group: 'Custom',
    url: cleanUrl,
    custom: true,
  };
  feeds.push(feed);
  if (!writeJSON(STORAGE.customFeeds, feeds)) {
    return { ok: false, error: 'Browser storage is blocked, so this source could not be saved.' };
  }
  return { ok: true, feed };
}

export function removeCustomFeed(feedId) {
  const feeds = getCustomFeeds().filter((feed) => feed.id !== feedId);
  writeJSON(STORAGE.customFeeds, feeds);
  const settings = getSettings();
  saveSettings({ disabledFeeds: settings.disabledFeeds.filter((id) => id !== feedId) });
  return true;
}

export function getCustomTopics() {
  const saved = readJSON(STORAGE.customTopics, []);
  return Array.isArray(saved) ? saved.filter((topic) => topic && topic.id && topic.label) : [];
}

export function addCustomTopic({ label, title, keywords, feeds }) {
  const topics = getCustomTopics();
  const base = String(label || '').trim();
  if (!base) return { ok: false, error: 'Give your topic a label.' };
  const id = `custom-${base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'topic'}-${Date.now().toString(36).slice(-4)}`;
  const topic = {
    id,
    label: base.toUpperCase(),
    title: title || base,
    feeds: Array.isArray(feeds) && feeds.length ? feeds : ['bbc-news', 'npr-news', 'guardian-world'],
    keywords: Array.isArray(keywords) ? keywords.filter(Boolean) : [],
    custom: true,
  };
  topics.push(topic);
  if (!writeJSON(STORAGE.customTopics, topics)) {
    return { ok: false, error: 'Browser storage is blocked, so this topic could not be saved.' };
  }
  return { ok: true, topic };
}

export function removeCustomTopic(topicId) {
  writeJSON(STORAGE.customTopics, getCustomTopics().filter((topic) => topic.id !== topicId));
  const settings = getSettings();
  saveSettings({
    hiddenTopics: settings.hiddenTopics.filter((id) => id !== topicId),
    topicOrder: settings.topicOrder.filter((id) => id !== topicId),
  });
  return true;
}

export function getAllTopics() {
  return [...TOPICS, ...getCustomTopics()];
}

export function getTopic(topicId) {
  return getAllTopics().find((topic) => topic.id === topicId) || null;
}

/**
 * Topics in the order chosen by the user, with hidden ones removed.
 * Default topics are used as the base ordering when no custom order exists.
 */
export function getVisibleTopics() {
  const settings = getSettings();
  const all = getAllTopics();
  const byId = new Map(all.map((topic) => [topic.id, topic]));
  const ordered = [];
  for (const id of settings.topicOrder) {
    const topic = byId.get(id);
    if (topic && !ordered.includes(topic)) ordered.push(topic);
  }
  for (const topic of all) {
    if (!ordered.includes(topic)) ordered.push(topic);
  }
  return ordered.filter((topic) => !topic.sports && !topic.hiddenFromBar && !settings.hiddenTopics.includes(topic.id));
}

/* ------------------------------------------------------------------ */
/* Live cache                                                          */
/* ------------------------------------------------------------------ */

export function saveLiveCache(topicId, payload) {
  return writeJSON(`${STORAGE.liveCachePrefix}${topicId}`, {
    ...payload,
    cachedAt: Date.now(),
  });
}

export function readLiveCache(topicId) {
  const saved = readJSON(`${STORAGE.liveCachePrefix}${topicId}`, null);
  if (!saved || !Array.isArray(saved.articles)) return null;
  return saved;
}

export function savePodcastCache(showId, payload) {
  return writeJSON(`newsreader_podcast_${showId}`, {
    ...payload,
    cachedAt: Date.now(),
  });
}

export function readPodcastCache(showId) {
  const saved = readJSON(`newsreader_podcast_${showId}`, null);
  if (!saved || !Array.isArray(saved.episodes)) return null;
  return saved;
}

/* ------------------------------------------------------------------ */
/* Archive result cache                                                */
/* ------------------------------------------------------------------ */

const ARCHIVE_TTL = 6 * 60 * 60 * 1000;

export function readArchiveCache(url, strategy) {
  const key = `${strategy}:${url}`;
  const cache = readJSON(STORAGE.archiveCache, {});
  const entry = cache[key];
  if (!entry || (Date.now() - entry.checkedAt) > ARCHIVE_TTL) return null;
  return entry;
}

export function writeArchiveCache(url, strategy, result) {
  const key = `${strategy}:${url}`;
  const cache = readJSON(STORAGE.archiveCache, {});
  const keys = Object.keys(cache);
  if (keys.length > 400) {
    for (const oldKey of keys.slice(0, keys.length - 350)) delete cache[oldKey];
  }
  cache[key] = { ...result, checkedAt: Date.now() };
  writeJSON(STORAGE.archiveCache, cache);
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export function exportSettings() {
  return {
    app: 'Newsreader',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: getSettings(),
    domainRules: getCustomRules(),
    customFeeds: getCustomFeeds(),
    customTopics: getCustomTopics(),
  };
}
