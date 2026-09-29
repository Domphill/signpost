/* Signpost - offline support. The app files are cached so Signpost opens without a connection.
   Bump VERSION when files change. Only caches named signpost-* are touched, because other apps
   (Lantern, Fuel, Buzz, Wardrobe) share this origin. */
const VERSION = 'signpost-v1';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'fonts/fonts.css',
  'fonts/atkinson-next-400-700.woff2',
  'fonts/bitter-500-700.woff2',
  'icons/icon-192.png',
  'icons/apple-touch-icon.png',
  'src/base.css',
  'src/data.js',
  'src/score.js',
  'src/app.js'
];

self.addEventListener('install', (e) => {
  /* cache: 'reload' skips the browser's HTTP cache, so a new version never precaches old files. */
  e.waitUntil(
    caches
      .open(VERSION)
      .then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('signpost-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  /* Cached copy first for speed and offline use; refresh it in the background. */
  e.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(e.request, { ignoreSearch: true }).then((hit) => {
        const fresh = fetch(e.request)
          .then((res) => {
            if (res && res.ok) cache.put(e.request, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || fresh;
      })
    )
  );
});
