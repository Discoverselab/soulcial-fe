<template>
    <div class="eventDetails">
        <div class="navigate">
            <div class="layout">
                <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt />
                <div class="empty"></div>
            </div>
            <div class="nav_name">
                <p class="name">Event Details</p>
            </div>
            <div class="operate">
                <img v-if="collectSuccess" class="collect" src="@/assets/collectActive.png" @click="collectToggle" alt="">
                <img v-else class="collect" src="@/assets/collect.png" @click="collectToggle" alt />
                <img class="label" src="@/assets/label.png" alt />
            </div>
        </div>
        <img class="banner" src="@/assets/eventActive1.png" alt />
        <div class="detail">
            <h1 class="title">HongKong Web3 Festival</h1>
            <p class="time fw500">Apr 7 at 10:00 (UTC+8)</p>
            <p class="desc fw500">HKCEC HALL3FG</p>
        </div>
        <!-- 谷歌地图 -->
        <div class="map">
            <div class="mapHeader">
                <div class="desc fw500">
                    Hong Kong Convention and Exhibition Centre,
                    Expo Drive, Wan Chai, Hong Kong
                </div>
                <div class="copy">
                    <img src="@/assets/copyWhite.png" alt="">
                </div>
            </div>

            <div id="mapBox"></div>

        </div>
        <!-- info -->
        <div class="info">
            <div class="title">
                Info
            </div>
            <div class="fw500 detail">
                The inaugural Web3 Festival, co-hosted by Wanxiang Blockchain Labs and HashKey Group and partnering with
                OKX, will take place on April 12-15, 2023 in Hong Kong Convention and Exhibition Center (HKCEC). This
                four-day event will see over 300 industry speakers, over 100 up-and-coming Web3 projects, esteemed
                venture
                capitalist entities, and representatives from the Hong Kong government.
            </div>
        </div>
        <!-- 按钮 -->
        <div class="footerBtn" :class="{ suspension: _isPhoneMobile() }">
            <div class="btn" @click="check">
                <div class="earn_diamond">
                    <img src="@/assets/diamond.png" alt />
                    <span>Earn</span>
                </div>Check in and claim airdrop
            </div>
        </div>
        <!-- 成功弹窗 -->
        <van-dialog v-model="successCheckShow" :close-on-click-overlay="true" :z-index="99999999999999999999"
            :show-cancel-button="false" :show-confirm-button="false">
            <div class="introduce">
                <p class="title">
                    Checked in!
                </p>
                <p class="earnVsoul">
                    You Earned 500 vSOUL
                </p>
                <div>
                    <img class="vsImg" src="@/assets/successCheck.png" alt />
                </div>
                <div class="setBut">
                    <button>GO TO CHAT and Connect</button>
                    <button class="backBtn" @click="successCheckShow = false">back</button>
                </div>
            </div>
        </van-dialog>
        <!-- 失败弹窗 -->
        <van-dialog v-model="failCheckShow" :close-on-click-overlay="true" :z-index="99999999999999999999"
            :show-cancel-button="false" :show-confirm-button="false">
            <div class="introduce">
                <p class="title">
                    SOrry!
                </p>
                <p class="detail">
                    Check in failed.
                </p>
                <p class="detail">
                    It seems you are too far away from the event.
                </p>
                <div>
                    <img class="vsImg" src="@/assets/sorry.png" alt />
                </div>
                <div class="setBut">
                    <button class="backBtn" @click="failCheckShow = false">back</button>
                </div>
            </div>
        </van-dialog>
        <TabBar ref="tabbar"></TabBar>
    </div>
</template>
<script>
import TabBar from '@/components/TabBar.vue'
import methods from './src/methods'

export default {
    data() {
        return {
            successCheckShow: false,
            failCheckShow: false,
            collectSuccess: false
        }
    },
    methods: methods,
    created() {
        this.initMap()
        console.log(this._isPhoneMobile(), '111')
    },
    components: {
        TabBar,
    }
}
</script>
<style lang="scss">
@import './sass/style.scss';
</style>