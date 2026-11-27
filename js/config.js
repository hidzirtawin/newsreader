import { OUTLET_DIRECTORY } from './outletDirectory.js';

/**
 * config.js — static configuration shared by the browser app and the
 * snapshot refresh script.
 *
 * This file is intentionally dependency-free so it can be imported from
 * both `js/app.js` and `scripts/refresh.mjs`.
 */

export const STRATEGIES = {
  DIRECT: 'direct',
  SMRY: 'smry',
  REMOVEPAYWALL: 'removepaywall',
  UNWALL: 'unwall',
  FREEDIUM: 'freedium',
  READER: 'reader',
  ARCHIVE_IS: 'archive_is',
  ARCHIVE_PH: 'archive_ph',
  WAYBACK: 'wayback',
  WALLHOP: 'wallhop',
  GOOGLE_TRANSLATE: 'google_translate',
  PRINTFRIENDLY: 'printfriendly',
};

export const STRATEGY_META = {
  direct: {
    label: 'Free / Direct',
    short: 'Free',
    badge: 'Free',
    status: 'free',
    desc: 'Open the publisher page directly. Best for free and openly accessible sites.',
  },
  smry: {
    label: 'SMRY.ai',
    short: 'SMRY',
    badge: 'SMRY',
    status: 'bypassed',
    desc: 'Open a clean summary and reader view through smry.ai.',
  },
  removepaywall: {
    label: 'RemovePaywall',
    short: 'Bypass',
    badge: 'Bypass',
    status: 'bypassed',
    desc: 'Try a multi-engine paywall cleaner through removepaywall.com.',
  },
  unwall: {
    label: 'UnWall',
    short: 'UnWall',
    badge: 'UnWall',
    status: 'bypassed',
    desc: 'Open a reader proxy through unwall.app.',
  },
  freedium: {
    label: 'Freedium',
    short: 'Freedium',
    badge: 'Freedium',
    status: 'bypassed',
    desc: 'Open a mirrored reader view through Freedium.',
  },
  reader: {
    label: 'Reader Mode',
    short: 'Reader',
    badge: 'Reader',
    status: 'bypassed',
    desc: 'Open a text-only reader view of the article with Jina Reader.',
  },
  wallhop: {
    label: 'WallHop',
    short: 'WallHop',
    badge: 'WallHop',
    status: 'bypassed',
    desc: 'Use WallHop’s cleaned article view, with archive fallbacks.',
  },
  archive_ph: {
    label: 'Archive.today (archive.ph)',
    short: 'Archive.ph',
    badge: 'Archive',
    status: 'checking',
    desc: 'Open an Archive.today snapshot. Stories without a snapshot are locked.',
    locks: true,
  },
  google_translate: {
    label: 'Google Translate proxy',
    short: 'Translate',
    badge: 'Translate',
    status: 'bypassed',
    desc: 'Read through Google’s translated page proxy.',
  },
  printfriendly: {
    label: 'PrintFriendly',
    short: 'Print',
    badge: 'Print',
    status: 'bypassed',
    desc: 'Open a print-friendly text view.',
  },
  archive_is: {
    label: 'Archive.is',
    short: 'Archive',
    badge: 'Archive',
    status: 'checking',
    desc: 'Check Archive.is for a saved copy. Stories with no snapshot are locked.',
    locks: true,
  },
  wayback: {
    label: 'Wayback Machine',
    short: 'Wayback',
    badge: 'Wayback',
    status: 'checking',
    desc: 'Check the Internet Archive for a saved copy. Stories with no snapshot are locked.',
    locks: true,
  },
};

/**
 * Curated strategy registry. The values are facts about how each publisher
 * is typically reached, not copied implementation code.
 */
export const DEFAULT_RULES = {
  // Open web — direct
  'bbc.com': { strategy: 'direct', paywall: 'none', label: 'BBC News' },
  'bbc.co.uk': { strategy: 'direct', paywall: 'none', label: 'BBC News' },
  'cbc.ca': { strategy: 'direct', paywall: 'none', label: 'CBC News' },
  'npr.org': { strategy: 'direct', paywall: 'none', label: 'NPR' },
  'theguardian.com': { strategy: 'direct', paywall: 'banner', label: 'The Guardian' },
  'aljazeera.com': { strategy: 'direct', paywall: 'none', label: 'Al Jazeera' },
  'apnews.com': { strategy: 'direct', paywall: 'none', label: 'Associated Press' },
  'cnn.com': { strategy: 'direct', paywall: 'none', label: 'CNN' },
  'cnbc.com': { strategy: 'direct', paywall: 'none', label: 'CNBC' },
  'investing.com': { strategy: 'direct', paywall: 'none', label: 'Investing.com' },
  'arstechnica.com': { strategy: 'direct', paywall: 'none', label: 'Ars Technica' },
  'theverge.com': { strategy: 'direct', paywall: 'none', label: 'The Verge' },
  'techcrunch.com': { strategy: 'direct', paywall: 'none', label: 'TechCrunch' },
  'engadget.com': { strategy: 'direct', paywall: 'none', label: 'Engadget' },
  'globalnews.ca': { strategy: 'direct', paywall: 'none', label: 'Global News' },
  'ctvnews.ca': { strategy: 'direct', paywall: 'none', label: 'CTV News' },
  'thestar.com': { strategy: 'direct', paywall: 'none', label: 'Toronto Star' },
  'theglobeandmail.com': { strategy: 'smry', paywall: 'metered', label: 'The Globe and Mail' },
  'sciencedaily.com': { strategy: 'direct', paywall: 'none', label: 'ScienceDaily' },
  'nature.com': { strategy: 'direct', paywall: 'metered', label: 'Nature' },
  'nasa.gov': { strategy: 'direct', paywall: 'none', label: 'NASA' },
  'space.com': { strategy: 'direct', paywall: 'none', label: 'Space.com' },
  'espn.com': { strategy: 'direct', paywall: 'none', label: 'ESPN' },
  'variety.com': { strategy: 'direct', paywall: 'none', label: 'Variety' },
  'hollywoodreporter.com': { strategy: 'direct', paywall: 'soft', label: 'The Hollywood Reporter' },
  'billboard.com': { strategy: 'direct', paywall: 'soft', label: 'Billboard' },
  'rollingstone.com': { strategy: 'direct', paywall: 'metered', label: 'Rolling Stone' },
  'refinery29.com': { strategy: 'direct', paywall: 'none', label: 'Refinery29' },
  'politico.com': { strategy: 'direct', paywall: 'none', label: 'Politico' },
  'usatoday.com': { strategy: 'direct', paywall: 'metered', label: 'USA Today' },
  'time.com': { strategy: 'direct', paywall: 'metered', label: 'TIME' },
  'vox.com': { strategy: 'direct', paywall: 'none', label: 'Vox' },
  'nationalpost.com': { strategy: 'direct', paywall: 'metered', label: 'National Post' },
  'japantimes.co.jp': { strategy: 'direct', paywall: 'metered', label: 'The Japan Times' },
  'dw.com': { strategy: 'direct', paywall: 'none', label: 'Deutsche Welle' },
  'france24.com': { strategy: 'direct', paywall: 'none', label: 'France 24' },
  'lemonde.fr': { strategy: 'direct', paywall: 'metered', label: 'Le Monde' },
  'abc.net.au': { strategy: 'direct', paywall: 'none', label: 'ABC News Australia' },
  'sbs.com.au': { strategy: 'direct', paywall: 'none', label: 'SBS News' },
  'channelnewsasia.com': { strategy: 'direct', paywall: 'none', label: 'CNA' },
  'mothership.sg': { strategy: 'direct', paywall: 'none', label: 'Mothership' },
  'bharian.com.my': { strategy: 'direct', paywall: 'none', label: 'Berita Harian' },
  'nst.com.my': { strategy: 'direct', paywall: 'none', label: 'New Straits Times' },
  'freemalaysiatoday.com': { strategy: 'direct', paywall: 'none', label: 'Free Malaysia Today' },
  'utusan.com.my': { strategy: 'direct', paywall: 'none', label: 'Utusan Malaysia' },
  'kosmo.com.my': { strategy: 'direct', paywall: 'none', label: 'Kosmo!' },
  'cbsnews.com': { strategy: 'direct', paywall: 'none', label: 'CBS News' },
  'news.sky.com': { strategy: 'direct', paywall: 'none', label: 'Sky News' },
  'reuters.com': { strategy: 'direct', paywall: 'metered', label: 'Reuters' },
  'nbcnews.com': { strategy: 'direct', paywall: 'none', label: 'NBC News' },
  'foxnews.com': { strategy: 'direct', paywall: 'none', label: 'Fox News' },
  'independent.co.uk': { strategy: 'direct', paywall: 'none', label: 'The Independent' },
  'smh.com.au': { strategy: 'smry', paywall: 'metered', label: 'The Sydney Morning Herald' },
  '7news.com.au': { strategy: 'direct', paywall: 'none', label: '7NEWS' },
  'cgtn.com': { strategy: 'direct', paywall: 'none', label: 'CGTN' },
  'globaltimes.cn': { strategy: 'direct', paywall: 'none', label: 'Global Times' },
  'en.people.cn': { strategy: 'direct', paywall: 'none', label: "People's Daily" },
  'sixthtone.com': { strategy: 'direct', paywall: 'none', label: 'Sixth Tone' },
  'themoscowtimes.com': { strategy: 'direct', paywall: 'none', label: 'The Moscow Times' },
  'tass.com': { strategy: 'direct', paywall: 'none', label: 'TASS' },
  'meduza.io': { strategy: 'direct', paywall: 'none', label: 'Meduza' },
  'rt.com': { strategy: 'direct', paywall: 'none', label: 'RT' },
  'cbssports.com': { strategy: 'direct', paywall: 'none', label: 'CBS Sports' },
  'espncricinfo.com': { strategy: 'direct', paywall: 'none', label: 'ESPNcricinfo' },
  'boxingscene.com': { strategy: 'direct', paywall: 'none', label: 'BoxingScene' },
  'boxingnews.com': { strategy: 'direct', paywall: 'none', label: 'Boxing News' },
  'sherdog.com': { strategy: 'direct', paywall: 'none', label: 'Sherdog' },
  'mmafighting.com': { strategy: 'direct', paywall: 'none', label: 'MMA Fighting' },
  'autosport.com': { strategy: 'direct', paywall: 'none', label: 'Autosport' },
  'premiumtimesng.com': { strategy: 'direct', paywall: 'none', label: 'Premium Times' },
  'folha.uol.com.br': { strategy: 'direct', paywall: 'metered', label: 'Folha de S.Paulo' },
  'oglobo.globo.com': { strategy: 'direct', paywall: 'metered', label: 'O Globo' },
  'clarin.com': { strategy: 'direct', paywall: 'metered', label: 'Clarín' },
  'lanacion.com.ar': { strategy: 'direct', paywall: 'metered', label: 'La Nación' },
  'spiegel.de': { strategy: 'smry', paywall: 'metered', label: 'Der Spiegel' },
  'zeit.de': { strategy: 'smry', paywall: 'metered', label: 'Die Zeit' },
  'corriere.it': { strategy: 'smry', paywall: 'metered', label: 'Corriere della Sera' },
  'repubblica.it': { strategy: 'smry', paywall: 'metered', label: 'la Repubblica' },
  'elmundo.es': { strategy: 'smry', paywall: 'metered', label: 'El Mundo' },
  'politico.eu': { strategy: 'direct', paywall: 'none', label: 'Politico Europe' },
  'euobserver.com': { strategy: 'direct', paywall: 'none', label: 'EUobserver' },
  'foreignpolicy.com': { strategy: 'smry', paywall: 'metered', label: 'Foreign Policy' },
  'foreignaffairs.com': { strategy: 'smry', paywall: 'metered', label: 'Foreign Affairs' },
  'en.yna.co.kr': { strategy: 'direct', paywall: 'none', label: 'Yonhap News' },
  'philstar.com': { strategy: 'direct', paywall: 'none', label: 'The Philippine Star' },
  'thediplomat.com': { strategy: 'direct', paywall: 'none', label: 'The Diplomat' },
  'rnz.co.nz': { strategy: 'direct', paywall: 'none', label: 'RNZ' },
  'ndtv.com': { strategy: 'direct', paywall: 'none', label: 'NDTV' },
  'livemint.com': { strategy: 'smry', paywall: 'metered', label: 'Mint' },
  'business-standard.com': { strategy: 'direct', paywall: 'none', label: 'Business Standard' },
  'businessinsider.com': { strategy: 'removepaywall', paywall: 'soft', label: 'Business Insider' },
  'theage.com.au': { strategy: 'smry', paywall: 'metered', label: 'The Age' },
  'examiner.com.au': { strategy: 'direct', paywall: 'none', label: 'The Examiner' },
  'thewest.com.au': { strategy: 'smry', paywall: 'hard', label: 'The West Australian' },
  'thenightly.com.au': { strategy: 'direct', paywall: 'none', label: 'The Nightly' },
  'codesports.com.au': { strategy: 'smry', paywall: 'hard', label: 'CODE Sports' },
  'dailytelegraph.com.au': { strategy: 'smry', paywall: 'hard', label: 'The Daily Telegraph' },
  'thehill.com': { strategy: 'direct', paywall: 'none', label: 'The Hill' },
  'euronews.com': { strategy: 'direct', paywall: 'none', label: 'Euronews' },
  'taipeitimes.com': { strategy: 'direct', paywall: 'none', label: 'Taipei Times' },
  'indianexpress.com': { strategy: 'direct', paywall: 'none', label: 'The Indian Express' },
  'timesofindia.indiatimes.com': { strategy: 'direct', paywall: 'none', label: 'The Times of India' },
  'arabnews.com': { strategy: 'direct', paywall: 'none', label: 'Arab News' },
  'jpost.com': { strategy: 'direct', paywall: 'none', label: 'The Jerusalem Post' },
  'elpais.com': { strategy: 'direct', paywall: 'metered', label: 'El País' },

  // Metered / regional subscriptions — reader tools
  'straitstimes.com': { strategy: 'smry', paywall: 'metered', label: 'The Straits Times' },
  'beritaharian.sg': { strategy: 'smry', paywall: 'metered', label: 'Berita Harian Singapore' },
  'businesstimes.com.sg': { strategy: 'smry', paywall: 'metered', label: 'The Business Times' },
  'heraldsun.com.au': { strategy: 'smry', paywall: 'hard', label: 'Herald Sun' },
  'theaustralian.com.au': { strategy: 'smry', paywall: 'hard', label: 'The Australian' },
  'scmp.com': { strategy: 'smry', paywall: 'metered', label: 'South China Morning Post' },
  'asia.nikkei.com': { strategy: 'smry', paywall: 'hard', label: 'Nikkei Asia' },
  'latimes.com': { strategy: 'smry', paywall: 'metered', label: 'Los Angeles Times' },

  // Soft / metered paywalls — reader tools
  'nytimes.com': { strategy: 'smry', paywall: 'metered', label: 'The New York Times' },
  'washingtonpost.com': { strategy: 'smry', paywall: 'metered', label: 'The Washington Post' },
  'theatlantic.com': { strategy: 'smry', paywall: 'metered', label: 'The Atlantic' },
  'newyorker.com': { strategy: 'smry', paywall: 'metered', label: 'The New Yorker' },
  'vancouversun.com': { strategy: 'smry', paywall: 'metered', label: 'Vancouver Sun' },
  'theprovince.com': { strategy: 'smry', paywall: 'metered', label: 'The Province' },
  'timescolonist.com': { strategy: 'smry', paywall: 'metered', label: 'Times Colonist' },

  // Cleaner / proxy tools
  'wired.com': { strategy: 'removepaywall', paywall: 'metered', label: 'WIRED' },
  'businessinsider.com': { strategy: 'removepaywall', paywall: 'soft', label: 'Business Insider' },
  'forbes.com': { strategy: 'removepaywall', paywall: 'soft', label: 'Forbes' },
  'fortune.com': { strategy: 'removepaywall', paywall: 'metered', label: 'Fortune' },
  'medium.com': { strategy: 'freedium', paywall: 'metered', label: 'Medium' },

  // Hard paywalls — reader first; archive verification remains available per site
  'wsj.com': { strategy: 'smry', paywall: 'hard', label: 'The Wall Street Journal' },
  'bloomberg.com': { strategy: 'smry', paywall: 'hard', label: 'Bloomberg' },
  'ft.com': { strategy: 'smry', paywall: 'hard', label: 'Financial Times' },
  'economist.com': { strategy: 'smry', paywall: 'hard', label: 'The Economist' },
  'telegraph.co.uk': { strategy: 'smry', paywall: 'hard', label: 'The Telegraph' },
  'thetimes.com': { strategy: 'smry', paywall: 'hard', label: 'The Times' },
  'barrons.com': { strategy: 'archive_is', paywall: 'hard', label: "Barron's" },
  'theinformation.com': { strategy: 'archive_is', paywall: 'hard', label: 'The Information' },
};

