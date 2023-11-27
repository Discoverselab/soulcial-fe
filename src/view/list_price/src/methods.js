/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "@/http/http";
import { ethers } from "ethers";
import NftABI from "@/libs/testEthABI.json";
import { nftAddress } from "@/libs/common.js";
import { addVTNetwork } from "@/libs/addVTNetwork.js";
import Web3 from "web3";
export default {
  listNFTApprove() {
    let url = this.$api.nft.listNFTApprove;
    let data = {
      id: this.NFTDetail.realTokenId,
      price: Number(this.price),
    };
    post(url, data, true)
      .then((res) => {
        if (res.code === 200) {
          // let path = this.$route.query.path || "";
          this.$router.replace(
            `/explore_details?id=${this.NFTDetail.realTokenId}&path=1`
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
            if (res.toLocaleUpperCase() != this.marketAddress.toLocaleUpperCase()) {
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
          this.marketAddress.toLocaleUpperCase()
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
        .approve(this.marketAddress, this.NFTDetail.realTokenId)
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
        this.marketAddress,
        this.NFTDetail.realTokenId
      );
      this.listNFTApprove();
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        this.$toast("Signature denied");
      } else {
        this.$toast("Transaction failed")
      }
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

  async getData() {
    try {
      this.overlayshow = true;
      let url = this.$api.nft.getNFTDetail + `?id=${this.$route.query.id}`;
      const res = await get(url);
  
      if (res.code === 200) {
        this.NFTDetail = res.data;
        this.marketAddress = res.data.contractMarketAddress;
      }
  
      this.overlayshow = false;
    } catch (error) {
      console.error( error);
      this.overlayshow = false;
    }
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
