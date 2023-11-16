<template>
  <!-- tabBar -->
  <div id="barCont" class="barCont">
    <div @click="BarClick(item)" class="bar_list" v-for="(item, index) in BarList" :key="index">
      <div v-if="['Earn'].includes(item.name) && BarActive != item.path && myRules(item.name)" class="dot"></div>
      <p v-if="BarActive != item.path" class="barName">{{ item.name }}</p>
      <img :class="`imgs${index + 1}`" v-else :src="item.img" alt="" />
    </div>
    <Wallet v-if="$route.path == '/'" @close="walletShow = false" :walletShow="walletShow"></Wallet>
    <Tags @close="tagShow = false" @save="save" :userTags="userTags" :tagShow="tagShow"></Tags>
  </div>
</template>
<script>
import Wallet from "../components/LinkWallet.vue";
import Tags from "../components/Tags.vue";
export default {
  props: {
    userTags: String,
  },
  data: function () {
    let _clientH = document.documentElement.clientHeight;
    return {
      tagShow: false,
      BarActive: this.$route.path,
      walletShow: false,
      BarList: [
        {
          name: "Explore",
          img: require("../assets/ExploreBar.png"),
          path: "/",
        },
        {
          name: "Earn",
          img: require("../assets/EarnBar.png"),
          path: "/earn",
        },
        {
          name: "Chat",
          img: require("../assets/ChatBar.png"),
          path: "/chat",
        },
        {
          name: "Home",
          img: require("../assets/HomeBar.png"),
          path: "/home",
        },
      ],
    };
  },
  computed: {},
  components: {
    Wallet,
    Tags,
  },
  methods: {
    myRules(name) {
      if (name === "Chat") {
        if (this.BarActive !== "/chat" && this.$store.state.chatRedPoint) {
          return true;
        }
      }
      if (name === "Earn") {
        if (this.BarActive !== "/earn" && this.$store.state.eranRedPoint) {
          return true;
        }
      }

    },
    tagshos() {
      this.tagShow = true;
    },
    save() {
      this.$emit("save", true)
    },
    BarClick(data) {
      if (this.BarActive != data.path) {
        if (data.name == "Explore") {
          // 首页
          this.walletShow = false;
          localStorage.setItem("routers", "");
          this.BarActive = data.path;
          this.$router.push(data.path);
        } else {
          // 其他tabbar

          // 未登录
          if (!this.$loginData.Auth_Token) {
            localStorage.setItem("routers", data.path);
            this.walletShow = true;
            this.$router.push('/');
            return
          }
          // 小狐狸登录
          if (this.$loginData.loginType == 0) {
            this.BarActive = data.path;
            this.$router.push(data.path);
            return
          }

          // particle登录
          const particle = window.sessionStorage.getItem("particle");
          if (this.$loginData.loginType == 1) {

            if (!window?.web3?.eth && !particle) {
              localStorage.setItem("routers", data.path);
              this.walletShow = true;
              this.$router.push('/');
            } else {
              this.BarActive = data.path;
              this.$router.push(data.path);
            }

          }
        }
      }
    },
  },
  mounted: async function () {
    this.BarActive = this.$route.path;
    console.log(this.$route.path);
  },
};
</script>
<style lang="scss">
@media screen and (min-width: 750px) {
  .barCont {
    height: 60px !important;
  }

  .dot {
    width: 10px !important;
    height: 10px !important;
    border-radius: 5px !important;
    position: absolute !important;
    top: 25px !important;
    right: 104px !important;
  }
}

.barCont {
  width: 100%;
  height: 84px;
  box-sizing: border-box;
  background-color: #000;
  position: fixed;
  z-index: 9999999;
  bottom: 0;
  left: 0;
  padding: 0 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .bar_list {
    position: relative;
    height: 100%;
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .dot {
      width: 8px;
      height: 8px;
      background-color: #fe6463;
      border-radius: 4px;
      position: absolute;
      top: 38px;
      right: 6px;
    }

    .barName {
      font-weight: 900;
      font-family: "Inter";
      font-style: normal;
      font-size: 20px;
      color: #fff;
    }

    img {
      display: block;

      &.imgs1 {
        width: 32px;
      }

      &.imgs2 {
        width: 32px;
      }

      &.imgs3 {
        width: 27px;
      }

      &.imgs4 {
        width: 27px;
      }
    }
  }
}
</style>
