<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
// import TabBar from "./components/TabBar.vue";
export default {
  name: "app",
  data() {
    return {
      BarList: ["/", "/earn", "/chat", "/home"],
    };
  },
  components: {
    // TabBar,
  },
  created() {
    // const isSafari = window.navigator.vendor === 'Apple Computer, Inc.';
    // if (this._isMobile()) {
    //   //移动设备
    //   if (isSafari) {
    //     // ios safari 浏览器
    //     if (!window.navigator.standalone) {
    //       this.$router.replace("/addtohome");
    //     } else {
    //       // isPWA
    //       window.localStorage.setItem("isPWA", true);
    //     }
    //   } else {
    //     // 其他浏览器
    //     if (!window.matchMedia('(display-mode: standalone)').matches) {
    //       this.$router.replace("/addtohome");
    //     } else {
    //       window.localStorage.setItem("isPWA", true);
    //     }
    //   }
    // } else {
    //   window.localStorage.setItem("isPWA", false);
    // }
  },
  methods: {
    IsBar() {
      if (this.BarList.indexOf(this.$route.path) === -1) {
        return false;
      } else {
        return true;
      }
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
  },
};
</script>

<style lang="scss">
html,
body,
div,
p,
span,
h1,
h2,
h3,
h4,
h5,
ul,
li,
input,
textarea,
u,
select,
a:focus {
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 12px;
  outline: none;
}

.particle-pwe-btn {
  display: none !important;
}

#app>div {
  min-height: 100vh;
  box-sizing: border-box;
}

img[lazy="loading"] {
  display: block;
  width: 50px !important;
  height: 50px !important;
  margin: 0 auto;
}

input {
  -webkit-user-select: auto;
  /*webkit浏览器*/
}

textarea {
  -webkit-user-select: auto;
  /*webkit浏览器*/
}

html {
  height: 100%;
  background-color: #f5f5ed;
}

#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}

body {
  &::-webkit-scrollbar {
    width: 0px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #e6e6e6;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-track {
    background-color: #fff;
    box-shadow: none;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.06);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  }

  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }

  -ms-overflow-style: none;
  /* IE 10+ */
  scrollbar-width: none;
  /* Firefox */


  @media screen and (min-width: 750px) {
    #app {
      padding: 0px 430px;
      box-sizing: border-box;
    }

    #app>div {
      box-shadow: 0.5px 5px 5px 0px #888888;
    }
  }
}

.van-toast {
  z-index: 9999999999999999999999 !important;
}

.van-uploader__upload {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
