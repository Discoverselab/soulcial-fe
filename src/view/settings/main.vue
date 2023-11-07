<template>
  <div class="settings">
    <!--operate -->
    <div class="user_infor">
      <div class="set_top">
        <div @click="$router.push('/home')">
          <img class="back" src="../../assets/back.png" alt="" />
        </div>
        <p class="title">Edit profile</p>
        <div class="set_right"></div>
      </div>
      <!-- portrait -->
      <div class="portrait">
        <img class="avatar" :src="UserInfo.avatar" alt="" />

        <div class="upImg">
          <img src="../../assets/upImg.png" alt="" />
          <van-uploader style="
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              overflow: hidden;
            " :after-read="afterRead" :max-size="5 * 1024 * 1024" @oversize="onOversize">
          </van-uploader>
        </div>
      </div>
      <!-- setInfor -->
      <div class="Infor_cont">
        <div class="infor_list" @click="$router.push(`/settingsName?value=${userName}`)">
          <span class="key">Name</span>
          <div class="value_cont" v-if="UserInfo.userName">
            <p class="value">{{ UserInfo.userName }}</p>
            <img src="../../assets/xia.png" alt="" />
          </div>
        </div>
        <div class="infor_list" @click="$router.push(`/settingsBio?value=${UserInfo.bio || ''}`)">
          <span class="key">Bio</span>
          <div class="value_cont">
            <p class="value">{{ UserInfo.bio || "" }}</p>
            <img src="../../assets/xia.png" alt="" />
          </div>
        </div>
        <div class="infor_list">
          <span class="key">Twitter Connect</span>
          <div class="value_cont">
            <van-switch active-color="#F5F5ED" :disabled="checked" inactive-color="#F5F5ED" :value="checked" @change="onInput" />
          </div>
        </div>
      </div>
      <div class="set_but">
        <button class="cancel" @click="quit">Disconnected Wallet</button>
      </div>
    </div>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import computed from "./src/computed";
import AOS from "aos";
import Overlay from "../../components/Overlay.vue";
import { analysisUrl } from "../../utils/utils";
export default {
  name: "home",
  data() {
    return {
      overlayshow: false,
      UserInfo: {},
      checked: false
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  components: { Overlay },
  created() {
    let url = ''
    if (window.location.href.indexOf('#') > -1) {
      url = window.location.href.split('#')[0]
    }
    if (analysisUrl(url, 'oauth_verifier')) {
      this.overlayshow = true
      // twitter授权成功
      this.setTwitterUserInfo(analysisUrl(url, 'oauth_verifier'))
    }else{
      this.getUserInfo();
    }
  },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
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
  destroyed() { },
};
</script>

<style lang="scss">
@import "./sass/style.scss";
</style>
