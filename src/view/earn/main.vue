<template>
  <div class="earn">
    <!-- Tab -->
    <div class="TabCont">
      <div
        class="Tab_list"
        :class="{
        Tab_list_Active: TabActive == item.id,
      }"
        @click="changeTabActive(item.id)"
        v-for="(item, index) in TabList"
        :key="index"
      >{{ item.name }}</div>
    </div>
    <!-- earnings -->
    <div class="earnings" v-if="TabActive == 1">
      <div class="earn_list earn_list_one">
        <p class="list_name" style="color:#62625F" >Balance</p>
        <p class="balance">{{ VSoulBalance }} vSOUL</p>
      </div>
      <div>
      <div>
        <div class="earn_list_title">
          <p class="title">History</p>
        </div>
        <van-list
          v-model="earnLoading"
          offset="200"
          loading-text="Loading"
          :immediate-check="false"
          :finished="earnFinished"
          finished-text
          @load="onEarnLoad"
          v-if="VSoulHistory.length>0"
        >
          <div class="earn_list" v-for="(item, index) in VSoulHistory" :key="index">
            <div class="list_left">
              <img v-if="item.number > 0" src="../../assets/Pick.png" alt />
              <img v-else src="../../assets/Promotion.png" alt />
              <div class="title_time">
                <p class="list_name">{{ earnType[`${item.type}`] || "Promotion"}}</p>
                <p class="times">{{ convertToTargetTimeZone(item.createTime) }}</p>
              </div>
            </div>
            <button class="list_right">{{ `+${item.vsoulPrice} vSOUL` }}</button>
          </div>
        </van-list>
        <div class="Save" v-else-if="showNoData">
          <img src="../../assets/noDist.png" alt />
          <p class="SaveText">No data to display</p>
        </div>
      </div>
    </div>
    </div>
    <!-- wallet -->
    <!-- 暂时隐藏 -->
    <div v-if="isShow">
      <div class="earnings" v-if="TabActive == 2">
        <!-- <div class="earn_list earn_list_one">
          <p class="list_name">Available Fund:</p>
          <p
            class="balance"
          >{{ formatNumber(Number(WalletBalance) + Number(PoolBalance)) }} {{ $network }}</p>
        </div>-->
        <div class="earn_list" style="margin:0;border-bottom:0">
          <p class="list_name" style="color:#62625F">Balance</p>
          <p class="er_balance">{{ WalletBalance }} {{ $network }}</p>
        </div>
        <!-- <div class="earned">
          <div class="money">
            <div class="earn_money">Earned</div>
            <div class="make_money">{{ `0` }} {{$network}}</div>
          </div>
        </div> -->
        <!-- <div class="earn_list">
          <p class="list_name" style="color:#62625F">Pool Balance</p>
          <p
            class="er_balance"
            :class="{ Nobalance: !Number(PoolBalance) }"
          >{{ PoolBalance }} W{{ $network }}</p>
        </div>-->
        <!-- <div class="earn_list" v-if="!Number(PoolBalance)">
          <div>
            <p class="list_name" style="color:#E03131">Your Pool Balance is empty</p>
            <p class="emptys">Add funds to Pick. You can withdraw anytime. No minimum required.</p>
          </div>
        </div>-->
        <div>
        <div class="earn_list_title earn_list_title_wallet">
          <p class="title">History</p>
        </div>
          <van-list
          v-model="walletLoading"
          offset="200"
          loading-text="Loading"
          :immediate-check="false"
          :finished="walletFinished"
          finished-text
          @load="onWalletLoad"
          v-if="WalletHistory.length>0"
          >
            <div class="earn_list" v-for="(item, index) in WalletHistory" :key="index">
            <div class="list_left">
              <img v-if="item.type == 0 || item.type == 1" src="../../assets/pickss.png" alt />
              <img v-else src="../../assets/start.png" alt />
              <div class="title_time">
                <p class="list_name">{{ walletTypeNmae[item.type] }}</p>
                <p class="times">{{ convertToTargetTimeZone(item.createTime) }}</p>
              </div>
            </div>
            <button class="list_right" :class="{ list_right_fu: item.type == 3 || item.type == 1 }">
              {{ item.type != 1 &&
              item.type != 3
              ? `+${item.price} ${$network}` : `-${item.price} ${$network}` }}
            </button>
          </div>
          </van-list>
          <div class="Save" v-else-if="showNoWallet">
          <img src="../../assets/noDist.png" alt />
          <p class="SaveText">No data to display</p>
        </div>
        
      </div>
      </div>
      <!-- <div class="set_but set_but_wallet" v-if="TabActive == 2">
        <button
          :class="{ disabled: !Number(WalletBalance) }"
          @click="addFunds(true)"
        >Add Funds To Pool</button>
        <button
          :class="{ disabled: !Number(PoolBalance) }"
          @click="addFunds(false)"
        >Withdraw From Pool</button>
      </div>-->
      
    </div>
    <!-- 暂时隐藏 -->

    <!-- set but -->

    <!-- collections -->
    <div v-if="isShow">
      <div class="collections" v-show="TabActive == 3">
        <!-- Secondary menu list -->
        <div class="ercont_cont">
          <div class="ercont">
            <div
              @click="erIDClick(item)"
              class="ercont_list"
              :class="{ ercont_list_active: item.id == erID }"
              v-for="(item, index) in erList"
              :key="index"
            >{{ item.name }}</div>
          </div>
          <div class="Tab_right">
            <img src="../../assets/sift.png" alt />
          </div>
        </div>
        <!-- NFT List -->
        <div class="nft_cont" v-if="NftList.length">
          <div
            class="nft_list"
            @click="$router.push(`/explore_details?id=${item.id}&path=`)"
            v-for="(item, index) in NftList"
            :key="index"
          >
            <div class="img_cont">
              <img class="nftUrl" :src="item.squarePictureUrl" alt />
              <div v-if="erID == 1" class="point">
                <span v-for="index in 3" :key="index"></span>
              </div>
              <!-- <img v-else class="subtract" src="../../assets/Subtract.png" alt=""> -->
            </div>
            <div class="nft_infor">
              <!-- <p class="top_name_price">
                <span class="name">Top Pick</span>
                <span class="price">0.45 {{ $network }}</span>
              </p>-->
              <div class="flow_id">
                <img :class="`level${item.level}`" :src="levelImg[item.level]" alt />
                <span class="flow">{{ getNFTLevel[item.level] }}</span>
                <span class="flow_lin">#{{ item.id }}</span>
              </div>
              <div class="Listing">
                <span>Listing Price</span>
                <span v-if="erID == 1">Cost</span>
              </div>
              <div class="price_botm">
                <span
                  class="bot_price"
                >{{ item.pickStatus == 1 ? item.price + ` ${$network}` : '--' }}</span>
                <span class="bot_price" v-if="erID == 1">{{ item.costPrice || 0 }} {{ $network }}</span>
              </div>
            </div>
            <div class="Launching">
              <div class="LaunchingData" v-if="item.pickStatus > 0">
                <span v-if="!item.nowPickCount">Pump 0/4</span>
                <span
                  v-else
                >{{ item.nowPickCount >= 4 ? 'Launching' : `Pump ${item.nowPickCount}/4` }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="Save" v-else>
          <img src="../../assets/noDist.png" alt />
          <p class="SaveText">No data to display</p>
        </div>
      </div>
    </div>

    <Overlay :overlayshow="overlayshow"></Overlay>
    <TabBar></TabBar>
    <Replace
      @callBack="callBack"
      @close="ReplaceShow = false"
      :WalletBalance="WalletBalance"
      :PoolBalance="PoolBalance"
      :type="walletType"
      :ReplaceShow="ReplaceShow"
    ></Replace>
  
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import AOS from "aos";
import { getNFTLevel, levelImg, earnType } from "../../libs/target";
import TabBar from "../../components/TabBar.vue";
import Overlay from "../../components/Overlay.vue";
import Replace from "../../components/Replace.vue";
import { isShow } from "@/libs/isShow.js";
import { convertToTargetTimeZone } from "@/utils/convertTime";
import ipinfo from "ipinfo";
export default {
  name: "",
  data() {
    return {
      getNFTLevel: getNFTLevel,
      levelImg: levelImg,
      earnType: earnType,
      earnLoading: false,
      walletLoading:false,
      earnFinished: false,
      earnPageSize: 20,
      earnCurrentPage: 1,
      walletCurrentPage:1,
      walletPageSize:20,
      walletFinished:false,
      TabActive: 2,
      VSoulHistory: [],
      WalletHistory: [],
      walletType: true,
      overlayshow: false,
      WalletBalance: "",
      PoolBalance: "",
      ReplaceShow: false,
      VSoulBalance: "",
      erID: 1,
      Available: 0,
      showNoData: false, // vsoul页面没有历史数据展示图片
      showNoWallet: false,//wallet页面没有历史数据时展示
      walletTypeNmae: {
        0: "Deposit",
        1: "Withdraw",
        2: "Earn",
        3: "Collect",
        4: "Refund",
        5: "Sell",
        6: "Creartor Earnings"
      },
      TabList: [
        {
          name: "WALLET",
          id: 2
        },
        {
          name: "vSOUL",
          id: 1
        },
        {
          name: "COLLECTIONS",
          id: 3
        }
      ],
      erList: [
        {
          name: "Inventory",
          id: 1
        },
        {
          name: "Pump",
          id: 2
        }
      ],
      HistoryList: [
        {
          time: "2023-04-25 19:41",
          number: 234
        },
        {
          time: "2023-04-25 19:41",
          number: 220
        },
        {
          time: "2023-04-25 19:41",
          number: -400
        }
      ],
      NftList: [
        {
          img: require("../../assets/Frame1.png")
        },
        {
          img: require("../../assets/Frame2.png")
        },
        {
          img: require("../../assets/Frame1.png")
        },
        {
          img: require("../../assets/Frame2.png")
        },
        {
          img: require("../../assets/Frame1.png")
        },
        {
          img: require("../../assets/Frame2.png")
        }
      ]
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    isShow() {
      return isShow;
    },
    convertToTargetTimeZone() {
      return convertToTargetTimeZone;
    }
  },
  components: {
    TabBar,
    Overlay,
    Replace
  },
  created() {
    let me = this;
    if (this.$route.query.type == 1) {
      this.TabActive = 1;
    }

    const token = "a47c446ea7f061";
    this.overlayshow = true;
    fetch(`https://ipinfo.io/json?token=${token}`)
      .then(response => response.json())
      .then(data => {
        window.localStorage.setItem("timezone", data.timezone);
        console.log(data.timezone,'data.timezonedata.timezone')
      })
      .catch(error => {
        window.localStorage.removeItem("timezone");
        console.error(error)
      })
    me.getBalance();
    // me.BalanceOf();
    me.getMintedNFTPage(1);
    me.getWallectHistory();
  },
  mounted: async function() {
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
</style>
