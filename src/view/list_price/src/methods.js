/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "@/http/http";
import { ethers } from "ethers";
import NftABI from "@/libs/testEthABI.json";
import { nftAddress, marketAddress } from "@/libs/common.js";
import { addVTNetwork } from "@/libs/addVTNetwork.js";
import Web3 from "web3";
export default {
  // 选择网络链接钱包
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

  listNFTApprove() {
    let me = this;
    let url = this.$api.nft.listNFTApprove;
    let data = {
      id: this.NFTDetail.realTokenId,
      price: Number(this.price),
    };
    post(url, data, true)
      .then((res) => {
        if (res.code === 200) {
          let path = this.$route.query.path || "";
          this.$router.replace(
            `/explore_details?id=${this.NFTDetail.realTokenId}&path=${path}`
          );
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
      });
  },
  async getApproved(provider) {
    this.overlayshow = true;
    let signer;
    let providers;
    providers = provider && new ethers.providers.Web3Provider(provider);

    let contract;
    if (provider) {
      signer = providers.getSigner();
      contract = new ethers.Contract(nftAddress, NftABI, signer);
    } else {
      contract = new window.web3.eth.Contract(NftABI, nftAddress);
    }
    try {
      let approvedAddress;
      if (this.$loginData.loginType == 1) {
        // particle
        contract.methods
          .getApproved(this.NFTDetail.realTokenId)
          .call()
          .then((res) => {
            if (res.toLocaleUpperCase() != marketAddress.toLocaleUpperCase()) {
              this.particleApproved(contract);
            } else {
              this.listNFTApprove();
            }
          })
          .catch((error) => {
            this.overlayshow = false;
            this.$toast(error);
          });
      } else {
        approvedAddress = await contract.getApproved(
          this.NFTDetail.realTokenId
        );
        if (
          approvedAddress.toLocaleUpperCase() !=
          marketAddress.toLocaleUpperCase()
        ) {
          this.Approved(contract);
        } else {
          this.listNFTApprove();
        }
      }
    } catch (error) {
      console.log("🔥🔥🔥🚀 ~ file: methods.js:79 ~ error:", error);
      this.overlayshow = false;
      this.$toast(error);
    }
  },
  async particleApproved(_contract) {
    try {
      await _contract.methods
        .approve(marketAddress, this.NFTDetail.realTokenId)
        .send({ from: this.$loginData.Auth_Token })
        .on("transactionHash", (hash) => {
          console.log("🔥🔥🔥🚀 ~ file: methods.js:87 ~ hash:", hash);
          this.listNFTApprove();
        })
        .on("error", function (error) {
          console.error("Error: ", error);
        });
    } catch (error) {
      this.overlayshow = false;
      console.log("🔥🔥🔥🚀 ~ file: methods.js:83 ~ error:", error);
    }
  },
  async Approved(contract) {
    try {
      const approved = await contract.approve(
        marketAddress,
        this.NFTDetail.realTokenId
      );
      this.listNFTApprove();
    } catch (error) {
      this.overlayshow = false;
      console.error(error);
    }
  },
  async Complete() {
    let me = this;
    me.overlayshow = true;
    if (this.$loginData.loginType == 0) {
      await addVTNetwork(me.getApproved, me.getApproved);
    } else {
      me.getApproved();
    }
    // me.overlayshow = false;
  },
 
  getData() {
    this.overlayshow = true;
    let url = this.$api.nft.getNFTDetail + `?id=${this.$route.query.id}`;
    get(url)
      .then((res) => {
        if (res.code === 200) {
          this.NFTDetail = res.data;
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
      });
  },
  // 计算收益
  getTotalEarn(price) {
    let k =
      this.NFTDetail.mintUserAddress === this.NFTDetail.ownerAddress
        ? 0.84
        : 0.8;
    return price * k;
  },
  
};
