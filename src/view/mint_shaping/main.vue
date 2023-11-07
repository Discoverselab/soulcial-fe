<template>
  <div class="mint_shaping">
    <div class="navigate">
      <img @click="nuxt" class="back" src="../../assets/back.png" alt="" />
      <div class="nav_name">
        <p class="name">Launch SoulCast</p>
      </div>
      <span></span>
    </div>
    <!-- mint slogin -->
    <div class="slogin">
      <p class="slogin_title">Confirm your choice</p>
      <img class="sou_lins" src="../../assets/sou_linS.png" alt="" />
    </div>

    <div class="details_cont">
      <!-- Selected picture -->
      <img class="mint_sou_nft" :src="shaping_data.squarePictureUrl" alt="" />
      <!-- Attribute list -->
      <div class="attribute">

        <!-- <div class="attribute_list">
          <div class="chid">
            <p>Personality</p>
          </div>
          <p>{{ getNFTPersonality[$route.query.personality] }}</p>
        </div> -->
        <div class="attribute_list">
          <div class="chid">
            <img src="../../assets/moodImg.png" alt="">
            <p>Mood</p>
          </div>
          <p>{{ getNFTMood[shaping_data.mood] }}</p>
        </div>
        <!-- <div class="attribute_list">
          <div>
            <p>Weather:</p>
          </div>
          <p>{{ Weather[shaping_data.weather] }}</p>
        </div> -->
        <div class="attribute_list">
          <div class="chid">
            <img src="../../assets/colorImg.png" alt="">
            <p>Color</p>
          </div>
          <p>{{ NFTColor[shaping_data.color] }}</p>
        </div>
        <div class="attribute_list">
          <div class="chid">
            <img src="../../assets/talent.png" alt="">
            <p>Personality</p>
          </div>
          <!-- <p>{{ NFTColor[shaping_data.color] }}</p> -->
          <p>{{ UserInfo.personality }}</p>
        </div>
        <div class="attribute_list">
          <div class="chid">
            <img src="../../assets/userImg.png" alt="">
            <p>Character</p>
          </div>
          <!-- <p>{{ NFTColor[shaping_data.color] }}</p> -->
          <p>{{ UserInfo.chracter }}</p>
        </div>
        <div class="attribute_list">
          <div class="chid">
            <img src="../../assets/grade.png" alt="">
            <p>SBTI</p>
          </div>
          <p>{{ getNFTLevel[UserInfo.level] }}</p>
        </div>
      </div>
      <!-- operation -->
      <div class="shapset_but">
        <button @click="cutAndUpload">
          Launch SoulCast NFT
          <span class="FREE">FREE</span>
        </button>
        <button class="Cancels" @click="nuxt">BACK</button>
      </div>
    </div>
    <van-dialog  v-model="overMintShow" :close-on-click-overlay="false" @confirm="toHome" confirmButtonText="ok"
      :z-index="99999999999999999999">
      <p class="fee_dint" >
        {{'Oops! Looks like you missed the boat. The Genesis SoulCast NFTs have been fully launched.' }}
      </p>
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

import {
  getNFTLevel,
  getNFTPersonality,
  NFTColor,
  getNFTMood,
  Weather,
} from "../../libs/target";
export default {
  name: "",
  data() {
    return {
      overMintShow: false, //超出mint弹窗
      overlayshow: false,
      UserInfo: {},
      getNFTLevel: getNFTLevel,
      getNFTPersonality: getNFTPersonality,
      NFTColor: NFTColor,
      getNFTMood: getNFTMood,
      Weather: Weather,
      shaping_data: this.$route.query,
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  components: { Overlay },
  created() {
    let me = this;
    this.getUserInfo();
  },
  mounted: async function () {
    console.log(this.shaping_data)
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
