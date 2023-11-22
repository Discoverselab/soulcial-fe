<template>
  <div class="chat">
    <div class="chat_top">
      <span></span>
      <span>Chat</span>
      <span></span>
      <!-- <img src="../../assets/Union.png" alt="" /> -->
    </div>
    <div class="chat_cont" v-if="ChatList.length">
      <div class="chat_list" @click="links(item)" v-for="(item, index) in ChatList" :key="index">
        <div class="list_left">
          <div class="portrait">
            <div class="portrait_img">
              <img @error="$handleErrorImg" :src="item.avator" alt="" />
              <!-- <img class="online" v-if="!item.isRead" src="../../assets/online.png" alt="" /> -->
            </div>


          </div>
          <div class="name_news">
            <p class="name" :class="{ yidu: item.isRead }">{{ item.type == 0 ? (item.username || '-') : item.type == 3 ? `SoulCast ${item.title.match(/#(\d+)/)[0]} PUMPed`  : `SoulCast #${item.tokenId} Group (${item.memberNum})` }}</p>
            <p class="news" :class="{ yidu: item.isRead }">{{ handleRelatedContent(item) }}</p>
          </div>
        </div>
        <div class="list_right">
          <p class="times" :class="{ yidu: item.isRead }">{{ getTimeDescription(item.time) }}</p>
          <span class="isRead" v-if="item.unreadNum > 0"><van-badge :content="item.unreadNum" max="99" /></span>
        </div>
      </div>
    </div>
    <div class="Save" v-if="!overlayshow && ChatList.length == 0">
      <img src="../../assets/noChat.png" alt="">
      <p class="SaveText">NO Chat</p>
    </div>
    <Overlay :overlayshow="overlayshow"></Overlay>
    <TabBar></TabBar>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import { getTimeDescription } from "@/utils/convertTime.js";
import Overlay from "../../components/Overlay.vue";
import AOS from "aos";
import TabBar from "../../components/TabBar.vue";
export default {
  name: "home",
  data() {
    return {
      overlayshow: false,
      ChatList: [],
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    getTimeDescription() {
      return getTimeDescription
    },
    handleRelatedContent() {
      return (item) => {
        if (item.type == 1) {
          return item.relatedContent ? `${item.username}: ${item.relatedContent}` : 'Start to chat'
        } else {
          return item.relatedContent || 'Start to chat'
        }
      }
    }
  },
  components: { TabBar, Overlay },
  created() {
    this.connectWS();
    let me = this;
    me.getData()
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
