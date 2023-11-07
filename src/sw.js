  // 安装Service Worker
  self.addEventListener('install', function(event) {

    event.waitUntil(
    // caches.open('my-cache').then(function(cache) {
      // return cache.addAll([
      //   '/',
      //   '/index.html',
      //   '/styles.css',
      //   '/app.js'
      // ]);
    // })
  );
});

// // 激活Service Worker
// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           return cacheName !== 'my-cache';
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });

// // 拦截网络请求
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });

// // 更新缓存
// self.addEventListener('message', function(event) {
//   if (event.data.action === 'skipWaiting') {
//     self.skipWaiting();
//   }
// });

// // 推送通知
// self.addEventListener('push', function(event) {
//   const title = 'My App';
//   const options = {
//     body: event.data.text(),
//     icon: '/images/icon.png',
//     badge: '/images/badge.png'
//   };
//   event.waitUntil(self.registration.showNotification(title, options));
// });