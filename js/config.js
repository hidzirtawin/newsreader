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
  WAYBACK: 'wayback',
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
  { id: 'indian-express', name: 'The Indian Express', domain: 'indianexpress.com', group: 'India', url: 'https://indianexpress.com/feed/' },
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
  { id: 'cgtn', name: 'CGTN', domain: 'cgtn.com', group: 'China', url: 'https://www.cgtn.com/subscribe/rss/section/world.xml' },
  { id: 'global-times', name: 'Global Times', domain: 'globaltimes.cn', group: 'China', url: 'https://news.google.com/rss/search?q=site%3Aglobaltimes.cn&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'peoples-daily', name: "People's Daily", domain: 'en.people.cn', group: 'China', url: 'https://news.google.com/rss/search?q=site%3Aen.people.cn&hl=en-US&gl=US&ceid=US%3Aen', googleNews: true },
  { id: 'sixth-tone', name: 'Sixth Tone', domain: 'sixthtone.com', group: 'China', url: 'https://www.sixthtone.com/rss' },

  // Russia (English-language, state and independent)
  { id: 'moscow-times', name: 'The Moscow Times', domain: 'themoscowtimes.com', group: 'Russia', url: 'https://www.themoscowtimes.com/rss/news' },
  { id: 'tass', name: 'TASS', domain: 'tass.com', group: 'Russia', url: 'https://tass.com/rss/v2.xml' },
  { id: 'meduza', name: 'Meduza', domain: 'meduza.io', group: 'Russia', url: 'https://meduza.io/rss/en/all' },
  { id: 'rt', name: 'RT', domain: 'rt.com', group: 'Russia', url: 'https://www.rt.com/rss/' },
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
  { id: 'australia', label: 'AUSTRALIA', title: 'Australia', feeds: ['abc-au', '7news', 'guardian-au', 'sbs-au', 'smh', 'herald-sun', 'the-australian'] },
  { id: 'canada', label: 'CANADA', title: 'Canada', feeds: ['cbc-top', 'cbc-canada', 'cbc-world', 'globe-mail'] },
  { id: 'singapore', label: 'SINGAPORE', title: 'Singapore', feeds: ['straitstimes-sg', 'cna', 'mothership', 'beritaharian-sg'] },
  { id: 'malaysia', label: 'MALAYSIA', title: 'Malaysia', feeds: ['berita-harian', 'nst', 'fmt', 'utusan', 'kosmo'] },
  { id: 'asia', label: 'ASIA', title: 'Asia', feeds: ['cna', 'straitstimes-asia', 'scmp', 'scmp-china', 'nikkei', 'japan-times', 'taipei-times', 'aljazeera'] },
  { id: 'europe', label: 'EUROPE', title: 'Europe', feeds: ['bbc-europe', 'dw', 'france24', 'euronews', 'el-pais', 'bloomberg-politics'] },
  { id: 'middle-east', label: 'MIDDLE EAST', title: 'Middle East', feeds: ['bbc-middle-east', 'aljazeera', 'arab-news', 'jpost'] },
  { id: 'india', label: 'INDIA', title: 'India', feeds: ['bbc-india', 'indian-express', 'times-of-india'] },
  { id: 'china', label: 'CHINA', title: 'China', feeds: ['scmp', 'scmp-china', 'bbc-china', 'cgtn', 'global-times', 'peoples-daily', 'sixth-tone'] },
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
  { id: 'sports', label: 'SPORTS', title: 'Sports', feeds: ['espn', 'bbc-sport', 'cbc-sports', 'guardian-sport'] },
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
export const RADIO_STATIONS = [
  { id: 'bfm-my', name: 'BFM 89.9', region: 'Malaysia', frequency: '89.9 FM', language: 'English', description: 'Business and current affairs', stream: 'https://22253.live.streamtheworld.com/BFM_SC' },
  { id: 'nasional-fm', name: 'Nasional FM', region: 'Malaysia', frequency: '88.5 FM', language: 'Malay', description: 'National news and talk', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NASIONAL_FM.mp3' },

  { id: 'cna938', name: 'CNA 938', region: 'Singapore', frequency: '93.8 FM', language: 'English', description: 'News and current affairs', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/938NOW_PREM.aac' },
  { id: 'money-fm', name: 'Money FM 89.3', region: 'Singapore', frequency: '89.3 FM', language: 'English', description: 'Business and markets', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MONEY_893AAC.aac' },

  { id: 'abc-news-radio', name: 'ABC News Radio', region: 'Australia', frequency: 'National', language: 'English', description: 'Rolling news', stream: 'https://abc.streamguys1.com/live/newsradio/icecast.audio' },
  { id: 'sky-news-au', name: 'Sky News Australia Radio', region: 'Australia', frequency: 'National', language: 'English', description: 'News and opinion', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVA_SKYNEWS.mp3' },
  { id: '3aw', name: '3AW 693', region: 'Australia', frequency: '693 AM · Melbourne', language: 'English', description: 'News and talk', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/3AW.mp3' },

  { id: 'bbc-ws', name: 'BBC World Service', region: 'United Kingdom', frequency: 'Global', language: 'English', description: 'World news', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
  { id: 'lbc-news', name: 'LBC News', region: 'United Kingdom', frequency: 'National', language: 'English', description: 'Rolling UK news', stream: 'https://media-ssl.musicradio.com/LBCNewsUK' },
  { id: 'times-radio', name: 'Times Radio', region: 'United Kingdom', frequency: 'National', language: 'English', description: 'News, analysis and interviews', stream: 'https://times.live.stream.broadcasting.news/stream' },
  { id: 'talksport', name: 'talkSPORT', region: 'United Kingdom', frequency: 'National', language: 'English', description: 'Sports news and talk', stream: 'https://radio.talksport.com/stream' },

  { id: 'npr', name: 'NPR', region: 'United States', frequency: 'National', language: 'English', description: 'News and culture', stream: 'https://npr-ice.streamguys1.com/live.mp3' },
  { id: 'bloomberg-radio', name: 'Bloomberg Radio', region: 'United States', frequency: '1130 AM · New York', language: 'English', description: 'Business and markets', stream: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WBBRAMAAC48.aac' },
  { id: 'fox-news-radio', name: 'Fox News Radio', region: 'United States', frequency: 'National', language: 'English', description: 'News and talk', stream: 'https://live.amperwave.net/direct/foxnewsradio-foxnewsradioaac-imc?source=fnr.web' },
  { id: 'msnbc', name: 'MSNBC', region: 'United States', frequency: 'National', language: 'English', description: 'News and analysis', stream: 'https://tunein.cdnstream1.com/3511_96.mp3' },
];

export const PODCAST_SHOWS = [
  {
    id: 'keluar-sekejap',
    name: 'Keluar Sekejap',
    hosts: 'Khairy Jamaluddin & Shahril Hamdan',
    region: 'Malaysia',
    feedUrl: 'https://anchor.fm/s/de2f4d90/podcast/rss',
    site: 'https://www.youtube.com/@KeluarSekejap',
    description: 'Malaysian politics, policy and current affairs.',
  },
];

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
