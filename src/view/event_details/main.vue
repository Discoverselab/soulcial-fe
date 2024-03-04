<template>
    <div class="eventDetails">
        <div class="navigate">
            <div class="layout">
                <img @click="back" class="back" src="../../assets/back.png" alt />
                <div class="empty"></div>
            </div>
            <div class="nav_name">
                <p class="name">Event Details</p>
            </div>
            <div class="operate">
                <img v-if="collectSuccess" class="collect" src="@/assets/collectActive.png" @click="collectToggle"
                    alt="">
                <img v-else class="collect" src="@/assets/collect.png" @click="collectToggle" alt />
                <img class="labelEvent" src="@/assets/label.png" @click="forward" alt />
            </div>
        </div>
        <img class="banner" :src="eventDetail.eventBanner" alt />
        <div class="detail">
            <h1 class="title">{{ eventDetail.eventName }}</h1>
            <p class="time fw500">{{ eventDetail.eventDateDetail }}</p>
        </div>
        <!-- 谷歌地图 -->
        <div class="map">
            <div class="mapHeader">
                <div class="desc fw500">
                    {{ eventDetail.eventAddress }}
                </div>
                <div class="copyAddress" @click="copyAddress">
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
                {{ eventDetail.intro }}
            </div>
        </div>
        <!-- 按钮 -->
        <div class="footerBtn" :class="{ suspension: _isPhoneMobile() }" v-if="checkIn">
            <div class="btn" @click="jumpToChat(eventDetail)">
                GO TO CHAT and Connect
            </div>
        </div>
        <template v-else>
            <div class="footerBtn" :class="{ suspension: _isPhoneMobile() }" v-if="eventDetail.link && !showCheck">
                <div class="btn" @click="jumpToOutside">
                    Join Now
                </div>
            </div>
            <template v-if="showCheck">
                <!-- suspension类使按钮悬浮 -->
                <div class="footerBtn" :class="{ suspension: _isPhoneMobile() }" v-if="!eventDetail.isCheckIn">
                    <div class="btn" @click="check">
                        <div class="earn_diamond">
                            <img src="@/assets/diamond.png" alt />
                            <span>{{ eventDetail.reward | removeDecimal }} vSOUL</span>
                        </div>Check in and claim airdrop
                    </div>
                </div>
            </template>
        </template>



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
                    <button @click="jumpToChat(eventDetail)">GO TO CHAT and Connect</button>
                    <button class="backBtn" @click="reload">back</button>
                </div>
            </div>
        </van-dialog>
        <!-- 失败弹窗 -->
        <!-- 签到失败 -->
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
        <!-- 获取地理位置失败 -->
        <van-dialog v-model="failLocationShow" :close-on-click-overlay="true" :z-index="99999999999999999999"
            :show-cancel-button="false" :show-confirm-button="false">
            <div class="introduce">
                <p class="title">
                    Oops...
                </p>
                <p class="detail">
                    Unable to access your precise location.Please turn on the browser location access insystem settings,
                    refresh the page and allowSoulcial to use your current location.
                </p>
                <div>
                    <img class="vsImg" src="@/assets/sorry.png" alt />
                </div>
                <div class="setBut">
                    <button class="backBtn" @click="failLocationShow = false">back</button>
                </div>
            </div>
        </van-dialog>
        <TabBar class="tabbar" ref="tabbar"></TabBar>
        <Overlay :overlayshow="overlayshow"></Overlay>
        <Wallet :path="pathEx" @close="walletClose()" :walletShow="walletShow"></Wallet>
    </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import methods from './src/methods'
import Overlay from '@/components/Overlay.vue'
import Wallet from '@/components/LinkWallet.vue'
export default {
    data() {
        return {
            successCheckShow: false,
            failCheckShow: false,
            collectSuccess: false,
            eventId: null,
            eventDetail: {},
            overlayshow: false,
            showCheck: false, // 是否显示在活动时间的按钮
            checkIn: false, // 是否签到成功
            userLon: null,
            userLat: null,
            googleMapsKey: null,
            loader: null,
            walletShow: false,
            failLocationShow: false
        }
    },
    methods: methods,
    async created() {
        if (this.$route.query && this.$route.query.eventId) {
            this.eventId = this.$route.query.eventId;
        } else if (this.$route.params && this.$route.params.id) {
            this.eventId = this.$route.params.id;
        }
        if (window.location.href.indexOf("/e/") > -1) {
            const parts = window.location.href.split("/e/");
            const lastPart = parts[parts.length - 1];
            const inviteCode = lastPart.split("/")[0];
            window.sessionStorage.setItem("inviteCode", inviteCode);
        }
        await this.init()
    },
    mounted() {
        this.$refs.tabbar.BarActive = "/event"
    },
    filters: {
        // 小数点后位0，去掉小数点后的部分
        removeDecimal(value) {
            return value.replace(/\.0+$/, '');
        }
    },
    components: {
        TabBar,
        Overlay,
        Wallet
    },
}
</script>

<style lang="scss">
@import './sass/style.scss';
</style>