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
  ABIAddress,
  getHeight,
  fetchBalance
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
  getWalletBalance(){
    if(this.$loginData.Auth_Token){
      fetchBalance().then((res) => {
    console.log('this.WalletBalance',this.WalletBalance)
        
        this.WalletBalance = res
      })
    }
    
   },
  goBack() {
    const isSharePick = this.$route.meta.isSharePick
    let path = this.$route.query.path || "";
    if (path || isSharePick) {
      this.$router.push("/");
    } else {
      this.$router.go(-1);
    }
  },
  walletClose() {
    this.walletShow = false;
    // this.BalanceOf();
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
    this.isUseInviteCode = JSON.parse(localStorage.getItem("isUseInviteCode"))
     this.loginInfo = JSON.parse(localStorage.getItem("loginInfo"))
    if (!this.$loginData.Auth_Token || (this.$loginData.loginType == 1 && !window?.web3?.eth)) {
      this.walletShow = true;
    } else  if(!this.loginInfo.usedInviteCode && !this.loginInfo.whiteUser && !this.isUseInviteCode){
      this.$router.push("/welcome")
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
            to: this.marketAddress,
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
        approvedAddress.toLocaleUpperCase() != this.marketAddress.toLocaleUpperCase()
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
    // this.overlayshow = true;
    let url =
      this.$api.nft.getNFTPickInfo +
      `?tokenId=${this.$route.query.id || this.$route.params.realTokenId}`;
    get(url)
      .then((res) => {
        if (res.code === 200) {
          this.NFTPickInfo = res.data;
        }
        this.onlyPickOnce();
        // this.overlayshow = false;
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
  async getData() {
    try {
      this.overlayshow = true;
      let url =
        this.$api.nft.getNFTDetail +
        `?id=${this.$route.query.id || this.$route.params.realTokenId}`;
  
      const res = await get(url);
  
      if (res.code === 200) {
        this.NFTDetail = res.data;
        let item = res.data;
        this.marketAddress = res.data.contractMarketAddress;
        this.hasMarketAddress = true
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
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.overlayshow = false;
    }
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
    this.isUseInviteCode = JSON.parse(localStorage.getItem("isUseInviteCode"))
    this.loginInfo = JSON.parse(localStorage.getItem("loginInfo"))
    if (!this.$loginData.Auth_Token) {
      this.walletShow = true;
    } else if(!this.loginInfo.usedInviteCode && !this.loginInfo.whiteUser&& !this.isUseInviteCode){
      this.$router.push("/welcome")
    } else {
      this.$router.push(
        `/share_pick?id=${this.NFTDetail.realTokenId}&isShareMy=${this.isShareMy}`
      );
    }
  },
  getMintedNFTPage() {
    this.overlayshow = true;
    let data = {
      current: 1,
      size: 99,
    };
    let url = this.$api.infor.getMintedNFTPage;
    get(url, data)
      .then((res) => {
        if (res.code === 200) {
          this.NftList = this.NftList.concat(res.data.records);
          this.getCollectNFTPage();
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
      });
  },

  getCollectNFTPage() {
    let data = {
      current: 1,
      size: 99,
    };
    let url = this.$api.infor.getCollectNFTPage;
    get(url, data)
      .then((res) => {
        if (res.code === 200) {
          this.NftList = this.NftList.concat(res.data.records);
          this.UnregisteredList = this.NftList.filter(
            (item) => item.pickStatus != 1
          );
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
      });
  },
  jumpToList(){
    if (this.UnregisteredList.length === 1) {
      this.earnVsoulShow = true
    } else {
      this.$router.push(`/list_price?id=${this.NFTDetail.realTokenId}`)
    }
  },
   continueList() {
    this.$router.push(`/list_price?id=${this.NFTDetail.realTokenId}`)
  },
};
