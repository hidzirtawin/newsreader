/**
 * app.js — UI orchestration for Newsreader.
 */

import {
  STRATEGY_META,
  TOPIC_PRESETS,
  LIVE_CACHE_TTL,
  RADIO_STATIONS,
  PODCAST_SHOWS,
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
  buildStrategyUrl,
  curateArticles,
  dedupeArticles,
  fetchPodcastShow,
  fetchTopicArticles,
  formatRelativeTime,
  getSnapshotForTopic,
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
  newStoriesBtn: $('#newStoriesBtn'),
  openRulesBtn: $('#openRulesBtn'),
  openCustomizeBtn: $('#openCustomizeBtn'),
  exportSettingsBtn: $('#exportSettingsBtn'),
  installAppBtn: $('#installAppBtn'),

  topicsBar: $('#topicsBar'),
  editorialHeading: $('#editorialHeading'),
  feedSortSelect: $('#feedSortSelect'),
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
  podcastUpdatedAt: '',
  podcastLoading: false,
  podcastError: '',
  player: { type: '', id: '', playing: false, title: '', kicker: '' },
  pendingArticles: null,
  pendingNewCount: 0,
  pendingFetchedAt: '',
  polling: false,
  autoRefreshTimer: null,
  lastAutoPoll: 0,
};

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
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

const RETURN_KEY = 'newsreader_return_v1';

function rememberReturnPosition() {
  if (!state.topicId) return;
  try {
    sessionStorage.setItem(RETURN_KEY, JSON.stringify({
      topicId: state.topicId,
      scrollY: window.scrollY,
      at: Date.now(),
    }));
  } catch { /* storage may be blocked */ }
}

function restoreReturnScroll() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(RETURN_KEY) || 'null');
    if (!saved || saved.topicId !== state.topicId) return;
    if (Date.now() - Number(saved.at || 0) > 30 * 60 * 1000) {
      sessionStorage.removeItem(RETURN_KEY);
      return;
    }
    sessionStorage.removeItem(RETURN_KEY);
    setTimeout(() => window.scrollTo({ top: Number(saved.scrollY) || 0, behavior: 'auto' }), 600);
  } catch { /* ignore */ }
}

function faviconMarkup(article) {
  return `<span class="favicon-fallback" style="--fav-hue:${hueFor(article.domain)}" aria-hidden="true">${esc(initialFor(article.source))}</span>`;
}

function badgeClass(article) {
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
  return `<div class="source-group">${faviconMarkup(article)}<span class="news-card-source">${esc(article.source)}</span>${time ? `<span class="news-card-time" data-pubdate="${esc(article.pubDate)}">${esc(time)}</span>` : ''}</div>`;
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
    const summary = variant === 'hero' && article.summary
      ? `<p class="news-card-summary">${esc(article.summary)}</p>` : '';
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
  els.topicsBar.innerHTML = topics.map((topic) => (
    `<button type="button" class="topic-pill${topic.id === state.topicId ? ' active' : ''}" data-topic="${esc(topic.id)}">${esc(topic.label)}</button>`
  )).join('');
  if (!topics.some((topic) => topic.id === state.topicId)) {
    loadTopic(topics[0].id);
  }
}

