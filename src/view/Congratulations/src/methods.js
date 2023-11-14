/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import {
    get,
} from '../../../http/http'
export default {
   async getData() {
        try {
            let url = this.$api.chat.getRewardInfo + `?messageId=${this.$route.query.id}`;
            const res = await get(url);
            if (res.code === 200) {
                this.NFTDetail = res.data.pfpTokenDetailVo;
                this.hiess = res.data;
            }
        } catch (error) {
            // 在这里处理异常
            console.error("", error);
        }

        // let url = this.$api.chat.getRewardInfo + `?messageId=${this.$route.query.id}`
        // get(url).then((res) => {
        //     if (res.code === 200) {
        //         this.NFTDetail = res.data.pfpTokenDetailVo
        //         this.hiess = res.data
        //     }
        // }).catch((error) => { });
    },
    substring(address) {
        if (!address) return
        return (address.substring(0, 6) + '...' + address.substring(address.length - 5, address.length)).toLocaleUpperCase()
    },
    getNFTPickInfo() {
        let url = this.$api.nft.getNFTPickInfo + `?tokenId=${this.NFTDetail.realTokenId}`
        get(url)
            .then((res) => {
                if (res.code === 200) {
                    this.NFTPickInfo = res.data
                }
            })
            .catch((error) => {

            });
    },
    LinkOwner(type) {
        if (type == 1) {
            if (this.isMineMint == 1) {
                this.$router.push(`/home`)
            } else {
                this.$router.push(`/user?id=${this.NFTDetail.mintUserId}`)
            }
        } else {
            if (this.isMineOwner == 1) {
                this.$router.push(`/home`)
            } else {
                this.$router.push(`/user?id=${this.NFTDetail.ownerUserId}`)
            }
        }
    }
}