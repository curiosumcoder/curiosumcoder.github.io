// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
const version = 'v0';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(version).then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/escudo-costa-rica.svg'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (response) {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            let responseClone = response.clone();

            caches.open(version).then(function (cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function () {
            return caches.match('/gallery/myLittleVader.jpg');
          });
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  var cacheKeeplist = [version];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});