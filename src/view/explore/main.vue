<template>
  <div class="explore" :class="{ background: showBackground && (TabActive == 1 || TabActive == 2) }">
    <!-- Tab -->
    <div class="TabCont">
      <div class="Tab_left">
        <div class="Tab_list" :class="{
          Tab_list_Active: TabActive == item.id,
        }" @click="changeTab(item.id)" v-for="(item, index) in TabList" :key="index">{{ item.name }}</div>
      </div>
      <div class="Tab_right">
        <img src="../../assets/sift.png" @click="SiftShow = true" alt />
        <img class="searchImg" src="@/assets/search.png" @click="$router.push('/search')" alt />
      </div>
    </div>
    <!-- NFT List -->
    <!-- FOR YOU -->
    <div class="for_you" v-if="TabActive === 1 || TabActive === 2">
      <van-list v-model="loading" offset="200" loading-text="Loading" :immediate-check="false" :finished="finished"
        finished-text="" @load="onLoad" v-if="nftList.length > 0">
        <div class="nft_cont">
          <div class="cont_cnet cont_left">
            <div @click="$router.push(`/explore_details?id=${item.realTokenId}&path=`)" class="Nft_list"
              v-for="item in evenNftList" :key="item.id">
              <div class="img_icon">
                <div class="match" v-if="item.pictureUrl && $loginData.Auth_Token">
                  <p :style="{ color: `hsla(${item.colorAttribute + 120}, 60%, 60%, 1)` }" class="center">{{ item.match ||
                    "0" }}%</p>
                  <p :style="{ color: `hsla(${item.colorAttribute + 120}, 60%, 60%, 1)` }" class="name">match</p>
                </div>
                <!-- <img  :src="item.pictureUrl" alt="" /> -->
                <img v-lazy="item.pictureUrl" alt />
              </div>
              <div class="bottom_infor" v-if="item.pictureUrl">
                <svg-icon :style="{ color: `hsla(${item.colorAttribute + 120}, 60%, 60%, 1)` }" class="svgName"
                  :iconClass="urls()"></svg-icon>
                <div class="grade_price">
                  <div class="grade">
                    <img :class="`level${item.level}`" :src="levelImg[item.level]" alt />
                    <p class="grade_name">{{ getNFTLevel[item.level] }}</p>
                  </div>
                  <p class="price" v-if="item.price && item.pickStatus != 0">{{ item.price }}{{ $network }}</p>
                  <!-- <p class="price priceinfp" v-else>{{ getNFTPersonality[item.personality] }}</p> -->

                  <p class="price priceinfp" v-else :style="getSoulSbtiStyle(item.soul)">{{ item.soul || '-' }}</p>
                </div>
                <!-- <div class="love">
              <img src="../../assets/love.png" alt="" />
              {{ item.likes }}
                </div>-->
              </div>
            </div>
          </div>
          <div class="cont_cnet cont_right">
            <div @click="$router.push(`/explore_details?id=${item.realTokenId}&path=`)" class="Nft_list"
              v-for="item in oddNftList" :key="item.id">
              <div class="img_icon">
                <div class="match" v-if="item.pictureUrl && $loginData.Auth_Token">
                  <p :style="{ color: `hsla(${item.colorAttribute + 120}, 60%, 60%, 1)` }" class="center">{{ item.match ||
                    "0" }}%</p>
                  <p :style="{ color: `hsla(${item.colorAttribute + 120}, 60%, 60%, 1)` }" class="name">match</p>
                </div>
                <!-- <img :src="item.pictureUrl" alt="" /> -->
                <img v-lazy="item.pictureUrl" alt />
              </div>
              <div class="bottom_infor" v-if="item.pictureUrl">
                <svg-icon :style="{ color: `hsla(${item.colorAttribute + 120}, 60%, 60%, 1)` }" class="svgName"
                  :iconClass="urls()"></svg-icon>
                <div class="grade_price">
                  <div class="grade">
                    <img :class="`level${item.level}`" :src="levelImg[item.level]" alt />
                    <p class="grade_name">{{ getNFTLevel[item.level] }}</p>
                  </div>
                  <p class="price" v-if="item.price && item.pickStatus != 0">{{ item.price }}{{ $network }}</p>
                  <!-- <p class="price priceinfp" v-else>{{ getNFTPersonality[item.personality] }}</p> -->
                  <p class="price priceinfp" :style="getSoulSbtiStyle(item.soul)" v-else>{{ item.soul || '-' }}</p>
                </div>
                <!-- <div class="love">
              <img src="../../assets/love.png" alt="" />
              {{ item.likes }}
                </div>-->
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <!-- Activity -->
    <div class="activity" v-if="TabActive === 3">
      <van-list v-model="activityLoading" :finished="activityFinished" loading-text="Loading" @load="onActivityLoad"
        :immediate-check="false" finished-text="">
        <div class="activity_list" v-for="item in activityList" :key="item.id" @click="linkNftDetail(item.tokenId)">
          <div class="left">
            <img class="userImg" :src="item.userImg" alt />
            <img class="nftImg" :src="item.tokenImg" alt />
          </div>
          <div class="right">
            <div class="order">{{ item.username || item.userAddress.substring(0, 6) }} {{ item.type === 0 ? 'Listed' :
              'Pumped' }} SoulCast #{{ item.tokenId }} {{ item.type === 0 ? '' : `(${item.pickCount}/4)` }}</div>
            <div class="price">{{ item.price }} {{ $network }}</div>
            <div class="time">{{ getLastTimeStr(convertToTargetTimeZone(item.createTime)) }}</div>
          </div>
        </div>
      </van-list>
    </div>
    <Overlay :overlayshow="overlayshow"></Overlay>
    <TabBar ref="tabbar"></TabBar>
    <Sift @pass="pass" :SiftShow="SiftShow" @close="SiftShow = false"></Sift>
    <!-- pwa弹窗 -->
    <van-dialog v-model="pwaModalShow" :close-on-click-overlay="false" confirmButtonText="BACK" :z-index="99999">
      <div class="title level_desc">
        <span style="text-transform: none;">For a smoother experience, add Soulcial to your Home Screen</span>
      </div>
      <div class="fee_dint">
        1.Open your browser <span>Menu</span>
      </div>
      <div class="fee_dint">
        2.Tap the <span>Share icon</span>
      </div>
      <div class="fee_dint">
        3.Select <span>“Add to Home Screen”</span>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import computed from "./src/computed";
