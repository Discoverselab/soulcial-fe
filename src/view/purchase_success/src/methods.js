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
        let url = this.$api.nft.getNFTDetail + `?id=${this.$route.query.id}`
        get(url).then((res) => {
            if (res.code === 200) {
                this.NFTDetail = res.data
            }
        }).catch((error) => { });
    },
}