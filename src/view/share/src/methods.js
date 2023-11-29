import { get } from "../../../http/http";
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import Clipboard from "clipboard";
import { Toast } from "vant";
import { website } from "@/http/api.js";
import { chracterInfo } from "@/libs/target.js";
export default {
    goBack() {
        let path = this.$route.query.path || "";
        if (path) {
            this.$router.push("/");
        } else {
            this.$router.go(-1);
        }
    },
    substring(address) {
        return (
            address.substring(0, 6) +
            "..." +
            address.substring(address.length - 5, address.length)
        );
    },
    getUserInfo() {
        const data = JSON.parse(localStorage.getItem("userInfo"));
        this.UserInfo = data;
        let userTags = data.userTags;
        this.TagsList = userTags ? userTags.split(",") : [];
        this.code = data.superInviteCode.split("-")[1];
        let item = data;
        this.soulInfo = chracterInfo[this.UserInfo.chracter];
        if (item.levelScore) {
            this.values.push(item.charisma);
            this.values.push(item.courage);
            this.values.push(item.art);
            this.values.push(item.wisdom);
            this.values.push(item.energy);
            this.values.push(item.extroversion);
        } else {
            this.$router.push("/welcome");
        }
    },
    captureAndSave() {
        this.overlayshow = true;
        this.$nextTick(() => {
            setTimeout(() => {
                // 使用HTML2Canvas捕捉元素
                html2canvas(document.querySelector("#elementToCapture"), {
                    backgroundColor: "#ffffff",
                    allowTaint: true,
                    useCORS: true,
                    scale: 4,
                }).then((canvas) => {
                    var base64ToBlob = function (code) {
                        let parts = code.split(";base64,");
                        let contentType = parts[0].split(":")[1];
                        let raw = window.atob(parts[1]);
                        let rawLength = raw.length;
                        let uInt8Array = new Uint8Array(rawLength);
                        for (let i = 0; i < rawLength; ++i) {
                            uInt8Array[i] = raw.charCodeAt(i);
                        }
                        return new Blob([uInt8Array], {
                            type: contentType,
                        });
                    };
                    const res = canvas.toDataURL("image/png");
                    let blob = base64ToBlob(res);
                    let a = document.createElement("a");
                    let event = new MouseEvent("click");
                    a.download = "soulcial.png";
                    a.href = URL.createObjectURL(blob);
                    a.dispatchEvent(event);
                    this.overlayshow = false;
                });
            }, 50);
        });
    },

    shareTiwtter() {
        const url = `${website}/#/t/${this.code}\n`;
        const text = `My SOUL in Web3 is ${this.UserInfo.personality} ${this.UserInfo.chracter}\n\nCome and Connect to me on @SoulcialGlobal\n${url}\n`;
        const hashtags = "Soulcial #SocialFi #Web3";
        const intentUrl =
            "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(text) +
            "&hashtags=" +
            encodeURIComponent(hashtags);
        window.open(intentUrl, "_blank", "width=550,height=420");
    },
    creatQrCode() {
        new QRCode(this.$refs.qrCodeUrl, {
            text: `${website}/#/t/${this.code}`, // 需要转换为二维码的内容
            width: 100,
            height: 100,
            colorDark: "#000000",
            colorLight: "transparent",
            correctLevel: QRCode.CorrectLevel.H,
        });
    },
    copy() {
        const clipboard = new Clipboard(".copy", {
            text: () => `${website}/#/t/${this.code}`,
        });
        clipboard.on("success", (e) => {
            Toast("Copy successfully");
        });
        clipboard.on("error", (e) => {
            Toast("No content");
        });
    },
    getMintedNFTPage() {
        this.overlayshow = true;
        this.NftList = JSON.parse(localStorage.getItem("mintedNFTPage"));
        if (this.NftList.length !== 0) {
            this.showNftPicture = this.NftList[0].pictureUrl;
        }
        this.overlayshow = false;
    },
    // 动态设置小雷达图的外边距
    getSmallRadarMarginTop() {
        const rootElement = document.documentElement;
        const computedStyle = window.getComputedStyle(rootElement);
        const fontSize = computedStyle.fontSize;
        const fontSizeValue = parseFloat(fontSize);
        const bio = this.$refs.bio;
        const smallRadar = this.$refs.smallRadar;
        if (!smallRadar) return;
        smallRadar.style.marginTop = bio?.clientHeight / fontSizeValue + "rem";
    },
};
