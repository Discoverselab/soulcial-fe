<template>
  <div class="followers">
    <div class="navigate">
      <img
        @click="$router.go(-1)"
        class="back"
        src="../../assets/back.png"
        alt=""
      />
      <div class="nav_name">
        <p class="name">Top Fans</p>
      </div>
      <div @click="SiftShow = true">
        <img class="sift" src="../../assets/sift.png" alt="" />
      </div>
    </div>
    <div class="followers_cont" v-if="Follower.length">
      <div class="followersList">
        <div class="list_left">
          <div class="rank">Rank</div>
          <p class="fan">Fan</p>
        </div>
      </div>
      <div class="followersList" v-for="(item, index) in Follower" :key="index">
        <div class="list_left">
          <div class="rank">
            <span :class="`rank${index + 1}`">{{ index + 1 }}</span>
          </div>
          <img :src="item.avatar" alt="" />
          <div class="name_address">
            <p class="name">{{item.userName }}</p>
            <p class="address">
              <!-- <img src="../../assets/love.png" alt=""> -->
              {{ item.count }}
              {{FansType?'Collects':'Pump'}}
            </p>
          </div>
        </div>
        <!-- <button class="Follows" :class="{ noFollows: index != 2 }">
          {{ index == 2 ? "Follow" : "Followed" }}
        </button> -->
      </div>
    </div>
    <div class="Save" v-else>
      <img src="../../assets/noDist.png" alt="" />
      <p class="SaveText">No data to display</p>
    </div>
    <FansSift :SiftShow="SiftShow" :activeID="FansType" @pass="pass" @close="SiftShow=false"></FansSift>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import computed from "./src/computed";
import Overlay from "../../components/Overlay.vue";
import FansSift from "../../components/FansSift.vue";
import AOS from "aos";
export default {
  name: "",
  data() {
    return {
      FansType: 0,
      SiftShow: false,
      overlayshow: false,
      Follower: [
        // {
        //   portrait: require("../../assets/portrait1.png"),
        //   address: "bc1pxane...yfgy06",
        // },
        // {
        //   portrait: require("../../assets/portrait2.png"),
        //   address: "bc1pxane...yfgy06",
        // },
        // {
        //   portrait: require("../../assets/portrait3.png"),
        //   address: "bc1pxane...yfgy06",
        // },
      ],
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  components: {
    Overlay,
    FansSift,
  },
  created() {
    let me = this;
    me.getFansRank()
  },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
    AOS.init({
      offset: 200,
      duration: 200,
      easing: "ease-in-sine",
      delay: 100,
    });
    console.log(this.$loginData);
    window.addEventListener("scroll", this.scrollToTop);
  },
  beforeRouteLeave(to, form, next) {
    window.removeEventListener("scroll", this.scrollToTop);
    next();
  },
  destroyed() {},
};
</script>

<style lang="scss">
// @import "./sass/style.scss";
</style>
