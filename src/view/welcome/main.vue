<template>
  <div class="welcome">
    <p class="title">welcome!</p>
    <p class="title_infor">
      You have successfully
      Connect Wallet:
    </p>
    <div class="wallet">{{ substring(address) }}</div>

    <!-- <div class="userportrait" v-if="UserInfo.userName">
      <img class="userportrait" :src="UserInfo.avatar" alt />
      <p class="humphry">{{ UserInfo.userName }}</p>
      <img class="con_lin" src="../../assets/con_lin.png" alt="" />
    </div> -->
    <img class="link_img link_img1" src="../../assets/link1.png" alt />
    <img class="link_img link_img2" src="../../assets/link2.png" alt />
    <img class="link_img link_img3" src="../../assets/link3.png" alt />

    <div style class="my_soul">
      <input class="invite_code" v-model="inviteCode"
        v-if="!UserInfo.levelScore && !usedInviteCode && !whiteUser && !UserInfo.isUseInviteCode" type="text"
        placeholder="invite code" />

      <div class="cudset_but">
        <button @click="nuxt" :disabled="!inviteCode && !usedInviteCode && !whiteUser && !UserInfo.isUseInviteCode"
          :class="{ disabled: !inviteCode && !usedInviteCode && !whiteUser && !UserInfo.isUseInviteCode }">reveal my
          SOUL</button>
        <!-- <button @click="nuxt">reveal my SOUL</button> -->
        <!-- <p class="skip" @click="$router.push('/')">
<span>Skip</span> and <span>Explore</span> other souls
        </p> -->
      </div>
    </div>
    <!-- 邀请码被使用了的弹窗 -->
    <van-dialog v-model="inviteShow" :close-on-click-overlay="false" confirmButtonText="ok"
      :z-index="99999999999999999999">
      <p class="fee_dint">{{ errmsg + '.' || 'please try again later' }}</p>
    </van-dialog>

    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import computed from "./src/computed";
import Overlay from "../../components/Overlay.vue";
import AOS from "aos";
export default {
  name: "",
  data() {
    return {
      inviteShow: false, // 邀请码被使用了的弹窗
      errmsg: null, //使用邀请码的错误提示
      usedInviteCode: false,
      whiteUser: false,
      address: "",
      loginType: 0,
      inviteCode: null, // 邀请码
      overlayshow: false,
      UserInfo: { address: "" },
      isUseInviteCode: null
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  components: { Overlay },
  created() {
    window.sessionStorage.getItem("inviteCode") &&
      (this.inviteCode = 'soul-' + window.sessionStorage.getItem("inviteCode"));
    let me = this;
    me.getUserInfo();
  },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
    AOS.init({
      offset: 200,
      duration: 200, //duration
      easing: "ease-in-sine",
      delay: 100
    });
    console.log(this.$loginData);
    window.addEventListener("scroll", this.scrollToTop);
  },
  beforeRouteLeave(to, form, next) {
    // Leave the route to remove the scrolling event
    window.removeEventListener("scroll", this.scrollToTop);
    next();
  },
  destroyed() { }
};
</script>

<style lang="scss">
@import "./sass/style.scss";
</style>
