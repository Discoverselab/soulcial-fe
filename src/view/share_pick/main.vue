<template>
  <div class="share_pick">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt />
      <div class="nav_name">
        <p class="name">Invite & Earn</p>
      </div>
      <div class="back"></div>
    </div>
    <div class="income">1. Invite your friends to Pump the SoulCast, and you can earn <b style="color: #FFC23D;">100 vSOUL</b> once they participate.</div>
    <div
      class="makesure"
    >2. To earn vSOUL, make sure to hold least one SoulCast NFT. Without a SoulCast, vSOUL rewards cannot be granted.</div>
    <div class="decoration">
      <div class="layout">
        <img class="market1" src="@/assets/market1.png" alt />
        <img class="market2" src="@/assets/market2.png" alt />
      </div>
    </div>
    <div class="content">Discover the unique features of {{ this.$route.query.isShareMy=== "true" ? "my" : "the" }} SoulCast NFT :) Visit @SoulcialGlobal via {{`${website}#/${realTokenId}/${superInviteCode}`}} to Pump and receive crypto rewards. Use my invite code: soul-{{ superInviteCode }}</div>

    <div class="operate">
      <div @click="shareTiwtter" class="btn">
        <div class="twitter_btn">TWITTER</div>
        <img src="@/assets/Twitters.png" alt />
      </div>
      <div class="btn copy-button1" @click="copyContent">
        <div class="Contact_btn" >Contact</div>
        <img  src="@/assets/copy1.png" alt  />
      </div>
    </div>
    <button class="link copy-button2" @click="copyLink" >
      <span class="link_content">{{`${website}#/${realTokenId}/${superInviteCode}`}}</span>
      <img class="copy_img" src="@/assets/copy1.png" alt />
    </button>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
  <script>
import methods from "./src/methods";
import { website } from "@/http/api.js";

export default {
  data() {
    return {
      overlayshow: false,
      UserInfo: {},
      superInviteCode: undefined,
      website: website,
      realTokenId: undefined
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.realTokenId = this.$route.query.id;
  },
  methods: methods
};
</script>
  <style lang="scss">
@import "./sass/style.scss";
</style>