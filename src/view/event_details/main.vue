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
    </div>
</template>
<style lang="scss">
@import './sass/style.scss';
</style>