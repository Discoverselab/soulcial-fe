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
    <ShareWebSoul ref="webSoul" />
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
    <div class="btn copy" style="text-transform: none;" @click="copy">
      <div>{{ `${website}/#/t/${this.code}` }}</div>
      <img round src="../../assets//copy1.png" alt />
    </div>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import methods from "./src/methods";
import { website } from "@/http/api.js";
import ShareWebSoul from "@/components/ShareWebSoul.vue"
export default {
  data() {
    return {
      UserInfo: {},
      code: '', // 长期邀请码
      overlayshow: false,
      website: website,
    };
  },
  methods: methods,
  created() {
  },
  mounted() {
    const shareWebSoul = this.$refs.webSoul
    this.code = shareWebSoul.code
    this.UserInfo = shareWebSoul.UserInfo
  },
  components: { ShareWebSoul }
};
</script>
<style lang="scss">
@import "./sass/style.scss";
</style>
