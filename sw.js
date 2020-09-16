/* eslint-env serviceworker */
var CACHE_NAME = 'my-site-cache-v18'
var urlsToCache = [
  '/src/app.js',
  '/json_exemplos/all-source-licenses-LT8xBfyS.json',
  '/json_exemplos/bitcoin-unconfirmed-transactions.json',
  '/json_exemplos/MOCK_DATA.json',
  '/json_exemplos/pokedex.json',
  '/json_exemplos/servlet.json',
  '/dist/out.css',
  '/'
]

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', function (event) {
  console.log('fetch')
  event.respondWith(
    caches.open(CACHE_NAME).then(async function (cache) {
      const response = await cache.match(event.request)
      // Cache hit - return response
      if (response) {
        return response
      }
      const response1 = await fetch(event.request)
      // Check if we received a valid response
      if (!response1 || response1.status !== 200 || response1.type !== 'basic') {
        return response1
      }
      // IMPORTANT: Clone the response. A response is a stream
      // and because we want the browser to consume the response
      // as well as the cache consuming the response, we need
      // to clone it so we have two streams.
      var responseToCache = response1.clone()
      caches.open(CACHE_NAME)
        .then(function (cache1) {
          cache1.put(event.request, responseToCache)
        })
      return response1
    })
  )
})

self.addEventListener('activate', function (event) {
  console.log('activate')
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      console.log('cache purge ')
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
})
