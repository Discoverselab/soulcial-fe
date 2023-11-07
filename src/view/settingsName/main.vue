<template>
  <div class="settingsName">
    <!--operate -->
    <div class="user_infor">
      <div class="set_top">
        <div class="set_left" @click="$router.go(-1)">
          <img class="back" src="../../assets/back.png" alt="" />
        </div>
        <p class="title">Name</p>
        <div class="set_right">
            <button @click="save" :class="{saveNo:name&&name!=$route.query.value}">Save</button>
        </div>
      </div>
      <input class="name_input" maxlength="15" type="text" v-model="name">
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
export default {
  name: "home",
  data() {
    return {
      overlayshow:false,
      name:"",
      UserInfo: {},
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  components: {Overlay },
  created() {
    let me = this;
    this.name = this.$route.query.value
    me.getUserInfo();
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
