const applicationName = "restaurant-reviews-app-mws" 
const staticCacheName = applicationName + "-v1.0";

const contentImgsCache = applicationName + "-images";

var allCaches = [
    staticCacheName,
    contentImgsCache
  ];

  /** At Service Worker Install time, cache all static assets */
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(staticCacheName).then(function(cache) {
        return cache.addAll([
          '/', // caches index.html
          '/restaurant.html',
          '/css/styles.css',
           '/js/dbhelper.js',
          '/js/mapkeypass.js',
          '/js/main.js',
          'js/reg-sw.js', 
          '/js/restaurant_info.js',
          'data/restaurants.json'
        ]);
      })
    );
  });


self.addEventListener('fetch', function(event) {
    const requestUrl = new URL(event.request.url); 
  if (requestUrl.origin === location.origin) {  
    if (requestUrl.pathname.startsWith('/restaurant.html')) {
      event.respondWith(caches.match('/restaurant.html'));
      return; 
    }
        if (requestUrl.pathname.startsWith('/img')) {
            event.respondWith(renewImage(event.request));
            return; 
          }
  }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  function renewImage(request) {
    let imagecontainerUrl = request.url;
    imagecontainerUrl = imagecontainerUrl.replace(/-small\.\w{3}|-medium\.\w{3}|-large\.\w{3}/i, '');
    return caches.open(contentImgsCache).then(function(cache) {
      return cache.match(imagecontainerUrl).then(function(response) {
        return response || fetch(request).then(function(networkResponse) {
          cache.put(imagecontainerUrl, networkResponse.clone());
          return networkResponse;
        });
      });
    });
  }
/** Activates Service Worker, Delete previous caches, if any */
self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith(applicationName) &&
                   !allCaches.includes(cacheName);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }); 