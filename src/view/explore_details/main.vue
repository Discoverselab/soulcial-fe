<template>
  <div class="explore_details">
    <div class="navigate">
      <img @click="goBack" class="back" src="../../assets/back.png" alt />
      <div class="nav_name hand" @click="linkUser(2)" v-if="NFTDetail.pictureUrl">
        <div class="portrait">
          <img class="userportrait" :src="NFTDetail.ownerUserAvatar" alt />
        </div>
        <p class="name">{{ NFTDetail.ownerUserName }}</p>
      </div>
      <img v-if="isShow" class="label" src="../../assets/label.png" alt @click="jumpSharePick" />
      <div v-else></div>
    </div>
    <div class="details_cont" v-if="NFTDetail.pictureUrl">
      <div class="Nft_details">
        <!-- NFT -->
        <div class="box" :class="{ flipped: turnShow, flippedShow: flippedShow && turnShow }">
          <div class="img_icon img_icon1">
            <div class="match" :class="{ matchs: turnShow }"
              v-if="NFTDetail.pictureUrl && $loginData.Auth_Token && !isPick()">
              <p :style="{
                color: `hsla(${NFTDetail.colorAttribute + 120}, 60%, 60%, 1)`,
              }" class="center">{{ NFTDetail.match || "0" }}%</p>
              <p :style="{
                color: `hsla(${NFTDetail.colorAttribute + 120}, 60%, 60%, 1)`,
              }" class="name">match</p>
            </div>
            <a :href="NFTDetail.squarePictureUrl" target="_blank">
              <img id="pfpNft" :src="NFTDetail.pictureUrl" alt />
            </a>
          </div>
          <!-- hexagonCalculate points -->
          <div class="img_icon img_icon2">
            <Hexagon v-if="this.values.length > 5 && turnShow" :type="false" :level="NFTDetail.level"
              :levelScore="NFTDetail.levelScore" :values="values" />
          </div>
        </div>
        <div class="bottom_infor" v-if="NFTDetail.pictureUrl">
          <svg-icon :style="{
            color: `hsla(${NFTDetail.colorAttribute + 120}, 60%, 60%, 1)`,
          }" class="svgName" iconClass="Vector1"></svg-icon>
          <div class="grade_price">
            <div class="grade">
              <img :class="`level${NFTDetail.level}`" :src="levelImg[NFTDetail.level]" alt />
              <p class="grade_name">{{ getNFTLevel[NFTDetail.level] }}</p>
              <p class="Personality_name" v-if="NFTDetail.price && NFTDetail.pickStatus != 0">
                <!-- {{ getNFTPersonality[NFTDetail.personality] }} -->
                {{ NFTDetail.soul }}
              </p>
            </div>
            <p class="price" v-if="NFTDetail.price && NFTDetail.pickStatus != 0">{{ NFTDetail.price || 0 }}{{ $network }}
            </p>
            <!-- <p class="price priceinfp" v-else> {{ getNFTPersonality[NFTDetail.personality] }}</p> -->
            <p class="price priceinfp" v-else :style="getSoulSbtiStyle(NFTDetail.soul)">{{ NFTDetail.soul || '-' }}</p>
          </div>
          <div class="turn" @click="turnShowClick">
            <img src="../../assets/turn.png" alt />
          </div>
          <!-- <div class="love">
            <img src="../../assets/love.png" alt="" />
            {{ NFTDetail.likes }}
          </div>-->
        </div>
        <!-- User label -->
        <div class="label_cont">
          <div class="label_left">
            <div class="label label1">{{ getNFTMood[NFTDetail.mood] }}</div>
            <!-- <div class="label label2">{{ Weather[NFTDetail.weather] }}</div> -->
            <div class="label label3">{{ NFTColor[NFTDetail.color] }}</div>
          </div>
        </div>
      </div>
      <!-- more -->
      <div class="more">
        <van-collapse v-model="activeNames">
          <van-collapse-item name="1">
            <template #title>
              <div class="chid">#{{ NFTDetail.realTokenId }}</div>
            </template>
            <template #value>
              <div class="MoreDetail">More Detail</div>
            </template>
            <template #right-icon>
              <van-icon class-prefix="my-icon" :name="activeNames == '1' ? 'up' : 'down'" />
            </template>
            <div class="more_list_cont">
              <div class="more_list">
                <span class="key">Contract Address</span>
                <span class="value hand copy-button" @click="copy(NFTDetail.contractAddress)">
                  {{
                    substring(NFTDetail.contractAddress)
                  }}
                </span>
              </div>
              <div class="more_list">
                <span class="key">Token ID</span>
                <span class="value">#{{ NFTDetail.realTokenId }}</span>
              </div>
              <div class="more_list">
                <span class="key">Blockchain</span>
                <span class="value">{{ NFTDetail.network }}</span>
              </div>
              <!-- <div class="more_list">
                <span class="key">Creator Earnings</span>
                <span class="value">1%</span>
              </div>-->
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
      <!-- The author has something. -->
      <div class="author">
        <div class="author_list" @click="linkUser(1)">
          <div class="portrait">
            <img class="portrait1" :src="NFTDetail.mintUserAvatar" alt />

            <img class="chat_link" src="../../assets/chat.png" alt />
          </div>
          <div class="Created">Launched By</div>
          <div class="name">{{ isUser(1) ? "You" : NFTDetail.mintUserName }}</div>
        </div>
        <div class="author_list" @click="linkUser(2)">
          <div class="portrait">
            <img class="portrait1" :src="NFTDetail.ownerUserAvatar" alt />
            <img class="chat_link" src="../../assets/chat.png" alt />
          </div>
          <div class="Created">{{ 'Owned By' }}</div>
          <div class="name">{{ isUser(2) ? "You" : NFTDetail.ownerUserName }}</div>
        </div>
      </div>
      <!-- operation -->
      <div class="set_but" v-if="NFTDetail.ownerAddress">
        <!-- <button
          v-if="
            NFTDetail.ownerAddress.toLocaleUpperCase() !=
              $loginData.Auth_Token.toLocaleUpperCase() && NFTDetail.price
          "
          @click="addVTNetwork(1)"
        >
          Collect Now
        </button>-->
        <button class="cancel" @click="cancelShow = true" v-if="NFTDetail.ownerAddress.toLocaleUpperCase() ===
          $loginData.Auth_Token.toLocaleUpperCase() && !NFTDetail.nowPickCount && NFTDetail.pickStatus > 0
          ">CANCEL LIST</button>
        <div v-if="isShow">
          <button @click="jumpToList" v-if="NFTDetail.ownerAddress.toLocaleUpperCase() ===
            $loginData.Auth_Token.toLocaleUpperCase() && !NFTDetail.pickStatus
            ">LIST FOR {{ formatNumber(NFTDetail.price) }} {{ $network }}</button>
        </div>

        <!-- <button
          v-if="
            NFTDetail.ownerAddress.toLocaleUpperCase() !=
            $loginData.Auth_Token.toLocaleUpperCase()
          "
        >
          Pick & Earn
        </button>-->
      </div>
      <!-- picks -->
      <div class="more" v-if="NFTDetail.pickStatus != 0">
        <p class="pikesTitle">
          <span class="title_left">
            <span class="pump">Pump</span>
            <img class="point_out" @click="dialogShow = true" src="../../assets/point_out.png" alt />
          </span>
          <span class="title_right" @click="jumpSharePick">
            <img src="@/assets/diamond.png" alt />
            <span class="invite_earn">Invite & Earn</span>
          </span>
        </p>
        <div class="author authorPicks">
          <!-- #1 -->
          <div class="author_list listPicks">
            <div v-if="NFTPickInfo.indexUserId0" @click="PicklinkUser(0)">
              <div class="portrait">
                <img class="portrait1" :src="NFTPickInfo.indexAvatar0" alt />
                <img class="chat_link" src="../../assets/chat.png" alt />
              </div>
              <p class="Created">Pumped By</p>
              <p class="name">{{ pickIsUser(0) ? 'You' : NFTPickInfo.indexUserName0 }}</p>
            </div>
            <div class="pick" v-else @click="picksTxH(0)">
              <button :class="{ disabledBUtton: isPick() || gray }">Pump</button>
            </div>
            <span class="number">#0</span>
          </div>
          <!-- #2 -->
          <div class="author_list listPicks">
            <div v-if="NFTPickInfo.indexUserId1" @click="PicklinkUser(1)">
              <div class="portrait">
                <img class="portrait1" :src="NFTPickInfo.indexAvatar1" alt />
                <img class="chat_link" src="../../assets/chat.png" alt />
              </div>
              <p class="Created">Pumped By</p>
              <p class="name">{{ pickIsUser(1) ? 'You' : NFTPickInfo.indexUserName1 }}</p>
            </div>
            <div class="pick" v-else @click="picksTxH(1)">
              <button :class="{ disabledBUtton: isPick() || gray }">Pump</button>
            </div>
            <span class="number">#1</span>
          </div>
          <!-- #3 -->
          <div class="author_list listPicks">
            <div v-if="NFTPickInfo.indexUserId2" @click="PicklinkUser(2)">
              <div class="portrait">
                <img class="portrait1" :src="NFTPickInfo.indexAvatar2" alt />
                <img class="chat_link" src="../../assets/chat.png" alt />
              </div>
              <p class="Created">Pumped By</p>
              <p class="name">{{ pickIsUser(2) ? 'You' : NFTPickInfo.indexUserName2 }}</p>
            </div>
            <div class="pick" v-else @click="picksTxH(2)">
              <button :class="{ disabledBUtton: isPick() || gray }">Pump</button>
            </div>
            <span class="number">#2</span>
          </div>
          <!-- #4 -->
          <div class="author_list listPicks">
            <div v-if="NFTPickInfo.indexUserId3" @click="PicklinkUser(3)">
              <div class="portrait">
                <img class="portrait1" :src="NFTPickInfo.indexAvatar3" alt />
                <img class="chat_link" src="../../assets/chat.png" alt />
              </div>
              <p class="Created">Pumped By</p>
              <p class="name">{{ pickIsUser(3) ? 'You' : NFTPickInfo.indexUserName3 }}</p>
            </div>
            <div class="pick" v-else @click="picksTxH(3)">
              <button :class="{ disabledBUtton: isPick() || gray }">Pump</button>
            </div>
            <span class="number">#3</span>
          </div>
        </div>
        <!-- v-if="NFTPickInfo.rewardTimeStr" -->
        <p class="picksTime" v-if="NFTPickInfo.nowPickCount === 4">
          PUMPING！
          <br />
          Results will be revealed in approximately <br />
          {{ calculateSecondsUntil(convertToTargetTimeZone(NFTPickInfo.rewardTime)) }} seconds
        </p>
      </div>
      <!-- picks -->
      <div class="more" v-if="false">
        <van-collapse v-model="activeNamesPicks">
          <van-collapse-item name="1">
            <template #title>
              <div class="chid">Pump</div>
            </template>
            <div class="more_list_cont">
              <div class="more_list more_list_picks">
                <span class="key">Price</span>
                <span class="key">From</span>
              </div>
              <div class="more_list" v-for="(item, index) in PicksList" :key="index">
                <span class="value">{{ item.price }}</span>
                <span class="value">{{ item.from }}</span>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
      <!-- history -->
      <div class="more history" v-if="History_list.length">
        <van-collapse v-model="activeNamesHistory">
          <van-collapse-item name="1">
            <template #title>
              <div class="chid">History</div>
            </template>
            <template #right-icon>
              <van-icon class-prefix="my-icon" :name="activeNamesHistory == '1' ? 'up' : 'down'" />
            </template>
            <div class="more_list_cont">
              <van-collapse v-for="(item, index) of History_list" :key="index" v-model="CollectList" class="collapse_er">
                <van-collapse-item :name="index">
                  <template #title>
                    <div class="more_list more_list_history">
                      <div class="type_cont">
                        <img v-if="item.type == 1" class="left_icon" src="../../assets/start.png" alt />
                        <img v-if="item.type == 0" class="left_icon" src="../../assets/mint.png" alt />
                        <img v-if="item.type == 2" class="left_icon" src="../../assets/Transfer.png" alt />
                        <div>
                          <span class="value">
                            {{ item.type == 1 ? 'Collect' : item.type == 3 ? 'Transfer' : 'Launch'
                            }}
                          </span>
                          <p class="hisname">{{ CollectList.indexOf(index) == '-1' ? '+ More' : '- Less' }}</p>
                        </div>
                      </div>
                      <div>
                        <span v-if="item.type == 1" class="value">{{ item.price }} {{ $network }}</span>
                        <p class="hisname hisname_right">{{ getLastTimeStr(convertToTargetTimeZone(item.createTime)) }}
                        </p>
                      </div>
                    </div>
                  </template>
                  <div class="more_list more_list_history" :key="index">
                    <div class="type_cont">
                      <div class="positioning"></div>
                      <div v-if="item.type != 0">
                        <span class="value">{{ substring(item.type == 0 ? item.toAddress : item.fromAddress) }}</span>
                        <p class="hisname">{{ item.type == 0 ? 'To Owner' : 'From' }}</p>
                      </div>
                    </div>
                    <div>
                      <span class="value">{{ substring(item.toAddress) }}</span>
                      <p class="hisname hisname_right">To</p>
                    </div>
                  </div>
                </van-collapse-item>
              </van-collapse>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <van-dialog v-model="dialogShow" :close-on-click-overlay="true" :z-index="99999999999999999999"
      :show-confirm-button="false" @confirm="dialog_confirm">
      <div class="introduce">
        <p class="introduce_title">What is Pump</p>
        <p class="content end">The Pump game lets you collect SoulCast NFTs and earn vSOULs.</p>
        <p class="introduce_title">How to Pump</p>
        <p class="content">1. Choose a slot from #0, #1, #2, and #3.</p>
        <p class="content">2. Confirm your Pump, and the payment will be deducted from your wallet.</p>
        <p class="content">3. Once all four slots are filled, one Pumper will be randomly chosen as the winner, collecting
          the SoulCast NFT.</p>
        <p class="content end">4. The other three Pumpers will receive a full refund plus an additional 4% in ETH as
          compensation.</p>
        <p class="introduce_title">Features</p>
        <p class="content">1. All Pumpers gain access to group chats with the creator of the SoulCast.</p>
        <p class="content">2. The winners of each Pump gain access to private chats with the creator of SoulCast.</p>
        <p class="content">3. The Pumpers who hold at least one SoulCast NFT are rewarded with vSOULs for participating.
        </p>
        <div class="setBut">
          <button class="backBtn" @click="dialogShow = false">back</button>
        </div>
      </div>
    </van-dialog>
    <van-dialog v-model="cancelShow" :close-on-click-overlay="true" :z-index="99999999999999999999"
      :show-cancel-button="false" :show-confirm-button="false">
      <div class="introduce">
        <p class="cancelPick">Do you want to cancel the list?</p>
        <img class="canserImg" src="../../assets/cancel_pick.png" alt />
        <div class="setBut">
          <button class="cancel" @click="cancelListNFT">cancel</button>
          <button class="backBtn" @click="cancelShow = false">back</button>
        </div>
      </div>
    </van-dialog>
    <Overlay :overlayshow="overlayshow"></Overlay>
    <Wallet :path="pathEx" @close="walletClose()" :walletShow="walletShow"></Wallet>
    <Picks :PoolBalance="PoolBalance" :pickIndex="pickIndex" @callBack="callBack" :NFTDetail="NFTDetail"
      @close="PicksShow = false" :PicksShow="PicksShow"></Picks>
    <!-- 未挂单nft需要大于1才能赚取积分 -->
    <van-dialog v-model="earnVsoulShow" :close-on-click-overlay="true" :z-index="9999999" :show-cancel-button="false"
      :show-confirm-button="false">
      <div class="introduce">
        <p class="earnVsoul">To earn vSOUL, make sure to hold least one SoulCast NFT. Without a SoulCast, vSOUL rewards
          cannot be granted.</p>
        <div class="setBut">
          <button @click="continueList">Continue To List</button>
          <button class="backBtn" style="background-color: #DFDFCE;" @click="earnVsoulShow = false">Cancel</button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import AOS from "aos";
