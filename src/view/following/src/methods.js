/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import {
    get, post
} from '../../../http/http'
import { ethers } from "ethers";

const provider =  window.ethereum?new ethers.providers.Web3Provider(window.ethereum):null;
let version = true;
export default {
    getFollowers() {
        this.overlayshow = true
        let data = {
            userId: this.$route.query.id
        }
        let url = this.$api.infor.getFollowing
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
    followUser(item) {
        this.UserInfo = item
        if (version) {
            this.follow()
        } else {
            this.unFollow()
        }
    },

    follow() {
        this.overlayshow = true
        let data = {
            followType: 0 ,
            subscribeUserId: this.UserInfo.id
        }
        let url = this.$api.infor.followUser
        post(url, data, true).then((res) => {
            if (res.code === 200) {
                this.$toast("Successful operation")
                this.getFollowers()
            } else {
                this.$toast(res.msg)
            }
            this.overlayshow = false
        }).catch((error) => {
            this.overlayshow = false
        });
    },
    substring(address) {
        return address.substring(0, 6) + '...' + address.substring(address.length - 5, address.length)
    },
}