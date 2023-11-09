/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "@/http/http";
import { ethers } from "ethers";
import Sorl from "@/libs/testEthABI.json";
import wethABI from "@/libs/weth.json";
import {
  addChain_Params,
  nftAddress,
  marketAddress,
  ABIAddress,
  getHeight,
} from "@/libs/common.js";
import { addVTNetwork } from "@/libs/addVTNetwork.js";
const provider = window.ethereum;
let signer;
let providers;
providers = provider ? new ethers.providers.Web3Provider(provider) : null;
signer = providers ? providers.getSigner() : null;
const contract = new ethers.Contract(ABIAddress, wethABI, signer);
import { Toast } from "vant";
export default {
  goBack() {
    let path = this.$route.query.path || "";
    if (path) {
      this.$router.push("/");
    } else {
      this.$router.go(-1);
    }
  },
  walletClose() {
    this.walletShow = false;
    // this.BalanceOf();
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
  // 获取W余额
  async BalanceOf() {
    let provider = window.ethereum;
    await provider.request({
      method: "eth_requestAccounts",
    });
    try {
      const BalanceOf = await contract.balanceOf(this.$loginData.Auth_Token);
      this.PoolBalance = ethers.utils.formatEther(
        this.formatNumber(parseInt(BalanceOf._hex))
      );
    } catch (error) {
      // this.$toast(error);
    }
  },
  picksTxH(index) {
    if (!this.$loginData.Auth_Token) {
      this.walletShow = true;
    } else {
      if (this.isPick() || this.gray) {
        return;
      }

      let me = this;
      this.pickIndex = index;
      this.PicksShow = true;
      me.overlayshow = false;

      // let url = this.$api.nft.prePickNFT;
      // let data = {
      //     tokenId: this.NFTDetail.realTokenId,
      //     pickIndex: index,
      // };
      // me.overlayshow = true;
      // post(url, data, true)
      //     .then((res) => {
      //         if (res.code === 200) {
      //             // 可正常购买

      //         } else if (res.code === 400) {
      //             // 已经Pick过一次，不可再次Pick
      //             Toast("You have already pumped the SoulCast.");
      //             me.overlayshow = false;
      //         } else if (res.code === 666) {
      //             // 检测到当前NFT已被其他玩家买走，给提示，刷新页面
      //             Toast("Sorry，pump failed");
      //             setTimeout(() => {
      //                 window.location.reload();
      //             }, 2000);
      //         } else {
      //             Toast(res.msg);
      //             me.overlayshow = false;
      //         }
      //     })
      //     .catch((error) => {
      //         me.overlayshow = false;
      //         Toast(error.msg);
      //     });
    }
  },
  dialog_confirm() {
    console.log(1);
  },
  closeDialog() {},
  isUser(type) {
    if (type == 1) {
      return (
        this.NFTDetail.mintUserAddress.toLocaleUpperCase() ===
        this.$loginData.Auth_Token.toLocaleUpperCase()
      );
    } else {
      return (
        this.NFTDetail.ownerAddress.toLocaleUpperCase() ===
        this.$loginData.Auth_Token.toLocaleUpperCase()
      );
    }
  },
  linkUser(type) {
    if (this.isUser(type)) {
      this.$router.push(`/home`);
      return;
    }
    let userId =
      type == 1 ? this.NFTDetail.mintUserId : this.NFTDetail.ownerUserId;
    this.$router.push(`/user?id=${userId}`);
  },
  pickIsUser(id) {
    return (
      this.NFTPickInfo[`indexAddress${id}`].toLocaleUpperCase() ===
      this.$loginData.Auth_Token.toLocaleUpperCase()
    );
  },
  PicklinkUser(id) {
    if (this.pickIsUser(id)) {
      this.$router.push(`/home`);
    } else {
      this.$router.push(`/user?id=${this.NFTPickInfo[`indexUserId${id}`]}`);
    }
  },
  turnShowClick() {
    if (this.turnShow) {
      setTimeout(() => {
        this.turnShow = !this.turnShow;
      }, 100);
    } else {
      this.turnShow = !this.turnShow;
    }
  },
  urls() {
    var urls = [
      "Label_01",
      "Label_02",
      "Label_03",
      "Label_04",
      "Label_05",
      "Label_06",
      "Label_07",
      "Label_08",
      "Label_09",
      "Label_10",
    ];
    //Randomly get a value from the array
    return urls[Math.floor(Math.random() * urls.length)];
  },
  isPick() {
    return (
      this.NFTDetail.ownerAddress.toLocaleUpperCase() ==
      this.$loginData.Auth_Token.toLocaleUpperCase()
    );
  },
  // 选择网络链接钱包
  async addVTNetwork() {
    if (!this.$loginData.Auth_Token) {
      this.walletShow = true;
      return;
    }
    let me = this;
    if (this.$loginData.loginType == 0) {
      await addVTNetwork(me.getApproved, me.getApproved);
    } else {
      me.getApproved();
    }
  },

  async toPay() {
    let me = this;
    let provider = window.ethereum;
    provider
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: this.$loginData.Auth_Token,
            to: marketAddress,
            value: ethers.utils.parseUnits(this.NFTDetail.price, 18)._hex,
          },
        ],
      })
      .then((txHash) => me.collectNFT(txHash))
      .catch((error) => console.error(error));
  },
  async getApproved(provider) {
    let signer;
    let providers;
    providers = provider ? new ethers.providers.Web3Provider(provider) : null;
    signer = providers.getSigner();
    const contract = new ethers.Contract(nftAddress, Sorl, signer);
    try {
      const approvedAddress = await contract.getApproved(
        this.NFTDetail.realTokenId
      );
      if (
        approvedAddress.toLocaleUpperCase() != marketAddress.toLocaleUpperCase()
      ) {
        this.$toast("NFT anomaly");
      } else {
        this.toPay();
      }
      console.log("Approved address:", approvedAddress);
    } catch (error) {
      console.error(error);
    }
  },
  cancelListNFT() {
    this.overlayshow = true;
    this.cancelShow = false;
    let url = this.$api.nft.cancelListNFT;
    let data = {
      id: this.NFTDetail.realTokenId,
    };
    post(url, data, true)
      .then((res) => {
        if (res.code === 200) {
          this.getData();
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
      });
  },
  set_click(type) {
    if (!this.$loginData.Auth_Token) {
      this.walletShow = true;
    } else {
      if (type == 1) {
        this.getApproved();
      }
    }
  },
  async collectNFT(txn) {
    console.log(txn);
    let me = this;
    this.overlayshow = true;
    let url = this.$api.nft.collectNFTOnline;
    let data = {
      tokenId: this.NFTDetail.realTokenId,
      payAddress: this.$loginData.Auth_Token,
      txn: txn,
    };
    post(url, data, true)
      .then((res) => {
        if (res.code === 200) {
          setTimeout(() => {
            me.overlayshow = false;
            me.$router.replace(
              `/purchase_success?id=${this.NFTDetail.realTokenId}`
            );
          }, 2000);
        } else {
          me.overlayshow = false;
          Toast(res.msg);
        }
      })
      .catch((error) => {
        me.overlayshow = false;
        Toast(error.msg);
      });
  },
  getNFTPickInfo() {
    this.overlayshow = true;
    let url =
      this.$api.nft.getNFTPickInfo +
      `?tokenId=${this.$route.query.id || this.$route.params.realTokenId}`;
    get(url)
      .then((res) => {
        if (res.code === 200) {
          this.NFTPickInfo = res.data;
        }
        this.onlyPickOnce();
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
      });
  },
  // 当pick后其余pick位置置灰
  onlyPickOnce() {
    if (!this.$loginData.Auth_Token) return;
    const indexAddressList = Object.keys(this.NFTPickInfo).filter((key) =>
      key.includes("indexAddress")
    );
    const addressValueList = indexAddressList.map((key) => {
      return this.NFTPickInfo[key]
        ? this.NFTPickInfo[key].toLocaleUpperCase()
        : "";
    });
    if (
      addressValueList.includes(this.$loginData.Auth_Token.toLocaleUpperCase())
    ) {
      this.gray = true;
    }
  },
  // async callBack(txHash) {
  //     this.overlayshow = true;
  //     let url = this.$api.nft.pickNFT;
  //     let data = {
  //         pickIndex: this.pickIndex,
  //         tokenId: this.NFTDetail.id,
  //         txn: txHash,
  //     };
  //     post(url, data, true)
  //         .then((res) => {
  //             if (res.code === 200) {
  //                 this.getData();
  //                 this.getNFTPickInfo();
  //             }
  //             this.overlayshow = false;
  //         })
  //         .catch((error) => {
  //             this.overlayshow = false;
  //         });
  // },
  getData() {
    this.overlayshow = true;
    let url =
      this.$api.nft.getNFTDetail +
      `?id=${this.$route.query.id || this.$route.params.realTokenId}`;
    get(url)
      .then((res) => {
        if (res.code === 200) {
          this.NFTDetail = res.data;
          let item = res.data;
          this.values.push(item.charisma);
          this.values.push(item.courage);
          this.values.push(item.art);
          this.values.push(item.wisdom);
          this.values.push(item.energy);
          this.values.push(item.extroversion);
          const isSame =
            this.NFTDetail.mintUserAddress.toLocaleUpperCase() ===
              this.$loginData.Auth_Token.toLocaleUpperCase() ||
            this.NFTDetail.ownerAddress.toLocaleUpperCase() ===
              this.$loginData.Auth_Token.toLocaleUpperCase();
          if (isSame) {
            this.isShareMy = true;
          }
          getHeight(this);
          this.overlayshow = false;
        }
      })
      .catch((error) => {
        this.overlayshow = false;
      });
  },

  getNFTHistory() {
    let url =
      this.$api.nft.getNFTHistory +
      `?id=${this.$route.query.id || this.$route.params.realTokenId}`;
    get(url)
      .then((res) => {
        if (res.code === 200) {
          this.History_list = res.data;
        }
      })
      .catch((error) => {});
  },
  substring(address) {
    if (!address) return;
    return (
      address.substring(0, 6) +
      "..." +
      address.substring(address.length - 5, address.length)
    );
  },
  getSoulSbtiStyle(soul) {
    const soulLength = String(soul).length;
    const k = 0.0052;
    return { fontSize: `${(705 / soulLength) * k}rem` };
  },
  jumpSharePick() {
    if (!this.$loginData.Auth_Token) {
      this.walletShow = true;
    } else {
      this.$router.push(
        `/share_pick?id=${this.NFTDetail.realTokenId}&isShareMy=${this.isShareMy}`
      );
    }
  },
};
