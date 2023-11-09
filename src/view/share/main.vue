<template>
  <div class="share">
    <img class="link_img link_img1" src="../../assets/link1.png" alt />
    <img class="link_img link_img2" src="../../assets/link2.png" alt />
    <img class="link_img link_img3" src="../../assets/link3.png" alt />
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt />
      <div class="nav_name">
        <p class="name">SHARE</p>
      </div>
      <div class="back" style="visibility: hidden;"></div>
    </div>
    <!-- 这里放置要截图的HTML内容 -->
    <div id="elementToCapture" class="share_photo">
      <!-- <svg-icon  className="svgName" iconClass="Vector1"></svg-icon> -->
      <div class="share_detail">
        <div class="title navigate">
          <div class="soul">
            <div  class="top">Web3 Soul</div>
            <div class="bottom">
              <span>{{ `${UserInfo.personality} ${UserInfo.chracter}` || '-' }}</span>
              <img src="@/assets/sbti.png" alt />
            </div>
            <div class="chracter">
              {{ soulInfo }}
            </div>
          </div>
        </div>
        <div class="nft_pic" v-if="showNftPicture">
          <img :src="NftList[0].pictureUrl" alt />
        </div>
        <div class="calculate" v-else>
          <div>
            <Hexagon
              :isShare="true"
              v-if="this.values.length > 5"
              :type="true"
              :level="UserInfo.level"
              :levelScore="UserInfo.levelScore"
              :values="values"
            />
          </div>
        </div>
        <!-- 存在nft图片 -->
        <div class="user_infor_nft" v-if="showNftPicture">
          <div class="userinfo">
            <div class="baseInfo">
              <img class="portrait" :src="`${UserInfo.avatar}`" alt />
              <div class="nameAddres" v-if="UserInfo.userName">
                <p class="name" >{{ UserInfo.userName }}</p>
                <!-- <p class="address">{{ substring(UserInfo.address) }}</p> -->
              </div>
            </div>

            <div class="introduce">
              <div class="bio" v-if="UserInfo.bio" ref="bio" >{{ UserInfo.bio }}</div>
              <div class="label_cont">
                <div
                  v-if="TagsList.length > 0"
                  style="display: flex;align-items: center;justify-content: space-between;"
                >
                  <div class="label_left">
                    <img
                      :class="`svgName${item}`"
                      v-for="(item, index) in TagsList"
                      :key="index"
                      :src="require(`@/assets/tags/tag${item}.png`)"
                      alt
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="smallRadar" ref="smallRadar" >
              <Hexagon1
                :isShare="true"
                :type="true"
                :level="UserInfo.level"
                :levelScore="UserInfo.levelScore"
                :values="values"
              />
            </div>
          </div>
        </div>
        <!-- 没有nft图片 -->
        <div class="user_infor_NoNft" v-else>
          <div class="userinfo">
            <div class="baseInfo">
              <img class="portrait" :src="`${UserInfo.avatar}`" alt />
              <div class="nameAddres" v-if="UserInfo.userName">
                <p class="name">{{ UserInfo.userName }}</p>
                <p class="address">{{ substring($loginData.Auth_Token) }}</p>
              </div>
            </div>
            <div class="introduce">
              <div class="bio">{{ UserInfo.bio }}</div>
              <div class="label_cont">
                <div
                  v-if="TagsList.length > 0"
                  style="display: flex;align-items: center;justify-content: space-between;"
                >
                  <div class="label_left">
                    <img
                      :class="`svgName${item}`"
                      v-for="(item, index) in TagsList"
                      :key="index"
                      :src="require(`@/assets/tags/tag${item}.png`)"
                      alt
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="soulical">
        <div class="logo">
          <img src="@/assets/logo.png" alt />
          <p>Rebuild the Value of Social Network</p>
        </div>
        <div class="qrcode" ref="qrCodeUrl"></div>
      </div>
    </div>

    <div class="operate">
      <div @click="shareTiwtter" class="btn">
        <div>twitter</div>
        <img src="@/assets/Twitters.png" alt />
      </div>
      <div class="btn" @click="captureAndSave">
        <div>download</div>
        <img src="@/assets/download-cloud-fill.png" alt />
      </div>
    </div>
    <div class="btn cpoy" style="text-transform: none;" @click="copy">
      <div>{{ `${website}#/t/${this.code}` }}</div>
      <img  class="copy-button" round src="../../assets//copy1.png" alt />
    </div>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import methods from "./src/methods";
import Hexagon from "@/components/Hexagon.vue";
import Hexagon1 from "@/components/Hexagon1.vue";
import Overlay from "@/components/Overlay.vue";
import { website } from "@/http/api.js";
export default {
  data() {
    return {
      soulInfo: undefined, // chracter的介绍
      values: [],
      UserInfo: {},
      TagsList: [],
      code: undefined, // 长期邀请码
      overlayshow: false,
      showNftPicture: false, // 展示用户持有的最新nft
      NftList: [],
      website: website,
    };
  },
  methods: methods,
  created() {},
   mounted() {
    let me = this;
     me.getUserInfo();

    me.getMintedNFTPage(1);

    me.creatQrCode();
    this.$nextTick(() => {
        me.getSmallRadarMarginTop()
    })
  },
  components: { Hexagon, Overlay, Hexagon1 }
};
</script>
<style lang="scss">
@import "./sass/style.scss";
</style>
