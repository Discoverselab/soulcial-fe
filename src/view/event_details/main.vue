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
            <p class="time">Apr 7 at 10:00 (UTC+8)</p>
            <p class="desc">HKCEC HALL3FG</p>
        </div>
    </div>
</template>
<style lang="scss">
@import './sass/style.scss';
</style>