<template>
  <div class="welcome_twitter">
    <p class="title">Link Twitter</p>
    <p class="title_infor">Let's create something fun!</p>
    <div class="twitter"></div>
    <div style="" class="my_soul">
      <div class="cudset_but">
        <button @click="linkTwitter">link with twitter</button>
        <button @click="skip" style="background-color: #DFDFCE;">SKIP</button>
      </div>
    </div>

    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import { analysisUrl } from "../../utils/utils";
import computed from "./src/computed";
import AOS from "aos";
export default {
  name: "",
  data() {
    return {
      inviteShow: false,// 邀请码被使用了的弹窗
      errmsg: null,//使用邀请码的错误提示
      usedInviteCode: false,
      whiteUser: false,
      address: "",
      loginType: 0,
      overlayshow: false,
      UserInfo: { address: "" },
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  created() {
    let url = ''
    if (window.location.href.indexOf('#') > -1) {
      url = window.location.href.split('#')[0]
    }
    if (analysisUrl(url, 'oauth_verifier')) {
      // twitter授权成功
      this.setTwitterUserInfo(analysisUrl(url, 'oauth_verifier'))
    }
  },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
    this.address = window.localStorage.getItem('address') || '-';
    AOS.init({
      offset: 200,
      duration: 200, //duration
      easing: "ease-in-sine",
      delay: 100,
    });
    console.log(this.$loginData);
    window.addEventListener("scroll", this.scrollToTop);
  },
  beforeRouteLeave(to, form, next) {
    // Leave the route to remove the scrolling event
    window.removeEventListener("scroll", this.scrollToTop);
    next();
  },
};
</script>

<style lang="scss">
@import "./sass/style.scss";

.welcome_twitter {
  display: flex;
  flex-direction: column;
  align-items: center;

  

  .twitter {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -62px;
    width: 124px;
    height: 120px;
    background: url('../../assets/twitter/icon_twitter.png') no-repeat center;
    background-size: 100% 100%;
  }
}
</style>