import AOS from "aos";
import TabBar from "../../components/TabBar.vue";
import { getNFTLevel, levelImg, getNFTPersonality } from "../../libs/target";
import Overlay from "../../components/Overlay.vue";
import Sift from "../../components/Sift.vue";
export default {
  name: "Explore",
  data() {
    let Sift = window.localStorage.getItem("Sift");
    let SiftType = Sift ? Sift : "4down";
    let orderColumn = SiftType ? SiftType[0] : 4;
    let orderType = SiftType.indexOf("up") !== -1 ? 1 : 0;
    return {
      currentPage: 1,
      pageSize: 20,
      pageType: 0,
      loading: false,
      activityLoading: false,
      finished: false,
      activityFinished: false,
      pwaModalShow: false,
      overlayshow: false,
      SiftShow: false,
      getNFTPersonality: getNFTPersonality,
      levelImg: levelImg,
      TabActive: 1,
      getNFTLevel: getNFTLevel,
      timer: null,
      nftList: [],
      activityList: [],
      showBackground: false,
      orderColumn: orderColumn,
      orderType: orderType,
      TabList: [
        {
          name: "For You",
          id: 1
        },
        {
          name: "Connected",
          id: 2
        },
        {
          name: "Activity",
          id: 3
        }
        // {
        //   name: "Liked",
        //   id: 3,
        // },
      ]
    };
  },
  watch: watch,
  methods: methods,
  computed: computed,
  components: {
    TabBar,
    Overlay,
    Sift
  },
  created() { },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
    this.getData();
    AOS.init({
      offset: 200,
      duration: 200, //duration
      easing: "ease-in-sine",
      delay: 100
    });
    console.log(this.$loginData);
    // window.addEventListener("scroll", this.scrollToTop);
  },
  activated() {
    this.handleShowModal();
    this.timer = setTimeout(() => {
      this.handleShowModal();
    }, 1000 * 30);

    if (this.$route.meta.from !== "explore_details") {
      this.nftList = []; //清空原有数据
      this.getData(); // 重新加载
    }

    this.$refs.tabbar.BarActive = this.$route.path;
    this.$refs.tabbar.walletShow = false;
  },
  deactivated() {
    this.timer && clearTimeout(this.timer);
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  },
  beforeRouteLeave(to, form, next) {
    // Leave the route to remove the scrolling event
    // window.removeEventListener("scroll", this.scrollToTop);
    next();
  },
};
</script>

<style lang="scss">
@import "./sass/style.scss";
</style>
<style lang="scss" scoped>
::v-deep .van-dialog {
  width: 342px;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #f5f5ed !important;

  .van-dialog__content {
    font-family: Inter;
    font-size: 16px;
    // font-weight: 600;
    line-height: 24px;
    letter-spacing: 0em;
    // text-align: center;
  }

  .van-dialog__footer {
    margin-top: 30px;
    padding: 0 24px 0 24px;

    button {
      border-radius: 45px !important;
      border: 2px solid #000 !important;
      background: #fff !important;

      .van-button__text {
        color: #000;
        text-align: center;
        font-size: 18px;
        font-family: "Inter";
        font-style: normal;
        font-weight: 700;
        text-transform: uppercase;
      }
    }
  }
}

.level_desc {
  line-height: 37px;
  margin-bottom: 27px;
  font-weight: 900;
  font-size: 22px;
  font-family: "Inter";
  color: #000000;
  letter-spacing: 0;

  span {
    font: inherit;
  }
}

.fee_dint {
  flex: 1;
  color: #333;
  font-size: 16px;
  font-family: "Inter";
  font-style: normal;

  span {
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
