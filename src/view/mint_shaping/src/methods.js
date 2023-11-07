/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "../../../http/http";
import { Toast } from "vant";
export default {
    getUserInfo() {
        let url = this.$api.infor.getUserInfo;
        get(url)
            .then((res) => {
                if (res.code === 200) {
                    this.UserInfo = res.data;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    cutAndUpload() {
        this.overlayshow = true;
        let url = this.$api.nft.cutAndUpload;
        let data = {
            squarePictureUrl: this.shaping_data.squarePictureUrl,
        };
        post(url, data, true)
            .then((res) => {
                if (res.code === 200) {
                    this.mintFreeNft(res.data);
                }
            })
            .catch((error) => {
                Toast(error.msg);
                this.overlayshow = false;
            });
    },
    toHome() {
        this.overMintShow = false;
        this.$router.push("/home");
    },
    nuxt() {
        let data = this.$route.query;
        this.$router.replace({
            path: "/mint_soulcast",
            query: data,
        });
    },
    mintFreeNft(item) {
        this.overlayshow = true;
        let url = this.$api.nft.mintFreeNft;
        let data = this.shaping_data;
        data.colorAttribute = item.colorAttribute;
        data.pictureUrl = item.pictureUrl;
        data.squarePictureUrl = item.squarePictureUrl;
        data.weather = 1;
        post(url, data, true)
            .then((res) => {
                if (res.code === 200) {
                    this.$router.replace(`/mint_success?id=${res.data}`);
                } else if (res.code === 433) {
                    this.overMintShow = true;
                } else {
                    Toast(res.msg);
                    setTimeout(() => {
                        this.$router.push("/home");
                    }, 1000);
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                Toast(error.msg);
                this.overlayshow = false;
            });
    },
};
