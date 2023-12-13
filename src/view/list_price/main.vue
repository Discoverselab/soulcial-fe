<template>
  <div class="list_price">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt />
      <div class="nav_name">
        <p class="name">list price</p>
      </div>
      <p></p>
    </div>
    <div class="details_cont">
      <!-- NFT infor -->
      <div class="nft_infor">
        <img class="nft_img" :src="NFTDetail.squarePictureUrl" alt />
        <div class="infor_right">
          <div class="right_top">
            <div class="grade">
              <img :class="`level${NFTDetail.level}`" :src="levelImg[NFTDetail.level]" alt />
              <p class="grade_name">{{ getNFTLevel[NFTDetail.level] }}</p>
              <p class="TOKENid">#{{ NFTDetail.realTokenId }}</p>
            </div>
            <!-- <p class="grade_right">{{ NFTDetail.price || "--" }} {{$network}}</p> -->
          </div>
          <div class="right_bot">
            <div class="bot_left">
              <span>Owned By:</span>
              You
            </div>
            <!-- <div class="bot_right">--</div> -->
          </div>
        </div>
      </div>
      <!-- sale -->
      <div class="suggestion">
        <div class="suggestion_list">
          <span class="key">last sale</span>
          <span
            class="value"
            style="color: #62625F;"
          >{{ NFTDetail.lastSale | formatNumber }} {{$network}}</span>
        </div>
        <div class="suggestion_list" style="margin: 0">
          <span class="key">List Price</span>
          <span
            class="value"
            style="color: #62625F;"
          >{{ NFTDetail.price | formatNumber}} {{$network}}</span>
        </div>
      </div>
      <p class="Fees">Fees</p>
      <div class="suggestion suggestions">
        <template v-if="isOld">
          <div class="suggestion_list">
            <span class="key">Compensation</span>
            <span class="value">12%</span>
          </div>
          <div class="suggestion_list">
            <span class="key">Service Fee</span>
            <span class="value">4%</span>
          </div>
          <div class="suggestion_list">
            <span class="key">Creator Fee</span>
            <span class="value">4%</span>
          </div>
        </template>
        <template v-else>
          <div class="suggestion_list">
            <span class="key">Compensation</span>
            <span class="value">14%-20%</span>
          </div>
          <div class="suggestion_list">
            <span class="key">Service Fee</span>
            <span class="value">2%</span>
          </div>
          <div class="suggestion_list">
            <span class="key">Creator Fee</span>
            <span class="value">2%</span>
          </div>
          <div class="suggestion_list" style="margin: 0">
            <span class="key">Referral Fee</span>
            <span class="value">2%</span>
          </div>
        </template>
      </div>
      <div class="suggestion">
        <template v-if="isOld">
          <div class="suggestion_list" style="margin: 0">
            <span class="key">potential earnings</span>
            <!-- 旧合约 -->
            <span class="value">{{ (getTotalEarn(NFTDetail.price)) | formatNumber }} {{$network}}</span>
          </div>
        </template>
        <template v-else>
          <div class="suggestion_list" style="margin: 0;display:unset">
            <p class="key">potential earnings</p>
            <p
              class="value mt20"
            >{{ (getTotalEarn(NFTDetail.price,0.74)) | formatNumber }} {{$network}} - {{ (getTotalEarn(NFTDetail.price,0.8))|formatNumber }}{{ $network }}</p>
          </div>
        </template>
      </div>
      <div class="input_cont" v-if="false">
        <input
          oninput="value=value.replace(/^([0-9-]\d*\.?\d{0,2})?.*$/,'$1')"
          @blur="price = $event.target.value"
          type="text"
          v-model="price"
        />
        <span class="symoy">
          <img :src="require(`../../assets/${$network}.png`)" alt />
          {{ $network }}
        </span>
      </div>
      <!-- operation -->
      <div class="set_but">
        <button @click="Complete()">Complete listing</button>
        <button class="Cancel" @click="$router.go(-1)">Cancel</button>
      </div>
    </div>

    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import watch from './src/watch'
import methods from './src/methods'
import computed from './src/computed'
import AOS from 'aos'
import Overlay from '../../components/Overlay.vue'
import {
  getNFTLevel,
  getNFTPersonality,
  NFTColor,
  getNFTMood,
  Weather,
  levelImg
} from '../../libs/target'
import { isOldMarketAddress } from '@/libs/common.js'
export default {
  name: '',
  data() {
    return {
      price: 0,
      overlayshow: false,
      levelImg: levelImg,
      getNFTPersonality: getNFTPersonality,
      getNFTLevel: getNFTLevel,
      NFTColor: NFTColor,
      getNFTMood: getNFTMood,
      Weather: Weather,
      NFTDetail: {},
      NftList: [],
      UnregisteredList: [], // 未挂单nft
      marketAddress: '', // 交易所合约地址
      isOld: false // 是否是旧合约
    }
  },
  watch: watch,
  methods: methods,
  computed: {},
  components: {
    Overlay
  },
  created() {
    let me = this
  },
  mounted: async function () {
    console.log('this：', this)
    console.log('$route：', this.$route)
    await this.getData()
    this.isOld = isOldMarketAddress(this.marketAddress)
    AOS.init({
      offset: 200,
      duration: 200, //duration
      easing: 'ease-in-sine',
      delay: 100
    })
    window.addEventListener('scroll', this.scrollToTop)
  },
  beforeRouteLeave(to, form, next) {
    // Leave the route to remove the scrolling event
    window.removeEventListener('scroll', this.scrollToTop)
    next()
  },
  destroyed() {}
}
</script>

<style lang="scss">
@import './sass/style.scss';
</style>
