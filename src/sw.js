// 安装Service Worker
self.addEventListener("install", function (event) {
  console.log("🔥🔥🔥🚀 ~ file: sw.js:3 ~ event:", event);
});

self.addEventListener("notificationclick", (evt) => {
  evt.notification.close();
  // 在新窗口打开页面
  evt.waitUntil(
    // eslint-disable-next-line no-undef
    clients.openWindow(evt.notification.data.url)
  );
});

// 推送通知
self.addEventListener("push", function (event) {
  let { title, body, url, icon } = event.data.json();
  const options = {
    body,
    icon,
    data: {
      url,
    },
  };
  self.registration.showNotification(title, options);
});
