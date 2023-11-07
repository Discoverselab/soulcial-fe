<template>
  <div class="invite">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt />
      <div class="nav_name">
        <p class="name">invite friend</p>
      </div>
      <div class="back"></div>
    </div>
    <div class="invite_code">
      <div class="title">invite code</div>
      <van-skeleton :row="3" :loading="overlayshow">
        <div class="code_nubmer" v-for="(item, i) in inviteCodeList" :key="item.id">
          <div class="number">{{ i + 1 }}</div>
          <div class="code" :class="{ disabled: item.used === 1 }">{{ item.inviteCode }}</div>
          <div class="copy" :class="{ disabled: item.used === 1 }">
            <img @click="copy(item.inviteCode)" class="copy-button" round src="../../assets//copy1.png" alt />
          </div>
        </div>
      </van-skeleton>

    </div>
    <div class="reward">
      <div class="lay">
        <div class="point"></div>
        <div class="desc">Invite your friend with your code, and increase your SBTI.</div>
      </div>
      <div class="lay">
        <div class="point"></div>
        <div class="desc">If you hold SoulCast NFT, both you and your friend will earn 20 vSOUL as reference reward.</div>
      </div>
    </div>
    <button class="check" @click="jumpEarn">check your earnings</button>
  </div>
</template>
<script>
import methods from "./src/methods";
export default {
  data() {
    return {
      overlayshow: false,
      inviteCodeList: []
    };
  },
  created() {
    this.getInviteCodeList();
  },
  methods: methods
};
</script>
<style lang="scss">
@import "./sass/style.scss";
</style>