/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import {
    get, post
} from '../../../http/http'
import { Toast } from 'vant';
export default {
    getUserInfo() {
        this.overlayshow = true
        let url = this.$api.infor.getUserInfo
        get(url).then((res) => {
            if (res.code === 200) {
                this.UserInfo = res.data
            }
            this.overlayshow = false
        }).catch((error) => {
            this.overlayshow = false
            console.log(error)
        });
    },
    save() {
        if (!this.name||this.name==this.$route.query.value) {
            // this.$toast("Content has not been modified.")
            return
        }
        this.overlayshow = true
        let url = this.$api.infor.setUserInfo
        let data = {
            bio:this.name
        }
        post(url,data,true).then((res) => {
            if (res.code === 200) {
                this.$router.replace({
                    path: '/home',
                })
            }
            this.overlayshow = false
        }).catch((error) => {
            this.overlayshow = false
            console.log(error)
        });
    }
}