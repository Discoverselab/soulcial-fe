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
        let url = `${this.$api.chat.getChatList}?userId=1705225272440528898`
        get(url).then((res) => {
            console.log("🔥🔥🔥🚀 ~ file: methods.js:17 ~ res:", res);
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
        this.$router.push(`/conversation?id=${item.id}`)
    }
}