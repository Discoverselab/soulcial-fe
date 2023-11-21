/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import {
    get, put, post
} from '../../../http/http'

import { ethers } from "ethers";

const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;
let version = true;
export default {
    putApi(url) {
        put(url).then((res) => {
            if (res.code === 200) {
                this.getConnectList()
            } else {
                this.$toast(res.msg)
            }
            this.overlayshow = false
        }).catch((error) => {
            this.overlayshow = false
        });
    },
    onConfirm() {
        this.overlayshow = true
        this.putApi(this.$api.infor.fetchCancelConnect + `/${this.curConnectId}`)
        this.connectShow = false
    },
    // 确认按钮
    confirmConnect(item) {
        this.curConnectId = item.id
        if (this.dialogText === 'connect') {
            let url = this.$api.infor.fetchConfirmConnect + `/${this.curConnectId}`
            put(url).then((res) => {
                if (res.code === 200) {
                    item.status = res.success
                }
                this.connectShow = false
            }).catch((error) => {
            });

        } else {
            // 展示取消按钮弹窗
            // this.connectShow = true
        }
    },
    getFollowers() {
        this.overlayshow = true
        let data = {
            userId: this.$route.query.id
        }
        let url = this.$api.infor.getFollowers
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
    // 获取follewers列表
    getConnectList() {
        this.overlayshow = true
        let url = this.$api.infor.getConnectList
        get(url).then((res) => {
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
    // followUser(item) {
    //     this.UserInfo = item
    //     if (version) {
    //         this.follow()
    //     } else {
    //         this.UserInfo.isFollow ? this.unFollow() : null
    //     }
    // },

    // 跳转到用户详情页
    linkUser(info) {
        const id = this.$route.query.id
        if(info.toUserId !== id) {
            this.$router.push(`/user?id=${info.toUserId}`)
        } else {
            this.$router.push(`/user?id=${info.userId}`)
        }
        // this.$router.push(`/user?id=${id}`)
    },

    follow() {
        this.overlayshow = true
        let data = {
            followType: this.UserInfo.isFollow ? 0 : 1,
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
        if (address) {
            return address.substring(0, 6) + '...' + address.substring(address.length - 5, address.length)
        }
    },
}