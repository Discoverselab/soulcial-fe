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
    getDate() {
        let me = this
        me.overlayshow = true
        let url = this.$api.chat.getUserMessage
        get(url).then((res) => {
            if (res.code === 200) {
                this.ChatList = res.data
            } else {
                this.$toast(res.msg)
            }
            me.overlayshow = false
        }).catch((error) => {
            me.overlayshow = false
            this.$toast(error)
        });
    },
    links(item){
        if(item.message=='REWARD_SUCCESS'){
            this.$router.push(`/Congratulations?id=${item.id}`)
        }else if(item.message=='REWARD_FAILED'){
            this.$router.push(`/sorry?id=${item.id}`)
        }else{
            this.$router.push(`/owner?id=${item.id}`)
        }
    }
}