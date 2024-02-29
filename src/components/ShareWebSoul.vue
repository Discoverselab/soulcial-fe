<template>
    <div id="elementToCapture" class="share_photo">
        <!-- <svg-icon  className="svgName" iconClass="Vector1"></svg-icon> -->
        <div class="share_detail">
            <div class="title ">
                <div class="soul">
                    <div class="top">Web3 Soul</div>
                    <div class="bottom">
                        <span>{{ `${UserInfo.personality} ${UserInfo.chracter}` || '-' }}</span>
                        <img src="@/assets/sbti.png" alt />
                    </div>
                    <div class="chracter">
                        {{ soulInfo }}
                    </div>
                </div>
            </div>
            <div class="nft_pic" v-if="showNftPicture">
                <img :src="NftList[0].pictureUrl" alt />
            </div>
            <div class="calculate" v-else>
                <div>
                    <Hexagon :isShare="true" v-if="this.values.length > 5" :type="true" :level="UserInfo.level"
                        :levelScore="UserInfo.levelScore" :values="values" />
                </div>
            </div>
            <!-- 存在nft图片 -->
            <div class="user_infor_nft" v-if="showNftPicture">
                <div class="userinfo">
                    <div class="baseInfo">
                        <img class="portrait" :src="`${UserInfo.avatar}`" alt />
                        <div class="nameAddres" v-if="UserInfo.userName">
                            <p class="name">{{ UserInfo.userName }}</p>
                            <!-- <p class="address">{{ substring(UserInfo.address) }}</p> -->
                        </div>
                    </div>

                    <div class="introduce">
                        <div class="bio" v-if="UserInfo.bio" ref="bio">{{ UserInfo.bio }}</div>
                        <div class="label_cont">
                            <div v-if="TagsList.length > 0"
                                style="display: flex;align-items: center;justify-content: space-between;">
                                <div class="label_left">
                                    <img :class="`svgName${item}`" v-for="(item, index) in TagsList" :key="index"
                                        :src="require(`@/assets/tags/tag${item}.png`)" alt />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="smallRadar" ref="smallRadar">
                        <Hexagon1 :isShare="true" :type="true" :level="UserInfo.level" :levelScore="UserInfo.levelScore"
                            :values="values" />
                    </div>
                </div>
            </div>
            <!-- 没有nft图片 -->
            <div class="user_infor_NoNft" v-else>
                <div class="userinfo">
                    <div class="baseInfo">
                        <img class="portrait" :src="`${UserInfo.avatar}`" alt />
                        <div class="nameAddres" v-if="UserInfo.userName">
                            <p class="name">{{ UserInfo.userName }}</p>
                            <p class="address">{{ substring($loginData.Auth_Token) }}</p>
                        </div>
                    </div>
                    <div class="introduce">
                        <div class="bio">{{ UserInfo.bio }}</div>
                        <div class="label_cont">
                            <div v-if="TagsList.length > 0"
                                style="display: flex;align-items: center;justify-content: space-between;">
                                <div class="label_left">
                                    <img :class="`svgName${item}`" v-for="(item, index) in TagsList" :key="index"
                                        :src="require(`@/assets/tags/tag${item}.png`)" alt />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="soulical">
            <div class="logo">
                <img src="@/assets/logo.png" alt />
                <p>Rebuild the Value of Social Network</p>
            </div>
            <div class="qrcode" ref="qrCodeUrl"></div>
        </div>
    </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue'
