<template>
  <div class="share_pick">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt />
      <div class="nav_name">
        <p class="name">Invite & Earn</p>
      </div>
      <div class="back"></div>
    </div>
    <div class="income">
      Invite your friends to PUMP the SoulCast, you can earn
      <b style="color: #FFC23D;">100 vSOUL</b> once he/she PUMPed.
    </div>
    <div class="decoration">
      <div class="layout">
        <img class="market1" src="@/assets/market1.png" alt />
        <img class="market2" src="@/assets/market2.png" alt />
      </div>
        
    </div>
    <div class="content">
      This SoulCast NFT looks extraordinary! Come to Soulcial via
      <span
        style="display: inline;"
      >{{`${website}#/${realTokenId}/${superInviteCode}`}}</span> {{`and PUMP it. Get the rewards in crypto. My invite code: soul-${superInviteCode}`}}
    </div>
   
    <div class="operate">
      <div @click="shareTiwtter" class="btn">
        <div class="twitter_btn">TWITTER</div>
        <img src="@/assets/Twitters.png" alt />
      </div>
      <div class="btn">
        <div class="Contact_btn">Contact</div>
        <img class="copy-button1" src="@/assets/copy1.png" alt @click="copyContent" />
      </div>
    </div>
    <button class="link">
      <span class="link_content">{{`${website}#/${realTokenId}/${superInviteCode}`}}</span>
      <img class="copy-button2" src="@/assets/copy1.png" alt @click="copyLink" />
    </button>
    <div
      class="condition"
    >*You should hold at least one SoulCast NFT to earn vSOUL. If you don't have SoulCast, vSOUL can not be rewarded.</div>
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
      UserInfo:{},
      superInviteCode:undefined,
      website:website,
      realTokenId:undefined
    };
  },
  created() {
  this.getUserInfo()
  },
  mounted(){
    this.realTokenId=this.$route.query.id
  },
  methods: methods
};
</script>
  <style lang="scss">
@import "./sass/style.scss";
</style>