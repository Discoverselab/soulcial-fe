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
                <img class="collect" src="@/assets/collect.png" alt />
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
                four-day event will see over 300 industry speakers, over 100 up-and-coming Web3 projects, esteemed venture
                capitalist entities, and representatives from the Hong Kong government.
            </div>
        </div>
        <!-- 按钮 -->
        <div class="footerBtn">
            <div class="btn">
                <div class="earn_diamond">
                    <img src="@/assets/diamond.png" alt />
                    <span>Earn</span>
                </div>Check in and claim airdrop
            </div>
        </div>
        <TabBar ref="tabbar"></TabBar>
    </div>
</template>
<script>
import TabBar from '@/components/TabBar.vue'
import methods from './src/methods'

export default {
    data() {
        return {

        }
    },
    methods: methods,
    created() {
        this.initMap()
    },
    components: {
        TabBar,
    }
}
</script>
<style lang="scss">
@import './sass/style.scss';
</style>