import Hexagon from "@/components/Hexagon.vue";
import Hexagon1 from "@/components/Hexagon1.vue";
import { chracterInfo } from '@/libs/target.js'
import QRCode from 'qrcodejs2'
import { website } from "@/http/api.js";
export default {
    data() {
        return {
            UserInfo: {},
            code: null,
            TagsList: [],
            soulInfo: null,
            values: [],
            NftList: [],
            showNftPicture: false,
            overlayshow: false
        }
    },
    methods: {
        substring(address) {
            return address.substring(0, 6) + '...' + address.substring(address.length - 5, address.length)
        },
        getUserInfo() {
            const data = JSON.parse(localStorage.getItem('userInfo'))
            this.UserInfo = data
            console.log('this.UserInfo', this.UserInfo)
            let userTags = data.userTags
            this.TagsList = userTags ? userTags.split(',') : []
            this.code = data.superInviteCode.split('-')[1]
            let item = data
            this.soulInfo = chracterInfo[this.UserInfo.chracter]
            this.values.push(item.charisma)
            this.values.push(item.courage)
            this.values.push(item.art)
            this.values.push(item.wisdom)
            this.values.push(item.energy)
            this.values.push(item.extroversion)
            this.getMintedNFTPage()
        },
        getMintedNFTPage() {
            this.overlayshow = true
            this.NftList = JSON.parse(localStorage.getItem('mintedNFTPage'))
            if (this.NftList && this.NftList.length !== 0) {
                this.showNftPicture = this.NftList[0].pictureUrl
            }
            this.overlayshow = false
        },
        // 动态设置小雷达图的外边距
        getSmallRadarMarginTop() {
            const rootElement = document.documentElement
            const computedStyle = window.getComputedStyle(rootElement)
            const fontSize = computedStyle.fontSize
            const fontSizeValue = parseFloat(fontSize)
            const bio = this.$refs.bio
            const smallRadar = this.$refs.smallRadar
            if (!smallRadar) return
            smallRadar.style.marginTop = bio?.clientHeight / fontSizeValue + 'rem'
        },
        creatQrCode() {
            new QRCode(this.$refs.qrCodeUrl, {
                text: `${website}/#/t/${this.code}`, // 需要转换为二维码的内容
                width: 100,
                height: 100,
                colorDark: '#000000',
                colorLight: 'transparent',
                correctLevel: QRCode.CorrectLevel.H
            })
        },

    },
    created() {
        this.getUserInfo()
    },
    mounted() {
        this.$nextTick(() => {
            this.getSmallRadarMarginTop()
        })
        this.creatQrCode()
    },
    components: { Overlay, Hexagon, Hexagon1 },
}
</script>

<style lang="scss">
$imgK: 0.7;

