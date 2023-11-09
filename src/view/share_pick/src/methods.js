import Clipboard from "clipboard";
import { get } from "../../../http/http";
export default {
    getUserInfo() {
        this.overlayshow = true;
        let url = this.$api.infor.getUserInfo;
        get(url)
            .then((res) => {
                if (res.code === 200) {
                    this.UserInfo = res.data;
                    this.superInviteCode = res.data.superInviteCode
                    this.superInviteCode = this.superInviteCode.substring(this.superInviteCode.length - 6);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.overlayshow = false;
            });
    },
    shareTiwtter() {
        const value = document.querySelector(".content").innerHTML;
        const text = `${value}`;
        const intentUrl =
            "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
        window.open(intentUrl, "_blank", "width=550,height=420");
    },
    copyContent() {
        const value = document.querySelector(".content").innerHTML;
        const clipboard = new Clipboard(".copy-button1", {
            text: () => `${value}`,
        });
        clipboard.on("success", (e) => {
            this.$toast("Copy successfully");
        });
        clipboard.on("error", (e) => {
            this.$toast("No content");
        });
    },
    copyLink() {
        const value = document.querySelector(".link_content").innerHTML;
        const clipboard = new Clipboard(".copy-button2", {
            text: () => `${value}`,
        });
        clipboard.on("success", (e) => {
            this.$toast("Copy successfully");
        });
        clipboard.on("error", (e) => {
            this.$toast("No content");
        });
    },
};
