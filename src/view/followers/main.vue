<template>
  <div class="followers">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt="" />
      <div class="nav_name">
        <p class="name">Connected</p>
      </div>
      <div></div>
    </div>
    <van-tabs v-model="active" background="transparent" line-height="0px">
      <van-tab :title="`All ${Follower.allList?.length}`">
        <div class="followers_cont" v-if="Follower.allList?.length !== 0">
          <div class="followersList" v-for="(item, index) in Follower.allList" :key="index" >
            <div class="list_left" @click="linkUser(item)">
              <div class="portrait">
                <img :src="item.userHeadImgUrl" alt="" />
              </div>

              <div class="name_address">
                <p class="name">{{ item.userName }}</p>
                <!-- <p class="address">{{ substring(item.userBnbAddress) }}</p> -->
              </div>
            </div>
            <!-- <button v-if="!$route.query.id" @click="followUser(item)" class="Follows"
              :class="{ noFollows: item.isFollow }">
              {{ !item.isFollow ? "Follow" : "Followed" }}
            </button> -->
            <div>
              <!-- 普通connected -->
              <button class="con_btn" v-if="item.status === 1" style="background-color: transparent;color: #666;"
                @click="() => { dialogText = 'disconnect'; confirmConnect(item) }">
                <img src="@/assets/arrow_left_right_line.png" alt="">
                <p>Connected</p>
              </button>
              <!-- 星标connected -->
              <button v-else-if="item.status === 2" class="con_btn" style="background-color: transparent;color: #F3B228;">
                <img src="@/assets/star_smile_fill.png" alt="">
                <p>Connected</p>
              </button>
            </div>
          </div>
        </div>
        <div class="Save" v-else>
          <img src="../../assets/noData.png" alt="">
          <p class="SaveText">No data to display</p>
        </div>
      </van-tab>
      <van-tab :title="`Star ${Follower.startList?.length}`">
        <div class="followers_cont" v-if="Follower.startList?.length !== 0">
          <div class="followersList" v-for="(item, index) in Follower.startList" :key="index">
            <div class="list_left" @click="linkUser(item)">
              <div class="portrait">
                <img :src="item.userHeadImgUrl" alt="" />
              </div>
              <div class="name_address">
                <p class="name">{{ item.userName }}</p>
                <!-- <p class="address">{{ substring(item.userBnbAddress) }}</p> -->
              </div>
            </div>
            <!-- <button v-if="!$route.query.id" @click="followUser(item)" class="Follows"
              :class="{ noFollows: item.isFollow }">
              {{ !item.isFollow ? "Follow" : "Followed" }}
            </button> -->
            <div>
              <button class="con_btn" style="background-color: transparent;color: #F3B228;">
                <img src="@/assets/star_smile_fill.png" alt="">
                <p>Connected</p>
              </button>
              <!-- <img class="connect_btn" src="@/assets/connect_star.png" alt=""> -->
            </div>
          </div>
        </div>
        <div class="Save" v-else>
          <img src="../../assets/noData.png" alt="">
          <p class="SaveText">No data to display</p>
        </div>
      </van-tab>

      <van-tab :title="`New ${Follower.newList?.length}`">
        <div class="followers_cont" v-if="Follower.newList?.length !== 0">
          <div class="followersList" v-for="(item, index) in Follower.newList" :key="index">
            <div class="list_left" @click="linkUser(item)">
              <div class="portrait">
                <img :src="item.userHeadImgUrl" alt="" />
              </div>
              <div class="name_address">
                <p class="name">{{ item.userName }}</p>
                <!-- <p class="address">{{ substring(item.userBnbAddress) }}</p> -->
              </div>
            </div>
            <!-- <button v-if="!$route.query.id" @click="followUser(item)" class="Follows"
              :class="{ noFollows: item.isFollow }">
              {{ !item.isFollow ? "Follow" : "Followed" }}
            </button> -->
            <div>
              <button class="con_btn" @click="() => { dialogText = 'connect'; confirmConnect(item) }" v-if="!item.status">
                <img src="@/assets/checkbox_circle.png" alt="">
                <p>Confirm</p>
              </button>
              <button v-else class="con_btn" style="background-color: transparent;color: #666;"
              @click="() => { dialogText = 'disconnect'; confirmConnect(item) }" >
              
                <img src="@/assets/arrow_left_right_line.png" alt="">
                <p>Connected</p>
              </button>
            </div>
          </div>
        </div>
        <div class="Save" v-else>
          <img src="../../assets/noData.png" alt="">
          <p class="SaveText">No data to display</p>
        </div>
      </van-tab>
    </van-tabs>
<!-- 取消好友关系弹窗 -->
    <van-dialog v-model="connectShow" :close-on-click-overlay="true" :z-index="99999999999999999999"
      :show-cancel-button="false" :show-confirm-button="false">
      <div class="introduce">
        <p class="cancelConnect">Confirm to {{ dialogText }}?</p>
        <div class="setBut">
          <button @click="onConfirm" style="margin-bottom: 20px;">Confirm</button>
          <button @click="connectShow = false" style="background-color:#F5F5ED;
">cancel</button>
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
import Overlay from "../../components/Overlay.vue";
import AOS from "aos";
export default {
  name: "",
  data() {
    return {
      a:true,
      overlayshow: false,
      UserInfo: {},
      active: 0,  // 默认选中tab栏
      All: 'ALL', // tab栏标题
      Star: 'STAR',// tab栏标题
      New: 'NEW',// tab栏标题
      connectShow: false, // 是否显示取消联系弹窗
      curConnectId: '', // 当前联系人id
      dialogText: 'connect',
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
        // {
        //   portrait: require("../../assets/portrait4.png"),
        //   address: "bc1pxane...yfgy06",
        // },
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
        // {
        //   portrait: require("../../assets/portrait4.png"),
        //   address: "bc1pxane...yfgy06",
        // },
      ],
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  components: { Overlay },
  created() {
  },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
    this.getConnectList();
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
.followers {
  .van-dialog {
  width: 342px;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #F5F5ED !important;

  .van-dialog__content {
    font-family: Inter;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: center;
  }
}
}

</style>