.conversation {

    // 发送名片开始
    .p24 {
        padding: 0 24px;
    }

    .hidden {
        position: absolute;
        top: 10000px;
    }

    .share_photo {
        border-radius: 10px;
        background-color: #dfdfce;

        .share_detail {
            padding: 0 16px;
            border-radius: 10px;
            border: 2px solid #dfdfce;
            background-color: #fff;

            .title {
                .soul {
                    text-align: center;

                    .top {
                        font-family: Inter;
                        font-size: 10px;
                        font-weight: 600;
                        line-height: 15px;
                        text-align: center;
                        color: #bfbfaf;
                        margin: 20px auto 0;
                    }

                    .bottom {
                        display: inline-block;
                        position: relative;
                        white-space: nowrap;
                        margin: 0 auto;

                        span {
                            height: 26px;
                            text-align: center;
                            font-family: DINCond-Bold;
                            font-size: 26px;
                            font-weight: 500;
                            letter-spacing: -0.02em;
                            text-transform: uppercase;
                            position: relative;
                            z-index: 2;
                        }

                        img {
                            // width: 127px;
                            // height: 8.786163330078125px;
                            width: 105%;
                            height: 8.786163330078125px;
                            position: absolute;
                            bottom: 0px;
                            left: -4px;
                            z-index: 1;
                        }
                    }

                    .chracter {
                        font-weight: 600;
                        margin-top: 10px;
                        text-align: left;
                        font-family: Inter;
                        font-size: 10px;
                    }
                }
            }

            .nft_pic {
                width: 192px;
                height: 192px;
                margin: auto;
                margin-bottom: 35px;
                text-align: center;

                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }

            .calculate {
                margin: 20px 0 20px;
                // padding: 0 62px;

                .tags {
                    span {
                        letter-spacing: -0.088px;
                        font-size: 8.808px;
                    }
                }
            }

            .user_infor_nft {
                display: flex;
                justify-content: space-between;
                // padding: 0 7px 0 18px;
            }


            .userinfo {
                margin-bottom: 5px;

                .baseInfo {
                    display: flex;
                    align-items: center;

                    .portrait {
                        object-fit: cover;
                        display: block;
                        width: 32px;
                        height: 32px;
                        border: 1px solid #000;
                        border-radius: 50%;
                        margin-right: 11px;
                    }

                    .nameAddres {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;

                        .name {
                            font-family: Inter;
                            font-size: 16px;
                            font-weight: 700;
                            line-height: 16px;
                            letter-spacing: -0.02em;
                        }

                        .address {
                            margin-top: 4px;
                            font-family: Inter;
                            font-size: 10px;
                            font-weight: 500;
                            line-height: 10px;
                            letter-spacing: 0em;
                            text-align: left;
                            // opacity: 30%;
                            color: #b2b2b2;
                        }
                    }
                }

                .introduce {
                    .bio {
                        padding-top: 6px;
                        color: #000;
                        font-family: Inter;
                        font-size: 10px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 150%;
                        word-break: break-word;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;

                        /* 15px */
                    }

                    .label_cont {
                        // padding-bottom: 20px;
                        // margin: 30px 0 20px 0;
                        padding: 13px 0 21px 0;

                        .label_left {
                            display: flex;
                            align-items: center;

                            .svgName1 {
                                width: 78px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName2 {
                                width: 75px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName3 {
                                width: 50px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName4 {
                                width: 94px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName5 {
                                width: 54.5px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName6 {
                                width: 52px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName7 {
                                width: 53px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName8 {
                                width: 40px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName9 {
                                width: 96px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName10 {
                                width: 40px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName11 {
                                width: 68px * $imgK !important;
                                height: 24px * $imgK !important;
                            }

                            .svgName12 {
                                width: 88px * $imgK !important;
                                height: 24px * $imgK !important;
                            }
                        }
                    }
                }
            }
        }

        .soulical {
            width: 100%;
            height: 76px;
            display: flex;
            padding: 12px;
            justify-content: space-between;

            .logo {
                margin-top: 4px;

                img {
                    width: 112px;
                }

                p {
                    margin-top: 5px;
                    font-family: Inter;
                    font-size: 10px;
                    font-weight: 500;
                    line-height: 10px;
                    letter-spacing: 0em;
                    text-align: center;
                    opacity: 0.5;
                    text-transform: uppercase;
                }
            }

            .qrcode {
                width: 50px;
                height: 50px;

                img {
                    width: 100%;
                }
            }
        }
    }

    // 发送名片结束
    .navigate {
        display: flex;
        align-items: center;
        height: 64px;
        box-sizing: border-box;
        padding: 0px 24px;
        background-color: #f5f5ed;

        .back {
            display: block;
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

        .info {
            display: flex;
            align-items: center;
            margin-left: 20px;

            .left {
                border-radius: 20px;
                overflow: hidden;
                width: 40px;
                height: 40px;
                margin-right: 10px;
                box-sizing: border-box;
                border: 1px solid #000;
                flex-shrink: 0;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .right {
                .name {
                    font-size: 16px;
                    color: #000;
                    font-weight: 600;
                    margin-bottom: 3px;
                    max-width: 220px;
                    white-space: nowrap;
                    /* 让文本在一行中显示 */
                    overflow: hidden;
                    /* 隐藏超出容器的内容 */
                    text-overflow: ellipsis;
                    /* 当文本溢出时显示省略号 */
                }

                .address {
                    display: flex;
                    align-items: center;
                    font-family: Inter;
                    font-size: 12px;
                    font-weight: 500;
                    color: #62625f;

                    img {
                        margin-left: 8px;
                        width: 16px;
                        height: 16px;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .chatBox {
        position: relative;
        height: calc(100vh - 64px - 108px);
        box-sizing: border-box;
        overflow: auto;
        padding: 0px 24px 24px;
        border-top: 2px solid #dfdfce;
        background-color: #f3f4ea;

        .loading {
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 20px;
            left: calc(50% - 15px);
        }

        .timeTip {
            margin: 10px 0 0;
            text-align: center;
            color: #575754;
        }

        .other {
            display: flex;
            align-items: flex-start;
            margin-top: 20px;

            .othersImg {
                width: 40px;
                height: 40px;
                border: 1px solid #000;
                box-sizing: border-box;
                border-radius: 20px;
                overflow: hidden;
                margin-right: 17px;
                flex-shrink: 0;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .othersMsg {
                padding: 12px;
                border-radius: 10px;
                max-width: 275px;
                background: #dfdfce;
                overflow-wrap: break-word;
            }
        }

        .me {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;

            .msg {
                padding: 12px;
                max-width: 280px;
                border-radius: 10px;
                background: #f2b229;
                overflow-wrap: break-word;
            }
        }
    }

    .shareMySoul {
        position: fixed;
        bottom: 120px;
        left: 0;
        right: 0;
        text-decoration: underline;
        text-align: center;
    }

    .footer {
        position: fixed;
        width: 390px;
        bottom: 0;
        display: flex;
        align-items: center;
        text-align: center;
        height: 108px;
        padding: 0px 12px;
        box-sizing: border-box;
        border-top: 2px solid #dfdfce;
        background-color: #fff;

        .btn {
            display: flex;
            align-items: center;

            .searchImg {
                margin-left: 12px;
                width: 24px;
                height: 24px;

                img {
                    width: 24px;
                    height: 24px;
                }
            }
        }
    }
}
</style>