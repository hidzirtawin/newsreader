# Tawin Newsreader

**Live:** <https://hidzirtawin.github.io/newsreader/>

A fast, static news reader built around a Flipboard-style magazine layout. It brings together regional publishers, live news radio and podcasts in one installable PWA — with no build step and no server-side runtime.

Built in the spirit of [OpenWire](https://github.com/AnsonLai/OpenWire) (AGPL-3.0), but implemented independently for this project.

## What's inside

- **In-app reader** — stories open in a reader overlay, never in a new tab. It extracts the article text, tries an archived copy when a publisher blocks access, and shows a clearly labelled publisher brief when full text is unavailable. Back returns to the feed at the same scroll position.
- **Strictly latest-first** — the lead story and every card below it are ordered by publication time, newest at the top and older stories at the bottom. There is no editorial reshuffling.
- **Magazine feed** — lead story, two-column features, compact rows and mid-feed banners. Stories without photos fall back to clean text layouts.
- **Auto-refresh** — every five minutes the app quietly checks a watch set of high-frequency wires and mastheads. New stories appear in a banner at the top; click it to bring the fresh edition forward without losing your place.
- **Briefing desk** — Reuters, AP, CNN, The Independent and ABC News US in one readable front page. Hard-paywalled titles sit in the Briefs desk.
- **Regional editions** — Top Stories, Latest, Briefing, Your Country, Video, World, US, UK, Europe, Middle East, Africa, Latin America, Asia, India, China, Russia, Australia, Canada, Singapore, Malaysia, Business, Tech, AI, Sports, Health, Science, Entertainment, Politics, Finance and Lifestyle. **113 country desks** are available from the Your Country picker, kept out of the main tab strip so the header stays clean.
- **Singapore desk** — CNA, Mothership and Berita Harian Singapore; The Straits Times is kept in Briefs.
- **Malaysia desk** — Malay Mail, Free Malaysia Today, Berita Harian, New Straits Times, Utusan Malaysia and Kosmo!.
- **Australia desk** — ABC News, 7NEWS, Guardian Australia, SBS News, The Sydney Morning Herald, The Age, The Examiner, The Nightly, The West Australian, CODE Sports, The Daily Telegraph, The Australian and Herald Sun.
- **China desk** — South China Morning Post, BBC China, CGTN, Global Times, People's Daily and Sixth Tone.
- **Russia desk** — The Moscow Times and Meduza (independent) alongside TASS and RT (state-aligned) so readers can compare official and independent accounts.
- **Briefs desk** — hard-paywalled publishers (NYT, Bloomberg, FT, WSJ, The Economist, The Times, The Telegraph, The Washington Post, LA Times, The Straits Times, The Globe and Mail, Business Insider, Herald Sun, The Australian, The West Australian, CODE Sports, The Daily Telegraph) are moved into a clearly labelled Briefs desk so the main feeds contain only stories that open properly. A menu toggle can show briefs in every feed.
- **Africa and Latin America desks** — BBC Africa, Premium Times, BBC Latin America, Folha de S.Paulo, O Globo, Clarín and La Nación.
- **Health desk** — ScienceDaily Health, KFF Health News, WHO, Medical Xpress, News-Medical, Healthline and NPR.
- **Health Research desk** — 33 journal sources including The Lancet and its specialty titles, BMJ, PLOS Medicine, NEJM, Nature Medicine, Annals of Internal Medicine, JAMA, CDC, NIH, WHO and KFF. Includes 18 specialty filters, 8 study-format filters (trials, meta-analyses, guidelines, reviews, observational, case reports, basic science), three-line publisher abstracts, and 13 standard medical calculators (BMI, BSA, eGFR, CHA₂DS₂-VASc, HAS-BLED, CURB-65, Wells DVT/PE, qSOFA, MAP, anion gap, corrected calcium, maintenance fluids). Publisher abstracts only; free full-text copies are located through OpenAlex and open in the in-app viewer. Calculators are for education, not medical advice.
- **Video desk** — live news channels (Sky News, Al Jazeera, DW, France 24, ABC News, Bloomberg TV and Astro Awani) plus on-demand video reports from BBC, Reuters, PBS, The Guardian and more, played in an in-app player.
- **Markets under Business** — the same TradingView market box used by No Wall News: a live ticker, US market status, clickable top movers and a crypto table sit above the Business desk.
- **Sports desk** — a dedicated sub-navigation for All Sport, Football, Cricket, Rugby League, Rugby Union, Boxing, MMA, Tennis, Formula 1, Golf, NBA and NFL, using BBC Sport, The Guardian, ESPNcricinfo, BoxingScene, Sherdog, Autosport and CBS Sports.
- **Wider world** — BBC, Reuters, AP, Al Jazeera, CNN, The Washington Post, NBC News, Fox News, USA Today, CBS, LA Times, NPR, CNBC, Bloomberg, Business Insider, The Guardian, Sky News, The Economist, SCMP, Nikkei Asia, The Japan Times, Yonhap, The Diplomat, RNZ, The Times of India, The Indian Express, NDTV, Mint, Arab News, The Jerusalem Post, Der Spiegel, Die Zeit, Corriere della Sera, la Repubblica, El Mundo, El País, Politico Europe, EUobserver, Foreign Policy, Foreign Affairs, Premium Times, Folha de S.Paulo, O Globo, Clarín, La Nación and more.
- **Live radio** — 22 news/current-affairs stations from Malaysia, Singapore, Australia, the UK, the US, Canada and France, with a sticky player while you browse.
- **Podcasts** — a dropdown of 16 popular shows, including *Keluar Sekejap*, *The Daily*, *The Intelligence*, *WSJ What’s News*, *FT News Briefing*, *Big Take*, BBC *Global News Podcast*, *The News Agents*, *Up First*, *ABC News Daily*, *The Decibel*, *ST News Headlines*, *CNA Deep Dive*, *3 Things*, *The Rest Is Politics* and *The Daily Aus*, with a full audio player (seek, ±15s, speed, volume).
- **Headline sorting** — sport stories are kept out of Top Stories, World and the country desks and routed to the Sports desk, so the main news pages stay news-focused.
- **Transparent hard-paywall handling** — no blocked or paywalled page is ever opened. If a publication offers no readable or archived copy, Tawin Newsreader shows its publisher brief instead.
- **More from any publisher** — tap a source name on a story or the *Latest* button in the source library to open that publisher’s latest-first edition inside the app.
- **Canada desk** — CBC News, CBC Canada and CBC World; The Globe and Mail is kept in Briefs.
- **Your Country desk** — detects the country from the device time zone (with a country picker on every country desk) and shows free local headlines plus international coverage of that country.
- **Free-to-read model** — like No Wall News, the main feeds prefer outlets whose articles open without a subscription. Hard-paywalled publishers are kept in **BRIEFS** and can be re-enabled with **Include paywalled briefs**.
- **Find it free** — paste any article link from the menu and route it through the saved publisher rule, WallHop, Jina Reader or an archive copy.
- **Reading rules** — per-publisher routing through direct links, SMRY, RemovePaywall, UnWall, WallHop, Freedium, Jina Reader, Archive.is, Archive.today (archive.ph), Google Translate proxy, PrintFriendly or the Wayback Machine.
- **Archive locks** — hard-paywall stories are checked against Archive.is in the background. Stories without a snapshot are greyed out and locked; *Hide locked* removes them entirely.
- **Customisation** — create topics with keywords and chosen sources, add any RSS/Atom feed, reorder/hide tabs, and export all settings as JSON.
- **PWA** — installable on iOS, Android and desktop, with an offline app shell and bundled editions.

Built-in topics refresh from the same-origin edition snapshot and a tiny `data/version.json` marker, so they do not depend on public CORS proxies. The snapshot includes 50+ country desks and the free-outlet expansion; custom topics and custom feeds still use the proxy waterfall when needed.

The default order is **Latest first**. Auto-refresh runs every five minutes while the page is visible and online. For built-in desks it checks the small same-origin version marker, then downloads the new edition only when it has changed. New stories wait in a banner until you choose to apply them. Background refreshes never re-render the page, scroll position or the audio player; manual refresh remains an explicit action.

## Run it

```bash
npm start
```

Open <http://localhost:4173>. Any static server works:

```bash
python3 -m http.server 8080
```

A local HTTP server is required for the service worker and the in-app reader proxy; opening `index.html` directly still loads the app, but PWA install/offline caching and the full reader service will not work.

## Refresh the bundled editions

```bash
npm run refresh
```

This fetches every configured RSS/Atom feed directly from the publisher, enriches missing photos from public article metadata, and rewrites:

- `data/news.json` — offline headlines per topic
- `data/podcasts.json` — podcast episodes
- `data/image-cache.json` — seven-day photo cache
- `data/publisher-url-cache.json` — resolved Google News publisher URLs

The script is safe to run on a schedule (cron, GitHub Actions, etc.). Keep photo lookups bounded if you add many feeds.

## Deploy

Any static host works: GitHub Pages, Cloudflare Pages, Netlify, Vercel, S3 or Nginx. Publish the repository root.

The included workflow at `.github/workflows/refresh-news.yml` rebuilds the bundled news editions every 10 minutes and commits them back; `.github/workflows/refresh-podcasts.yml` refreshes podcast feeds every six hours. Enable GitHub Actions write permissions for the repository (or adapt the workflow to publish to your host) so the static snapshot stays fresh between client auto-refresh cycles.

## Notes on sources

- **The New Paper (Singapore)** stopped publishing in 2021 and no longer offers a working RSS feed, so it is not listed. Singapore coverage uses The Straits Times, CNA, Mothership and Berita Harian Singapore.
- Some Malaysian publishers no longer expose public RSS. The sources above are the ones that currently return usable feeds. You can add any new feed yourself under **Menu → Customize topics → RSS sources**.
- Several major mastheads (Herald Sun, The Australian, Reuters, AP, CNN, The Washington Post, NBC News, Fox News, USA Today, The Times, The Telegraph, The Independent, The Sydney Morning Herald and The Globe and Mail) block direct RSS clients. Tawin Newsreader uses each publisher's Google News index for those titles, then resolves the link to the publisher URL during `npm run refresh`. Resolved URLs are cached for 30 days. If a live wrapper cannot be resolved, clicking still follows Google's redirect to the publisher.
- Guardian feeds occasionally return HTTP 403 to non-browser clients. The refresh script uses browser-style requests; if a publisher rate-limits you, wait and run `npm run refresh` again.
- Radio streams belong to their broadcasters and can change without notice. The URLs here are public streams verified at build time.
- *Keluar Sekejap* is fetched from its official Anchor/Spotify for Podcasters RSS feed.

## Customise

- **Paywall rules** — **Menu → Paywall rules**. Add a domain, pick a reading tool, or reset to defaults. Click any badge on a story to change that publisher's rule in place.
- **Topics** — **Menu → Customize topics → Topics bar** to show, hide or reorder tabs.
- **New topic** — pick a preset or write keywords, then choose sources.
- **Sources** — add a name and feed URL, toggle built-in sources, or remove custom ones.
- **Quick URL** — **Menu → Open article URL** routes any link through a chosen tool and can remember that choice per site.
- **Export** — download topics, custom sources, rules and preferences as JSON.

All preferences live in `localStorage`; nothing is sent to a Tawin Newsreader server.

## Project structure

```
index.html                 app shell, dialogs and audio dock
css/styles.css             magazine theme, dark mode, radio/podcast UI
js/config.js               feeds, topics, radio stations, podcasts, rules
js/store.js                localStorage, topic/rule merging, caches
js/feedService.js          RSS/Atom parsing, proxies, curation, podcast parsing
js/archive.js              Archive.is and Wayback checks
js/app.js                  rendering, dialogs, player, interactions
scripts/refresh.mjs        offline snapshot generator
data/news.json             bundled headlines
data/podcasts.json         bundled episodes
server.mjs                 zero-dependency local static server
sw.js                      offline app shell
manifest.webmanifest       PWA metadata
icons/                     app icons
```

## Disclaimer

Headlines and photos belong to their publishers and link back to the original articles. Archive and reader tools are third-party services; availability and legality vary by publisher and jurisdiction. Use them responsibly and respect publishers' terms.