function updateTopicHeader(topic) {
  state.currentLabel = topic.label;
  els.editorialHeading.textContent = (topic.title || topic.label).toUpperCase();
  document.title = `${topic.title || topic.label} | Newsreader`;
  els.feedSortSelect.value = state.sort;
  const listen = topic.type === 'radio' || topic.type === 'podcasts';
  els.editorialActions.hidden = listen;
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
  if (saved && topics.some((topic) => topic.id === saved)) return saved;
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

  const curated = curateArticles(state.articles, state.sort);
  const visible = state.hideLocked ? curated.filter((article) => article.status !== 'locked') : curated;

  if (!curated.length) {
    els.feedList.hidden = false;
    els.feedList.innerHTML = `<div class="state-container">
      <h2 class="state-title">Nothing to show yet</h2>
      <p class="state-desc">${esc(state.emptyReason || 'No recent stories were found for this topic.')}</p>
    </div>`;
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

function updateStatusLine() {
  if (state.loading) {
    setStatus('Refreshing live headlines…');
    return;
  }
  if (!state.articles.length) {
    setStatus('');
    return;
  }
  const when = state.lastUpdated ? formatRelativeTime(state.lastUpdated) : '';
  if (state.liveFailed) {
    setStatus(`Live refresh incomplete · showing saved headlines${when ? ` (${when})` : ''}`, true);
    return;
  }
  if (state.fromSnapshot) {
    setStatus(`Saved edition${when ? ` · ${when}` : ''} · ${state.articles.length} stories`);
    return;
  }
  const okSources = state.results.filter((result) => result.ok).length;
  setStatus(`Updated ${when || 'just now'} · ${state.articles.length} stories${okSources ? ` · ${okSources} sources` : ''}`);
}

/* ------------------------------------------------------------------ */
/* Loading topics                                                      */
/* ------------------------------------------------------------------ */

async function loadTopic(topicId, { forceLive = false } = {}) {
  const topic = getTopic(topicId);
  if (!topic) return;

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
      refreshTopic(topic, { token, background: true });
      return;
    }
  }

  showLoading();
  updateStatusLine();
  refreshTopic(topic, { token, background: false });
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

    state.results = payload.results || [];
    state.lastUpdated = payload.fetchedAt || new Date().toISOString();
    state.lastAutoPoll = Date.now();
    state.fromSnapshot = false;
    state.liveFailed = false;
    state.emptyReason = payload.emptyReason || '';

    const okSources = state.results.filter((result) => result.ok).length;
    const sparseLive = state.results.length > 0 && (
      okSources < Math.ceil(state.results.length / 2)
      || payload.articles.length < Math.min(18, Math.ceil(state.articles.length * 0.5))
    );
    if (sparseLive && wasSnapshot && hadArticles) {
      // A partial proxy response should not replace a complete bundled edition.
      state.fromSnapshot = true;
      state.liveFailed = true;
      state.lastUpdated = previousUpdated;
      state.results = previousResults.length ? previousResults : state.results;
      sourceResultsMarkup();
      updateStatusLine();
      return;
    }

    if (payload.articles.length) {
      state.articles = payload.articles;
      saveLiveCache(topic.id, {
        articles: payload.articles,
        results: payload.results,
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
      renderFeed();
      updateStatusLine();
    } else {
      showError(error?.message || 'Live feeds could not be reached.');
      setStatus('');
    }
  } finally {
    if (token === state.fetchToken) {
      state.loading = false;
      setRefreshSpinning(false);
      if (state.articles.length) updateStatusLine();
    }
  }
}

function refreshCurrentTopic(force = true) {
  if (state.listenMode === 'radio') {
    renderRadioView();
    showToast('Radio streams are always live. Pick a station to listen.');
    return;
  }
  if (state.listenMode === 'podcasts') {
    state.fetchToken += 1;
    loadPodcasts({ force: true });
    return;
  }
  const topic = getTopic(state.topicId);
  if (!topic) return;
  closeMenu();
  clearPendingStories();
  state.lastAutoPoll = Date.now();
  scheduleAutoRefresh();
  refreshTopic(topic, { token: ++state.fetchToken, background: state.articles.length > 0 });
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
  if (state.polling || state.loading || state.listenMode) return;
  if (document.hidden || navigator.onLine === false) return;
  const topic = getTopic(state.topicId);
  if (!topic || topic.type) return;
  if (!state.articles.length) {
    refreshTopic(topic, { token: ++state.fetchToken, background: false });
    return;
  }

  const token = state.fetchToken;
  state.polling = true;
  try {
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
    pollCurrentTopic();
  }, minutes * 60 * 1000);
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

function renderPodcastsView() {
  state.listenMode = 'podcasts';
  hideFeedStates();
  setRefreshSpinning(false);
  els.feedList.hidden = false;
  els.feedSourcesDetails.hidden = true;
  els.feedUpdateStatus.hidden = !state.podcastEpisodes.length;
  els.editorialActions.hidden = true;

  const episodes = state.podcastEpisodes.slice(0, 40);
  const episodeCard = (episode) => {
    const playing = isEpisodePlaying(episode.id);
    const thumb = episode.imageUrl
      ? `<img class="episode-thumb" src="${esc(episode.imageUrl)}" alt="" loading="lazy" decoding="async">`
      : '';
    return `<article class="episode-card${playing ? ' playing' : ''}" data-episode-id="${esc(episode.id)}">
      <div class="episode-thumb-wrap">
        <span class="episode-thumb-fallback" aria-hidden="true">${esc(initialFor(episode.showName || 'Podcast'))}</span>
        ${thumb}
      </div>
      <div class="episode-body">
        <h3 class="episode-title">${esc(episode.title)}</h3>
        ${episode.description ? `<p class="episode-desc">${esc(episode.description)}</p>` : ''}
        <div class="episode-meta">
          <span>${esc(episode.showName || 'Podcast')}</span>
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

  els.feedList.innerHTML = `<div class="listen-view">
    <div class="listen-hero">
      <span class="listen-hero-kicker">Podcast</span>
      <h2>Keluar Sekejap</h2>
      <p>Khairy Jamaluddin and Shahril Hamdan on Malaysian politics, policy and current affairs — straight from the show’s own feed.</p>
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
    setStatus(`Keluar Sekejap · ${episodes.length} episodes${updated ? ` · updated ${updated}` : ''}`);
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

async function loadPodcasts({ force = false } = {}) {
  state.listenMode = 'podcasts';
  const token = state.fetchToken;
  const cacheTtl = 30 * 60 * 1000;
  let episodes = [];

  for (const show of PODCAST_SHOWS) {
    const cached = readPodcastCache(show.id);
    if (cached && (Date.now() - Number(cached.cachedAt || 0) < cacheTtl)) {
      episodes.push(...cached.episodes);
    }
  }

  if (episodes.length && !force) {
    state.podcastEpisodes = sortEpisodes(episodes);
    state.podcastLoading = false;
    renderPodcastsView();
    return;
  }

  if (!episodes.length) {
    const snapshot = await loadPodcastSnapshot();
    if (token !== state.fetchToken) return;
    const snapshotEpisodes = (snapshot?.shows || []).flatMap((show) => show.episodes || []);
    if (snapshotEpisodes.length) {
      episodes = snapshotEpisodes;
      state.podcastUpdatedAt = snapshot.updatedAt || '';
    }
  }

  if (episodes.length) {
    state.podcastEpisodes = sortEpisodes(episodes);
    state.podcastLoading = false;
    renderPodcastsView();
  } else {
    state.podcastEpisodes = [];
    state.podcastLoading = true;
    renderPodcastsView();
  }

  state.podcastLoading = !state.podcastEpisodes.length;
  setRefreshSpinning(true);
  renderPodcastsView();

  try {
    const settled = await Promise.allSettled(PODCAST_SHOWS.map((show) => fetchPodcastShow(show)));
    if (token !== state.fetchToken) return;
    const results = settled.filter((result) => result.status === 'fulfilled').map((result) => result.value);
    if (!results.length) {
      const failure = settled.find((result) => result.status === 'rejected');
      throw failure?.reason || new Error('Podcast feed unavailable');
    }
    const liveEpisodes = results.flatMap((result) => result.episodes || []);
    results.forEach((result) => {
      savePodcastCache(result.showId, {
        episodes: result.episodes,
        fetchedAt: result.fetchedAt,
      });
    });
    state.podcastEpisodes = sortEpisodes(liveEpisodes);
    state.podcastUpdatedAt = results[0]?.fetchedAt || new Date().toISOString();
    state.podcastLoading = false;
    state.podcastError = '';
    if (state.listenMode === 'podcasts') renderPodcastsView();
  } catch (error) {
    if (token !== state.fetchToken) return;
    state.podcastLoading = false;
    state.podcastError = error?.message || 'Podcast feed unavailable';
    if (state.listenMode === 'podcasts') renderPodcastsView();
    if (state.podcastEpisodes.length) showToast('Podcast refresh failed. Showing saved episodes.');
  } finally {
    if (token === state.fetchToken) setRefreshSpinning(false);
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
    loadPodcasts({ force: true });
  }
});


function findArticle(id) {
  return state.articles.find((article) => article.id === id) || null;
}

function openArticle(article) {
  if (!article) return;
  if (article.status === 'locked') {
    showToast('No archive snapshot is available for this story. The original may be paywalled.', {
      href: article.url,
      label: 'Open original ↗',
      duration: 6000,
    });
    return;
  }
  if (article.status === 'checking') {
    showToast('Still checking for an archived copy. Try again in a moment.');
    return;
  }
  rememberReturnPosition();
  window.location.assign(article.targetUrl || article.url);
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
  const card = event.target.closest('[data-card-id]');
  if (!card) return;
  const article = findArticle(card.dataset.cardId);
  if (!article) return;
  const anchor = event.target.closest('a[href]');
  if (anchor) {
    if (article.status === 'checking' || article.status === 'locked') {
      event.preventDefault();
      openArticle(article);
    } else {
      // Let the browser handle a same-tab navigation so Back returns to the feed.
      if (!(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) rememberReturnPosition();
    }
    return;
  }
  openArticle(article);
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
  if (!pill || pill.dataset.topic === state.topicId) return;
  loadTopic(pill.dataset.topic);
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

els.newStoriesBtn.addEventListener('click', applyPendingStories);
els.toastActionLink.addEventListener('click', rememberReturnPosition);

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
    if (topic && !ordered.includes(topic)) ordered.push(topic);
  }
  for (const topic of all) if (!ordered.includes(topic)) ordered.push(topic);
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
    if (strategy === 'archive_is' || strategy === 'wayback') {
      const result = await checkArchive({ url: parsed.href, strategy, domain });
      closeModal(els.quickUrlModal);
      if (result.available && result.archiveUrl) {
        rememberReturnPosition();
        window.location.assign(result.archiveUrl);
      } else {
        showToast(`No ${strategy === 'archive_is' ? 'Archive.is' : 'Wayback'} snapshot found for this story.`, {
          href: parsed.href,
          label: 'Open original ↗',
          duration: 6000,
        });
      }
    } else {
      const target = buildStrategyUrl(strategy, parsed.href);
      closeModal(els.quickUrlModal);
      rememberReturnPosition();
      window.location.assign(target);
    }
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
  showToast('Newsreader installed.');
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

document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  const settings = getSettings();
  if (!settings.autoRefresh) return;
  const minutes = Math.max(1, Number(settings.refreshMinutes) || AUTO_REFRESH_MINUTES);
  if (Date.now() - state.lastAutoPoll > minutes * 60 * 1000) pollCurrentTopic();
});

/* ------------------------------------------------------------------ */
/* Service worker                                                      */
/* ------------------------------------------------------------------ */

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed', error);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

function boot() {
  const settings = getSettings();
  state.sort = settings.sort === 'oldest' ? 'oldest' : 'newest';
  if (settings.sort !== state.sort) saveSettings({ sort: state.sort });
  state.hideLocked = Boolean(settings.hideLocked);
  els.feedSortSelect.value = state.sort;
  els.hideLockedCheckbox.checked = state.hideLocked;
  els.autoRefreshCheckbox.checked = Boolean(settings.autoRefresh);
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
    setTimeout(restoreReturnScroll, 1400);
  } else {
    renderFeed();
  }

  setInterval(() => {
    if (state.listenMode) return;
    updateVisibleTimes();
    if (!state.loading && state.articles.length && !state.pendingNewCount) updateStatusLine();
  }, 60000);
}

boot();
