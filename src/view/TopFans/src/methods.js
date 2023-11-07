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
    urls() {
        var urls = ['Label_01', 'Label_02', 'Label_03', 'Label_04', 'Label_05', 'Label_06', 'Label_07', 'Label_08', 'Label_09', 'Label_10'];
        //Randomly get a value from the array
        return urls[Math.floor((Math.random() * urls.length))]
    },
    getFansRank() {
        this.overlayshow = true
        let data = {
            type: this.FansType
        }
        let url = this.$api.infor.getFansRank
        get(url, data).then((res) => {
            if (res.code === 200) {
                this.Follower = res.data
            } else {
                this.$toast(res.msg)
            }
            this.overlayshow = false
        }).catch((error) => {
            this.overlayshow = false
        });
    },
    pass(data) {
        this.FansType = data
        this.getFansRank()
    },
    substring(address) {
        return address.substring(0, 6) + '...' + address.substring(address.length - 5, address.length)
    },
}