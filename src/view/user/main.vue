<template>
  <div class="user">
    <!--operate -->
    <div class="user_infor">
      <div class="set_top">
        <div @click="back">
          <img class="back" src="../../assets/back.png" alt />
        </div>
        <div class="set_right">
        </div>
      </div>
      <!-- Avatar name and address -->
      <div class="userinfo">
        <div @click="goTwitter" class="portrait">
          <img :src="UserInfo.avatar" alt />
        </div>
        <div class="nameAddres">
          <div class="nameAddres_cont" v-if="UserInfo.userName">
            <p class="name noTwitter">{{ UserInfo.userName }}</p>
            <div class="info">
              <div>
                <img @click="goTwitter" class="twitterBrid" src="@/assets/Twitters.png" alt=""
                  v-if="UserInfo.twitterStatus === 1">
              </div>
              <div class="Connects" v-if="isOwn">
                <button class="userBtn connect"
                  v-if="UserInfo.connectStatus !== 0 && !UserInfo.connectStatus && !connectSuccess"
                  @click="connectUser">Connect</button>
                <button class="userBtn" @click="confirmConnect(isEmpty[0].id)"
                  v-else-if="UserInfo.connectStatus === 0 && shouldConfirm" style="background-color: #F3B228;">
                  <img src="@/assets/checkbox_circle.png" alt />
                  Confirm
                </button>
                <button class="userBtn" v-else-if="UserInfo.connectStatus === 0 || connectSuccess"
                  style="background-color: #F3B228;">
                  <img src="@/assets/send_plane.png" alt />
                  Sent
                </button>
                <button class="userBtn" @click="cancelConnect(allList[0]?.id, isEmpty[0]?.id)"
                  v-else-if="UserInfo.connectStatus === 1" style="color: #666666;">
                  <img src="@/assets/arrow_left_right_line.png" alt />
                  Connected
                </button>
                <button class="userBtn" v-else-if="UserInfo.connectStatus === 2" style="color: #F3B228;">
                  <img src="@/assets/star_smile_fill.png" alt />
                  Connected
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bio" v-if="UserInfo.bio">{{ UserInfo.bio }}</div>
      <!-- User label -->
      <div class="label_cont">
        <div class="label_left">
          <svg-icon v-for="(item, index) in TagsList" :key="index" :className="`svgName${item}`"
            :iconClass="`tag${item}`"></svg-icon>
        </div>
        <!-- <img class="edit" src="../../assets/user_chat.png" alt="" /> -->
      </div>
      <!-- Calculate points -->
      <div class="Calculate">
        <div class="soul">
          <span :style="getSoulSbtiStyle(`${UserInfo.personality} ${UserInfo.chracter}`)">{{ `${UserInfo.personality}
                      ${UserInfo.chracter}` || '-' }}</span>

          <img src="@/assets/sbti.png" alt />
        </div>
        <!-- <button class="Update" @click="Update">
          <img src="../../assets/time.png" class="time" alt="">
          Update SBTI
        </button>-->
        <Hexagon v-if="this.values.length > 5" :type="true" :level="UserInfo.level" :levelScore="UserInfo.levelScore"
          :values="values" />
        <!-- Ranking data information -->
        <div class="rank_cont" style="margin-top: 20px;">
          <!-- <div @click="FollList(1)" class="rank_list">
            <p class="value">{{ UserInfo.followers }}</p>
            <p class="key">Followers</p>
          </div>
          <div @click="FollList(2)" class="rank_list">
            <p class="value">{{ UserInfo.following }}</p>
            <p class="key">Following</p>
          </div>
          <div @click="$router.push('/TopFans')" class="rank_list">
            <p class="value">RANK</p>
            <p class="key">Top Fans</p>
          </div>-->

          <div class="rank_list">
            <p class="value">{{ UserInfo.connectedNum || 0 }}</p>
            <div class="key">Connected</div>
          </div>
          <div class="rank_list">
            <p class="value">{{ UserInfo.levelScore || '-' }}</p>
            <p class="key">SBTI</p>
          </div>
        </div>
      </div>
      <!-- <div class="invite_friend" @click="toInvite">
        <div class="earn_diamond">
          <img src="@/assets/diamond.png" alt="">
          <span>Earn</span>
        </div>
        invite friend
      </div>-->
    </div>
    <!-- Tab -->
    <div class="TabCont">
      <div class="Tab_list" :class="{
        Tab_list_Active: TabActive == item.id,
      }" @click="TabClick(item.id)" v-for="(item, index) in TabList" :key="index">{{ item.name }}</div>
    </div>
    <!-- NFT list -->
    <div class="nft_cont" v-if="NftList.length">
      <div class="nft_list" v-for="(item, index) in NftList" @click="$router.push(`/explore_details?id=${item.id}&path=`)"
        :key="index">
        <div class="img_cont">
          <img class="nftUrl" :src="item.squarePictureUrl" alt />
          <div v-if="TabActive == 1 || TabActive == 2" class="point">
            <span v-for="index in 3" :key="index"></span>
          </div>
        </div>
        <div class="nft_infor">
          <!-- <p class="top_name_price">
            <span class="name">Top Pick</span>
            <span class="price">{{ item.topPick || 0 }} {{ $network }}</span>
          </p>-->
          <div class="flow_id">
            <img :class="`level${item.level}`" :src="levelImg[item.level]" alt />
            <span class="flow">{{ getNFTLevel[item.level] }}</span>
            <span class="flow_lin">#{{ item.realTokenId }}</span>
          </div>
          <div class="Listing">
            <span>Listing Price</span>
            <!-- <span> Cost </span> -->
          </div>
          <div class="price_botm">
            <span class="bot_price">{{ item.pickStatus == 1 ? item.price + ` ${$network}` : '--' }}</span>
            <!-- <span class="bot_price">{{ item.price || 0 }} {{ $network }}</span> -->
          </div>
        </div>
      </div>
    </div>
    <div class="Save" v-else>
      <img src="../../assets/noData.png" alt />
      <p class="SaveText">No data to display</p>
    </div>
    <Overlay :overlayshow="overlayshow"></Overlay>

    <!-- 取消连接弹窗 -->
    <van-dialog v-model="connectShow" :close-on-click-overlay="true" :z-index="99999999999999999999"
      :show-cancel-button="false" :show-confirm-button="false">
      <div class="introduce">
        <p class="cancelConnect">Confirm to disconnect?</p>
        <div class="setBut">
          <button @click="onCancelConnect" style="margin-bottom: 20px;">Confirm</button>
          <button @click="connectShow = false" style="background-color:#F5F5ED;">Cancel</button>
        </div>
      </div>
    </van-dialog>
    <Wallet @close="walletShow = false" @init="init" :walletShow="walletShow"></Wallet>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import computed from "./src/computed";
