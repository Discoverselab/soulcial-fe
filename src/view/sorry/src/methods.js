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
    getData() {
        let url = this.$api.chat.getRewardInfo + `?messageId=${this.$route.query.id}`
        get(url).then((res) => {
            if (res.code === 200) {
                this.NFTDetail = res.data.pfpTokenDetailVo
                this.hiess = res.data
            }
        }).catch((error) => { });
    },
    substring(address) {
        if (!address) return
        return address.substring(0, 4) + '...' + address.substring(address.length - 5, address.length)
    },
}