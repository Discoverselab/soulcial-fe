if (!("serviceWorker" in navigator)) return;
import axios from "axios";
import { post } from "@/http/http.js";
// 公钥
const publicKey =
  "BHLORrWUCwqhTvCWfpAGn2-EfWygzKJYv0oTrdMt0TTELMlU_vSn29ADKjPjyILhk4ayqkKDBA5wkdYVglCjS_w";
console.log(
  "🔥🔥🔥🚀 ~ file: registerServiceWorker.js:5 ~ publicKey:",
  publicKey
);

navigator.serviceWorker.register("./sw.js", {
  // service worker 就绪
  ready(registration) {
    // 检查浏览器是否支持推送通知
    if (!("Notification" in window)) {
      console.log("This browser does not support push notification.");
      return;
    }

    // 请求用户授权
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");

        // 订阅web push服务，成功后提交endpoint至服务端保存
        const convertedVapidKey = urlBase64ToUint8Array(publicKey);
        const subscribeOption = {
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        };
        registration.pushManager
          .subscribe(subscribeOption)
          .then((subscription) => {
            console.log("Push notification subscription successful.");
            // 提交endpoint
            let url = this.$api.pwa.fetchSubscribe;
            post(url, subscription, true)
              .then((res) => {
                console.log(
                  "save push endpoint result, " + JSON.stringify(res)
                );
              })
              .catch((error) => {
                console.log("🔥🔥🔥🚀 ~ file: registerServiceWorker.js:47 ~ error:", error);
              });
          })
          .catch((error) => {
            console.log("Push notification subscription failed:", error);
          });
      } else {
        console.log("Notification permission denied.");
      }
    });
  },
  registered() {
    console.log("Service worker has been registered.");
  },
  cached() {
    console.log("Content has been cached for offline use.");
  },
  updatefound() {
    console.log("New content is downloading.");
  },
  updated() {
    console.log("New content is available; please refresh.");
  },
  offline() {
    console.log(
      "No internet connection found. App is running in offline mode."
    );
  },
  error(error) {
    console.error("Error during service worker registration:", error);
  },
});

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
