<template>
  <!-- tabBar -->
  <div class="Picks">
    <van-action-sheet @close="close" v-model="PicksShow">
      <div class="content">
        <p class="headLin" @click="close"></p>
        <p class="title">PUMP & EARN</p>
        <div class="nft_infor">
          <img class="nft_img" :src="NFTDetail.squarePictureUrl" alt />
          <div class="infor_right">
            <div class="right_top">
              <div class="grade">
                <img :class="`level${NFTDetail.level}`" :src="levelImg[NFTDetail.level]" alt />
                <p class="grade_name">{{ getNFTLevel[NFTDetail.level] }}</p>
                <p class="TOKENid">#{{ NFTDetail.realTokenId }}</p>
              </div>
              <p class="grade_right">{{ NFTDetail.price || "--" }} {{ $network }}</p>
            </div>
            <div class="right_bot">
              <div class="bot_left">
                <span>Owned By:</span>
                {{ NFTDetail.ownerUserName }}
              </div>
            </div>
          </div>
        </div>
        <div class="EnterPrice">
          <div class="input_cont">
            <input readonly oninput="value=value.replace(/^([0-9-]\d*\.?\d{0,10})?.*$/,'$1')"
              @blur="price = $event.target.value" class="cont_input" v-model="NFTDetail.price" type="text" />
            <p class="unit">
              <img :src="require(`../assets/${$network}.png`)" alt />
              {{ $network }}
            </p>
          </div>
          <!-- <p class="walletBalance">
            Pool Balance:
            <span>{{ PoolBalance }} {{$network}}</span>
          </p>-->
          <p class="walletBalance">
            Potential Launch Reward (4%) :
            <span>{{ formatNumber(NFTDetail.price * 0.04) }} {{ $network }}</span>
          </p>
        </div>
        <div class="cudset_but">
          <!-- <button @click="$router.push('/earn')" v-if="!IFBalance()">Go to add {{$network}}</button> -->
          <button @click="save">PUMP</button>
          <button class="Cancel" @click="close()">CANCEL</button>
        </div>
      </div>
    </van-action-sheet>
    <!-- <van-dialog
      v-model="dialogShow"
      :close-on-click-overlay="false"
      :z-index="99999999999999999999"
      :confirmButtonText="`Go to add W${$network}`"
      @confirm="dialog_confirm"
    >
      <p class="fee_dint">Sorry, you don't have enough W{{ $network }}.</p>
    </van-dialog>-->
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import Overlay from "../components/Overlay.vue";
import Sorl from "../libs/testEthABI.json";
import MarketABI from "../libs/MarketABI.json";
import wethABI from "../libs/weth.json";
import { nftAddress, ABIAddress, marketAddress } from "../libs/common.js";
import { ethers } from "ethers";
import Web3 from "web3";
import { get, post } from "@/http/http";
import { levelImg, getNFTLevel } from "../libs/target";
import { addVTNetwork } from "@/libs/addVTNetwork.js";
export default {
  props: {
    NFTDetail: Object,
    PicksShow: Boolean,
    pickIndex: Number,
    PoolBalance: String
  },
  data: function () {
    let _clientH = document.documentElement.clientHeight;
    return {
      overlayshow: false,
      // dialogShow: false,
      price: "",
      levelImg: levelImg,
      getNFTLevel: getNFTLevel
    };
  },
  computed: {},
  components: { Overlay },
  watch: {},
  methods: {
    dialog_confirm() {
      this.$router.push("/earn");
    },
    formatNumber(number) {
      if (Number.isInteger(number)) {
        return number.toString(); // 如果是整数，直接返回
      } else {
        const roundedNumber = Math.round(number * 1000000) / 1000000; // 四舍五入到4位小数
        const decimalPlaces = roundedNumber.toString().split(".")[1]; // 获取小数部分
        if (decimalPlaces && decimalPlaces.length > 6) {
          return roundedNumber.toFixed(6); // 如果小数位超过4位，保留4位小数
        } else {
          return roundedNumber.toString(); // 如果小数位不超过4位，展示实际位数
        }
      }
    },
    close() {
      this.$emit("close", true);
    },
    getPickInfo() {
      let url =
        this.$api.nft.getNFTPickInfo + `?tokenId=${this.NFTDetail.realTokenId}`;
      let me = this;
      get(url)
        .then(res => {
          if (res.code === 200) {
            if (res.data[`indexUserName${me.pickIndex}`]) {
              this.$parent.NFTPickInfo = res.data;
              me.close();
              me.overlayshow = false;
            } else {
              me.getPickInfo();
            }
          }
        })
        .catch(error => {
          console.error(error);
          this.$toast("getPickInfo error");
          this.overlayshow = false;
        });
    },
    async jcHash(txHash) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
        if (error) {
          console.error(error);
          this.overlayshow = false;
        } else if (receipt && receipt.status === true) {
          console.log("链上交易已执行完毕");
          this.getPickInfo();
          this.pickByInviteCode()
        } else {
          this.jcHash(txHash);
          console.log("链上交易未执行完毕");
        }
      });
    },
    // 使用邀请码pick
    pickByInviteCode() {
      this.overlayshow = true;
      let url = this.$api.infor.pickByInviteCode;
      let superInviteCode = JSON.parse(localStorage.getItem("userInfo"))
        .superInviteCode;
      let data = {
        inviteCode: superInviteCode
      };
      post(url, data)
        .then(res => { })
        .catch(error => { })
        .finally(() => {
          this.overlayshow = false;
        });
    },
    // IFBalance() {
    //   return Number(this.PoolBalance) > 0;
    // },
    async save() {
      // 选择网络链接钱包
      if (!this.$loginData.Auth_Token) {
        this.walletShow = true;
        return;
      }
      if (this.$loginData.loginType == 0) {
        await addVTNetwork(this.getApproved, this.getApproved);
      } else {
        window.particle ? this.getApproved() : (this.walletShow = true);
      }
    },
    async getApproved() {
      this.overlayshow = true;
      try {
        this.$loginData.loginType == 1 ? this.particlePay() : this.toPay();
      } catch (error) {
        this.overlayshow = false;
        this.$toast(error);
        console.error(error);
      }
    },
    // particle交易
    async particlePay() {
      const contract = new window.web3.eth.Contract(MarketABI, marketAddress);
      this.handlePickItem(contract);
    },
    // metatask交易
    async toPay() {
      const web3 = new Web3(window.ethereum);
      var myContract = new web3.eth.Contract(MarketABI, marketAddress);
      this.handlePickItem(myContract);
    },
    handlePickItem(contract) {
      let me = this;
      const tokenId = this.NFTDetail.realTokenId;
      const value = ethers.utils.parseUnits(this.NFTDetail.price, 18)._hex;
      contract.methods
        .pickItem(nftAddress, tokenId, this.pickIndex)
        .send({ from: this.$loginData.Auth_Token, value: value })
        .on("transactionHash", function (hash) {
          console.log("🔥🔥🔥🚀 ~ file: Picks.vue:179 ~ hash:", hash);
          // 交易已发送，可以显示交易哈希或执行其他操作
          me.jcHash(hash);
        })
        .on("error", function (error) {
          me.overlayshow = false;
          me.$toast(error);
          console.error("Error: ", error);
        });
    }
  }
};
</script>
<style lang="scss">
.Picks {
  @media screen and (min-width: 750px) {
    .van-action-sheet__content {
      padding: 8px 430px 42px 430px !important;
      border: 1px solid #000;
    }

    .van-action-sheet {
      max-height: 80% !important;
    }
  }

  .van-dialog {
    padding: 30px 24px 30px 24px !important;
  }

  .fee_dint {
    color: #333;
    font-size: 16px;
    font-family: "Inter";
    font-weight: 600;
    font-style: normal;
    margin-bottom: 20px;
  }

  .van-action-sheet {
    background-color: #f5f5ed;
    min-height: 75%;
    max-height: 100%;
  }

  .content {
    padding: 8px 25px 42px 25px;
    background-color: #f5f5ed;

    .headLin {
      width: 88px;
      height: 4px;
      background: #dfdfce;
      border-radius: 100px;
      margin: 0 auto 30px auto;
    }

    .title {
      color: #000;
      text-align: center;
      font-family: "Inter";
      font-size: 20px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      text-transform: uppercase;
      margin-bottom: 38px;
    }

    .nft_infor {
      padding-bottom: 18px;
      border-bottom: 2px solid #dfdfce;
      display: flex;
      align-items: center;
      margin-bottom: 40px;

      .nft_img {
        display: block;
        min-width: 60px;
        min-height: 60px;
        max-width: 60px;
        max-height: 60px;
        margin-right: 16px;
      }

      .infor_right {
        width: 100%;

        .right_top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .grade {
            display: flex;
            align-items: center;

            img {
              display: block;
              height: auto;
              margin-right: 4px;
              object-fit: cover;

              &.level1 {
                width: 22px;
              }

              &.level2 {
                width: 20px;
              }

              &.level3 {
                width: 20px;
              }

              &.level4 {
                width: 20px;
              }

              &.level5 {
                width: 22px;
              }
            }

            .grade_name {
              font-family: "Inter";
              font-weight: 600;
              font-size: 16px;
              text-transform: uppercase;
              color: #000000;
            }

            .TOKENid {
              margin-left: 12px;
              color: #000;
              font-size: 16px;
              font-family: Inter;
              font-weight: 600;
            }
          }

          .grade_right {
            color: #000;
            text-align: right;
            font-size: 16px;
            font-family: Inter;
            font-weight: 600;
          }
        }

        .right_bot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;

          .bot_left {
            color: #000;
            font-size: 14px;
            font-family: Inter;
            font-weight: 600;

            span {
              color: #62625f;
            }
          }

          .bot_right {
            color: #62625f;
            text-align: right;
            font-size: 12px;
            font-family: Inter;
            font-weight: 600;
          }
        }
      }
    }

    .EnterPrice {
      .input_cont {
        position: relative;

        .cont_input {
          width: 100%;
          box-sizing: border-box;
          border-radius: 10px;
          border: 2px solid #dfdfce;
          background: #fff;
          font-family: "Inter";
          font-size: 18px;
          font-style: normal;
          font-weight: 600;
          color: #000;
          padding: 12px 20px;
        }

        .unit {
          position: absolute;
          right: 20px;
          top: 12px;
          background-color: #000;
          padding: 4px 12px;
          border-radius: 6px;
          background: #000;
          display: flex;
          align-items: center;
          font-family: "Inter";
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          color: #fff;

          img {
            display: block;
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
      }

      .walletBalance {
        margin-top: 15px;
        color: #62625f;
        font-family: "Inter";
        font-size: 12px;
        font-style: normal;
        font-weight: 600;

        span {
          margin-top: 15px;
          color: #000;
          font-family: "Inter";
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
        }
      }
    }

    .cudset_but {
      box-sizing: border-box;
      margin-top: 76px;

      button {
        position: relative;

        &:active {
          opacity: 0.8;
        }

        &.disabled {
          background-color: #f1f1e7;
          color: #c4c4be;
          border: 2px solid #c4c4be;
        }

        &.Cancel {
          border: 2px solid #000;
          background: #dfdece;
          color: #000;
        }

        display: block;
        width: 100%;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 26px;
        gap: 10px;
        width: 342px;
        height: 40px;
        background: #ffffff;
        text-transform: uppercase;
        border: 2px solid #000000;
        border-radius: 45px;
        font-family: "Inter";
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        color: #000;
      }

      .skip {
        color: #000;
        text-align: center;
        font-size: 12px;
        font-family: "Inter";
        font-style: normal;
        font-weight: 600;
        margin-top: 20px;

        span {
          color: #f3b228;
        }
      }
    }
  }

  .svgName1 {
    width: 78px !important;
    height: 24px !important;
  }

  .svgName2 {
    width: 75px !important;
    height: 24px !important;
  }

  .svgName3 {
    width: 50px !important;
    height: 24px !important;
  }

  .svgName4 {
    width: 94px !important;
    height: 24px !important;
  }

  .svgName5 {
    width: 54.5px !important;
    height: 24px !important;
  }

  .svgName6 {
    width: 52px !important;
    height: 24px !important;
  }

  .svgName7 {
    width: 53px !important;
    height: 24px !important;
  }

  .svgName8 {
    width: 40px !important;
    height: 24px !important;
  }

  .svgName9 {
    width: 96px !important;
    height: 24px !important;
  }

  .svgName10 {
    width: 40px !important;
    height: 24px !important;
  }

  .svgName11 {
    width: 68px !important;
    height: 24px !important;
  }

  .svgName12 {
    width: 88px !important;
    height: 24px !important;
  }

  .ovrlay {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .van-dialog__header {
    text-align: center;
    font-size: 20px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 900;
    text-transform: uppercase;
  }
}
</style>
        