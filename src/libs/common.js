import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { customStyle } from "./customstyle.js";
import router from "@/router";
import Web3 from "web3";
import loginData from "@/libs/loginData";
import Clipboard from "clipboard";

export const isPROD = process.env.VUE_APP_BUILD === "production";

// nft合约地址
export const nftAddress = isPROD
    ? "0x6AF9eBA0E7d216bA015f644fcCdA5BE7E18a0DbD"
    : "0x4508Ca82715A9de9FC3df76F354535B23aFb56Dd";

// 交易所合约地址
export const marketAddress = isPROD
    ? "0x6AF9eBA0E7d216bA015f644fcCdA5BE7E18a0DbD"
    : "0x395a571eCb5C4d02c45D930067e9c53Cb648057A";

export const ABIAddress = "0x4200000000000000000000000000000000000006";

// particle Info
export const projectId = "07962ac6-fde2-4363-82af-9eacc9b6ada5";
export const clientKey = "cT8A9u0bPUBmP7mKLPhy3lkhbWlv2hcbyFmsau4Z";
export const appId = "47102ab8-d9f6-41b4-87f8-7b5f07072963";
export const chainList = isPROD
    ? [
          { id: 10, name: "optimism" },
          { id: 420, name: "optimism" },
          { id: 1, name: "Ethereum" },
          { id: 5, name: "Ethereum" },
      ]
    : [
          { id: 420, name: "optimism" },
          { id: 10, name: "optimism" },
          { id: 1, name: "Ethereum" },
          { id: 5, name: "Ethereum" },
      ];

export const linkOpen = (type, has) => {
    window.open(`https://bscscan.com/block/${has}`);
};

// addChain_Params
const _10to16 = (num) => "0x" + Number(num).toString(16);
const _16to10 = (num) => parseInt(num, 10);
const handleChainId = (n) => (n.includes("0x") ? n : _10to16(n));

const CHAINID = isPROD ? "0xa" : "0x1a4";

const CHAIN_NAME = isPROD ? "Optimism" : "Optimism Goerli";

const CHAIN_SYMBOL = "ETH";

const RPC_URL = isPROD
    ? "https://mainnet.optimism.io"
    : "https://goerli.optimism.io";

const blockExplorerUrls = isPROD
    ? "https://explorer.optimism.io"
    : "https://goerli-explorer.optimism.io";

export const addChain_Params = {
    chainId: handleChainId(CHAINID),
    chainName: CHAIN_NAME,
    nativeCurrency: {
        name: CHAIN_NAME,
        symbol: CHAIN_SYMBOL,
        decimals: 18,
    },
    rpcUrls: [RPC_URL],
    blockExplorerUrls: [blockExplorerUrls],
    iconUrls: [""],
};

const clearInfo = () => {
    // 清除登录信息
    loginData.out();
    window.localStorage.removeItem("loginInfo");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("mintedNFTPage");
    router.push("/");
    window.localStorage.setItem("Sift", "4down");
};

// particle 登录
export const onParticle = async (callback) => {
    try {
        window.particle = new ParticleNetwork({
            projectId,
            clientKey,
            appId,
            chainName: chainList[0].name,
            chainId: chainList[0].id,
            wallet: {
                displayWalletEntry: true,
                defaultWalletEntryPosition: WalletEntryPosition.BR,
                uiMode: "light",
                displayCloseButton: true,
                supportChains: chainList,
                customStyle,
            },
        });
        const particleProvider = new ParticleProvider(window.particle.auth);
        window.web3 = new Web3(particleProvider);
        callback && callback();
    } catch (error) {
        console.log("🔥🔥🔥🚀 ~ file: methods.js:43 ~ error:", error);
        clearInfo();
    }
};

//  打开particle钱包
export const goParticle = function () {
    if (!loginData.loginType) return;
    if (loginData.Auth_Token && !window.particle) {
        onParticle(goParticle);
        return;
    }
    try {
        const url = window.particle.buildWalletUrl({
            topMenuType: "close",
            mode: "iframe",
        });
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.zIndex = "999999999";
        iframe.style.border = "none";

        let barCont = document.getElementById("barCont");
        // iframe插入页面
        document.body.appendChild(iframe);
        barCont.style.display = "none";

        // //if topMenuType is "close"
        window.addEventListener("message", (event) => {
            if (event.data === "PARTICLE_WALLET_CLOSE_IFRAME") {
                iframe && document.body.removeChild(iframe);
                barCont.style.display = "flex";
            }
        });
    } catch (error) {
        console.log("🔥🔥🔥🚀 ~ file: common.js:150 ~ error:", error);
        clearInfo();
    }
};
export const getHeight = function (vm) {
    vm.$nextTick(() => {
        let clientWidth = document.documentElement.clientWidth;
        let k = 1;
        if (clientWidth <= 750) {
            k = clientWidth / (390 / 340);
        } else if (clientWidth > 750) {
            k = clientWidth / (1000 / 265);
        }
        const imageDom = document.getElementById("pfpNft");
        imageDom.onload = () => {
            console.log("imageDom", imageDom.offsetHeight, k);
            vm.height = imageDom.offsetHeight;
            vm.flippedShow = vm.height < k;
        };
        vm.flippedShow = vm.height < k;
    });
};


export const copy = function(data) {
    const clipboard = new Clipboard(".copy-button", {
        text: () => `${data}`,
    });
    clipboard.on("success", (e) => {
        this.$toast("Copy successfully");
    });
    clipboard.on("error", (e) => {
        this.$toast("No content");
    });
}