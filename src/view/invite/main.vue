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
            <img
              @click="copy(item.inviteCode, '.copy-button')"
              class="copy-button"
              round
              src="../../assets//copy1.png"
              alt
            />
          </div>
        </div>
      </van-skeleton>
    </div>

    <div class="invite_code">
      <div class="title">invite link</div>
      <van-skeleton :row="3" :loading="overlayshow">
        <div class="code_nubmer">
          <div class="code linkcode">{{ inviteLink }}</div>
          <div class="copy">
            <img
              @click="copy(inviteLink, '.copy-link')"
              class="copy-button copy-link"
              round
              src="../../assets//copy1.png"
              alt
            />
          </div>
        </div>
      </van-skeleton>
    </div>
    <div class="reward">
      <div class="lay">
        <div class="point"></div>
        <div class="desc">
          Invite your friend with your code or link, and both you and your friend will earn
          <span
            class="keynote"
          >2 vSOUL</span>
          as referral reward.
        </div>
      </div>
      <div class="lay">
        <div class="point"></div>
        <div class="desc">
          With SoulCast NFT, you can boost your vSOUL earning from
          <span class="keynote">{{"10x! "}}</span>
          <span
            class="canJump bold"
            style="color: #000;"
            @click="jumpToEarn"
          >{{ "Check my Booster->" }}</span>
        </div>
      </div>
      <div class="lay">
        <div class="point"></div>
        <div class="desc">
          Each time your friend joins the Pump Game, you can get
          <span class="keynote">0.5% ETH</span>
          of the amount he Pumped and
          <span class="keynote">10% vSOUL</span> of amount he rewarded.
        </div>
      </div>
      <!-- <div class="lay">
        <div class="point"></div>
        <div class="desc">
          If you hold SoulCast NFT, both you and your friend will earn
          <span class="keynote">20 vSOUL</span>
          as referral reward.
        </div>
      </div>-->
    </div>
    <button class="check" @click="jumpEarn">check your earnings</button>
  </div>
</template>
<script>
import methods from './src/methods'
import { website } from '@/http/api.js'
export default {
  data() {
    return {
      overlayshow: false,
      inviteCodeList: [],
      code: '',
      inviteLink: ''
    }
  },
  created() {
    const data = JSON.parse(localStorage.getItem('userInfo'))
    this.code = data.superInviteCode.split('-')[1]
    this.inviteLink = `${website}/#/t/${this.code}`

    this.getInviteCodeList()
  },
  methods: methods
}
</script>
<style lang="scss">
@import './sass/style.scss';
</style>