<template>
  <div class="purchase_success">
    <div class="navigate">
      <img
        @click="$router.go(-1)"
        class="back"
        src="../../assets/back.png"
        alt=""
      />
      <div class="nav_name">
        <p class="name"></p>
      </div>
      <span></span>
    </div>
    <div class="success">
      <p class="success_title">sorry!</p>
      <p class="success_infor" style="margin-bottom:20px;">
        According to <span @click="linkOpen(1,hiess.rewardBlockHeight)">{{ 'BNB Chain' }} Block #{{ hiess.rewardBlockHeight}}</span> <br>  with Hash <span @click="linkOpen(2,hiess.rewardBlockHash)">{{ substring(hiess.rewardBlockHash) }}</span>, <br> Slot #{{hiess.rewardIndex}} {{hiess.userName}} is the winner!
      </p>
      <p class="success_infor">
        Sorry, You did not get SoulCast #{{NFTDetail.realTokenId }}.<br />
        But you earned {{ hiess.rewardPirce }} {{ $network }} launch <br> reward and {{hiess.vsoulPrice}} $vSoul.
      </p>
    </div>
    <div class="details_cont">
      <img class="sorry" src="../../assets/sorry.png" alt="">
      <div class="shapset_but">
        <button @click="$router.push('/earn')">check earnings</button>
        <p class="check_infors">If you  do not receive earnings, please wait for the transcation processing, which can take a few minutes.</p>
      </div>
    </div>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import { linkOpen } from "@/libs/common.js"
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
      hiess:{},
      NFTPickInfo:{},
      NFTDetail: {},
      getNFTLevel: getNFTLevel,
      getNFTPersonality: getNFTPersonality,
      NFTColor: NFTColor,
      getNFTMood: getNFTMood,
      Weather: Weather,
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    linkOpen() {
      return (type, has) => linkOpen(type, has);
    },
  },
  components: {},
  created() {
    let me = this;
    me.getData();
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
  destroyed() {},
};
</script>

<style lang="scss">
@import "./sass/style.scss";
</style>
