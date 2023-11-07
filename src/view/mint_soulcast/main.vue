<template>
  <div class="mint_select">
    <div class="navigate">
      <img
        @click="$router.go(-1)"
        class="back"
        src="../../assets/back.png"
        alt=""
      />
      <div class="nav_name">
        <p class="name">Launch SoulCast</p>
      </div>
      <span></span>
    </div>
    <!-- mint slogin -->
    <div class="slogin">
      <p class="slogin_title" v-if="!overlayshow||$route.query.squarePictureUrl">Choose your favorites to launch it.</p>
      <p class="slogin_title" v-else>Generating SoulCast with AI. <br> It can sometimes take around 3 to 5 minutes.</p>
      <img class="sou_lin" src="../../assets/mint_soulcast.png" alt="" />
    </div>

    <div class="details_cont">
      <!-- NFTList -->
      <div class="nft_cont">
        <div
          @click="ticks(item, index)"
          class="nft_list"
          :class="{ nft_listac: active == index }"
          v-for="(item, index) in NftList"
          :key="index"
        >
          <img
            v-if="active != index"
            class="tick"
            src="../../assets/tick.png"
            alt=""
          />
          <img v-else class="tick" src="../../assets/ticks.png" alt="" />
          <img class="nftimg" :src="item.squarePictureUrl" alt="" />
        </div>
      </div>
      <!-- operation -->
      <div class="set_but">
        <button class="Cancels" @click="$router.go(-1)">Cancel</button>
        <button @click="nuxt">NEXT</button>
      </div>
    </div>
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
      overlayshow:false,
      active: 99,
      pictureUrl: "",
      squarePictureUrl: "",
      colorAttribute: "",
      mood:"",
      color:"",
      NftList: [],
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  components: {
    Overlay
  },
  created() {
    let me = this;
    if(this.$route.query.squarePictureUrl){
      this.getLastMintPictur()
    }else{
      this.getData();
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
  destroyed() {},
};
</script>

<style lang="scss">
@import "./sass/style.scss";
</style>
