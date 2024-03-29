/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post, put } from "../../../http/http";
import Clipboard from "clipboard";
import { Toast } from "vant";
import { LensClient, production, development } from "@lens-protocol/client";
let version = true;
import { ethers } from "ethers";
const client = new LensClient({
    environment: development,
});
const provider = window.ethereum
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null;
export default {
    goTwitter() {
        window.open(`https://twitter.com/${this.UserInfo.twitterUserName}`)
    },
    async init() {
        await this.getUserInfo();
        this.getMintedNFTPage(1);
        this.getConnectList();
        this.isMe();
    },
    isMe() {
        if (this.$loginData.Auth_Token === this.UserInfo.address) {
            this.isOwn = false;
        }
    },
    FollList(type) {
        if (type == 1) {
            if (this.UserInfo.followers <= 0 || !this.UserInfo.followers) {
                this.$toast("No Followers at the moment");
                return;
            } else {
                this.$router.push(`/followers?id=${this.UserInfo.id}`);
            }
        }
        if (type == 2) {
            if (this.UserInfo.following <= 0 || !this.UserInfo.following) {
                this.$toast("No following for the time being");
                return;
            } else {
                this.$router.push(`/following?id=${this.UserInfo.id}`);
            }
        }
    },
    // 获取好友请求列表
    getConnectList() {
        this.overlayshow = true;
        let url = this.$api.infor.getConnectList;
        let data = {
            userId:  this.userId ,
        };
        get(url, data)
            .then((res) => {
                if (res.code === 200) {
                    // this.conneceListNum = res.data.allList.length
                    this.newList = res.data.newList;
                    this.allList = res.data.allList;
                    this.isEmpty = res.data.newList.filter(
                        (item) => item.userId === this.$route.query.id
                    );
                    this.allList = res.data.allList.filter(
                        (item) => item.userId === this.$route.query.id
                    );
                    if (this.isEmpty.length !== 0) {
                        this.shouldConfirm = true;
                    }
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                this.overlayshow = false;
                console.log(error);
            });
    },
    // 确认添加好友
    confirmConnect(id) {
        this.curConnectId = id;
        let url = this.$api.infor.fetchConfirmConnect + `/${this.curConnectId}`;
        put(url)
            .then((res) => {
                if (res.code === 200) {
                    this.UserInfo.connectStatus = 1;
                }
            })
            .catch((error) => {});
    },
    // 取消好友连接
    cancelConnect(allId, newId) {
        // 获取用户信息后，刚刚确认添加的好友还在newList列表里
        if (!allId) {
            this.curConnectId = newId;
        } else {
            this.curConnectId = allId;
            console.log(this.curConnectId, "this.curConnectId");
        }
        // 展示取消连接弹窗
        // this.connectShow = true
    },
    onCancelConnect() {
        console.log(this.curConnectId, "this.curConnectId");
        let url = this.$api.infor.fetchCancelConnect + `/${this.curConnectId}`;
        put(url)
            .then((res) => {
                if (res.code === 200) {
                    this.UserInfo.connectStatus = null;
                    this.connectShow = false;
                }
            })
            .catch((error) => {});
    },

    copy() {
        const clipboard = new Clipboard(".copy-button", {
            text: () => this.UserInfo.address,
        });
        clipboard.on("success", (e) => {
            Toast("Copy successfully");
        });
        clipboard.on("error", (e) => {
            Toast("No content");
        });
    },
    substring(address) {
        return (
            address.substring(0, 6) +
            "..." +
            address.substring(address.length - 4, address.length)
        );
    },
    close() {
        this.$router.push("/");
    },
    async getUserInfo() {
        try {
            this.overlayshow = true;
            let url = this.$api.infor.getUserInfo;
            let data = {
                userId: this.$route.query.id,
                code:this.$route.params.code
            };
            const res = await get(url, data);

            if (res.code === 200) {
                this.connectedNum = res.data.connectedNum;
                this.UserInfo = res.data;
                let userTags = res.data.userTags;
                this.TagsList = userTags ? userTags.split(",") : [];
                this.userId = res.data.id
                let item = res.data;
                this.values.push(item.charisma);
                this.values.push(item.courage);
                this.values.push(item.art);
                this.values.push(item.wisdom);
                this.values.push(item.energy);
                this.values.push(item.extroversion);
            }

            this.overlayshow = false;
        } catch (error) {
            this.overlayshow = false;
            console.log(error);
        }
    },

    //  getUserInfo() {
    //     this.overlayshow = true
    //     let url = this.$api.infor.getUserInfo
    //     let data = {
    //         userId: this.$route.query.id
    //     }
    //     get(url, data).then((res) => {
    //         if (res.code === 200) {
    //             this.connectedNum = res.data.connectedNum
    //             this.UserInfo = res.data
    //             let userTags = res.data.userTags
    //             this.TagsList = userTags ? userTags.split(',') : []
    //             let item = res.data
    //             this.values.push(item.charisma)
    //             this.values.push(item.courage)
    //             this.values.push(item.art)
    //             this.values.push(item.wisdom)
    //             this.values.push(item.energy)
    //             this.values.push(item.extroversion)

    //         }
    //         this.overlayshow = false
    //     }).catch((error) => {
    //         this.overlayshow = false
    //         console.log(error)
    //     });
    // },
    Update() {
        if (!this.$loginData.Auth_Token) {
            return (this.walletShow = true);
        }
        let me = this;
        me.overlayshow = true;
        let url = this.$api.infor.updateUserScore;
        get(url)
            .then((res) => {
                if (res.code === 200) {
                    this.getUserInfo();
                    // this.Updatedb3(res.data)
                } else {
                    this.$toast(res.msg);
                }
                me.overlayshow = false;
            })
            .catch((error) => {
                me.overlayshow = false;
                this.$toast(error.msg);
            });
    },
    TabClick(id) {
        this.TabActive = id;
        this.getMintedNFTPage(id);
    },
    followUser() {
        if (version) {
            this.follow();
        } else {
            this.UserInfo.isFollow ? this.unFollow() : this.follow_lens();
        }
    },
    connectUser() {
        if (!this.$loginData.Auth_Token) {
            return (this.walletShow = true);
        }
        const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
        if (!loginInfo.usedInviteCode && !loginInfo.whiteUser) {
            return;
        }
        // this.overlayshow = true
        let url = this.$api.infor.addConnect + "/" + this.UserInfo.id;
        put(url)
            .then((res) => {
                if (res.code === 200) {
                    this.connectSuccess = res.success;
                    // this.getUserInfo()
                } else {
                    this.$toast(res.msg);
                }
                // this.overlayshow = false
            })
            .catch((error) => {
                // this.overlayshow = false
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
        const r = await client.authentication.generateChallenge(
            this.$loginData.Auth_Token
        );
        const signer = provider.getSigner();
        const signature = await signer.signMessage(r);
        const authData = await client.authentication.authenticate(
            this.$loginData.Auth_Token,
            signature
        );
        let res = await client.authentication.isAuthenticated();
        this.UserInfo.isFollow ? this.unFollow() : this.follow_lens();
    },
    async follow_lens() {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
        });
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        this.overlayshow = true;
        // 关注
        try {
            const followTypedDataResult =
                await client.profile.createFollowTypedData({
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
                console.log("关注成功");
                setTimeout(async () => {
                    await this.follow();
                }, 1000);
            }
            this.overlayshow = false;
        } catch (err) {
            console.log(err);
            this.linkethers();
            this.overlayshow = false;
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
        this.overlayshow = true;
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
                console.log("取关成功");
                setTimeout(async () => {
                    await this.follow();
                }, 1000);
            }
            this.overlayshow = false;
        } catch (err) {
            this.linkethers();
            this.overlayshow = false;
        }
    },
    follow() {
        this.overlayshow = true;
        let data = {
            followType: this.UserInfo.isFollow ? 0 : 1,
            subscribeUserId: this.$route.query.id,
        };
        let url = this.$api.infor.followUser;
        post(url, data, true)
            .then((res) => {
                if (res.code === 200) {
                    this.$toast("Successful operation");
                    this.getUserInfo();
                } else {
                    this.$toast(res.msg);
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                this.overlayshow = false;
            });
    },
    getMintedNFTPage(type) {
        this.overlayshow = true;
        let data = {
            current: 1,
            size: 99,
            userId:  this.userId ,
        };
        let url =
            type == 1
                ? this.$api.infor.getMintedNFTPage
                : this.$api.infor.getCollectNFTPage;
        this.NftList = [];
        get(url, data)
            .then((res) => {
                if (res.code === 200) {
                    // this.NftList = res.data.records.filter(item => item.pickStatus !== 1) // 没有挂单的nft
                    this.NftList = res.data.records;  // 全部nft
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                this.overlayshow = false;
            });
    },
    // toInvite() {
    //     if (!this.$loginData.Auth_Token) {
    //         return (this.walletShow = true);
    //     }
    //     this.$router.push("/invite");
    // },
    back() {
        if (this.$route.fullPath.includes('/t/')) {
            this.$router.push("/");
        } else {
            this.$router.go(-1);
        }
    },
    getSoulSbtiStyle(soul) {
        const soulLength = String(soul).length;
        const k = 0.0052;
        return {fontSize: `${500 / soulLength * k}rem`}
    },
};
