/* eslint-env serviceworker */
var CACHE_NAME = 'my-site-cache-v2'
var urlsToCache = [
  '/src/app.js',
  '/json_exemplos/all-source-licenses-LT8xBfyS.json',
  '/json_exemplos/bitcoin-unconfirmed-transactions.json',
  '/json_exemplos/MOCK_DATA.json',
  '/json_exemplos/pokedex.json',
  '/json_exemplos/servlet.json'
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
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response
        }

        return fetch(event.request).then(
          function (response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache)
              })

            return response
          }
        )
      })
  )
})
