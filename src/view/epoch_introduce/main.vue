<template>
  <div class="vsoul_introduce">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" />
      <div class="nav_name">Soul King da Moon</div>
    </div>
    <div class="banner">
      <img src="../../assets/weekly.png" alt />
    </div>
    <div class="introduce">
      <div class="content">
        Start Soulcial Journey and earn vSOUL, Top 10 on weekly leaderboard share
        <span
          class="bold"
        >$170</span> rewards pool.
      </div>
      <div class="title">Weekly Leaderboard</div>
      <div class="content">
        <p>Mon 00:00 - Sun 23:59 UTC</p>
        <p>The leaderboard will be reset and re-calculated every Monday.</p>
      </div>
      <div class="title">Rewards</div>
      <div class="content" style="border: none;">
        <p>
          Top 10 on weekly leaderboard share
          <span class="bold">$170</span> rewards pool.
        </p>
        <p class="sec">
          · 1st:
          <span class="bold">$50</span>
        </p>
        <p class="sec">
          · 2nd:
          <span class="bold">$30</span>
        </p>
        <p class="sec">
          · 3rd:
          <span class="bold">$20</span>
        </p>
        <p class="sec">
          · 4th-10th:
          <span class="bold">$10</span>
        </p>
      </div>
    </div>

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
  padding: 20px 24px 40px;

  .canJump {
    text-decoration: underline;
    cursor: pointer;
  }
  .back {
    display: block;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .banner {
    margin-bottom: 20px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .navigate {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    top: 0px;
    z-index: 9;
    margin-bottom: 18px;

    .nav_name {
      justify-content: center;
      flex: 1;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      color: #000;
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
      .bold {
        font-weight: 600;
      }
    }
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

  .sec {
    text-indent: 1em;
  }
  .everySec {
    margin-left: 1em;
  }
}
</style>