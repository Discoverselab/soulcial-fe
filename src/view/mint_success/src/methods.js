/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get } from "../../../http/http";
import { getHeight } from "@/libs/common.js";
export default {
    getData() {
        let url = this.$api.nft.getNFTDetail + `?id=${this.$route.query.id}`;
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
                    getHeight(this);
                }
            })
            .catch((error) => {});
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
    getSoulSbtiStyle(soul) {
        const soulLength = String(soul).length;
        const k = 0.0052;
        return {fontSize: `${705 / soulLength * k}rem`}
    },
    jumpToList(){
        if (this.UnregisteredList.length === 1) {
          this.earnVsoulShow = true
        } else {
          this.$router.push(`/list_price?id=${this.NFTDetail.realTokenId}&path=1`)
        }
      },
      continueList() {
        this.$router.push(`/list_price?id=${this.NFTDetail.realTokenId}&path=1`)
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
};
