# Newsreader

A fast, static news reader built around a Flipboard-style magazine layout. It brings together regional publishers, live news radio and podcasts in one installable PWA — with no build step and no server-side runtime.

Built in the spirit of [OpenWire](https://github.com/AnsonLai/OpenWire) (AGPL-3.0), but implemented independently for this project.

## What's inside

- **Strictly latest-first** — the lead story and every card below it are ordered by publication time, newest at the top and older stories at the bottom. There is no editorial reshuffling.
- **Magazine feed** — lead story, two-column features, compact rows and mid-feed banners. Stories without photos fall back to clean text layouts.
- **Auto-refresh** — every five minutes the app quietly checks a watch set of high-frequency wires and mastheads. New stories appear in a banner at the top; click it to bring the fresh edition forward without losing your place.
- **Briefing desk** — Reuters, AP, NYT, The Economist, Financial Times, WSJ, Bloomberg, CNN, The Washington Post, The Times, The Telegraph, The Independent, ABC News US, The Australian and Herald Sun in one front page.
- **Regional editions** — Top Stories, Latest, Briefing, World, US, UK, Europe, Middle East, Asia, India, Australia, Canada, Singapore, Malaysia, Business, Tech, AI, Sports, Science, Entertainment, Politics, Finance and Lifestyle.
- **Singapore desk** — The Straits Times (Singapore, World, Asia, Business feeds), CNA, Mothership and Berita Harian Singapore.
- **Malaysia desk** — Berita Harian, New Straits Times, Free Malaysia Today, Utusan Malaysia and Kosmo!.
- **Australia desk** — ABC News Australia, Guardian Australia, SBS News, The Sydney Morning Herald, The Australian and Herald Sun.
- **Wider world** — BBC, Reuters, AP, Al Jazeera, CNN, The Washington Post, NBC News, Fox News, USA Today, CBS, LA Times, NPR, CNBC, Bloomberg, The Guardian, Sky News, The Economist, SCMP, Nikkei Asia, The Japan Times, The Times of India, The Indian Express, Arab News, The Jerusalem Post, Taipei Times, El País and more.
- **Live radio** — 15 news/current-affairs stations from Malaysia, Singapore, Australia, the UK and the US, with a sticky player while you browse.
- **Podcasts** — *Keluar Sekejap* episodes from the show's official feed, with a full audio player (seek, ±15s, speed, volume).
- **Canada desk** — CBC News, CBC Canada, CBC World and The Globe and Mail.
- **Reading rules** — per-publisher routing through direct links, SMRY, RemovePaywall, UnWall, Freedium, Jina Reader, Archive.is or the Wayback Machine.
- **Archive locks** — hard-paywall stories are checked against Archive.is in the background. Stories without a snapshot are greyed out and locked; *Hide locked* removes them entirely.
- **Customisation** — create topics with keywords and chosen sources, add any RSS/Atom feed, reorder/hide tabs, and export all settings as JSON.
- **PWA** — installable on iOS, Android and desktop, with an offline app shell and bundled editions.

The app tries live feeds first through public CORS proxies. If a publisher or proxy is unavailable, it falls back to the snapshots in `data/news.json` and `data/podcasts.json`.

The default order is **Latest first**. Auto-refresh runs every five minutes while the page is visible and online. It polls only the first six feeds of the active topic (the fastest wires and mastheads), then keeps any new stories in a banner until you choose to apply them, so the page never jumps while you are reading.

## Run it

```bash
npm start
```

Open <http://localhost:4173>. Any static server works:

```bash
python3 -m http.server 8080
```

A local HTTP server is required for the service worker; opening `index.html` directly still loads the app, but PWA install/offline caching will not work.

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

The included workflow at `.github/workflows/refresh.yml` rebuilds the bundled editions every 30 minutes and commits them back. Enable GitHub Actions write permissions for the repository (or adapt the workflow to publish to your host) so the static snapshot stays fresh between client auto-refresh cycles.

## Notes on sources

- **The New Paper (Singapore)** stopped publishing in 2021 and no longer offers a working RSS feed, so it is not listed. Singapore coverage uses The Straits Times, CNA, Mothership and Berita Harian Singapore.
- Some Malaysian publishers no longer expose public RSS. The sources above are the ones that currently return usable feeds. You can add any new feed yourself under **Menu → Customize topics → RSS sources**.
- Several major mastheads (Herald Sun, The Australian, Reuters, AP, CNN, The Washington Post, NBC News, Fox News, USA Today, The Times, The Telegraph, The Independent, The Sydney Morning Herald and The Globe and Mail) block direct RSS clients. Newsreader uses each publisher's Google News index for those titles, then resolves the link to the publisher URL during `npm run refresh`. Resolved URLs are cached for 30 days. If a live wrapper cannot be resolved, clicking still follows Google's redirect to the publisher.
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

All preferences live in `localStorage`; nothing is sent to a Newsreader server.

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
