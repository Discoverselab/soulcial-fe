<template>
  <div class="vsoul_introduce">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" />
      <div class="nav_name">
        <p class="name">ABOUT vSOUL</p>
      </div>
      <div class="back"></div>
    </div>
    <div class="poster">
      <img src="@/assets/poster1.png" alt />
    </div>
    <div class="introduce">
      <div class="title">What is vSOUL</div>
      <div class="content">
        <p>1. vSOUL represents the reward points in Soulcial.</p>
        <p>
          2. vSOUL could be converted into Soulcial tokens in the future
          <span
            class="bold"
          >100% airdrop</span>.
        </p>
        <p>
          3.
          <span
            @click="jumpTokenomics"
            class="canJump bold"
          >{{ "Learn more about our tokenomics->" }}</span>
        </p>
      </div>
      <div class="title">How to earn vSOUL</div>
      <div class="content" style="border: none;margin-bottom:0px">
        <p>
          1.
          <span class="bold">vSOUL = Base * Booster</span>
        </p>
        <p>2. Booster = Alpha Boost+Sum(Beta Boost), Alpha Boost is the Highest Level of your holding SoulCast NFT, Beta Boost is the sum of your other holding NFT.</p>
        <p>3. If you do not have SoulCast, Booster = 1</p>
        <p>4. About Base vSOUL</p>
        <p class="everySec">· Referral Base: 2 vSOUL</p>
        <p class="everySec">· Pump Base:</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Pump SoulCast Level</th>
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
          <td>40</td>
          <td>200</td>
          <td>1000</td>
          <td>2000</td>
          <td>4000</td>
        </tr>
        <tr>
          <td>Not Win Pump Base</td>
          <td>10</td>
          <td>50</td>
          <td>250</td>
          <td>500</td>
          <td>1000</td>
        </tr>
      </tbody>
    </table>
    <div class="introduce">
      <div class="content" style="border: none;margin-bottom:0px">
        <p class="everySec mt10">· 10% vSOUL of your referral earned in PUMP Game</p>
        <p>5. About Booster</p>
        <p class="everySec">
          · Now Your Booster =
          <span class="bold">{{ `${booster}x` }}</span>
        </p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Holding SoulCast Level</th>
          <th>Lv 1 ORIGIN</th>
          <th>Lv 2 VITALITY</th>
          <th>Lv 3 EUREKA</th>
          <th>Lv 4 SPARK</th>
          <th>Lv 5 FLOW</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alpha Boost</td>
          <td>10x</td>
          <td>11x</td>
          <td>12x</td>
          <td>13x</td>
          <td>15x</td>
        </tr>
        <tr>
          <td>Beta Boost</td>
          <td>0.5x</td>
          <td>1x</td>
          <td>1.5x</td>
          <td>2x</td>
          <td>2.5x</td>
        </tr>
      </tbody>
    </table>

    <Overlay :overlayshow="overlayshow"></Overlay>
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
      overlayshow: false,
      booster: null
    }
  },
  methods: {
    jumpTokenomics() {
      window.open(
        'https://soulcial-network.gitbook.io/soulcial-litepaper/litepaper/tokenomics-fairness-is-our-commitment-to-all-souls',
        '_blank'
      )
    },
    jumpToPumpGame() {
      this.$router.push(`/explore_details?id=${this.NFT.realTokenId}&path=`)
    },
    jumpToInviteFriend() {
      this.$router.push(`/share_pick?id=${this.NFTDetail.realTokenId}&isShareMy=${this.isShareMy}`)
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
    this.booster = this.$route.query.booster
    console.log('this.booster', this.booster)
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
  .poster {
    margin-bottom: 20px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
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
  .mt10 {
    margin-top: 10px;
  }
  .bold {
    font-weight: 600;
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