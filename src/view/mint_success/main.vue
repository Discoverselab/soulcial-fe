<template>
  <div class="mint_success">
    <div class="navigate">
      <span></span>
      <!-- <img
        @click="$router.go(-1)"
        class="back"
        src="../../assets/back.png"
        alt=""
      /> -->
      <div class="nav_name">
        <p class="name">Launch SoulCast</p>
      </div>
      <span></span>
    </div>
    <div class="success">
      <p class="success_title">Congratulations!</p>
      <p class="success_infor">You launched a new SoulCast NFT!</p>
    </div>
    <div class="details_cont">
      <div class="Nft_details">
        <!-- NFT -->
        <div class="box" :class="{ flipped: turnShow, flippedShow: flippedShow && turnShow }">
          <div class="img_icon img_icon1">
            <!-- <div 
              class="match"
              v-if="NFTDetail.pictureUrl"
            >
              <p
                :style="{ color: `hsla(${20 + 120}, 60%, 60%, 1)` }"
                class="center"
              >
                {{ NFTDetail.match || "0" }}%
              </p>
              <p
                :style="{ color: `hsla(${20 + 120}, 60%, 60%, 1)` }"
                class="name"
              >
                match
              </p>
            </div> -->
            <img id="pfpNft" :src="NFTDetail.pictureUrl" alt="" />
          </div>
          <div class="img_icon img_icon2">
            <Hexagon v-if="this.values.length > 5 && turnShow" :type="false" :level="NFTDetail.level"
              :levelScore="NFTDetail.levelScore" :values="values" />
          </div>
        </div>
        <div class="bottom_infor" v-if="NFTDetail.pictureUrl">
          <div class="tokenid">{{ `#${NFTDetail.realTokenId}` }}</div>
          <svg-icon :style="{ color: `hsla(${NFTDetail.colorAttribute + 120}, 60%, 60%, 1)` }" className="svgName"
            iconClass="Vector1"></svg-icon>
          <div class="grade_price">
            <div class="grade">
              <img src="../../assets/level1.png" alt="" />
              <p class="grade_name">{{ getNFTLevel[NFTDetail.level] }}</p>
              <!-- <p class="Personality_name">
                {{ getNFTPersonality[NFTDetail.personality] }}
              </p> -->
            </div>
            <!-- <p class="price" v-if="NFTDetail.price">{{ NFTDetail.price || 0 }}{{ $network }}</p> -->
            <!-- <p class="price priceinfp">  {{ getNFTPersonality[NFTDetail.personality] }}</p> -->
            <p class="price priceinfp" :style="getSoulSbtiStyle(NFTDetail.soul)"> {{ NFTDetail.soul }} </p>

          </div>
          <div class="turn" @click="turnShowClick">
            <img src="../../assets/turn.png" alt="" />
          </div>
          <!-- <div class="love">
            {{ NFTDetail.priceTime }}
          </div> -->
        </div>
        <!-- User label -->
        <div class="label_cont">
          <div class="label_left">
            <div class="label label1">{{ getNFTMood[NFTDetail.mood] }}</div>
            <!-- <div class="label label2">{{ Weather[NFTDetail.weather] }}</div> -->
            <div class="label label3">{{ NFTColor[NFTDetail.color] }}</div>
          </div>
        </div>
      </div>
      <!-- Selected picture -->
      <!-- operation -->
      <div class="shapset_but">
        <div v-if="isShow">
          <button @click="jumpToList">List for
            {{ formatNumber(NFTDetail.price) }} {{ $network }}</button>
        </div>
        <button class="Cancels" @click="$router.push('/')">
          Explore other souls
        </button>
        <!-- <button @click="$router.go(-1)">BACK</button> -->
      </div>
    </div>
    <!-- 未挂单nft需要大于1才能赚取积分 -->
    <van-dialog
      v-model="earnVsoulShow"
      :close-on-click-overlay="true"
      :z-index="9999999"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      <div class="introduce">
        <p class="earnVsoul">To earn vSOUL, make sure to hold least one SoulCast NFT. Without a SoulCast, vSOUL rewards cannot be granted.</p>
        <div class="setBut">
          <button @click="continueList" >Continue To List</button>
          <button class="backBtn" style="background-color: #DFDFCE;" @click="earnVsoulShow = false" >Cancel</button>
        </div>
      </div>
    </van-dialog>
    <Overlay :overlayshow="overlayshow"></Overlay>

  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import computed from "./src/computed";
import AOS from "aos";
import Hexagon from "../../components/Hexagon.vue";
import { getNFTLevel, getNFTPersonality, NFTColor, getNFTMood, Weather } from "../../libs/target";
import {isShow} from "@/libs/isShow.js"
import Overlay from "@/components/Overlay.vue";

export default {
  name: "",
  data() {
    return {
      values: [],
      flippedShow: false,
      turnShow: false,
      overlayshow:false,
      NFTDetail: {},
      getNFTLevel: getNFTLevel,
      getNFTPersonality: getNFTPersonality,
      NFTColor: NFTColor,
      getNFTMood: getNFTMood,
      Weather: Weather,
      earnVsoulShow:false,
      UnregisteredList: [], // 未挂单nft 
      NftList:[],
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    isShow() {
      return isShow;
    }
  },
  components: {
    Hexagon,
    Overlay
  },
  created() {
    let me = this;
    me.getData();
    me.getMintedNFTPage()
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
