// 安装Service Worker
self.addEventListener("install", function (event) {
  console.log("🔥🔥🔥🚀 ~ file: sw.js:3 ~ event:", event);
});

self.addEventListener("notificationclick", (evt) => {
  evt.notification.close();
  // 获取client
  evt.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      console.log("🔥🔥🔥🚀 ~ file: sw.js:16 ~ clients:", clients);
      clients.forEach((client) => {
        // postMessage将信息发送给界面
        client.postMessage(evt.notification.body);
      });
    })
  );
});

// 推送通知
self.addEventListener("push", function (event) {
  console.log("🔥🔥🔥🚀 ~ file: sw.js:49 ~ push event:", event);
  const title = "Soulcial-test";
  const options = {
    body: event.data.json(),
    icon: "./static/img/logo_app.4dc3ab5d.png",
    badge: "./static/img/logo_app.4dc3ab5d.png",
  };
  self.registration.showNotification(title, options);
});
