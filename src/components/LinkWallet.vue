<template>
  <!-- tabBar -->
  <div class="wallet">
    <van-action-sheet @close="close" v-model="walletShow">
      <div class="content">
        <p class="headLin" @click="close"></p>
        <P class="title">Connect Wallet</P>
        <img class="wallet_img" src="../assets/wellat_img.png" alt="" />
        <div v-if="!isPWA" class="wallet_list" @click="metamask">
          <div class="list_left">
            <img src="../assets/metamask.png" alt="" />
            <p>MetaMask</p>
          </div>
          <svg-icon className="Polygon" iconClass="Polygon"></svg-icon>
        </div>
        <div class="wallet_list" @click="particle('phone', 1)">
          <div class="list_left">
            <img src="../assets/Subtract1.png" alt="" />
            <p>Phone</p>
          </div>
          <svg-icon className="Polygon" iconClass="Polygon"></svg-icon>
        </div>
        <div class="wallet_list" @click="particle('email', 2)">
          <div class="list_left">
            <img src="../assets/Exclude.png" alt="" />
            <p>Email</p>
          </div>
          <svg-icon className="Polygon" iconClass="Polygon"></svg-icon>
        </div>
        <div class="wallet_list" @click="particle('google', 4)">
          <div class="list_left">
            <img src="../assets/gogo.png" alt="" />
            <p>Google</p>
          </div>
          <svg-icon className="Polygon" iconClass="Polygon"></svg-icon>
        </div>
        <!-- <div class="wallet_list" @click="WalletConnect">
          <div class="list_left">
            <img src="../assets/wallet_connect.png" alt="" />
            <p>WalletConnect</p>
          </div>
          <svg-icon className="Polygon" iconClass="Polygon"></svg-icon>
        </div> -->
        <!-- <div class="attention">
          <van-icon name="info" size="20" />
          <div class="attention_text">
            <p class="attention_title">What is a Wallet?</p>
            <p class="title_one">A Home for your Digital Assets</p>
            <p class="text">
              Wallets are used to send, receive, store, and display digital assets like Tokens and NFTs.
            </p>
            <p class="title_one">A New Way to Log In</p>
            <p class="text">
              Instead of creating new accounts and passwords on every website, just connect your wallet.
            </p>
          </div>
        </div> -->
        <!-- <template v-if="!isPWA">
          <div class="lins">
            <p class="lin"></p>
            <p class="lin_text">Or connect with Particle Wallet</p>
            <p class="lin"></p>
          </div>
          <div class="img_list">
            <img @click="particle('phone', 1)" src="../assets/Subtract1.png" alt="" />
            <img @click="particle('email', 2)" src="../assets/Exclude.png" alt="" />
            <img @click="particle('apple', 3)" src="../assets/phones.png" alt="" />
            <img @click="particle('google', 4)" src="../assets/gogo.png" alt="" />
            <img @click="particle('google', 5)" src="../assets/Twitters.png" alt="" />
          </div>
        </template> -->
      </div>
    </van-action-sheet>
    <van-dialog v-model="dialogShow" :close-on-click-overlay="true" :z-index="9999999" title="Create Lens Handle"
      :before-close="newGroupBefColse" confirmButtonText="CONFIRM" @confirm="dialog_confirm">
      <input placeholder="Please enter" onkeyup="this.value = this.value.replace(/[^A-z0-9]/, '')" maxlength="10"
        type="text" @input="restrictInput" v-model="handle" />
      <p class="point_out">
        Handle must be minimum of 5 length and maximum of 31 length
      </p>
    </van-dialog>
    <!-- 白名单弹窗 -->
    <van-dialog v-model="whiteShow" :close-on-click-overlay="false" :z-index="99999999"
      confirmButtonText="Join the waitlist" @confirm="white_confirm">
      <p class="fee_dint">
        Sorry, Soulcial is now in beta stage. It seems that you are not eligible
        temporally. Please join the waitlist first.
      </p>
    </van-dialog>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import { post, get } from "../http/http";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Overlay from "../components/Overlay.vue";
