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
      window.open(clients[0]?.url, '_blank');
      // clients.forEach((client) => {
      //   // postMessage将信息发送给界面
      //   client.postMessage(evt.notification.body);
      // });
    })
  );
});

// 推送通知
self.addEventListener("push", function (event) {
  console.log("🔥🔥🔥🚀 ~ file: sw.js:49 ~ push event:", event);
  const title = "Soulcial-test";
  const options = {
    body: event.data.text(),
    icon: "./static/img/logo_app.4dc3ab5d.png",
    badge: "./static/img/logo_app.4dc3ab5d.png",
  };
  console.log("🔥🔥🔥🚀 ~ file: sw.js:29 ~ text:", event.data.text());
  console.log("🔥🔥🔥🚀 ~ file: sw.js:29 ~ json:", event.data.json());
  console.log("🔥🔥🔥🚀 ~ file: sw.js:29 ~ parse:", JSON.parse(event.data.json()));
  self.registration.showNotification(title, options);
});
