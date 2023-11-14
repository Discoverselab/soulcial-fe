<template>
  <div class="Congratulations">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt />
      <div class="nav_name">
        <p class="name"></p>
      </div>
      <span></span>
    </div>
    <div class="success">
      <p class="success_title">Congratulations!</p>
        <p class="content">
          Pump Winner of SoulCast #{{ NFTDetail.realTokenId }}!
        </p>
        <p class="content">
        You have successfully collected SoulCast and gained access to private chat with the creator {{NFTDetail.mintUserName }}.
        </p>
      <p class="content">
        Check transaction  <span style="text-transform: lowercase;" @click="linkOpen(1, hiess.rewardBlockHash)">{{substring(hiess.rewardBlockHash) }}</span>
      </p>
    </div>
    <div class="details_cont">
      <div class="Nft_details">
        <!-- NFT -->
        <div class="box">
          <div class="img_icon">
            <img :src="NFTDetail.pictureUrl" alt />
          </div>
        </div>
        <div class="bottom_infor" v-if="NFTDetail.pictureUrl">
          <svg-icon
            :style="{
            color: `hsla(${NFTDetail.colorAttribute + 120}, 60%, 60%, 1)`,
          }"
            class="svgName"
            iconClass="Vector1"
          ></svg-icon>
          <div class="grade_price">
            <div class="grade">
              <img src="../../assets/level1.png" alt />
              <p class="grade_name">{{ getNFTLevel[NFTDetail.level] }}</p>
              <p class="Personality_name">
                <!-- {{ getNFTPersonality[NFTDetail.personality] }} -->
                {{ NFTDetail.soul }}
              </p>
            </div>
            <p class="price">{{ NFTDetail.price || 0 }} {{ $network }}</p>
          </div>
          <div class="love">#{{ NFTDetail.realTokenId }}</div>
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
      <!-- The author has something. -->
      <div class="author">
        <div class="author_list" @click="LinkOwner(1)">
          <div class="portrait">
            <img class="portrait1" :src="NFTDetail.mintUserAvatar" alt />
            <img class="chat_link" src="../../assets/chat.png" alt />
          </div>
          <p class="Created">Launched By</p>
          <p class="name">{{ NFTDetail.isMineMint == 1 ? 'You' : NFTDetail.mintUserName }}</p>
        </div>
        <div class="author_list" @click="LinkOwner(2)">
          <div class="portrait">
            <img class="portrait1" :src="NFTDetail.ownerUserAvatar" alt />
            <img class="chat_link" src="../../assets/chat.png" alt />
          </div>
          <p class="Created">Owned By</p>
          <p class="name">{{ NFTDetail.isMineOwner == 1 ? 'You' : NFTDetail.ownerUserName }}</p>
        </div>
      </div>
      <!-- Selected picture -->
      <!-- operation -->
      <div class="shapset_but">
        <button @click="$router.push(`/chat`)">
          Go to Chat
        </button>
        <div v-if="isShow">
          <button style="background-color: #DFDFCE;" @click="$router.push(`/list_price?id=${NFTDetail.realTokenId}`)">
            List for
            {{ formatNumber(hiess.pfpTokenDetailVo.nextListPrice) }} {{ $network }}
          </button>
        </div>
        <!-- <button @click="$router.push('/earn?type=1')">Check Earnings</button> -->
        <!-- <button class="prohibit">SHARE</button> -->
      </div>
      <p class="lations">
        If you do not receive earnings, please wait for the transcation processing, which can take a few
        minutes.
      </p>
    </div>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import { linkOpen, formatNumber } from "@/libs/common.js";
import AOS from "aos";
import {
  getNFTLevel,
  getNFTPersonality,
  NFTColor,
  getNFTMood,
  Weather
} from "../../libs/target";
import { isShow } from "@/libs/isShow.js";
export default {
  name: "",
  data() {
    return {
      hiess: {
        pfpTokenDetailVo: {}
      },
      NFTPickInfo: {},
      NFTDetail: {},
      getNFTLevel: getNFTLevel,
      getNFTPersonality: getNFTPersonality,
      NFTColor: NFTColor,
      getNFTMood: getNFTMood,
      Weather: Weather
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    isShow() {
      return isShow;
    },
    linkOpen() {
      return (type, has) => linkOpen(type, has);
    },
    formatNumber() {
      return (num) => formatNumber(num);
    }
  },
  components: {},
  async created() {
    let me = this;
    await me.getData();
    me.getNFTPickInfo();
  },
  mounted: async function() {
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
  destroyed() {}
};
</script>

<style lang="scss">
@import "./sass/style.scss";
</style>