import AOS from "aos";
import Hexagon from "../../components/Hexagon.vue";
import { getNFTLevel, levelImg } from "../../libs/target";
import Overlay from "../../components/Overlay.vue";
import Wallet from "@/components/LinkWallet.vue";
import { isShow } from "@/libs/isShow.js";
export default {
  name: "home",
  data() {
    return {
      connectShow: false, // 取消添加好友弹窗
      newList: [], // 等待被添加的好友列表
      allList: [], // 全部好友列表
      shouldConfirm: false, // 判断应该是sent按钮还是confirm按钮
      isEmpty: [], // 当前访问主页是否在我的待添加好友列表里
      connectSuccess: false,
      connectedNum: null,
      userId: null,
      TagsList: [],
      overlayshow: false,
      levelImg: levelImg,
      getNFTLevel: getNFTLevel,
      UserInfo: {},
      values: [],
      TabActive: 1,
      walletShow: false,
      isOwn: true, // 用来判断分享的页面是否是自己登录的账户
      TabList: [
        {
          name: "launched",
          id: 1
        },
        {
          name: "collected",
          id: 2,
        },
        // {
        //   name: "liked",
        //   id: 3,
        // },
      ],
      NftList: []
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    isShow() {
      return isShow;
    }
  },
  components: { Hexagon, Overlay, Wallet },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
    await this.init();
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
};
</script>

<style lang="scss">
@import "./sass/style.scss";

.user {
  .van-dialog {
    width: 342px;
    padding: 40px 20px;
    box-sizing: border-box;
    background-color: #f5f5ed !important;

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
