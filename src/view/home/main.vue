<template>
  <div class="home">
    <!--operate -->
    <div class="user_infor">
      <div class="set_top">
        <div></div>
        <div class="set_right">
          <img @click="$router.push('/share')" class="label" src="../../assets/label.png" alt />
          <img @click="$router.push('/settings')" class="set" src="../../assets/set.png" alt />
        </div>
      </div>
      <!-- Avatar name and address -->
      <div class="userinfo">
        <img @click="goTwitter(UserInfo)" class="portrait" :src="UserInfo.avatar" alt />
        <!--  -->
        <div class="nameAddres" v-if="UserInfo.userName">
          <p class="name">{{ UserInfo.userName }}</p>
          <p @click="$loginData.loginType == 0 ? copy() : goParticle()" class="address">
            <img class="copy-button" round src="../../assets/icon_wallet.png" alt />
            <span>{{ substring($loginData.Auth_Token) }}</span>
          </p>
        </div>
      </div>
      <div class="bio" v-if="UserInfo.bio">{{ UserInfo.bio }}</div>
      <!-- User label -->
      <div class="label_cont">
        <div
          v-if="TagsList.length"
          style="display: flex;align-items: center;justify-content: space-between;"
        >
          <div class="label_left">
            <svg-icon
              v-for="(item, index) in TagsList"
              :key="index"
              :className="`svgName${item}`"
              :iconClass="`tag${item}`"
            ></svg-icon>
          </div>
          <img class="edit" @click="tagShow" src="../../assets/edit.png" alt />
        </div>
        <div class="set_but" v-else>
          <button class="Cancel" @click="tagShow">Select your interest tags</button>
        </div>
      </div>
      <!-- Calculate points -->
      <div class="Calculate">
        <div class="soul" @click="$router.push('/share')">
          <span
            :style="getSoulSbtiStyle(`${UserInfo.personality} ${UserInfo.chracter}`)"
          >{{ `${UserInfo.personality} ${UserInfo.chracter}` || '-' }}</span>
          <img src="@/assets/sbti.png" alt />
        </div>
        <button class="Update" @click="Update">
          <img src="../../assets/time.png" class="time" alt />
          Update
        </button>
        <Hexagon
          ref="radar"
          :clickable="true"
          v-if="this.values.length > 5"
          :type="true"
          :level="UserInfo.level"
          :levelScore="UserInfo.levelScore"
          :values="values"
        />
        <!-- Ranking data information -->
        <div class="rank_cont">
          <!-- <div @click="FollList(1)" class="rank_list">
            <p class="value">{{ UserInfo.followers }}</p>
            <p class="key">Followers</p>
          </div>
          <div @click="FollList(2)" class="rank_list">
            <p class="value">{{ UserInfo.following }}</p>
            <p class="key">Following</p>
          </div>-->
          <div class="rank_list" @click="ConnectList">
            <p class="value">{{ UserInfo.connectedNum || 0 }}</p>
            <div class="key">
              connected
              <div class="redPoint" v-if="UserInfo.redPoint"></div>
            </div>
          </div>
          <div class="rank_list" @click="showCenter">
            <p class="value">{{ UserInfo.levelScore || '-' }}</p>
            <p class="key">SBTI</p>
          </div>
          <!-- <div @click="$router.push('/TopFans')" class="rank_list">
            <p class="value">{{  UserInfo.levelScore || '-' }}</p>
            <p class="key">SBTI</p>
          </div>-->
        </div>
        <div class="invite_friend" @click="$router.push('/invite')">
          <div class="earn_diamond">
            <img src="@/assets/diamond.png" alt />
            <span>Earn</span>
          </div>invite friend
        </div>
      </div>
    </div>
    <!-- Tab -->
    <div class="TabCont">
      <div
        class="Tab_list"
        :class="{
        Tab_list_Active: TabActive == item.id,
      }"
        @click="TabClick(item.id)"
        v-for="(item, index) in TabList"
        :key="index"
      >{{ item.name }}</div>
    </div>
    <div class="set_but" v-if="TabActive == 1 ">
      <button
        @click="showLaunch"
        :disabled="!UserInfo.mintStatus"
        :class="{disabled: !UserInfo.mintStatus}"
      >Launch SoulCast</button>
    </div>
    <!-- NFT list -->
    <div class="nft_cont" v-if="NftList.length">
      <div
        class="nft_list"
        v-for="(item, index) in NftList"
        @click="$router.push(`/explore_details?id=${item.realTokenId}&path=`)"
        :key="index"
      >
        <div class="img_cont">
          <img class="nftUrl" :src="item.squarePictureUrl" alt />
          <div v-if="TabActive == 1 || TabActive == 2" class="point">
            <span v-for="index in 3" :key="index"></span>
          </div>
        </div>
        <div class="nft_infor">
          <!-- <p class="top_name_price">
            <span class="name">Top Pick</span>
            <span class="price">{{ item.topPick || 0 }} {{}}</span>
          </p>-->
          <div class="flow_id">
            <img :class="`level${item.level}`" :src="levelImg[item.level]" alt />
            <span class="flow">{{ getNFTLevel[item.level] }}</span>
            <span class="flow_lin">#{{ item.realTokenId || '--' }}</span>
          </div>
          <div class="Listing">
            <span>Listing Price</span>
            <span v-if="TabActive == 2">Cost</span>
          </div>
          <div class="price_botm">
            <span class="bot_price">{{ item.pickStatus == 1 ? item.price + ` ${$network}` : '--' }}</span>
            <span class="bot_price" v-if="TabActive == 2">{{ item.lastSale || 0 }} {{ $network }}</span>
          </div>
          
        </div>
        <div class="Launching" v-if="TabActive === 3">
              <div class="LaunchingData" v-if="item.pickStatus > 0">
                <span v-if="!item.nowPickCount">Pump 0/4</span>
                <span
                  v-else
                >{{ item.nowPickCount >= 4 ? 'PUMPING' : `Pump ${item.nowPickCount}/4` }}</span>
              </div>
            </div>
      </div>
    </div>
    <div class="Save" v-else>
      <img src="../../assets/noData.png" alt />
      <p class="SaveText">No data to display</p>
    </div>
    <!-- <button @click="checkLink">12312312</button> -->
    <Overlay :overlayshow="overlayshow"></Overlay>
    <!-- launch次数弹窗 -->
    <van-dialog
      v-model="launchShow"
      :close-on-click-overlay="true"
      :z-index="9999999"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      <div class="introduce">
        <p class>Want to Free Launch Your Own SoulCast NFT？</p>
        <p class>PUMP 3 Different SoulCast to Unlock!</p>
        <p class>{{`（Pumped ${UserInfo.pickCount >= 3 ? 3 :UserInfo.pickCount }/3）`}}</p>
        <div class="setBut">
          <button @click="goPump" v-if="UserInfo.pickCount < 3">Go to PUMP</button>
          <button @click="goLaunch" v-else>Free Launch SoulCast</button>
          <!-- <button>Pay 0.025{{ $network }} for Launching</button> -->
        </div>
      </div>
    </van-dialog>
    <!-- 没有绑定twitter时展示 -->
    <van-dialog
      v-model="bindTwitterShow"
      :close-on-click-overlay="true"
      :z-index="9999999"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      <div class="introduce">
        <p class>You should link your Twitter account before launch your SoulCast NFT.</p>
        <div class="setBut">
          <button @click="$router.push('/twitterAuth')">Go to link</button>
          <button style="background-color: #DFDFCE;" @click=" bindTwitterShow = false">Cancel</button>
        </div>
      </div>
    </van-dialog>
    <TabBar @save="save" :userTags="UserInfo.userTags" ref="taber"></TabBar>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import computed from "./src/computed";