// Publishers that block full-text readers. They remain available in the Briefs
// desk, but are kept out of the main feeds unless the reader opts in.
export const BRIEF_ONLY_DOMAINS = [
  'nytimes.com',
  'bloomberg.com',
  'ft.com',
  'wsj.com',
  'heraldsun.com.au',
  'theaustralian.com.au',
  'thewest.com.au',
  'codesports.com.au',
  'dailytelegraph.com.au',
  'economist.com',
  'telegraph.co.uk',
  'thetimes.com',
  'straitstimes.com',
  'theglobeandmail.com',
  'washingtonpost.com',
  'latimes.com',
  'businessinsider.com',
];

// These publishers currently yield full readable text through WallHop.
export const WALLHOP_DOMAINS = [
  'nytimes.com',
  'ft.com',
  'wsj.com',
  'telegraph.co.uk',
  'thetimes.com',
  'smh.com.au',
  'theage.com.au',
  'businessinsider.com',
];

export const FEEDS = [
  { id: 'bbc-news', name: 'BBC News', domain: 'bbc.com', group: 'General', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
  { id: 'bbc-world', name: 'BBC World', domain: 'bbc.com', group: 'World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { id: 'bbc-tech', name: 'BBC Technology', domain: 'bbc.com', group: 'Technology', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },
  { id: 'bbc-sport', name: 'BBC Sport', domain: 'bbc.com', group: 'Sports', url: 'https://feeds.bbci.co.uk/sport/rss.xml' },
  { id: 'cbc-top', name: 'CBC News', domain: 'cbc.ca', group: 'Canada', url: 'https://www.cbc.ca/webfeed/rss/rss-topstories' },
  { id: 'cbc-canada', name: 'CBC Canada', domain: 'cbc.ca', group: 'Canada', url: 'https://www.cbc.ca/webfeed/rss/rss-canada' },
  { id: 'cbc-world', name: 'CBC World', domain: 'cbc.ca', group: 'Canada', url: 'https://www.cbc.ca/webfeed/rss/rss-world' },
  { id: 'cbc-politics', name: 'CBC Politics', domain: 'cbc.ca', group: 'Canada', url: 'https://www.cbc.ca/webfeed/rss/rss-politics' },
  { id: 'cbc-tech', name: 'CBC Technology', domain: 'cbc.ca', group: 'Technology', url: 'https://www.cbc.ca/webfeed/rss/rss-technology' },
  { id: 'cbc-sports', name: 'CBC Sports', domain: 'cbc.ca', group: 'Sports', url: 'https://www.cbc.ca/webfeed/rss/rss-sports' },
  { id: 'global-news', name: 'Global News', domain: 'globalnews.ca', group: 'Canada', url: 'https://globalnews.ca/feed/' },
  { id: 'global-bc', name: 'Global News BC', domain: 'globalnews.ca', group: 'Canada', url: 'https://globalnews.ca/bc/feed/' },
  { id: 'vancouver-sun', name: 'Vancouver Sun', domain: 'vancouversun.com', group: 'Canada', url: 'https://vancouversun.com/feed/' },
  { id: 'guardian-world', name: 'The Guardian World', domain: 'theguardian.com', group: 'World', url: 'https://www.theguardian.com/world/rss' },
  { id: 'guardian-business', name: 'The Guardian Business', domain: 'theguardian.com', group: 'Business', url: 'https://www.theguardian.com/business/rss' },
  { id: 'guardian-politics', name: 'The Guardian Politics', domain: 'theguardian.com', group: 'Politics', url: 'https://www.theguardian.com/politics/rss' },
  { id: 'guardian-science', name: 'The Guardian Science', domain: 'theguardian.com', group: 'Science', url: 'https://www.theguardian.com/science/rss' },
  { id: 'guardian-sport', name: 'The Guardian Sport', domain: 'theguardian.com', group: 'Sports', url: 'https://www.theguardian.com/sport/rss' },
  { id: 'guardian-culture', name: 'The Guardian Culture', domain: 'theguardian.com', group: 'Entertainment', url: 'https://www.theguardian.com/culture/rss' },
  { id: 'guardian-life', name: 'The Guardian Lifestyle', domain: 'theguardian.com', group: 'Lifestyle', url: 'https://www.theguardian.com/lifeandstyle/rss' },
  { id: 'npr-news', name: 'NPR News', domain: 'npr.org', group: 'General', url: 'https://feeds.npr.org/1001/rss.xml' },
  { id: 'npr-politics', name: 'NPR Politics', domain: 'npr.org', group: 'Politics', url: 'https://feeds.npr.org/1014/rss.xml' },
  { id: 'aljazeera', name: 'Al Jazeera', domain: 'aljazeera.com', group: 'World', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { id: 'nyt-world', name: 'NYT World', domain: 'nytimes.com', group: 'World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
  { id: 'nyt-tech', name: 'NYT Technology', domain: 'nytimes.com', group: 'Technology', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml' },
  { id: 'atlantic', name: 'The Atlantic', domain: 'theatlantic.com', group: 'General', url: 'https://www.theatlantic.com/feed/all/' },
  { id: 'economist', name: 'The Economist', domain: 'economist.com', group: 'Business', url: 'https://www.economist.com/finance-and-economics/rss.xml' },
  { id: 'wsj-world', name: 'WSJ World', domain: 'wsj.com', group: 'World', url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml' },
  { id: 'ft-home', name: 'Financial Times', domain: 'ft.com', group: 'Business', url: 'https://www.ft.com/rss/home' },
  { id: 'wired', name: 'WIRED', domain: 'wired.com', group: 'Technology', url: 'https://www.wired.com/feed/rss' },
  { id: 'ars', name: 'Ars Technica', domain: 'arstechnica.com', group: 'Technology', url: 'https://feeds.arstechnica.com/arstechnica/index' },
  { id: 'verge', name: 'The Verge', domain: 'theverge.com', group: 'Technology', url: 'https://www.theverge.com/rss/index.xml' },
  { id: 'verge-ai', name: 'The Verge AI', domain: 'theverge.com', group: 'AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
  { id: 'techcrunch', name: 'TechCrunch', domain: 'techcrunch.com', group: 'Technology', url: 'https://techcrunch.com/feed/' },
  { id: 'techcrunch-ai', name: 'TechCrunch AI', domain: 'techcrunch.com', group: 'AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { id: 'mit-tr', name: 'MIT Technology Review', domain: 'technologyreview.com', group: 'AI', url: 'https://www.technologyreview.com/feed/' },
  { id: 'engadget', name: 'Engadget', domain: 'engadget.com', group: 'Technology', url: 'https://www.engadget.com/rss.xml' },
  { id: 'cnbc', name: 'CNBC', domain: 'cnbc.com', group: 'Business', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
  { id: 'investing', name: 'Investing.com', domain: 'investing.com', group: 'Finance', url: 'https://www.investing.com/rss/news.rss' },
  { id: 'sciencedaily', name: 'ScienceDaily', domain: 'sciencedaily.com', group: 'Science', url: 'https://www.sciencedaily.com/rss/top/science.xml' },
  { id: 'nature', name: 'Nature', domain: 'nature.com', group: 'Science', url: 'https://www.nature.com/nature.rss' },
  { id: 'nasa', name: 'NASA', domain: 'nasa.gov', group: 'Science', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss' },
  { id: 'space', name: 'Space.com', domain: 'space.com', group: 'Science', url: 'https://www.space.com/feeds/all' },
  { id: 'espn', name: 'ESPN', domain: 'espn.com', group: 'Sports', url: 'https://www.espn.com/espn/rss/news' },
  { id: 'variety', name: 'Variety', domain: 'variety.com', group: 'Entertainment', url: 'https://variety.com/feed/' },
  { id: 'hollywood-reporter', name: 'The Hollywood Reporter', domain: 'hollywoodreporter.com', group: 'Entertainment', url: 'https://www.hollywoodreporter.com/feed/' },
  { id: 'billboard', name: 'Billboard', domain: 'billboard.com', group: 'Entertainment', url: 'https://www.billboard.com/feed/' },
  { id: 'rollingstone', name: 'Rolling Stone', domain: 'rollingstone.com', group: 'Entertainment', url: 'https://www.rollingstone.com/feed/' },
  { id: 'refinery29', name: 'Refinery29', domain: 'refinery29.com', group: 'Lifestyle', url: 'https://www.refinery29.com/en-us/rss.xml' },

  // Australia
  { id: 'abc-au', name: 'ABC News Australia', domain: 'abc.net.au', group: 'Australia', url: 'https://www.abc.net.au/news/feed/51120/rss.xml' },
  { id: 'guardian-au', name: 'Guardian Australia', domain: 'theguardian.com', group: 'Australia', url: 'https://www.theguardian.com/australia-news/rss' },
  { id: 'sbs-au', name: 'SBS News', domain: 'sbs.com.au', group: 'Australia', url: 'https://www.sbs.com.au/news/feed' },

  // Singapore
  { id: 'straitstimes-sg', name: 'The Straits Times · Singapore', domain: 'straitstimes.com', group: 'Singapore', url: 'https://www.straitstimes.com/news/singapore/rss.xml' },
  { id: 'straitstimes-world', name: 'The Straits Times · World', domain: 'straitstimes.com', group: 'Singapore', url: 'https://www.straitstimes.com/news/world/rss.xml' },
  { id: 'straitstimes-asia', name: 'The Straits Times · Asia', domain: 'straitstimes.com', group: 'Singapore', url: 'https://www.straitstimes.com/news/asia/rss.xml' },
  { id: 'straitstimes-business', name: 'The Straits Times · Business', domain: 'straitstimes.com', group: 'Singapore', url: 'https://www.straitstimes.com/news/business/rss.xml' },
  { id: 'cna', name: 'CNA', domain: 'channelnewsasia.com', group: 'Singapore', url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml' },
  { id: 'mothership', name: 'Mothership', domain: 'mothership.sg', group: 'Singapore', url: 'https://mothership.sg/feed/' },
  { id: 'beritaharian-sg', name: 'Berita Harian (Singapore)', domain: 'beritaharian.sg', group: 'Singapore', url: 'https://www.beritaharian.sg/rss.xml' },
  { id: 'business-times-sg', name: 'The Business Times', domain: 'businesstimes.com.sg', group: 'Singapore', url: 'https://www.businesstimes.com.sg/rss/top-stories' },

  // Malaysia
  { id: 'berita-harian', name: 'Berita Harian', domain: 'bharian.com.my', group: 'Malaysia', url: 'https://www.bharian.com.my/feed' },
  { id: 'nst', name: 'New Straits Times', domain: 'nst.com.my', group: 'Malaysia', url: 'https://www.nst.com.my/feed' },
  { id: 'fmt', name: 'Free Malaysia Today', domain: 'freemalaysiatoday.com', group: 'Malaysia', url: 'https://www.freemalaysiatoday.com/feed/' },
  { id: 'utusan', name: 'Utusan Malaysia', domain: 'utusan.com.my', group: 'Malaysia', url: 'https://www.utusan.com.my/feed/' },
  { id: 'kosmo', name: 'Kosmo!', domain: 'kosmo.com.my', group: 'Malaysia', url: 'https://www.kosmo.com.my/feed/' },

  // Wider Asia
  { id: 'scmp', name: 'South China Morning Post', domain: 'scmp.com', group: 'Asia', url: 'https://www.scmp.com/rss/91/feed' },
  { id: 'scmp-china', name: 'SCMP China', domain: 'scmp.com', group: 'Asia', url: 'https://www.scmp.com/rss/4/feed' },
  { id: 'nikkei', name: 'Nikkei Asia', domain: 'asia.nikkei.com', group: 'Asia', url: 'https://asia.nikkei.com/rss/feed/nar' },

  // United States
  { id: 'cbs', name: 'CBS News', domain: 'cbsnews.com', group: 'United States', url: 'https://www.cbsnews.com/latest/rss/main' },
  { id: 'latimes', name: 'Los Angeles Times', domain: 'latimes.com', group: 'United States', url: 'https://www.latimes.com/world-nation/rss2.0.xml' },
  { id: 'nyt-us', name: 'NYT U.S.', domain: 'nytimes.com', group: 'United States', url: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml' },

  // United Kingdom
  { id: 'bbc-uk', name: 'BBC UK', domain: 'bbc.com', group: 'United Kingdom', url: 'https://feeds.bbci.co.uk/news/uk/rss.xml' },
  { id: 'guardian-uk', name: 'Guardian UK', domain: 'theguardian.com', group: 'United Kingdom', url: 'https://www.theguardian.com/uk-news/rss' },
  { id: 'sky-uk', name: 'Sky News UK', domain: 'news.sky.com', group: 'United Kingdom', url: 'https://feeds.skynews.com/feeds/rss/uk.xml' },

  // Major wires and global desks
  { id: 'reuters', name: 'Reuters', domain: 'reuters.com', group: 'Wires', url: 'https://news.google.com/rss/search?q=site%3Areuters.com+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'ap', name: 'Associated Press', domain: 'apnews.com', group: 'Wires', url: 'https://news.google.com/rss/search?q=site%3Aapnews.com+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'bloomberg-markets', name: 'Bloomberg Markets', domain: 'bloomberg.com', group: 'Business', url: 'https://feeds.bloomberg.com/markets/news.rss' },
  { id: 'bloomberg-politics', name: 'Bloomberg Politics', domain: 'bloomberg.com', group: 'Politics', url: 'https://feeds.bloomberg.com/politics/news.rss' },
  { id: 'cnn', name: 'CNN', domain: 'cnn.com', group: 'World', url: 'https://news.google.com/rss/search?q=site%3Acnn.com+when%3A1d&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'abc-us', name: 'ABC News (US)', domain: 'abcnews.go.com', group: 'United States', url: 'https://abcnews.go.com/abcnews/topstories' },
  { id: 'politico', name: 'Politico', domain: 'politico.com', group: 'Politics', url: 'https://rss.politico.com/politics-news.xml' },
  { id: 'the-hill', name: 'The Hill', domain: 'thehill.com', group: 'Politics', url: 'https://thehill.com/feed/' },
  { id: 'euronews', name: 'Euronews', domain: 'euronews.com', group: 'Europe', url: 'https://www.euronews.com/rss?level=theme&name=news' },
  { id: 'dw', name: 'Deutsche Welle', domain: 'dw.com', group: 'Europe', url: 'https://rss.dw.com/rdf/rss-en-world' },
  { id: 'france24', name: 'France 24', domain: 'france24.com', group: 'Europe', url: 'https://www.france24.com/en/rss' },
  { id: 'japan-times', name: 'The Japan Times', domain: 'japantimes.co.jp', group: 'Asia', url: 'https://www.japantimes.co.jp/feed/' },
  { id: 'taipei-times', name: 'Taipei Times', domain: 'taipeitimes.com', group: 'Asia', url: 'https://www.taipeitimes.com/xml/index.rss' },
  { id: 'indian-express', name: 'The Indian Express', domain: 'indianexpress.com', group: 'India', url: 'https://news.google.com/rss/search?q=site%3Aindianexpress.com+when%3A2d&hl=en-IN&gl=IN&ceid=IN%3Aen', googleNews: true },
  { id: 'times-of-india', name: 'The Times of India', domain: 'timesofindia.indiatimes.com', group: 'India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' },
  { id: 'arab-news', name: 'Arab News', domain: 'arabnews.com', group: 'Middle East', url: 'https://www.arabnews.com/rss.xml' },
  { id: 'jpost', name: 'The Jerusalem Post', domain: 'jpost.com', group: 'Middle East', url: 'https://www.jpost.com/rss/rssfeedsfrontpage.aspx' },
  { id: 'el-pais', name: 'El País', domain: 'elpais.com', group: 'Europe', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' },

  // Australian mastheads (News Corp feeds are blocked, so use the publisher's Google News index)
  { id: 'herald-sun', name: 'Herald Sun', domain: 'heraldsun.com.au', group: 'Australia', url: 'https://news.google.com/rss/search?q=site%3Aheraldsun.com.au&hl=en-AU&gl=AU&ceid=AU%3Aen', googleNews: true },
  { id: 'the-australian', name: 'The Australian', domain: 'theaustralian.com.au', group: 'Australia', url: 'https://news.google.com/rss/search?q=site%3Atheaustralian.com.au&hl=en-AU&gl=AU&ceid=AU%3Aen', googleNews: true },

  // NYT and The Economist desks
  { id: 'nyt-business', name: 'NYT Business', domain: 'nytimes.com', group: 'Business', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml' },
  { id: 'nyt-politics', name: 'NYT Politics', domain: 'nytimes.com', group: 'Politics', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml' },
  { id: 'economist-latest', name: 'The Economist', domain: 'economist.com', group: 'Business', url: 'https://www.economist.com/latest/rss.xml' },

  { id: 'bbc-europe', name: 'BBC Europe', domain: 'bbc.com', group: 'Europe', url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml' },
  { id: 'bbc-middle-east', name: 'BBC Middle East', domain: 'bbc.com', group: 'Middle East', url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml' },
  { id: 'bbc-india', name: 'BBC India', domain: 'bbc.com', group: 'India', url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml' },

  // Additional major mastheads via their Google News index (publisher feeds are blocked)
  { id: 'washington-post', name: 'The Washington Post', domain: 'washingtonpost.com', group: 'United States', url: 'https://news.google.com/rss/search?q=site%3Awashingtonpost.com+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'nbc-news', name: 'NBC News', domain: 'nbcnews.com', group: 'United States', url: 'https://news.google.com/rss/search?q=site%3Anbcnews.com+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'fox-news', name: 'Fox News', domain: 'foxnews.com', group: 'United States', url: 'https://news.google.com/rss/search?q=site%3Afoxnews.com+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'usa-today', name: 'USA Today', domain: 'usatoday.com', group: 'United States', url: 'https://news.google.com/rss/search?q=site%3Ausatoday.com+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'the-times', name: 'The Times', domain: 'thetimes.com', group: 'United Kingdom', url: 'https://news.google.com/rss/search?q=site%3Athetimes.com+when%3A2d&hl=en-GB&gl=GB&ceid=GB%3Aen', googleNews: true },
  { id: 'telegraph', name: 'The Telegraph', domain: 'telegraph.co.uk', group: 'United Kingdom', url: 'https://news.google.com/rss/search?q=site%3Atelegraph.co.uk+when%3A2d&hl=en-GB&gl=GB&ceid=GB%3Aen', googleNews: true },
  { id: 'independent', name: 'The Independent', domain: 'independent.co.uk', group: 'United Kingdom', url: 'https://news.google.com/rss/search?q=site%3Aindependent.co.uk+when%3A2d&hl=en-GB&gl=GB&ceid=GB%3Aen', googleNews: true },
  { id: 'smh', name: 'The Sydney Morning Herald', domain: 'smh.com.au', group: 'Australia', url: 'https://news.google.com/rss/search?q=site%3Asmh.com.au+when%3A2d&hl=en-AU&gl=AU&ceid=AU%3Aen', googleNews: true },
  { id: 'globe-mail', name: 'The Globe and Mail', domain: 'theglobeandmail.com', group: 'Canada', url: 'https://news.google.com/rss/search?q=site%3Atheglobeandmail.com+when%3A2d&hl=en-CA&gl=CA&ceid=CA%3Aen', googleNews: true },

  // Australia
  { id: '7news', name: '7NEWS', domain: '7news.com.au', group: 'Australia', url: 'https://7news.com.au/news/rss' },

  // China (English-language)
  { id: 'bbc-china', name: 'BBC China', domain: 'bbc.com', group: 'China', url: 'https://feeds.bbci.co.uk/news/world/asia/china/rss.xml' },
  { id: 'cgtn', name: 'CGTN China', domain: 'cgtn.com', group: 'China', url: 'https://www.cgtn.com/subscribe/rss/section/china.xml' },
  { id: 'global-times', name: 'Global Times', domain: 'globaltimes.cn', group: 'China', url: 'https://news.google.com/rss/search?q=site%3Aglobaltimes.cn&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'peoples-daily', name: "People's Daily", domain: 'en.people.cn', group: 'China', url: 'https://news.google.com/rss/search?q=site%3Aen.people.cn&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'sixth-tone', name: 'Sixth Tone', domain: 'sixthtone.com', group: 'China', url: 'https://www.sixthtone.com/rss' },

  // Russia (English-language, state and independent)
  { id: 'moscow-times', name: 'The Moscow Times', domain: 'themoscowtimes.com', group: 'Russia', url: 'https://www.themoscowtimes.com/rss/news' },
  { id: 'tass', name: 'TASS', domain: 'tass.com', group: 'Russia', url: 'https://tass.com/rss/v2.xml' },
  { id: 'meduza', name: 'Meduza', domain: 'meduza.io', group: 'Russia', url: 'https://meduza.io/rss/en/all' },
  { id: 'rt', name: 'RT', domain: 'rt.com', group: 'Russia', url: 'https://www.rt.com/rss/' },
  // Sport desks
  { id: 'cbssports', name: 'CBS Sports', domain: 'cbssports.com', group: 'Sport', url: 'https://www.cbssports.com/rss/headlines/' },
  { id: 'bbc-football', name: 'BBC Football', domain: 'bbc.com', group: 'Football', url: 'https://feeds.bbci.co.uk/sport/football/rss.xml' },
  { id: 'guardian-football', name: 'Guardian Football', domain: 'theguardian.com', group: 'Football', url: 'https://www.theguardian.com/football/rss' },
  { id: 'bbc-cricket', name: 'BBC Cricket', domain: 'bbc.com', group: 'Cricket', url: 'https://feeds.bbci.co.uk/sport/cricket/rss.xml' },
  { id: 'guardian-cricket', name: 'Guardian Cricket', domain: 'theguardian.com', group: 'Cricket', url: 'https://www.theguardian.com/sport/cricket/rss' },
  { id: 'espncricinfo', name: 'ESPNcricinfo', domain: 'espncricinfo.com', group: 'Cricket', url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml' },
  { id: 'toi-cricket', name: 'Times of India Cricket', domain: 'timesofindia.indiatimes.com', group: 'Cricket', url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms' },
  { id: 'bbc-rugby-league', name: 'BBC Rugby League', domain: 'bbc.com', group: 'Rugby League', url: 'https://feeds.bbci.co.uk/sport/rugby-league/rss.xml' },
  { id: 'guardian-rugby-league', name: 'Guardian Rugby League', domain: 'theguardian.com', group: 'Rugby League', url: 'https://www.theguardian.com/sport/rugbyleague/rss' },
  { id: 'bbc-rugby-union', name: 'BBC Rugby Union', domain: 'bbc.com', group: 'Rugby Union', url: 'https://feeds.bbci.co.uk/sport/rugby-union/rss.xml' },
  { id: 'guardian-rugby-union', name: 'Guardian Rugby Union', domain: 'theguardian.com', group: 'Rugby Union', url: 'https://www.theguardian.com/sport/rugbyunion/rss' },
  { id: 'bbc-boxing', name: 'BBC Boxing', domain: 'bbc.com', group: 'Boxing & MMA', url: 'https://feeds.bbci.co.uk/sport/boxing/rss.xml' },
  { id: 'guardian-boxing', name: 'Guardian Boxing', domain: 'theguardian.com', group: 'Boxing & MMA', url: 'https://www.theguardian.com/sport/boxing/rss' },
  { id: 'boxingscene', name: 'BoxingScene', domain: 'boxingscene.com', group: 'Boxing & MMA', url: 'https://www.boxingscene.com/rss/' },
  { id: 'boxingnews', name: 'Boxing News', domain: 'boxingnews.com', group: 'Boxing & MMA', url: 'https://boxingnews.com/feed/' },
  { id: 'bbc-mma', name: 'BBC MMA', domain: 'bbc.com', group: 'Boxing & MMA', url: 'https://feeds.bbci.co.uk/sport/mixed-martial-arts/rss.xml' },
  { id: 'guardian-mma', name: 'Guardian MMA', domain: 'theguardian.com', group: 'Boxing & MMA', url: 'https://www.theguardian.com/sport/mma/rss' },
  { id: 'sherdog', name: 'Sherdog', domain: 'sherdog.com', group: 'Boxing & MMA', url: 'https://www.sherdog.com/rss/news.xml' },
  { id: 'mmafighting', name: 'MMA Fighting', domain: 'mmafighting.com', group: 'Boxing & MMA', url: 'https://news.google.com/rss/search?q=site%3Ammafighting.com&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'bbc-tennis', name: 'BBC Tennis', domain: 'bbc.com', group: 'Tennis', url: 'https://feeds.bbci.co.uk/sport/tennis/rss.xml' },
  { id: 'guardian-tennis', name: 'Guardian Tennis', domain: 'theguardian.com', group: 'Tennis', url: 'https://www.theguardian.com/sport/tennis/rss' },
  { id: 'bbc-f1', name: 'BBC Formula 1', domain: 'bbc.com', group: 'Motorsport', url: 'https://feeds.bbci.co.uk/sport/formula1/rss.xml' },
  { id: 'guardian-f1', name: 'Guardian Formula 1', domain: 'theguardian.com', group: 'Motorsport', url: 'https://www.theguardian.com/sport/formulaone/rss' },
  { id: 'autosport', name: 'Autosport', domain: 'autosport.com', group: 'Motorsport', url: 'https://www.autosport.com/rss/feed/all' },
  { id: 'bbc-golf', name: 'BBC Golf', domain: 'bbc.com', group: 'Golf', url: 'https://feeds.bbci.co.uk/sport/golf/rss.xml' },
  { id: 'guardian-golf', name: 'Guardian Golf', domain: 'theguardian.com', group: 'Golf', url: 'https://www.theguardian.com/sport/golf/rss' },
  { id: 'cbs-nba', name: 'CBS Sports NBA', domain: 'cbssports.com', group: 'US Sports', url: 'https://www.cbssports.com/rss/headlines/nba/' },
  { id: 'cbs-nfl', name: 'CBS Sports NFL', domain: 'cbssports.com', group: 'US Sports', url: 'https://www.cbssports.com/rss/headlines/nfl/' },

  // Additional country and regional desks
  { id: 'bbc-africa', name: 'BBC Africa', domain: 'bbc.com', group: 'Africa', url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml' },
  { id: 'premium-times', name: 'Premium Times', domain: 'premiumtimesng.com', group: 'Africa', url: 'https://www.premiumtimesng.com/feed/' },
  { id: 'bbc-latin-america', name: 'BBC Latin America', domain: 'bbc.com', group: 'Latin America', url: 'https://feeds.bbci.co.uk/news/world/latin_america/rss.xml' },
  { id: 'folha', name: 'Folha de S.Paulo', domain: 'folha.uol.com.br', group: 'Latin America', url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml' },
  { id: 'oglobo', name: 'O Globo', domain: 'oglobo.globo.com', group: 'Latin America', url: 'https://oglobo.globo.com/rss/oglobo/' },
  { id: 'clarin', name: 'Clarín', domain: 'clarin.com', group: 'Latin America', url: 'https://www.clarin.com/rss/lo-ultimo/' },
  { id: 'lanacion', name: 'La Nación', domain: 'lanacion.com.ar', group: 'Latin America', url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/' },
  { id: 'spiegel', name: 'Der Spiegel International', domain: 'spiegel.de', group: 'Europe', url: 'https://www.spiegel.de/international/index.rss' },
  { id: 'zeit', name: 'Die Zeit', domain: 'zeit.de', group: 'Europe', url: 'https://newsfeed.zeit.de/index' },
  { id: 'corriere', name: 'Corriere della Sera', domain: 'corriere.it', group: 'Europe', url: 'https://xml2.corriereobjects.it/rss/homepage.xml' },
  { id: 'repubblica', name: 'la Repubblica', domain: 'repubblica.it', group: 'Europe', url: 'https://www.repubblica.it/rss/homepage/rss2.0.xml' },
  { id: 'elmundo', name: 'El Mundo', domain: 'elmundo.es', group: 'Europe', url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml' },
  { id: 'politico-eu', name: 'Politico Europe', domain: 'politico.eu', group: 'Europe', url: 'https://www.politico.eu/feed/' },
  { id: 'euobserver', name: 'EUobserver', domain: 'euobserver.com', group: 'Europe', url: 'https://euobserver.com/rss' },
  { id: 'foreign-policy', name: 'Foreign Policy', domain: 'foreignpolicy.com', group: 'Europe', url: 'https://foreignpolicy.com/feed/' },
  { id: 'foreign-affairs', name: 'Foreign Affairs', domain: 'foreignaffairs.com', group: 'Europe', url: 'https://www.foreignaffairs.com/rss.xml' },
  { id: 'yonhap', name: 'Yonhap News', domain: 'en.yna.co.kr', group: 'Asia', url: 'https://en.yna.co.kr/RSS/news.xml' },
  { id: 'philstar', name: 'The Philippine Star', domain: 'philstar.com', group: 'Asia', url: 'https://www.philstar.com/rss/headlines' },
  { id: 'the-diplomat', name: 'The Diplomat', domain: 'thediplomat.com', group: 'Asia', url: 'https://thediplomat.com/feed/' },
  { id: 'rnz', name: 'RNZ', domain: 'rnz.co.nz', group: 'Asia', url: 'https://www.rnz.co.nz/rss/news.xml' },
  { id: 'ndtv', name: 'NDTV', domain: 'ndtv.com', group: 'India', url: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
  { id: 'mint', name: 'Mint', domain: 'livemint.com', group: 'India', url: 'https://www.livemint.com/rss/news' },
  { id: 'business-standard', name: 'Business Standard', domain: 'business-standard.com', group: 'India', url: 'https://www.business-standard.com/rss/home_page_top_stories.rss' },

  // Additional mastheads
  { id: 'business-insider', name: 'Business Insider', domain: 'businessinsider.com', group: 'United States', url: 'https://news.google.com/rss/search?q=site%3Abusinessinsider.com+when%3A2d&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'the-age', name: 'The Age', domain: 'theage.com.au', group: 'Australia', url: 'https://www.theage.com.au/rss/feed.xml' },
  { id: 'examiner', name: 'The Examiner', domain: 'examiner.com.au', group: 'Australia', url: 'https://www.examiner.com.au/rss.xml' },
  { id: 'the-west', name: 'The West Australian', domain: 'thewest.com.au', group: 'Australia', url: 'https://thewest.com.au/rss' },
  { id: 'the-nightly', name: 'The Nightly', domain: 'thenightly.com.au', group: 'Australia', url: 'https://thenightly.com.au/feed/' },
  { id: 'code-sports', name: 'CODE Sports', domain: 'codesports.com.au', group: 'Australia', url: 'https://news.google.com/rss/search?q=site%3Acodesports.com.au&hl=en-AU&gl=AU&ceid=AU%3Aen', googleNews: true },
  { id: 'daily-telegraph', name: 'The Daily Telegraph', domain: 'dailytelegraph.com.au', group: 'Australia', url: 'https://news.google.com/rss/search?q=site%3Adailytelegraph.com.au&hl=en-AU&gl=AU&ceid=AU%3Aen', googleNews: true },

];

export const TOPICS = [
  {
    id: 'top',
    label: 'TOP STORIES',
    title: 'Top Stories',
    feeds: ['bbc-news', 'reuters', 'ap', 'cnn', 'aljazeera', 'cna', 'abc-au', 'abc-us', 'guardian-world', 'nyt-world', 'cnbc', 'ars', 'espn', 'variety'],
  },
  {
    id: 'latest',
    label: 'LATEST',
    title: 'Latest',
    feeds: ['bbc-news', 'reuters', 'ap', 'cnn', 'cna', 'straitstimes-sg', 'aljazeera', 'abc-au', 'abc-us', 'cbs', 'guardian-world', 'fmt', 'scmp', 'cnbc', 'ars', 'espn', 'variety'],
  },
  {
    id: 'briefing',
    label: 'BRIEFING',
    title: 'The Briefing',
    feeds: ['reuters', 'ap', 'cnn', 'washington-post', 'nyt-world', 'nyt-politics', 'nyt-business', 'economist-latest', 'ft-home', 'wsj-world', 'bloomberg-markets', 'the-times', 'telegraph', 'independent', 'herald-sun', 'the-australian', 'abc-us'],
  },
  {
    id: 'briefs',
    label: 'BRIEFS',
    title: 'Publisher Briefs',
    feeds: ['nyt-world', 'nyt-us', 'nyt-politics', 'nyt-business', 'bloomberg-markets', 'bloomberg-politics', 'ft-home', 'wsj-world', 'herald-sun', 'the-australian', 'the-west', 'code-sports', 'daily-telegraph'],
  },

  { id: 'radio', label: 'RADIO', title: 'Live Radio', type: 'radio', feeds: [] },
  { id: 'podcasts', label: 'PODCASTS', title: 'Podcasts', type: 'podcasts', feeds: [] },
  {
    id: 'world',
    label: 'WORLD',
    title: 'World',
    feeds: ['bbc-world', 'reuters', 'ap', 'guardian-world', 'aljazeera', 'cnn', 'washington-post', 'npr-news', 'nyt-world', 'scmp', 'cna'],
  },
  { id: 'us', label: 'US', title: 'United States', feeds: ['cbs', 'abc-us', 'cnn', 'latimes', 'npr-news', 'nyt-us', 'nyt-politics', 'cnbc'] },
  { id: 'uk', label: 'UK', title: 'United Kingdom', feeds: ['bbc-uk', 'guardian-uk', 'sky-uk', 'bbc-news', 'guardian-world'] },
  { id: 'australia', label: 'AUSTRALIA', title: 'Australia', feeds: ['abc-au', '7news', 'guardian-au', 'sbs-au', 'smh', 'the-age', 'examiner', 'the-west', 'the-nightly', 'code-sports', 'daily-telegraph', 'herald-sun', 'the-australian'] },
  { id: 'canada', label: 'CANADA', title: 'Canada', feeds: ['cbc-top', 'cbc-canada', 'cbc-world', 'globe-mail'] },
  { id: 'singapore', label: 'SINGAPORE', title: 'Singapore', feeds: ['straitstimes-sg', 'cna', 'mothership', 'beritaharian-sg'] },
  { id: 'malaysia', label: 'MALAYSIA', title: 'Malaysia', feeds: ['berita-harian', 'nst', 'fmt', 'utusan', 'kosmo'] },
  { id: 'asia', label: 'ASIA', title: 'Asia', feeds: ['cna', 'straitstimes-asia', 'scmp', 'scmp-china', 'nikkei', 'japan-times', 'taipei-times', 'yonhap', 'philstar', 'the-diplomat', 'rnz', 'aljazeera'] },
  { id: 'europe', label: 'EUROPE', title: 'Europe', feeds: ['bbc-europe', 'dw', 'france24', 'euronews', 'el-pais', 'spiegel', 'zeit', 'corriere', 'repubblica', 'elmundo', 'politico-eu', 'euobserver', 'foreign-policy', 'foreign-affairs', 'bloomberg-politics'] },
  { id: 'middle-east', label: 'MIDDLE EAST', title: 'Middle East', feeds: ['bbc-middle-east', 'aljazeera', 'arab-news', 'jpost'] },
  { id: 'africa', label: 'AFRICA', title: 'Africa', feeds: ['bbc-africa', 'premium-times'] },
  { id: 'latin-america', label: 'LATIN AMERICA', title: 'Latin America', feeds: ['bbc-latin-america', 'folha', 'oglobo', 'clarin', 'lanacion'] },
  { id: 'india', label: 'INDIA', title: 'India', feeds: ['bbc-india', 'indian-express', 'times-of-india', 'ndtv', 'mint', 'business-standard'] },
  { id: 'china', label: 'CHINA', title: 'China', feeds: ['scmp-china', 'bbc-china', 'cgtn', 'global-times', 'peoples-daily', 'sixth-tone'] },
  { id: 'russia', label: 'RUSSIA', title: 'Russia', feeds: ['moscow-times', 'tass', 'meduza', 'rt'] },
  {
    id: 'business',
    label: 'BUSINESS',
    title: 'Business & Markets',
    feeds: ['cnbc', 'bloomberg-markets', 'guardian-business', 'investing', 'economist', 'economist-latest', 'ft-home', 'wsj-world', 'business-times-sg', 'straitstimes-business', 'nikkei', 'nyt-business'],
  },
  {
    id: 'technology',
    label: 'TECH',
    title: 'Technology',
    feeds: ['verge', 'ars', 'techcrunch', 'engadget', 'bbc-tech', 'cbc-tech', 'nyt-tech', 'wired'],
  },
  { id: 'ai', label: 'AI', title: 'Artificial Intelligence', feeds: ['verge-ai', 'techcrunch-ai', 'mit-tr', 'ars', 'wired', 'verge'] },
  { id: 'sports', label: 'SPORTS', title: 'Sports', feeds: ['espn', 'bbc-sport', 'guardian-sport', 'cbc-sports', 'cbssports'] },
  { id: 'sport-football', label: 'FOOTBALL', title: 'Football', sports: true, feeds: ['bbc-football', 'guardian-football'] },
  { id: 'sport-cricket', label: 'CRICKET', title: 'Cricket', sports: true, feeds: ['bbc-cricket', 'guardian-cricket', 'espncricinfo', 'toi-cricket'] },
  { id: 'sport-rugby-league', label: 'RUGBY LEAGUE', title: 'Rugby League', sports: true, feeds: ['bbc-rugby-league', 'guardian-rugby-league'] },
  { id: 'sport-rugby-union', label: 'RUGBY UNION', title: 'Rugby Union', sports: true, feeds: ['bbc-rugby-union', 'guardian-rugby-union'] },
  { id: 'sport-boxing', label: 'BOXING', title: 'Boxing', sports: true, feeds: ['bbc-boxing', 'guardian-boxing', 'boxingscene', 'boxingnews'] },
  { id: 'sport-mma', label: 'MMA', title: 'MMA', sports: true, feeds: ['bbc-mma', 'guardian-mma', 'sherdog', 'mmafighting'] },
  { id: 'sport-tennis', label: 'TENNIS', title: 'Tennis', sports: true, feeds: ['bbc-tennis', 'guardian-tennis'] },
  { id: 'sport-f1', label: 'F1', title: 'Formula 1', sports: true, feeds: ['bbc-f1', 'guardian-f1', 'autosport'] },
  { id: 'sport-golf', label: 'GOLF', title: 'Golf', sports: true, feeds: ['bbc-golf', 'guardian-golf'] },
  { id: 'sport-nba', label: 'NBA', title: 'NBA', sports: true, feeds: ['cbs-nba'] },
  { id: 'sport-nfl', label: 'NFL', title: 'NFL', sports: true, feeds: ['cbs-nfl'] },
  { id: 'science', label: 'SCIENCE', title: 'Science', feeds: ['sciencedaily', 'nature', 'nasa', 'space', 'guardian-science'] },
  { id: 'entertainment', label: 'ENTERTAINMENT', title: 'Entertainment', feeds: ['variety', 'hollywood-reporter', 'billboard', 'rollingstone', 'guardian-culture'] },
  { id: 'politics', label: 'POLITICS', title: 'Politics', feeds: ['npr-politics', 'guardian-politics', 'cbc-politics', 'scmp-china', 'politico', 'the-hill', 'nyt-politics', 'bloomberg-politics'] },
  { id: 'finance', label: 'FINANCE', title: 'Finance', feeds: ['cnbc', 'bloomberg-markets', 'investing', 'economist', 'ft-home', 'business-times-sg', 'guardian-business', 'nyt-business'] },
  { id: 'lifestyle', label: 'LIFESTYLE', title: 'Lifestyle', feeds: ['guardian-life', 'refinery29', 'billboard', 'rollingstone'] },
];

export const TOPIC_PRESETS = [
  { label: 'AI & Robotics', keywords: ['artificial intelligence', 'machine learning', 'robotics', 'OpenAI', 'Anthropic'], feeds: ['verge-ai', 'techcrunch-ai', 'mit-tr', 'ars'] },
  { label: 'Crypto & Web3', keywords: ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'web3'], feeds: ['cnbc', 'techcrunch', 'investing', 'ars'] },
  { label: 'Space & Astronomy', keywords: ['SpaceX', 'NASA', 'astronomy', 'space exploration', 'James Webb'], feeds: ['space', 'nasa', 'sciencedaily', 'nature'] },
  { label: 'Gaming & Esports', keywords: ['video games', 'gaming', 'esports', 'PlayStation', 'Xbox', 'Nintendo'], feeds: ['verge', 'ars', 'engadget', 'techcrunch'] },
  { label: 'Electric Vehicles', keywords: ['electric vehicles', 'EV', 'Tesla', 'Rivian', 'clean mobility'], feeds: ['verge', 'ars', 'techcrunch', 'engadget'] },
  { label: 'Climate & Clean Energy', keywords: ['climate change', 'renewable energy', 'clean energy', 'solar', 'wind power'], feeds: ['guardian-science', 'sciencedaily', 'nature', 'bbc-news'] },
  { label: 'Economy & Markets', keywords: ['economy', 'stock market', 'inflation', 'Federal Reserve', 'interest rates'], feeds: ['cnbc', 'investing', 'economist', 'guardian-business'] },
  { label: 'Health & Medicine', keywords: ['health', 'medicine', 'healthcare', 'biotech', 'wellness'], feeds: ['sciencedaily', 'nature', 'npr-news', 'guardian-life'] },
  { label: 'Politics & Government', keywords: ['politics', 'congress', 'white house', 'elections', 'legislation'], feeds: ['npr-politics', 'guardian-politics', 'cbc-politics'] },
];

/**
 * Popular news and current-affairs radio stations with public live streams.
 * Every URL is HTTPS so it can play from a secure static host.
 */

/* ------------------------------------------------------------------ */
/* Free-to-read country desks and NoWall-style source expansion        */
/* ------------------------------------------------------------------ */

function addFeedsToTopic(topicId, feedIds) {
  const topic = TOPICS.find((item) => item.id === topicId);
  if (!topic) return;
  topic.feeds = [...new Set([...(topic.feeds || []), ...feedIds])];
}

function googleSiteFeed(id, name, domain, group) {
  return {
    id,
    name,
    domain,
    group,
    url: `https://news.google.com/rss/search?q=site%3A${encodeURIComponent(domain)}&hl=en-US&gl=US&ceid=US%3Aen`,
    googleNews: true,
  };
}

const FREE_OUTLETS = [
  googleSiteFeed('pbs-newshour', 'PBS NewsHour', 'pbs.org', 'United States'),
  googleSiteFeed('newsnation', 'NewsNation', 'newsnationnow.com', 'United States'),
  googleSiteFeed('semafor', 'Semafor', 'semafor.com', 'United States'),
  googleSiteFeed('propublica', 'ProPublica', 'propublica.org', 'United States'),
  googleSiteFeed('nypost', 'New York Post', 'nypost.com', 'United States'),
  googleSiteFeed('yahoo-news', 'Yahoo News', 'news.yahoo.com', 'United States'),
  googleSiteFeed('kff-health', 'KFF Health News', 'kffhealthnews.org', 'Health'),
  googleSiteFeed('who-news', 'WHO', 'who.int', 'Health'),
  googleSiteFeed('medical-xpress', 'Medical Xpress', 'medicalxpress.com', 'Health'),
  googleSiteFeed('news-medical', 'News-Medical', 'news-medical.net', 'Health'),
  googleSiteFeed('healthline', 'Healthline', 'healthline.com', 'Health'),
  googleSiteFeed('un-news', 'UN News', 'news.un.org', 'World'),
  googleSiteFeed('rfi', 'RFI', 'rfi.fr', 'Europe'),
  googleSiteFeed('rte', 'RTÉ News', 'rte.ie', 'Europe'),
  googleSiteFeed('the-conversation', 'The Conversation', 'theconversation.com', 'World'),
  googleSiteFeed('the-register', 'The Register', 'theregister.com', 'Technology'),
  googleSiteFeed('zdnet', 'ZDNET', 'zdnet.com', 'Technology'),
  googleSiteFeed('cnet', 'CNET', 'cnet.com', 'Technology'),
  googleSiteFeed('androidauthority', 'Android Authority', 'androidauthority.com', 'Technology'),
  googleSiteFeed('benzinga', 'Benzinga', 'benzinga.com', 'Business'),
  googleSiteFeed('investing-com', 'Investing.com', 'investing.com', 'Business'),
  googleSiteFeed('fox-business', 'Fox Business', 'foxbusiness.com', 'Business'),
  googleSiteFeed('sky-sports', 'Sky Sports', 'skysports.com', 'Sports'),
  googleSiteFeed('sporting-news', 'Sporting News', 'sportingnews.com', 'Sports'),
  googleSiteFeed('yardbarker', 'Yardbarker', 'yardbarker.com', 'Sports'),
  googleSiteFeed('yahoo-sports', 'Yahoo Sports', 'sports.yahoo.com', 'Sports'),
  googleSiteFeed('quanta', 'Quanta Magazine', 'quantamagazine.org', 'Science'),
  googleSiteFeed('science-news', 'Science News', 'sciencenews.org', 'Science'),
  googleSiteFeed('sciencealert', 'ScienceAlert', 'sciencealert.com', 'Science'),
  googleSiteFeed('smithsonian', 'Smithsonian', 'smithsonianmag.com', 'Science'),
  googleSiteFeed('phys-org', 'Phys.org', 'phys.org', 'Science'),
  googleSiteFeed('new-atlas', 'New Atlas', 'newatlas.com', 'Science'),
  googleSiteFeed('earth-com', 'Earth.com', 'earth.com', 'Science'),
  googleSiteFeed('africanews', 'Africanews', 'africanews.com', 'Africa'),
  googleSiteFeed('dawn', 'Dawn', 'dawn.com', 'Pakistan'),
  googleSiteFeed('geo-news', 'Geo News', 'geo.tv', 'Pakistan'),
  googleSiteFeed('express-tribune', 'The Express Tribune', 'tribune.com.pk', 'Pakistan'),
  googleSiteFeed('punch', 'Punch', 'punchng.com', 'Nigeria'),
  googleSiteFeed('vanguard', 'Vanguard', 'vanguardngr.com', 'Nigeria'),
  googleSiteFeed('channels-tv', 'Channels TV', 'channelstv.com', 'Nigeria'),
  googleSiteFeed('rappler', 'Rappler', 'rappler.com', 'Philippines'),
  googleSiteFeed('gma-news', 'GMA News', 'gmanetwork.com', 'Philippines'),
  googleSiteFeed('daily-maverick', 'Daily Maverick', 'dailymaverick.co.za', 'South Africa'),
  googleSiteFeed('iol', 'IOL', 'iol.co.za', 'South Africa'),
  googleSiteFeed('thejournal-ie', 'TheJournal.ie', 'thejournal.ie', 'Ireland'),
  googleSiteFeed('1news', '1News', '1news.co.nz', 'New Zealand'),
  googleSiteFeed('stuff', 'Stuff', 'stuff.co.nz', 'New Zealand'),
  googleSiteFeed('antara', 'Antara', 'antaranews.com', 'Indonesia'),
  googleSiteFeed('detik', 'detikNews', 'detik.com', 'Indonesia'),
  googleSiteFeed('khaosod', 'Khaosod English', 'khaosodenglish.com', 'Thailand'),
  googleSiteFeed('thaiger', 'The Thaiger', 'thethaiger.com', 'Thailand'),
  googleSiteFeed('vnexpress', 'VnExpress International', 'e.vnexpress.net', 'Vietnam'),
  googleSiteFeed('tuoi-tre', 'Tuoi Tre News', 'tuoitrenews.vn', 'Vietnam'),
  googleSiteFeed('mainichi', 'Mainichi', 'mainichi.jp', 'Japan'),
  googleSiteFeed('nippon', 'Nippon.com', 'nippon.com', 'Japan'),
  googleSiteFeed('korea-times', 'The Korea Times', 'koreatimes.co.kr', 'South Korea'),
  googleSiteFeed('hkfp', 'Hong Kong Free Press', 'hongkongfp.com', 'Hong Kong'),
  googleSiteFeed('rthk', 'RTHK', 'rthk.hk', 'Hong Kong'),
  googleSiteFeed('dutchnews', 'DutchNews', 'dutchnews.nl', 'Netherlands'),
  googleSiteFeed('nltimes', 'NL Times', 'nltimes.nl', 'Netherlands'),
  googleSiteFeed('g1', 'g1', 'g1.globo.com', 'Brazil'),
  googleSiteFeed('mexico-news-daily', 'Mexico News Daily', 'mexiconewsdaily.com', 'Mexico'),
  googleSiteFeed('kyiv-independent', 'Kyiv Independent', 'kyivindependent.com', 'Ukraine'),
  googleSiteFeed('investinglive', 'investingLive', 'investinglive.com', 'Business'),
  googleSiteFeed('techradar', 'TechRadar', 'techradar.com', 'Technology'),
  googleSiteFeed('cbs-moneywatch', 'CBS MoneyWatch', 'cbsnews.com', 'Business'),
];

const VIDEO_FEEDS = [
  { id: 'yt-abc-news', name: 'ABC News', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBi2mrWuNuyYy4gbM6fU18Q', video: true },
  { id: 'yt-bbc-news', name: 'BBC News', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC16niRr50-MSBwiO3YDb3RA', video: true },
  { id: 'yt-aljazeera', name: 'Al Jazeera English', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNye-wNBqNL5ZzHSJj3l8Bg', video: true },
  { id: 'yt-dw-news', name: 'DW News', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCknLrEdhRCp1aegoMqRaCZg', video: true },
  { id: 'yt-sky-news', name: 'Sky News', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCoMdktPbSTixAyNGwb-UYkQ', video: true },
  { id: 'yt-france24', name: 'France 24 English', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCQfwfsi5VrQ8yKZ-UWmAEFg', video: true },
  { id: 'yt-pbs', name: 'PBS NewsHour', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6ZFN9Tx6xh-skXCuRHCDpQ', video: true },
  { id: 'yt-cbs-news', name: 'CBS News', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC8p1vwvWtl6T73JiExfWs1g', video: true },
  { id: 'yt-fox-news', name: 'Fox News', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXIJgqnII2ZOINSWNOGFThA', video: true },

  { id: 'yt-reuters', name: 'Reuters', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UChqUTb7kYRX8-EiaN3XFrSQ', video: true },
  { id: 'yt-bloomberg', name: 'Bloomberg Television', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCIALMKvObZNtJ6AmdCLP7Lg', video: true },
  { id: 'yt-guardian', name: 'The Guardian', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCHpw8xwDNhU9gdohEcJu4aA', video: true },
  { id: 'yt-astro-awani', name: 'Astro Awani', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5dYmq91e5_g54krpO06NJw', video: true },
  { id: 'yt-abc-au', name: 'ABC News In-depth', domain: 'youtube.com', group: 'Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxcrzzhQDj5zKJbXfIscCtg', video: true },
];
FEEDS.push(...VIDEO_FEEDS);

const VIDEO_TOPIC = {
  id: 'video',
  label: 'VIDEO',
  title: 'Video News',
  video: true,
  limit: 36,
  feeds: VIDEO_FEEDS.map((feed) => feed.id),
};
const videoWorldIndex = TOPICS.findIndex((topic) => topic.id === 'world');
TOPICS.splice(videoWorldIndex === -1 ? TOPICS.length : videoWorldIndex, 0, VIDEO_TOPIC);

const LIVE_TV_TOPIC = {
  id: 'live-tv',
  label: 'LIVE TV',
  title: 'Live TV',
  type: 'livetv',
  feeds: [],
};
TOPICS.splice(videoWorldIndex === -1 ? TOPICS.length : videoWorldIndex + 1, 0, LIVE_TV_TOPIC);

export const LIVE_TV_CHANNELS = [
  { id: 'sky-news', name: 'Sky News', region: 'United Kingdom', channelId: 'UCoMdktPbSTixAyNGwb-UYkQ' },
  { id: 'al-jazeera', name: 'Al Jazeera English', region: 'Qatar', channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg' },
  { id: 'dw-news', name: 'DW News', region: 'Germany', channelId: 'UCknLrEdhRCp1aegoMqRaCZg' },
  { id: 'france-24', name: 'France 24 English', region: 'France', channelId: 'UCQfwfsi5VrQ8yKZ-UWmAEFg' },
  { id: 'abc-news', name: 'ABC News', region: 'United States', channelId: 'UCBi2mrWuNuyYy4gbM6fU18Q' },
  { id: 'nbc-news', name: 'NBC News', region: 'United States', channelId: 'UCeY0bbntWzzVIaj2z3QigXg' },
  { id: 'cbs-news', name: 'CBS News', region: 'United States', channelId: 'UC8p1vwvWtl6T73JiExfWs1g' },
  { id: 'cnn', name: 'CNN', region: 'United States', channelId: 'UCupvZG-5ko_eiXAupbDfxWw' },
  { id: 'fox-news', name: 'Fox News', region: 'United States', channelId: 'UCXIJgqnII2ZOINSWNOGFThA' },
  { id: 'cnbc', name: 'CNBC', region: 'United States', channelId: 'UCvJJ_dzjViJCoLf5uKUTwoA' },
  { id: 'bloomberg', name: 'Bloomberg TV', region: 'United States', channelId: 'UCIALMKvObZNtJ6AmdCLP7Lg' },
  { id: 'bbc-news', name: 'BBC News', region: 'United Kingdom', channelId: 'UC16niRr50-MSBwiO3YDb3RA' },
  { id: 'reuters', name: 'Reuters', region: 'Global', channelId: 'UChqUTb7kYRX8-EiaN3XFrSQ' },
  { id: 'pbs', name: 'PBS NewsHour', region: 'United States', channelId: 'UC6ZFN9Tx6xh-skXCuRHCDpQ' },
  { id: 'astro-awani', name: 'Astro Awani', region: 'Malaysia', channelId: 'UC5dYmq91e5_g54krpO06NJw' },
];

export const LIVE_VIDEO_CHANNELS = [
  { id: 'live-sky', name: 'Sky News', region: 'United Kingdom', channelId: 'UCoMdktPbSTixAyNGwb-UYkQ' },
  { id: 'live-aljazeera', name: 'Al Jazeera English', region: 'Qatar', channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg' },
  { id: 'live-dw', name: 'DW News', region: 'Germany', channelId: 'UCknLrEdhRCp1aegoMqRaCZg' },
  { id: 'live-france24', name: 'France 24 English', region: 'France', channelId: 'UCQfwfsi5VrQ8yKZ-UWmAEFg' },
  { id: 'live-abc', name: 'ABC News', region: 'United States', channelId: 'UCBi2mrWuNuyYy4gbM6fU18Q' },
  { id: 'live-bloomberg', name: 'Bloomberg TV', region: 'United States', channelId: 'UCIALMKvObZNtJ6AmdCLP7Lg' },
  { id: 'live-astro', name: 'Astro Awani', region: 'Malaysia', channelId: 'UC5dYmq91e5_g54krpO06NJw' },
];

FEEDS.push(...FREE_OUTLETS);

FEEDS.push({
  id: 'malay-mail',
  name: 'Malay Mail',
  domain: 'malaymail.com',
  group: 'Malaysia',
  url: 'https://www.malaymail.com/feed/rss',
});

addFeedsToTopic('world', ['pbs-newshour', 'newsnation', 'semafor', 'propublica', 'un-news', 'rfi', 'rte', 'africanews', 'the-conversation']);
addFeedsToTopic('us', ['pbs-newshour', 'newsnation', 'semafor', 'propublica', 'nypost', 'yahoo-news']);
addFeedsToTopic('business', ['benzinga', 'investing-com', 'fox-business', 'investinglive', 'cbs-moneywatch']);
addFeedsToTopic('technology', ['the-register', 'zdnet', 'cnet', 'androidauthority', 'the-conversation', 'techradar']);
addFeedsToTopic('science', ['quanta', 'science-news', 'sciencealert', 'smithsonian', 'phys-org', 'new-atlas', 'earth-com']);
addFeedsToTopic('sports', ['sky-sports', 'sporting-news', 'yardbarker', 'yahoo-sports']);
addFeedsToTopic('politics', ['propublica', 'semafor']);
addFeedsToTopic('africa', ['africanews']);
addFeedsToTopic('europe', ['rfi', 'rte']);
addFeedsToTopic('finance', ['benzinga', 'investing-com']);
addFeedsToTopic('malaysia', ['malay-mail']);
addFeedsToTopic('briefs', ['washington-post', 'latimes', 'economist-latest', 'telegraph', 'the-times', 'straitstimes-sg', 'globe-mail', 'business-insider']);
addFeedsToTopic('asia', ['rappler', 'gma-news', 'antara', 'detik', 'khaosod', 'thaiger', 'vnexpress', 'tuoi-tre', 'mainichi', 'nippon', 'korea-times', 'hkfp', 'rthk']);
addFeedsToTopic('pakistan', ['dawn', 'geo-news', 'express-tribune']);
addFeedsToTopic('nigeria', ['punch', 'vanguard', 'channels-tv']);
addFeedsToTopic('philippines', ['rappler', 'gma-news']);
addFeedsToTopic('south-africa', ['daily-maverick', 'iol']);
addFeedsToTopic('ireland', ['rte', 'thejournal-ie']);
addFeedsToTopic('new-zealand', ['rnz', '1news', 'stuff']);

FEEDS.push({
  id: 'sciencedaily-health',
  name: 'ScienceDaily Health',
  domain: 'sciencedaily.com',
  group: 'Health',
  url: 'https://www.sciencedaily.com/rss/health_medicine.xml',
});

const HEALTH_TOPIC = {
  id: 'health',
  label: 'HEALTH',
  title: 'Health',
  feeds: ['sciencedaily-health', 'kff-health', 'who-news', 'medical-xpress', 'news-medical', 'healthline', 'npr-news'],
};
const scienceIndex = TOPICS.findIndex((topic) => topic.id === 'science');
TOPICS.splice(scienceIndex === -1 ? TOPICS.length : scienceIndex, 0, HEALTH_TOPIC);

/* Country desks. Existing desks keep their curated local feeds; new desks
   use the free Google News country edition, then filter out brief-only
   publishers in the client. */
const COUNTRY_DESK_CONFIG = [
  { code: 'MY', name: 'Malaysia', topic: 'malaysia' },
  { code: 'AU', name: 'Australia', topic: 'australia' },
  { code: 'US', name: 'United States', topic: 'us' },
  { code: 'GB', name: 'United Kingdom', topic: 'uk' },
  { code: 'SG', name: 'Singapore', topic: 'singapore' },
  { code: 'CA', name: 'Canada', topic: 'canada' },
  { code: 'IN', name: 'India', topic: 'india' },
  { code: 'NZ', name: 'New Zealand', feeds: ['rnz', '1news', 'stuff'] },
  { code: 'IE', name: 'Ireland', feeds: ['rte', 'thejournal-ie'] },
  { code: 'ID', name: 'Indonesia', feeds: ['antara', 'detik'] },
  { code: 'PH', name: 'Philippines', feeds: ['rappler', 'gma-news'] },
  { code: 'TH', name: 'Thailand', feeds: ['khaosod', 'thaiger'] },
  { code: 'VN', name: 'Vietnam', feeds: ['vnexpress', 'tuoi-tre'] },
  { code: 'JP', name: 'Japan', feeds: ['japan-times', 'mainichi', 'nippon'] },
  { code: 'KR', name: 'South Korea', feeds: ['yonhap', 'korea-times'] },
  { code: 'CN', name: 'China', topic: 'china' },
  { code: 'HK', name: 'Hong Kong', feeds: ['hkfp', 'rthk'] },
  { code: 'TW', name: 'Taiwan', feeds: ['taipei-times'] },
  { code: 'PK', name: 'Pakistan', feeds: ['dawn', 'geo-news', 'express-tribune'] },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'NP', name: 'Nepal' },
  { code: 'ZA', name: 'South Africa', feeds: ['daily-maverick', 'iol'] },
  { code: 'NG', name: 'Nigeria', feeds: ['punch', 'vanguard', 'channels-tv'] },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IL', name: 'Israel', feeds: ['jpost'] },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia', topic: 'russia' },
  { code: 'DE', name: 'Germany', feeds: ['dw', 'spiegel', 'zeit'] },
  { code: 'FR', name: 'France', feeds: ['france24', 'rfi'] },
  { code: 'ES', name: 'Spain', feeds: ['el-pais', 'elmundo'] },
  { code: 'IT', name: 'Italy', feeds: ['corriere', 'repubblica'] },
  { code: 'NL', name: 'Netherlands', feeds: ['dutchnews', 'nltimes'] },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'UA', name: 'Ukraine', feeds: ['kyiv-independent'] },
  { code: 'BR', name: 'Brazil', feeds: ['folha', 'g1'] },
  { code: 'MX', name: 'Mexico', feeds: ['mexico-news-daily'] },
  { code: 'AR', name: 'Argentina', feeds: ['clarin', 'lanacion'] },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'CD', name: 'DR Congo' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LY', name: 'Libya' },
  { code: 'MT', name: 'Malta' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'KP', name: 'North Korea' },
  { code: 'PS', name: 'Palestine' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SO', name: 'Somalia' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SY', name: 'Syria' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

const EXISTING_COUNTRY_TOPICS = new Set(['us', 'uk', 'australia', 'canada', 'singapore', 'malaysia', 'india', 'china', 'russia']);
for (const id of EXISTING_COUNTRY_TOPICS) {
  const topic = TOPICS.find((item) => item.id === id);
  if (topic) {
    topic.country = true;
    topic.hiddenFromBar = true;
  }
}

export const COUNTRY_DESKS = COUNTRY_DESK_CONFIG.map((desk) => {
  const topicId = desk.topic || `country-${desk.code.toLowerCase()}`;
  const feedId = `gn-${desk.code.toLowerCase()}`;
  FEEDS.push({
    id: feedId,
    name: `${desk.name} · Google News`,
    domain: 'news.google.com',
    group: desk.name,
    url: `https://news.google.com/rss?gl=${desk.code}&hl=en-US&ceid=${desk.code}:en`,
    googleNews: true,
    aggregator: true,
  });
  if (!EXISTING_COUNTRY_TOPICS.has(topicId)) {
    TOPICS.push({
      id: topicId,
      label: desk.name.toUpperCase(),
      title: `${desk.name} News`,
      country: true,
      hiddenFromBar: true,
      noImages: true,
      limit: 20,
      feeds: [feedId, ...(desk.feeds || [])],
    });
  } else {
    addFeedsToTopic(topicId, [feedId, ...(desk.feeds || [])]);
  }
  return { code: desk.code, name: desk.name, topic: topicId };
});

export const COUNTRY_TIMEZONES = {
  'Asia/Kuala_Lumpur': 'MY', 'Asia/Kuching': 'MY',
  'Australia/Melbourne': 'AU', 'Australia/Sydney': 'AU', 'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU', 'Australia/Hobart': 'AU', 'Australia/Darwin': 'AU',
  'Pacific/Auckland': 'NZ', 'Asia/Singapore': 'SG', 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
  'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD', 'Asia/Colombo': 'LK', 'Asia/Kathmandu': 'NP',
  'Asia/Manila': 'PH', 'Asia/Jakarta': 'ID', 'Asia/Bangkok': 'TH', 'Asia/Ho_Chi_Minh': 'VN',
  'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Asia/Hong_Kong': 'HK', 'Asia/Taipei': 'TW', 'Asia/Shanghai': 'CN',
  'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
  'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE',
  'Europe/Zurich': 'CH', 'Europe/Vienna': 'AT', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO',
  'Europe/Copenhagen': 'DK', 'Europe/Helsinki': 'FI', 'Europe/Warsaw': 'PL', 'Europe/Lisbon': 'PT',
  'Europe/Athens': 'GR', 'Europe/Istanbul': 'TR', 'Europe/Kyiv': 'UA', 'Europe/Moscow': 'RU',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Halifax': 'CA',
  'America/Sao_Paulo': 'BR', 'America/Mexico_City': 'MX', 'America/Argentina/Buenos_Aires': 'AR',
  'America/Santiago': 'CL', 'America/Bogota': 'CO', 'America/Lima': 'PE',
  'Africa/Johannesburg': 'ZA', 'Africa/Lagos': 'NG', 'Africa/Nairobi': 'KE', 'Africa/Accra': 'GH',
  'Africa/Cairo': 'EG', 'Asia/Riyadh': 'SA', 'Asia/Dubai': 'AE', 'Asia/Jerusalem': 'IL',
};

export function getCountryDesk(code) {
  const upper = String(code || '').toUpperCase();
  return COUNTRY_DESKS.find((desk) => desk.code === upper) || null;
}

export function countryTopicId(code) {
  return getCountryDesk(code)?.topic || '';
}


/* ------------------------------------------------------------------ */
/* Health research — No Wall Medicine-style journal desk               */
/* ------------------------------------------------------------------ */

const RESEARCH_FEEDS = [
  { id: 'lancet', name: 'The Lancet', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/lancet_current.xml' },
  { id: 'lancet-global', name: 'Lancet Global Health', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/langlo_current.xml' },
  { id: 'lancet-digital', name: 'Lancet Digital Health', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/landig_current.xml' },
  { id: 'lancet-oncology', name: 'Lancet Oncology', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/lanonc_current.xml' },
  { id: 'lancet-neurology', name: 'Lancet Neurology', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/laneur_current.xml' },
  { id: 'lancet-psychiatry', name: 'Lancet Psychiatry', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/lanpsy_current.xml' },
  { id: 'lancet-public-health', name: 'Lancet Public Health', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/lanpub_current.xml' },
  { id: 'lancet-diabetes', name: 'Lancet Diabetes & Endocrinology', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/landia_current.xml' },
  { id: 'lancet-hiv', name: 'Lancet HIV', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/lanhiv_current.xml' },
  { id: 'lancet-rheumatology', name: 'Lancet Rheumatology', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/lanrhe_current.xml' },
  { id: 'lancet-gastro', name: 'Lancet Gastroenterology & Hepatology', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/langas_current.xml' },
  { id: 'lancet-child', name: 'Lancet Child & Adolescent Health', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/lanchi_current.xml' },
  { id: 'lancet-respiratory', name: 'Lancet Respiratory Medicine', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/lanres_current.xml' },
  { id: 'lancet-infectious', name: 'Lancet Infectious Diseases', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/laninf_current.xml' },
  { id: 'ebiomedicine', name: 'eBioMedicine', domain: 'thelancet.com', group: 'Research', url: 'https://www.thelancet.com/rssfeed/ebiom_current.xml' },
  { id: 'bmj', name: 'The BMJ', domain: 'bmj.com', group: 'Research', url: 'https://www.bmj.com/rss.xml' },
  { id: 'plos-medicine', name: 'PLOS Medicine', domain: 'journals.plos.org', group: 'Research', url: 'https://journals.plos.org/plosmedicine/feed/atom' },
  { id: 'nejm', name: 'NEJM', domain: 'nejm.org', group: 'Research', url: 'https://www.nejm.org/action/showFeed?type=etoc&feed=rss&jc=nejm' },
  { id: 'nature-medicine', name: 'Nature Medicine', domain: 'nature.com', group: 'Research', url: 'https://www.nature.com/nm.rss' },
  { id: 'annals-internal-medicine', name: 'Annals of Internal Medicine', domain: 'acpjournals.org', group: 'Research', url: 'https://www.acpjournals.org/action/showFeed?type=etoc&feed=rss&jc=aim' },
  { id: 'elife', name: 'eLife', domain: 'elifesciences.org', group: 'Research', url: 'https://elifesciences.org/rss/recent.xml' },
  { id: 'plos-global', name: 'PLOS Global Public Health', domain: 'journals.plos.org', group: 'Research', url: 'https://journals.plos.org/globalpublichealth/feed/atom' },
  { id: 'plos-one', name: 'PLOS ONE', domain: 'journals.plos.org', group: 'Research', url: 'https://journals.plos.org/plosone/feed/atom' },
  { id: 'nature-comms', name: 'Nature Communications', domain: 'nature.com', group: 'Research', url: 'https://www.nature.com/ncomms.rss' },
  { id: 'scientific-reports', name: 'Scientific Reports', domain: 'nature.com', group: 'Research', url: 'https://www.nature.com/srep.rss' },
  { id: 'bmj-open', name: 'BMJ Open', domain: 'bmjopen.bmj.com', group: 'Research', url: 'https://bmjopen.bmj.com/rss.xml' },
  { id: 'jmir', name: 'JMIR', domain: 'jmir.org', group: 'Research', url: 'https://www.jmir.org/feed/' },
  { id: 'frontiers-medicine', name: 'Frontiers in Medicine', domain: 'frontiersin.org', group: 'Research', url: 'https://www.frontiersin.org/journals/medicine/rss' },
  googleSiteFeed('jama', 'JAMA', 'jamanetwork.com', 'Research'),
  googleSiteFeed('cdc-research', 'CDC', 'cdc.gov', 'Research'),
  googleSiteFeed('nih-research', 'NIH', 'nih.gov', 'Research'),
  googleSiteFeed('bmc-medicine', 'BMC Medicine', 'bmcmedicine.biomedcentral.com', 'Research'),
  googleSiteFeed('jacc', 'JACC', 'jacc.org', 'Research'),
  googleSiteFeed('circulation', 'Circulation', 'ahajournals.org', 'Research'),
  googleSiteFeed('mayo-clinic', 'Mayo Clinic', 'mayoclinic.org', 'Research'),
  googleSiteFeed('cleveland-clinic', 'Cleveland Clinic', 'my.clevelandclinic.org', 'Research'),
  googleSiteFeed('medical-news-today', 'Medical News Today', 'medicalnewstoday.com', 'Research'),
];
FEEDS.push(...RESEARCH_FEEDS);

const RESEARCH_TOPIC = {
  id: 'research',
  label: 'RESEARCH',
  title: 'Health Research',
  research: true,
  hiddenFromBar: true,
  limit: 48,
  feeds: [
    'lancet', 'lancet-global', 'lancet-digital', 'lancet-oncology', 'lancet-neurology',
    'lancet-psychiatry', 'lancet-public-health', 'lancet-diabetes', 'lancet-hiv',
    'lancet-rheumatology', 'lancet-gastro', 'lancet-child', 'lancet-respiratory',
    'lancet-infectious', 'ebiomedicine', 'bmj', 'plos-medicine', 'nejm', 'nature-medicine',
    'annals-internal-medicine', 'jama', 'cdc-research',
    'nih-research', 'bmc-medicine', 'jacc', 'circulation', 'who-news',
    'mayo-clinic', 'cleveland-clinic',
    'elife', 'plos-global', 'plos-one', 'nature-comms', 'scientific-reports', 'bmj-open',
    'jmir', 'frontiers-medicine',
  ],
};
const healthIndex = TOPICS.findIndex((topic) => topic.id === 'health');
TOPICS.splice(healthIndex === -1 ? TOPICS.length : healthIndex + 1, 0, RESEARCH_TOPIC);

export const RESEARCH_FORMATS = [
  { id: 'all', label: 'All formats', keywords: [] },
  { id: 'trials', label: 'Trials', keywords: ['randomised', 'randomized', 'trial', 'phase 2', 'phase 3', 'phase ii', 'phase iii', 'placebo', 'intervention group', 'hazard ratio', 'primary endpoint'] },
  { id: 'meta', label: 'Meta-analyses', keywords: ['meta-analysis', 'systematic review', 'pooled analysis'] },
  { id: 'guidelines', label: 'Guidelines', keywords: ['guideline', 'consensus', 'recommendation', 'position statement', 'practice parameter'] },
  { id: 'reviews', label: 'Reviews', keywords: ['review', 'overview', 'perspective'] },
  { id: 'observational', label: 'Observational', keywords: ['cohort', 'cross-sectional', 'case-control', 'registry', 'survey', 'population study'] },
  { id: 'case-reports', label: 'Case reports', keywords: ['case report', 'case series'] },
  { id: 'basic', label: 'Basic science', keywords: ['mice', 'mouse', 'in vitro', 'cell', 'molecular', 'gene', 'organoid', 'biomarker', 'protein', 'receptor'] },
];

export const RESEARCH_SPECIALTIES = [
  { id: 'all', label: 'All research', keywords: [] },
  { id: 'cardiology', label: 'Cardiology', keywords: ['heart', 'cardiac', 'cardio', 'stroke', 'hypertension', 'cholesterol', 'atrial', 'artery', 'aortic', 'blood pressure'] },
  { id: 'infectious', label: 'Infectious Disease', keywords: ['infection', 'vaccine', 'virus', 'viral', 'bacterial', 'antimicrobial', 'hiv', 'malaria', 'tuberculosis', 'covid', 'influenza', 'hepatitis', 'sepsis'] },
  { id: 'oncology', label: 'Oncology', keywords: ['cancer', 'tumour', 'tumor', 'carcinoma', 'chemotherapy', 'immunotherapy', 'metastasis', 'leukemia', 'lymphoma', 'myeloma'] },
  { id: 'neurology', label: 'Neurology', keywords: ['brain', 'neuro', 'alzheimer', 'parkinson', 'epilepsy', 'multiple sclerosis', 'dementia', 'migraine', 'eeg'] },
  { id: 'digital', label: 'Digital Health & AI', keywords: ['artificial intelligence', ' ai ', 'machine learning', 'digital', 'telehealth', 'algorithm', 'smartphone', 'wearable', 'large language model'] },
  { id: 'pediatrics', label: 'Pediatrics', keywords: ['child', 'children', 'infant', 'pediatric', 'paediatric', 'neonatal', 'adolescent'] },
  { id: 'gastro', label: 'Gastroenterology', keywords: ['gut', 'gastro', 'liver', 'bowel', 'crohn', 'colitis', 'colon', 'colorectal', 'pancrea'] },
  { id: 'pulmonology', label: 'Pulmonology', keywords: ['lung', 'respiratory', 'asthma', 'copd', 'pulmonary', 'tuberculosis'] },
  { id: 'endocrinology', label: 'Endocrinology', keywords: ['diabetes', 'insulin', 'thyroid', 'endocrine', 'obesity', 'hormone', 'glucose'] },
  { id: 'public-health', label: 'Public & Global Health', keywords: ['public health', 'global health', 'policy', 'screening', 'vaccination', 'who', 'inequality', 'low-income', 'population'] },
  { id: 'psychiatry', label: 'Psychiatry', keywords: ['mental', 'depression', 'anxiety', 'psychiatric', 'schizophrenia', 'bipolar', 'suicide'] },
  { id: 'geriatrics', label: 'Geriatrics', keywords: ['older', 'elderly', 'frailty', 'geriatric', 'ageing', 'aging', 'dementia'] },
  { id: 'womens-health', label: "Women's Health", keywords: ['women', 'maternal', 'pregnancy', 'obstetric', 'gynecolog', 'gynaecolog', 'breast', 'endometriosis', 'menopause'] },
  { id: 'surgery', label: 'Surgery', keywords: ['surgery', 'surgical', 'operation', 'transplant', 'postoperative'] },
  { id: 'diagnostics', label: 'Diagnostics', keywords: ['diagnostic', 'screening', 'imaging', 'biomarker', 'sensitivity', 'specificity', 'accuracy'] },
  { id: 'guidelines', label: 'Guidelines', keywords: ['guideline', 'consensus', 'recommendation', 'position statement'] },
  { id: 'trials', label: 'Trials', keywords: ['randomised', 'randomized', 'trial', 'phase 3', 'phase iii', 'meta-analysis'] },
];

export const RADIO_STATIONS = [
  { id: 'bfm-my', name: 'BFM 89.9', region: 'Malaysia', frequency: '89.9 FM', language: 'English', description: 'Business and current affairs', stream: 'https://22253.live.streamtheworld.com/BFM_SC' },
  { id: 'nasional-fm', name: 'Nasional FM', region: 'Malaysia', frequency: '88.5 FM', language: 'Malay', description: 'National news and talk', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NASIONAL_FM.mp3' },

  { id: 'cna938', name: 'CNA 938', region: 'Singapore', frequency: '93.8 FM', language: 'English', description: 'News and current affairs', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/938NOW_PREM.aac' },
  { id: 'money-fm', name: 'Money FM 89.3', region: 'Singapore', frequency: '89.3 FM', language: 'English', description: 'Business and markets', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MONEY_893AAC.aac' },

  { id: 'abc-news-radio', name: 'ABC News Radio', region: 'Australia', frequency: 'National', language: 'English', description: 'Rolling news', stream: 'https://abc.streamguys1.com/live/newsradio/icecast.audio' },
  { id: 'sky-news-au', name: 'Sky News Australia Radio', region: 'Australia', frequency: 'National', language: 'English', description: 'News and opinion', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVA_SKYNEWS.mp3' },
  { id: '3aw', name: '3AW 693', region: 'Australia', frequency: '693 AM · Melbourne', language: 'English', description: 'News and talk', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/3AW.mp3' },
  { id: '2gb', name: '2GB 873', region: 'Australia', frequency: '873 AM · Sydney', language: 'English', description: 'News and talk', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/2GB.mp3' },
  { id: '6pr', name: '6PR 882', region: 'Australia', frequency: '882 AM · Perth', language: 'English', description: 'News and talk', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/6PR.mp3' },
  { id: '4bc', name: '4BC 882', region: 'Australia', frequency: '882 AM · Brisbane', language: 'English', description: 'News and talk', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/4BC.mp3' },

  { id: 'bbc-ws', name: 'BBC World Service', region: 'United Kingdom', frequency: 'Global', language: 'English', description: 'World news', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
  { id: 'lbc-news', name: 'LBC News', region: 'United Kingdom', frequency: 'National', language: 'English', description: 'Rolling UK news', stream: 'https://media-ssl.musicradio.com/LBCNewsUK' },
  { id: 'times-radio', name: 'Times Radio', region: 'United Kingdom', frequency: 'National', language: 'English', description: 'News, analysis and interviews', stream: 'https://times.live.stream.broadcasting.news/stream' },
  { id: 'talksport', name: 'talkSPORT', region: 'United Kingdom', frequency: 'National', language: 'English', description: 'Sports news and talk', stream: 'https://radio.talksport.com/stream' },
  { id: 'gb-news-radio', name: 'GB News Radio', region: 'United Kingdom', frequency: 'National', language: 'English', description: 'News and opinion', stream: 'https://listen-gbnews.sharp-stream.com/gbnews.mp3' },
  { id: 'talk-radio', name: 'TalkRadio', region: 'United Kingdom', frequency: 'National', language: 'English', description: 'News and debate', stream: 'https://radio.talkradio.co.uk/stream' },

  { id: 'npr', name: 'NPR', region: 'United States', frequency: 'National', language: 'English', description: 'News and culture', stream: 'https://npr-ice.streamguys1.com/live.mp3' },
  { id: 'bloomberg-radio', name: 'Bloomberg Radio', region: 'United States', frequency: '1130 AM · New York', language: 'English', description: 'Business and markets', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WBBRAMAAC48.aac' },
  { id: 'fox-news-radio', name: 'Fox News Radio', region: 'United States', frequency: 'National', language: 'English', description: 'News and talk', stream: 'https://live.amperwave.net/direct/foxnewsradio-foxnewsradioaac-imc?source=fnr.web' },
  { id: 'msnbc', name: 'MSNBC', region: 'United States', frequency: 'National', language: 'English', description: 'News and analysis', stream: 'https://tunein.cdnstream1.com/3511_96.mp3' },
  { id: 'rfi-english', name: 'RFI English', region: 'France', frequency: 'Global', language: 'English', description: 'World news from Paris', stream: 'https://rfienanglais64k.ice.infomaniak.ch/rfienanglais-64.mp3' },
  { id: 'cfrb-1010', name: 'CFRB 1010', region: 'Canada', frequency: '1010 AM · Toronto', language: 'English', description: 'News and talk', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CFRBAM.mp3' },
];

export const PODCAST_SHOWS = [
  {
    id: 'keluar-sekejap',
    name: 'Keluar Sekejap',
    publisher: 'Keluar Sekejap',
    hosts: 'Khairy Jamaluddin & Shahril Hamdan',
    region: 'Malaysia',
    category: 'Malaysia',
    feedUrl: 'https://anchor.fm/s/de2f4d90/podcast/rss',
    site: 'https://www.youtube.com/@KeluarSekejap',
    description: 'Malaysian politics, policy and current affairs.',
  },
  {
    id: 'the-daily',
    name: 'The Daily',
    publisher: 'The New York Times',
    hosts: 'Michael Barbaro',
    region: 'United States',
    category: 'Global',
    feedUrl: 'https://feeds.simplecast.com/Sl5CSM3S',
    site: 'https://www.nytimes.com/column/the-daily',
    description: 'The biggest stories of the day, explained by the journalists reporting them.',
  },
  {
    id: 'the-intelligence',
    name: 'The Intelligence',
    publisher: 'The Economist',
    hosts: 'The Economist',
    region: 'United Kingdom',
    category: 'Global',
    feedUrl: 'https://access.acast.com/rss/d556eb54-6160-4c85-95f4-47d9f5216c49?limit=40',
    site: 'https://www.economist.com/podcasts',
    description: 'A daily analysis of the world from The Economist.',
  },
  {
    id: 'wsj-whats-news',
    name: "WSJ What's News",
    publisher: 'The Wall Street Journal',
    hosts: 'The Wall Street Journal',
    region: 'United States',
    category: 'Business',
    feedUrl: 'https://video-api.shdsvc.dowjones.io/api/podcasts/the%20wall%20street%20journal%20whats%20news/feed',
    site: 'https://www.wsj.com/podcasts',
    description: 'The top business and markets stories in a short daily briefing.',
  },
  {
    id: 'ft-news-briefing',
    name: 'FT News Briefing',
    publisher: 'Financial Times',
    hosts: 'Marc Filippino',
    region: 'United Kingdom',
    category: 'Business',
    feedUrl: 'https://feeds.acast.com/public/shows/73fe3ede-5c5c-4850-96a8-30db8dbae8bf',
    site: 'https://www.ft.com/news-briefing',
    description: 'The global business stories that matter, every weekday morning.',
  },
  {
    id: 'big-take',
    name: 'Big Take',
    publisher: 'Bloomberg',
    hosts: 'Bloomberg',
    region: 'United States',
    category: 'Business',
    feedUrl: 'https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/825d4e29-b616-46f4-afd7-ae2b0013005c/8b1dd624-a026-43e9-8b57-ae2b00130066/podcast.rss',
    site: 'https://www.bloomberg.com/podcasts',
    description: 'One big story from the global economy, explained by Bloomberg journalists.',
  },
  {
    id: 'bbc-global-news',
    name: 'Global News Podcast',
    publisher: 'BBC World Service',
    hosts: 'BBC World Service',
    region: 'United Kingdom',
    category: 'Global',
    feedUrl: 'https://podcasts.files.bbci.co.uk/p02nq0gn.rss',
    site: 'https://www.bbc.co.uk/programmes/p02nq0gn',
    description: 'The day’s top stories from BBC correspondents around the world.',
  },
  {
    id: 'the-news-agents',
    name: 'The News Agents',
    publisher: 'Global',
    hosts: 'Emily Maitlis, Jon Sopel & Lewis Goodall',
    region: 'United Kingdom',
    category: 'UK',
    feedUrl: 'https://feeds.captivate.fm/the-news-agents/',
    site: 'https://www.globalplayer.com/podcasts',
    description: 'British politics and world affairs, without the spin.',
  },
  {
    id: 'up-first',
    name: 'Up First',
    publisher: 'NPR',
    hosts: 'NPR',
    region: 'United States',
    category: 'US',
    feedUrl: 'https://feeds.npr.org/510318/podcast.xml',
    site: 'https://www.npr.org/podcasts/510318/up-first',
    description: 'The three stories you need to start your day.',
  },
  {
    id: 'abc-news-daily',
    name: 'ABC News Daily',
    publisher: 'ABC Australia',
    hosts: 'Samantha Hawley',
    region: 'Australia',
    category: 'Australia',
    feedUrl: 'https://www.abc.net.au/feeds/9443166/podcast.xml',
    site: 'https://www.abc.net.au/listen/programs/abc-news-daily',
    description: 'One big Australian story each morning, with the reporters who know it best.',
  },
  {
    id: 'the-decibel',
    name: 'The Decibel',
    publisher: 'The Globe and Mail',
    hosts: 'The Globe and Mail',
    region: 'Canada',
    category: 'Canada',
    feedUrl: 'https://feeds.simplecast.com/TGclX98p',
    site: 'https://www.theglobeandmail.com/podcasts',
    description: 'A daily Canadian news podcast from The Globe and Mail.',
  },
  {
    id: 'straits-times-headlines',
    name: 'ST News Headlines',
    publisher: 'The Straits Times · Money FM 89.3',
    hosts: 'The Straits Times',
    region: 'Singapore',
    category: 'Singapore',
    feedUrl: 'https://www.omnycontent.com/d/playlist/d9486183-3dd4-4ad6-aebe-a4c1008455d5/4e188010-01ce-44a9-bf38-adcf004a366a/a86dfcac-e7b5-4438-b84b-adcf004aff3b/podcast.rss',
    site: 'https://www.straitstimes.com/podcasts',
    description: 'Singapore and world headlines from The Straits Times newsroom.',
  },
  {
    id: 'cna-deep-dive',
    name: 'CNA Deep Dive',
    publisher: 'CNA',
    hosts: 'CNA',
    region: 'Singapore',
    category: 'Singapore',
    feedUrl: 'https://www.omnycontent.com/d/playlist/7740012e-e1bd-4f85-81c4-a7f50047134a/053184de-200a-4a53-a80c-ab6e006ab608/22e00ef9-7730-4062-8cd4-ab6e006ab624/podcast.rss',
    site: 'https://www.channelnewsasia.com/podcasts',
    description: 'Singapore and Asia current affairs, explained in depth.',
  },
  {
    id: 'three-things',
    name: '3 Things',
    publisher: 'The Indian Express',
    hosts: 'The Indian Express',
    region: 'India',
    category: 'India',
    feedUrl: 'https://www.spreaker.com/show/5008053/episodes/feed',
    site: 'https://indianexpress.com/audio/3-things',
    description: 'Three things you need to know about India today.',
  },
  {
    id: 'the-rest-is-politics',
    name: 'The Rest Is Politics',
    publisher: 'Goalhanger',
    hosts: 'Rory Stewart & Alastair Campbell',
    region: 'United Kingdom',
    category: 'UK',
    feedUrl: 'https://feeds.megaphone.fm/GLT9190936013',
    site: 'https://www.goalhanger.com/the-rest-is-politics',
    description: 'Two former insiders on the politics behind the headlines.',
  },
  {
    id: 'the-daily-aus',
    name: 'The Daily Aus',
    publisher: 'The Daily Aus',
    hosts: 'The Daily Aus',
    region: 'Australia',
    category: 'Australia',
    feedUrl: 'https://feeds.megaphone.fm/DAH3715264617',
    site: 'https://thedailyaus.com.au',
    description: 'Australian and global news, made for a younger generation.',
  },
];

// Complete No Wall News outlet directory. These are listed in the source
// library and can be used in custom topics; built-in topics keep their
// curated feeds so the snapshot refresh stays fast.
const configuredDomains = new Set(FEEDS.map((feed) => feed.domain).filter(Boolean));
const directoryFeeds = OUTLET_DIRECTORY.filter((feed) => !configuredDomains.has(feed.domain));
FEEDS.push(...directoryFeeds);

export const STORAGE = {
  settings: 'newsreader_settings_v1',
  customRules: 'newsreader_domain_rules_v1',
  customFeeds: 'newsreader_custom_feeds_v1',
  customTopics: 'newsreader_custom_topics_v1',
  liveCachePrefix: 'newsreader_live_',
  archiveCache: 'newsreader_archive_cache_v1',
};

export const FEED_LIMIT = 14;
export const TOPIC_ARTICLE_LIMIT = 48;
export const LIVE_CACHE_TTL = 10 * 60 * 1000;

export function getFeedById(id) {
  return FEEDS.find((feed) => feed.id === id) || null;
}

export function normalizeDomain(input) {
  if (!input || typeof input !== 'string') return '';
  let host = input.trim().toLowerCase();
  try {
    if (host.startsWith('http://') || host.startsWith('https://')) {
      host = new URL(host).hostname;
    }
  } catch { /* keep raw */ }
  host = host.split(':')[0].split('/')[0].replace(/^www\./, '').replace(/\.+$/, '');
  return host;
}
