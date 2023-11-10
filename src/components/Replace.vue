<template>
  <!-- tabBar -->
  <div class="Tags">
    <van-action-sheet @close="close" v-model="ReplaceShow">
      <div class="content">
        <p class="headLin" @click="close"></p>
        <p class="title">{{ type?'Add Funds To Pool':'Withdraw From Pool' }} </p>
        <div class="EnterPrice">
          <div class="input_cont">
            <input
              oninput="value=value.replace(/^([0-9-]\d*\.?\d{0,10})?.*$/,'$1')"
              @blur="price = $event.target.value"
              class="cont_input"
              v-model="price"
              type="text"
            />
            <p class="unit">
              <img :src="require(`../assets/${$network}.png`)" alt="" />
              {{ type ? $network : `W${$network}` }}
            </p>
          </div>
          <!-- Wallet Balance: -->
          <p class="walletBalance" v-if="type">
            Wallet Balance: <span>{{ WalletBalance }}</span>
          </p>
          <p class="walletBalance" v-else>
            Pool Balance: <span>{{ PoolBalance }}</span>
          </p>
        </div>
        <div class="cudset_but">
          <button @click="save">{{ type?'SAVE':'withdraw'}} </button>
          <button class="Cancel" @click="close()">CANCEL</button>
        </div>
      </div>
    </van-action-sheet>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
  <script>
import Overlay from "../components/Overlay.vue";
import wethABI from "../libs/weth.json";
import { ABIAddress } from "../libs/common.js";
import { ethers } from "ethers";
import Web3 from "web3";
const provider = window.ethereum;
let signer;
let providers;
providers = provider?new ethers.providers.Web3Provider(provider):null;
signer = providers?providers.getSigner():null;
const contract = new ethers.Contract(ABIAddress, wethABI, signer);
export default {
  props: {
    ReplaceShow: Boolean,
    type: Boolean,
    WalletBalance: String,
    PoolBalance: String,
  },
  data: function () {
    let _clientH = document.documentElement.clientHeight;
    return {
      overlayshow: false,
      price: "",
    };
  },
  computed: {},
  components: { Overlay },
  watch: {
    ReplaceShow() {
      this.price = "";
    },
  },
  methods: {
    close() {
      this.$emit("close", true);
    },
    async jcHash(txHash) {
        const web3 = new Web3(window.ethereum);
        web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
        if (error) {
            console.error(error);
        } else if (receipt && receipt.status === true) {
            console.log('链上交易已执行完毕');
            this.overlayshow = false;
            this.$emit("callBack", this.type,txHash,this.price);
            this.close();
        } else {
            this.jcHash(txHash)
            console.log('链上交易未执行完毕');
        }
        });
    },
    async save() {
      if (!this.price) {
        this.$toast("Please enter replacement price");
        return;
      }
      if (this.type) {
        if (Number(this.price) > Number(this.WalletBalance)) {
          this.$toast("Greater than available balance");
          return;
        }
        try {
          this.overlayshow = true;
          const deposit = await contract.deposit({
            value: ethers.utils.parseEther(this.price),
          });
          this.jcHash(deposit.hash)
          this.overlayshow = false
        } catch (error) {
          this.overlayshow = false
          // this.$toast(error);
        }
      } else {
        if (Number(this.price) > Number(this.PoolBalance)) {
          this.$toast("Greater than available balance");
          return;
        }
        try {
          this.overlayshow = true;
          const withdraw = await contract.withdraw(
            ethers.utils.parseEther(this.price)
          );
          console.log(withdraw)
          this.jcHash(withdraw.hash)
          this.overlayshow = false;
        } catch (error) {
          this.overlayshow = false
          this.$toast(error);
        }
      }
    },
  },
  created() {},
  mounted: async function () {},
};
</script>
    <style lang="scss">
.Tags {
  @media screen and (min-width: 750px) {
    .van-action-sheet__content {
      padding: 0px 430px 0px 430px !important;
      border: 1px solid #000;
    }
    .van-action-sheet {
      max-height: 80% !important;
    }
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
      