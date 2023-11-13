// import { post } from "@/http/http.js";
// import { website } from "@/http/api.js";
// if ("serviceWorker" in navigator) {
//   const urlBase64ToUint8Array = (base64String) => {
//     const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//     const base64 = (base64String + padding)
//       .replace(/-/g, "+")
//       .replace(/_/g, "/");

//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);

//     for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
//   };
//   const arrayBufferToBase64 = (buffer) => {
//     var binary = "";
//     var bytes = new Uint8Array(buffer);
//     for (var i = 0; i < bytes.byteLength; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary);
//   };

//   // 公钥
//   const publicKey =
//     "BHLORrWUCwqhTvCWfpAGn2-EfWygzKJYv0oTrdMt0TTELMlU_vSn29ADKjPjyILhk4ayqkKDBA5wkdYVglCjS_w";

//   navigator.serviceWorker.register("./sw.js").then((registration) => {
//     // 检查浏览器是否支持推送通知
//     if (!("Notification" in window)) {
//       console.log("This browser does not support push notification.");
//       return;
//     }

//     // 请求用户授权
//     console.log("🔥🔥🔥🚀 ~ file: registerServiceWorker.js:35 ~ 请求用户授权:");
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         console.log("Notification permission granted.");

//         // 订阅web push服务，成功后提交endpoint至服务端保存
//         const convertedVapidKey = urlBase64ToUint8Array(publicKey);
//         const subscribeOption = {
//           userVisibleOnly: true,
//           applicationServerKey: convertedVapidKey,
//         };
//         registration.pushManager
//           .subscribe(subscribeOption)
//           .then((subscription) => {
//             console.log(
//               "Push notification subscription successful.",
//               subscription
//             );
//             // 提交endpoint
//             let url = `${website}pfp/api/notification/subscribe`;
//             let data = {
//               endpoint: subscription.endpoint,
//               keys: {
//                 p256dh: arrayBufferToBase64(subscription.getKey("p256dh")),
//                 auth: arrayBufferToBase64(subscription.getKey("auth")),
//               },
//             };
//             post(url, data, true)
//               .then((res) => {
//                 console.log(
//                   "订阅成功 save push endpoint result, " + JSON.stringify(res)
//                 );
//               })
//               .catch((error) => {
//                 console.log(
//                   "🔥🔥🔥🚀 ~ file: registerServiceWorker.js:47 ~ error:",
//                   error
//                 );
//               });
//           })
//           .catch((error) => {
//             console.log("Push notification subscription failed:", error);
//           });
//       } else {
//         console.log("Notification permission denied.");
//       }
//     });
//   });
// }
