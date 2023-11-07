/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import {
    get, put, post
} from '../../../http/http'
import {
    LensClient,
    production,
    development
} from "@lens-protocol/client";
import { ethers } from "ethers";
const client = new LensClient({
    environment: development,
});
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
    followUser(item) {
        this.UserInfo = item
        if (version) {
            this.follow()
        } else {
            this.UserInfo.isFollow ? this.unFollow() : this.follow_lens()
        }
    },

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

    async linkethers() {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
        });
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        //签名
        const r = await client.authentication.generateChallenge(this.$loginData.Auth_Token);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(r);
        const authData = await client.authentication.authenticate(this.$loginData.Auth_Token, signature)
        let res = await client.authentication.isAuthenticated();
        this.UserInfo.isFollow ? this.unFollow() : this.follow_lens()
    },
    async follow_lens() {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
        });
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        this.overlayshow = true
        // 关注
        try {
            const followTypedDataResult = await client.profile.createFollowTypedData({
                follow: [
                    {
                        profile: this.UserInfo.lensProfile,
                    },
                ],
            });
            // 签名信息
            const data = followTypedDataResult.unwrap();
            // sign with the wallet
            const signedTypedData = await provider
                .getSigner()
                ._signTypedData(
                    data.typedData.domain,
                    data.typedData.types,
                    data.typedData.value
                );
            console.log(signedTypedData);
            const broadcastResult = await client.transaction.broadcast({
                id: data.id,
                signature: signedTypedData,
            });
            if (broadcastResult.value) {
                console.log('关注成功')
                setTimeout(async () => {
                    await this.follow()
                }, 1000)
            }
            this.overlayshow = false
        } catch (err) {
            this.overlayshow = false
            console.log(err)
            this.linkethers()
        }
    },
    async unFollow() {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
        });
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        this.overlayshow = true
        //取消关注
        try {
            const unfollowTypedDataResult =
                await client.profile.createUnfollowTypedData({
                    profile: this.UserInfo.lensProfile,
                });

            const data = unfollowTypedDataResult.unwrap();
            const signedTypedData = await provider
                .getSigner()
                ._signTypedData(
                    data.typedData.domain,
                    data.typedData.types,
                    data.typedData.value
                );

            const broadcastResult = await client.transaction.broadcast({
                id: data.id,
                signature: signedTypedData,
            });
            if (broadcastResult.value) {
                console.log('取关成功')
                setTimeout(async () => {
                    await this.follow()
                }, 1000)
            }
            this.overlayshow = false
        } catch (err) {
            this.linkethers()
            this.overlayshow = false
        }
    },

    substring(address) {
        if (address) {
            return address.substring(0, 6) + '...' + address.substring(address.length - 5, address.length)
        }
    },
}