import Wallet from "../../components/LinkWallet.vue";
import Hexagon from "../../components/Hexagon.vue";
import Overlay from "../../components/Overlay.vue";
import Picks from "../../components/Picks.vue";
import { copy, formatNumber } from "@/libs/common.js";
import { calculateSecondsUntil, getLastTimeStr, convertToTargetTimeZone } from "@/utils/convertTime.js"
import {
  getNFTLevel,
  getNFTPersonality,
  NFTColor,
  getNFTMood,
  Weather,
  levelImg
} from "../../libs/target";
import { isShow } from "@/libs/isShow.js";
export default {
  name: "explore_details",
  data() {
    return {
      loginInfo: undefined,
      isShareMy: false,
      dialogShow: false,
      cancelShow: false,
      PoolBalance: "",
      PicksShow: false,
      pathEx: true,
      History_list: [],
      gray: false,
      flippedShow: false,
      pickIndex: 0,
      overlayshow: false,
      turnShow: false,
      levelImg: levelImg,
      values: [],
      getNFTPersonality: getNFTPersonality,
      getNFTLevel: getNFTLevel,
      NFTColor: NFTColor,
      getNFTMood: getNFTMood,
      Weather: Weather,
      walletShow: false,
      CollectList: [],
      TransferList: [],
      activeNames: [],
      MintList: [],
      activeNamesPicks: [],
      activeNamesHistory: ["1"],
      NFTDetail: {
        ownerUserName: ""
      },
      NFTPickInfo: {},
      PicksList: [],
      TabActive: 1,
      height: 0, //图片高度
      NftList: [],
      UnregisteredList: [], // 未挂单nft 
      earnVsoulShow: false,
      isUseInviteCode:false, // 用户是否使用过邀请码 
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    isShow() {
      return isShow;
    },
    copy() {
      return copy;
    },
    calculateSecondsUntil() {
      return calculateSecondsUntil
    },
    getLastTimeStr() {
      return getLastTimeStr
    },
    convertToTargetTimeZone() {
      return convertToTargetTimeZone
    },
    formatNumber() {
      return (num) => formatNumber(num)
    }
  },
  components: {
    Wallet,
    Hexagon,
    Overlay,
    Picks
  },
  created() {
    // this.BalanceOf()
    if (this.$route.meta.isSharePick) {
      let urlList = window.location.href.split("/");
      window.sessionStorage.setItem("inviteCode", urlList[urlList.length - 1]);
    }
  },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
    this.getData();
    this.getNFTHistory();
    this.getNFTPickInfo();
    this.getMintedNFTPage()
    AOS.init({
      offset: 200,
      duration: 200, //duration
      easing: "ease-in-sine",
      delay: 100
    });
    window.addEventListener("scroll", this.scrollToTop);
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("scroll", this.scrollToTop);
    next();
  },
};
</script>

<style lang="scss">
@import "./sass/style.scss";
</style>