import AOS from "aos";
import TabBar from "../../components/TabBar.vue";
import Hexagon from "../../components/Hexagon.vue";
import { getNFTLevel, levelImg } from "../../libs/target";
import Overlay from "../../components/Overlay.vue";
import { goParticle } from "@/libs/common.js";
export default {
  name: "home",
  data() {
    return {
      TagsList: [],
      overlayshow: false,
      address: "",
      levelImg: levelImg,
      getNFTLevel: getNFTLevel,
      UserInfo: {},
      values: [],
      TabActive: 1,
      launchShow: false, // 是否展示launch弹窗
      bindTwitterShow: false, // 去绑定twitter弹窗
      TabList: [
        {
          name: "Launched",
          id: 1
        },
        {
          name: "collected",
          id: 2
        },
        {
          name: "pumping",
          id: 3
        }
        // {
        //   name: "liked",
        //   id: 3,
        // },
      ],
      NftList: [
        // {
        //   img: require("../../assets/Frame1.png"),
        // },
        // {
        //   img: require("../../assets/Frame2.png"),
        // },
        // {
        //   img: require("../../assets/Frame1.png"),
        // },
        // {
        //   img: require("../../assets/Frame2.png"),
        // },
        // {
        //   img: require("../../assets/Frame1.png"),
        // },
        // {
        //   img: require("../../assets/Frame2.png"),
        // },
      ]
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    goParticle() {
      return goParticle;
    }
  },
  components: { TabBar, Hexagon, Overlay },
  created() {
    let me = this;
    me.getUserInfo();
    me.getMintedNFTPage(1);
    // me.db3()
  },
  mounted: async function() {
    // await this.linkethers()
    // await this.creatMyInfo()
    // this.creatMyInfo()
    // this.checkLink()
    console.log("this：", this);
    console.log("$route：", this.$route);
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
  destroyed() {}
};
</script>

<style lang="scss">
@import "./sass/style.scss";
.home {
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
    }
  }
}
</style>
