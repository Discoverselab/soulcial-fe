import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import rem from "./rem";
import api from "./http/api";
import store from'./store/index';
import loginData from "./libs/loginData";
import VueDragscroll from "vue-dragscroll";
import AOS from "aos";
import "../node_modules/aos/dist/aos.css";
import "./assets/css/public.scss";
import "./assets/font/font.css";
import Vant from "vant";
import "vant/lib/index.css";
import "@vant/touch-emulator";
import VueLazyload from "vue-lazyload";
import loadingImg from "./assets/loadingImg.png";
import Overlay from "./components/Overlay.vue";
import "@/assets/css/iconfont.css";
import Meta from "vue-meta";
import "./registerServiceWorker.js";
import vConsole from 'vconsole'
import { isPROD } from "./libs/common.js";
import { handleError } from "./utils/utils";
Vue.use(Meta, {
  refreshOnceOnNavigation: true,
});

Vue.use(VueLazyload, {
  loading: loadingImg, // 占位符图片
  attempt: 1, // 尝试加载次数
  throttleWait: 0, // 滚动节流时间
  observerOptions: {
    rootMargin: "0px", // 根边界
    threshold: 0.1, // 阈值，表示元素进入可视区域的比例
  },
});
Vue.use(Vant);
Vue.use(AOS);
Vue.use(VueDragscroll);
if (!isPROD) {
  Vue.prototype.$vConsole = new vConsole()
}
import MetaInfo from "vue-meta-info";
import VueI18n from "vue-i18n";
import "./icons/index.js";

Vue.use(MetaInfo);
Vue.use(VueI18n);
Vue.component("Overlay", Overlay);
const i18n = new VueI18n({
  locale: localStorage.getItem("lang") ? localStorage.getItem("lang") : "en-US",
  messages: {
    "en-US": require("./lang/en"),
    "ko-RE": require("./lang/ko"),
    jpn: require("./lang/jpn"),
  },
});
Vue.prototype.$network = "ETH";
Vue.prototype.$api = api;
Vue.prototype.$handleErrorImg = handleError;
Vue.prototype.$loginData = loginData;
Vue.config.productionTip = false;
// new WOW().init();
new Vue({
  render: (h) => h(App),
  router,
  store,
  rem,
  i18n,
  mounted() {
    document.dispatchEvent(new Event("render-event"));
  },
}).$mount("#app");
