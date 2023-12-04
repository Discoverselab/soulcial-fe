<template>
  <div class="vsoul_introduce">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" />
      <div class="nav_name">
        <p class="name">ABOUT vSOUL</p>
      </div>
      <div class="back"></div>
    </div>
    <div class="introduce">
      <div class="title">What is vSOUL</div>
      <div class="content">
        <p>1. vSOUL represents the reward points in Soulcial.</p>
        <p>2. vSOUL could be converted into Soulcial tokens in the future airdrop.</p>
      </div>
      <div class="title">How to earn vSOUL</div>
      <div class="content" style="border: none;">
        <p>1. To earn vSOUL, make sure to hold least one SoulCast NFT. Without a SoulCast, vSOUL rewards cannot be granted.</p>
        <p>2. You can earn vSOUL by joining a Pump game, inviting friends to join a Pump game, and inviting friends to register:</p>
        <p class="everySec">
          · 20 vSOUL for each invited friend
          <span
            class="canJump bold"
            @click="jumpToInviteRegister"
          >{{"Go to Invite->"}}</span>
        </p>
        <p class="everySec">
          · 100 vSOUL for each invited Pump game
          <span
            class="canJump bold"
            @click="jumpToInviteFriend"
          >{{"Go to Invite->"}}</span>
        </p>
        <p class="everySec">
          · Pump vSOUL is calculated as Base * (1 + sum(Bonus)), with the Bonus amount varying based on your SoulCast NFT holding.
          <span
            class="canJump bold"
            @click="jumpToPumpGame"
          >{{"Go to Pump->"}}</span>
        </p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>SoulCast Level</th>
          <th>Lv 1 ORIGIN</th>
          <th>Lv 2 VITALITY</th>
          <th>Lv 3 EUREKA</th>
          <th>Lv 4 SPARK</th>
          <th>Lv 5 FLOW</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Win Pump Base</td>
          <td>400</td>
          <td>2000</td>
          <td>10000</td>
          <td>20000</td>
          <td>40000</td>
        </tr>
        <tr>
          <td>Not Win Pump Base</td>
          <td>100</td>
          <td>500</td>
          <td>2500</td>
          <td>5000</td>
          <td>10000</td>
        </tr>
        <tr>
          <td>Holding SoulCast Bonus</td>
          <td>5%</td>
          <td>10%</td>
          <td>15%</td>
          <td>20%</td>
          <td>25%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { get } from '@/http/http'
import Overlay from '@/components/Overlay.vue'
export default {
  data() {
    return {
      NFT: null,
      NFTDetail: null,
      isShareMy: false,
      UserInfo: null,
      overlayshow: false
    }
  },
  methods: {
    jumpToPumpGame() {
      this.$router.push(`/explore_details?id=${this.NFT.realTokenId}&path=`)
    },
    jumpToInviteFriend() {
      this.$router.push(`/share_pick?id=${this.NFTDetail.realTokenId}&isShareMy=${this.isShareMy}`)
    },
    jumpToInviteRegister() {
      this.$router.push(`invite`)
    },
    async getData() {
      try {
        this.overlayshow = true
        let url = this.$api.nft.getNFTDetail + `?id=${this.NFT.realTokenId}`
        const res = await get(url)
        if (res.code === 200) {
          this.NFTDetail = res.data
          const isSame =
            this.NFTDetail.mintUserAddress.toLocaleUpperCase() ===
              this.$loginData.Auth_Token.toLocaleUpperCase() ||
            this.NFTDetail.ownerAddress.toLocaleUpperCase() ===
              this.$loginData.Auth_Token.toLocaleUpperCase()
          if (isSame) {
            this.isShareMy = true
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.overlayshow = false
      }
    },
    getUserInfo() {
      this.overlayshow = true
      let url = this.$api.infor.getUserInfo
      get(url)
        .then(res => {
          if (res.code === 200) {
            this.UserInfo = res.data
            localStorage.setItem('userInfo', JSON.stringify(res.data))
          }
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          this.overlayshow = false
        })
    }
  },
  created() {
    this.NFT = JSON.parse(localStorage.getItem('NFT'))
    this.getData()
    this.getUserInfo()
  },
  components: {
    Overlay
  }
}
</script>
  <style lang="scss">
* {
  box-sizing: border-box;
}

.vsoul_introduce {
  padding: 20px 24px 0 24px;

  .back {
    display: block;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .navigate {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    top: 0px;
    z-index: 9;
    margin-bottom: 18px;

    .label {
      display: block;
      width: 16px;
      height: 16px;
    }

    .nav_name {
      display: flex;
      align-items: center;

      .userportrait {
        display: block;
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }

      .name {
        // text-transform: uppercase;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        color: #000;
      }

      .label {
        display: block;
        width: 16px;
        height: 16px;
      }
    }
  }

  .introduce {
    .title {
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 6px;
    }
    .content {
      line-height: 20px;
      border-bottom: 1px solid #dfdfce;
      margin-bottom: 10px;
      padding-bottom: 10px;
    }
  }
  .everySec {
    margin-left: 1em;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    border: 1px solid #dddddd;
    text-align: center;
    padding: 8px 4px;
    font-size: 8px;
    &:first-child {
      text-align: left; /* 设置第一列文本左对齐 */
    }
  }
  th {
    font-weight: 700;
    text-align: center;
    &:nth-child(1) {
      text-align: left;
    }
  }
}
</style>