import {
  RuntimeConnector,
  Extension,
  RESOURCE,
} from "@dataverse/runtime-connector";
const runtimeConnector = new RuntimeConnector(Extension);
let dataverse = false;
let version = false;
import { addVTNetwork } from "@/libs/addVTNetwork.js";
const app = dataverse ? "soulcial" : "soulcial4";
import Web3 from "web3";
import {
  LensClient,
  development,
  isRelayerResult,
} from "@lens-protocol/client";
import { ethers } from "ethers";
import { onParticle } from '@/libs/common.js'
const client = new LensClient({
  environment: development,
});
export default {
  props: {
    walletShow: Boolean,
  },
  data: function () {
    let _clientH = document.documentElement.clientHeight;
    return {
      userLens: {},
      dialogShow: false,
      whiteShow: false,
      wallet: "",
      address: "",
      loginType: 0,
      isPWA: false,
      overlayshow: false,
      preferredAuthType: "",
      handle: "",
    };
  },
  components: { Overlay },
  methods: {
    restrictInput(event) {
      const pattern = /^[a-zA-Z0-9]*$/;
      const inputValue = event.target.value;
      if (!pattern.test(inputValue)) {
        event.preventDefault();
      }
    },
    async testLink(data) {
      //Connect wallet
      try {
        this.overlayshow = true;
        const res = await runtimeConnector.connectWallet();
        this.wallet = res.wallet;
        await this.linkCapability();
        await this.creatData(data);
        this.overlayshow = false;
      } catch (error) {
        this.overlayshow = false;
      }
    },
    async linkCapability() {
      //Establish capability model createCapability
      let pkh = await runtimeConnector.createCapability({
        app,
        resource: RESOURCE.CERAMIC,
        wallet: this.wallet,
      });
      this.pkh = pkh;
    },
    async creatData(data) {
      //Create streamcreateStream
      const encrypted = JSON.stringify({
        level: false,
        charisma: false,
        extroversion: false,
        energy: false,
        wisdom: false,
        art: false,
        courage: false,
        soulscore: false,
      });
      let Stream = await runtimeConnector.createStream({
        modelId: dataverse
          ? "kjzl6hvfrbw6c7bz8dm3olx6u48rc7acu6d5khlbu3yeltho4k3oluq2bsbxvdo"
          : "kjzl6hvfrbw6c76e72zrpizt50pwpobmqbr49u1mks91zxkdr433l3masps9og8",
        streamContent: {
          level: String(data.level),
          charisma: data.charisma || 0,
          extroversion: data.extroversion || 0,
          energy: data.energy || 0,
          wisdom: data.wisdom || 0,
          art: data.art || 0,
          courage: data.courage || 0,
          soulscore: data.levelScore || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          encrypted,
        },
      });
      this.overlayshow = false;
      this.login(data.isRegister, data.levelScore, Stream.streamId, "", "");
    },
    close() {
      this.$emit("close", true);
    },
    // 查询是否已生成steam_id
    async checkSteamId(address, signParams) {
      this.overlayshow = true;
      this.address = address;
      let data = {
        loginType: this.loginType,
        address: address,
        particleType: this.preferredAuthType,
        refreshScore: version ? 1 : 0,
      };
      let url = this.$api.login.checkSteamId;
      get(url, data)
        .then((res) => {
          if (res.code === 200) {
            this.login(res.data.isRegister, res.data.levelScore, "", "", "", signParams);
            // if (!version) {
            //   this.check_lens(data);
            //   // this.login(res.data.isRegister,res.data.levelScore);
            // } else {
            //   if (res.data.streamId) {
            //     this.login(
            //       res.data.isRegister,
            //       res.data.levelScore,
            //       res.data.streamId,
            //       "",
            //       ""
            //     );
            //   } else {
            //     let me = this;
            //     setTimeout(() => {
            //       me.testLink(res.data);
            //     }, 100);
            //   }
            // }
          } else if (res.code === 400) {
            // this.whiteShow = true
            this.$router.push('/welcome')
          }
          this.overlayshow = false;
        })
        .catch((error) => {
          this.overlayshow = false
        });
    },

    async check_lens(data) {
      // 根据当前连接钱包账户判断是否注册过lens账户
      const allOwnedProfiles = await client.profile.fetchAll({
        ownedBy: [this.address],
        limit: 1,
      });
      // 判断lens账户List长度
      if (allOwnedProfiles.items.length) {
        let item = allOwnedProfiles.items[0];
        this.login(data.isRegister, data.levelScore, "", item.id, item.handle);
      } else {
        this.handle = "";
        this.userLens = data;
        this.dialogShow = true;
      }
      console.log(allOwnedProfiles);
    },
    newGroupBefColse(action, done) {
      if (action == "confirm" && !this.handle.trim()) {
        done(false);
      } else if (
        (action == "confirm" && this.handle.length < 5) ||
        this.handle.length > 30
      ) {
        done(false);
      } else {
        done(true);
      }
    },
    white_confirm() {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLScCRviofrSM0VY3IG8g3PhfQPKunJ15xWGsWq_ofZgRoIi-lw/viewform"
      );
    },
    dialog_confirm() {
      if (!this.handle) {
        this.$toast("Please enter");
        return;
      }
      if (this.handle.length < 5 || this.handle.length > 30) {
        this.$toast(
          "Not less than 5 characters and not more than 30 characters"
        );
        return;
      }
      this.overlayshow = true;
      this.dialogShow = false;
      this.CreateUser();
    },
    // 创建lens用户
    async CreateUser() {
      //签名
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const r = await client.authentication.generateChallenge(this.address);
      const provider = window.ethereum
        ? new ethers.providers.Web3Provider(window.ethereum)
        : null;
      const signer = provider.getSigner();
      const signature = await signer.signMessage(r);
      const authData = await client.authentication.authenticate(
        this.address,
        signature
      );
      let res = await client.authentication.isAuthenticated();
      //创建个人资料
      const profileCreateResult = await client.profile.create({
        handle: this.handle,
        profilePictureUri: null,
        // followModule: {
        //   revertFollowModule: true,
        // },
      });
      const profileCreateResultValue = profileCreateResult.unwrap();
      if (!isRelayerResult(profileCreateResultValue)) {
        this.$toast(`Something went wrong`, profileCreateResultValue);
        this.overlayshow = false;
        return;
      } else {
        console.log(profileCreateResultValue);
        // 创建成功
        let me = this;
        setTimeout(() => {
          me.check_lens(this.userLens);
        }, 7000);
      }
    },
    login(isRegister, levelScore, streamId, lensId, handle, signParams) {
      this.overlayshow = true
      let streamID = streamId ? streamId : Date.parse(new Date());
      let prefix = this.$api.login.login;
      let params = `?address=${this.address}&&loginType=${this.loginType}&&particleType=${this.preferredAuthType}&&dataverse-streamId=streamId${streamID}&&lensProfile=${lensId}&&userName=${handle}&&message=${signParams?.message || ''}&&signature=${signParams?.signature || ''}`;
      post(prefix + params)
        .then((res) => {
          if (res.code === 200) {
            const loginInfo = {
              usedInviteCode: res.data.usedInviteCode,
              whiteUser: res.data.whiteUser
            }
            localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
            this.$loginData.in({
              authToken: this.address,
              login_type: this.loginType,
              id: res.data.tokenValue,
            });
            this.$emit("init");  // 分享页登录后重新获取user页面数据
            this.close();
            // if (isRegister && !levelScore) {
            //   this.$router.push("/welcome");
            // } 
            if (!res.data.usedInviteCode && !res.data.whiteUser) {
              this.$router.push("/welcome");
            } else {
              if (localStorage.getItem("routers")) {
                this.$router.push(localStorage.getItem("routers"));
              }
            }
          } else {
            this.$toast(res.msg)
          }
          this.overlayshow = false;
        })
        .catch((error) => {
          this.overlayshow = false;
        });
    },
    metamaskChack() {
      let me = this;
      const clear = function () {
        if (me.$loginData.Auth_Token) {
          me.$loginData.out();
          window.localStorage.removeItem('loginInfo');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('mintedNFTPage');
          me.$router.push("/");
          window.localStorage.setItem('Sift', '4down')
        }
      }
      // 监听账户切换
      window.ethereum.on("accountsChanged", clear);
      // 监听网络切换
      window.ethereum.on("networkChanged", clear);
    },

    async handleSign(provider, accounts) {
      // 签名操作
      //Get Metamask web3 provider
      var web3 = new Web3(Web3.givenProvider);

      //Connect to Metamask (not sure how to do like web3.eth.connect)
      await provider.enable();

      let unit = "\n";
      let timestamp = String(+new Date()).slice(-6)

      //TO-DO: Message should be generated on server side with a nonce
      let message = `Welcome to Soulcial!${unit}\nWallet address:${unit}${accounts[0]}${unit}\nNonce:${unit}${timestamp}`;

      //Sign message with Metamask (private key)
      const signedMessage = await web3.eth.personal.sign(
        message,
        accounts[0]
      );
      if (signedMessage) {
        let signParams = {
          message: encodeURIComponent(message),
          signature: signedMessage,
        }
        this.loginType = 0;
        this.preferredAuthType = "";
        this.checkSteamId(accounts[0], signParams);
      } else {
        // 异常
        this.$toast("Wrong signature");
      }
    },
    handleAddCatch(provider, accounts) {
      this.loginType = 0;
      this.preferredAuthType = "";
      this.checkSteamId(accounts[0]);
    },

    // Link metamask wallet
    async metamask() {
      if (typeof window.ethereum !== "undefined") {
        //选择网络链接钱包
        addVTNetwork(this.handleSign, this.handleAddCatch)
      } else {
        window.open("https://metamask.io/");
      }
    },
    // interlinkageWalletConnect
    async WalletConnect() {
      const provider = new WalletConnectProvider({
        infuraId: "5491a1035f5d42cfb17022aa25a97ea9",
      });
      try {
        let accounts = await provider.enable();
        this.loginType = 0;
        this.preferredAuthType = "";
        this.checkSteamId(accounts[0]);
        this.disconnect(provider);
      } catch (err) {
        console.log(err);
      }
    },
    disconnect(provider) {
      // Monitor wallet exit status
      provider.on("disconnect", (code, reason) => {
        this.$loginData.out();
        location.href = "/";
      });
    },
    async particleCallback() {
      this.overlayshow = false;
      this.close();
      const accounts = await window.web3.eth.getAccounts();
      // particle签名
      let unit = "\n";
      let timestamp = String(+new Date()).slice(-6);

      let msg = `Welcome to Soulcial!${unit}\nWallet address:${unit}${accounts[0]}${unit}\nNonce:${unit}${timestamp}`;
      window.web3.eth.personal
        .sign(msg, accounts[0])
        .then((result) => {
          console.log("personal_sign", result);
          let signParams = {
            message: encodeURIComponent(msg),
            signature: result,
          }
          this.loginType = 1;
          this.checkSteamId(accounts[0], signParams);
        })
        .catch((error) => {
          console.error("personal_sign err", error);
          this.$toast("Wrong signature");

        });
    },
    async particle(preferredAuthType, type) {
      this.preferredAuthType = type;
      this.overlayshow = true;
      onParticle(this.particleCallback)
    },
  },
  created() {
    this.metamaskChack();
  },
  mounted() {
    this.isPWA = window.localStorage.getItem("isPWA") == 'true';
  },
};
</script>
<style lang="scss">
.wallet {
  @media screen and (min-width: 750px) {
    .van-action-sheet__content {
      padding: 8px 430px 42px 430px !important;
      border: 1px solid #000;
    }

    // .content {
    //   padding: 8px 430px 42px 430px !important;
    //   border: 1px solid #000;
    // }
    .van-action-sheet {
      max-height: 80% !important;
    }
  }

  .van-action-sheet {
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
      font-family: "Inter";
      font-style: normal;
      font-weight: 900;
      font-size: 20px;
      text-transform: uppercase;
      text-align: center;
      color: #000000;
    }

    .wallet_img {
      display: block;
      width: 136px;
      height: auto;
      margin: 35px auto 50px auto;
    }

    .wallet_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #dfdfce;
      padding-bottom: 10px;
      margin-bottom: 20px;

      .list_left {
        display: flex;
        align-items: center;

        img {
          display: block;
          width: 22.5px;
          height: auto;
          margin-right: 18px;
        }

        p {
          font-family: "Inter";
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          color: #000000;
        }
      }

      .Polygon {
        width: 13px;
        height: 8.5px;
      }
    }

    .attention {
      display: flex;

      .attention_text {
        margin-left: 15px;

        .attention_title {
          font-family: "Inter";
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          color: #000000;
          margin-bottom: 15px;
        }

        .title_one {
          font-family: "Inter";
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          color: #000000;
          margin-bottom: 5px;
        }

        .text {
          font-family: "Inter";
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 150%;
          color: #62625f;
          margin-bottom: 15px;
        }
      }
    }

    .lins {
      display: flex;
      align-content: center;
      align-items: center;
      margin-top: 26px;

      .lin {
        width: 100%;
        border-bottom: 2px solid #dfdfce;
      }

      .lin_text {
        font-family: "Inter";
        font-style: normal;
        font-weight: 600;
        font-size: 10px;
        text-transform: uppercase;
        color: #000000;
        margin: 0 10px;
        white-space: nowrap;
      }
    }

    .img_list {
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      img {
        transform: scale(0.5);
        /* scaling */
      }
    }
  }

  .ovrlay {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // .van-overlay{
  //   z-index: 9999999999999999 !important;
  // }
  // .van-dialog {
  //   z-index: 999999999999999 !important;
  // }
  .van-dialog__header {
    text-align: center;
    font-size: 20px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 900;
    text-transform: uppercase;
  }

  .van-dialog__content {
    padding: 0 24px;
    margin-top: 24px;

    input {
      border-radius: 10px;
      border: 2px solid #dfdfce;
      background: #fff;
      width: 100%;
      padding: 12px 20px;
      box-sizing: border-box;
      color: #000;
      font-size: 18px;
      font-family: "Inter";
      font-style: normal;
      font-weight: 600;
    }

    .point_out {
      color: rgba(0, 0, 0, 0.5);
      font-size: 16px;
      font-family: "Inter";
      font-style: normal;
      margin-top: 10px;
    }
  }

  .van-dialog__footer {
    margin-top: 30px;
    padding: 0 24px 24px 24px;

    button {
      border-radius: 45px !important;
      border: 2px solid #000 !important;
      background: #fff !important;

      .van-button__text {
        color: #000;
        text-align: center;
        font-size: 18px;
        font-family: "Inter";
        font-style: normal;
        font-weight: 700;
        text-transform: uppercase;
      }
    }
  }

  .fee_dint {
    color: #333;
    font-size: 16px;
    font-family: "Inter";
    font-weight: 600;
    font-style: normal;
    margin-bottom: 20px;
  }
}
</style>
  