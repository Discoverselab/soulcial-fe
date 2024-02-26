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
                <img class="label" src="@/assets/label.png" @click="forward" alt />
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
        <div class="footerBtn" :class="{ suspension: _isPhoneMobile() }" v-if="eventDetail.link && !showCheck">
            <div class="btn" @click="jumpToOutside">
                Join Now
            </div>
        </div>
        <template v-if="showCheck">
            <div class="footerBtn" :class="{ suspension: _isPhoneMobile() }" v-if="!eventDetail.isCheckIn">
                <div class="btn" @click="check">
                    <div class="earn_diamond">
                        <img src="@/assets/diamond.png" alt />
                        <span>Earn</span>
                    </div>Check in and claim airdrop
                </div>
            </div>
            <div class="footerBtn" :class="{ suspension: _isPhoneMobile() }" v-else>
                <div class="btn" @click="$router.push('/earn')">
                    <div class="earn_diamond">
                        <img src="@/assets/diamond.png" alt />
                        <span>Earn</span>
                    </div>Check in & earn vsoul
                </div>
            </div>
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
                    <button @click="jumpToChat">GO TO CHAT and Connect</button>
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
        <Overlay :overlayshow="overlayshow"></Overlay>
    </div>
</template>
<script>
import TabBar from '@/components/TabBar.vue'
import methods from './src/methods'
import Overlay from '@/components/Overlay.vue'

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
            userLon: null,
            userLat: null,
            googleMapsKey: null,
            loader: null
        }
    },
    methods: methods,
    async created() {
        if (this.$route.query && this.$route.query.eventId) {
            this.eventId = this.$route.query.eventId;
        } else if (this.$route.params && this.$route.params.id) {
            this.eventId = this.$route.params.id;
        }
        await this.getGoogleMapsKey()
        await this.getEventDetail()
        this.createLoader()
        this.isEventTime()
        this.initMap()
    },
    mounted() {
        this.getUserPos()
    },
    components: {
        TabBar,
        Overlay
    }
}
</script>
<style lang="scss">
@import './sass/style.scss';
</style>