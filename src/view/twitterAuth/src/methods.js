import { get, post } from "@/http/http";
let version = true;
export default {
    skip() {
        this.checkSteamId(this.address)
    },
    clearUrl() {
        var clean_uri =
            location.protocol +
            "//" +
            location.host +
            location.pathname +
            location.hash;
        window.history.replaceState({}, document.title, clean_uri);
    },
    // 查询是否已生成steam_id
    async checkSteamId(address) {
        this.overlayshow = true;
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
                    this.clearUrl();
                    this.$router.push("/congr");
                } else {
                    this.$toast(res.msg || "unknown error");
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                this.overlayshow = false;
            });
    },
    substring(address) {
        return (
            address.substring(0, 6) +
            "..." +
            address.substring(address.length - 5, address.length)
        );
    },
    setTwitterUserInfo(val) {
        this.overlayshow = true;
        let url = this.$api.login.setTwitterUserInfo;
        let data = {
            oauthVerifier: val,
        };
        post(url, data)
            .then((res) => {
                if (res.code === 200) {
                    this.checkSteamId(this.address);
                } else {
                    this.overlayshow = false;
                    this.clearUrl();
                    this.$toast(res.msg || "unknown error");
                }
            })
            .catch((error) => {
                this.overlayshow = false;
                console.log(error);
            });
    },
    linkTwitter() {
        this.overlayshow = true;
        let url = this.$api.login.twitterRedirect + "?source=1";
        post(url)
            .then((res) => {
                if (res.code === 200) {
                    window.open(res.data, "_self");
                } else {
                    this.$toast(res.msg || "unknown error");
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                this.overlayshow = false;
                console.log("🔥🔥🔥🚀 ~ file: methods.js:19 ~ error:", error);
            });
    },
};
