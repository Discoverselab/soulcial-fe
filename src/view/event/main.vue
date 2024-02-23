<template>
  <div class="event">
    <!-- Tab -->
    <div class="TabCont">
      <div class="Tab_left">
        <div class="Tab_list" @click="changeTab(item)" :class="{
          Tab_list_Active: TabActive == item.id,
        }" v-for="(item, index) in TabList" :key="index">{{ item.name }}</div>
      </div>
    </div>
    <div>
      <!-- all下显示banner -->
      <div v-if="TabActive === 1 && eventList[0]" @click="jumpToEventDetail(eventList[0].eventId)"
        style="cursor: pointer;">
        <img class="banner" :src="eventList[0].eventBannerUrl" alt />
        <div class="detail">
          <h1 class="title">{{ eventList[0].eventName }}</h1>
          <p class="time fw500">{{ eventList[0].eventDate }}</p>
          <p class="desc fw500">{{ eventList[0].eventAddress }}</p>
        </div>
      </div>

      <!-- 活动列表 -->
      <van-list v-model="eventLoading" offset="200" :finished="eventFinished" loading-text="Loading" finished-text
        :immediate-check="true" @load="eventOnLoad">
        <van-cell :center="true" v-for="item in eventList" :key="item.eventId" @click="jumpToEventDetail(item.eventId)">
          <template #title>
            <img class="img" :src="item.eventBannerUrl" alt />
          </template>
          <template #default>
            <div class="title">{{ item.eventName }}</div>
            <div class="time fw500">{{ item.eventDate }}</div>
            <div class="desc fw500">{{ item.eventAddress }}</div>
          </template>
        </van-cell>
      </van-list>
    </div>
    <Sift class="siftShow" :SiftShow="SiftShow" @close="SiftShow = false"></Sift>
    <Overlay :overlayshow="overlayshow"></Overlay>
    <TabBar ref="tabbar"></TabBar>
  </div>
</template>
<script>
import Sift from '../../components/Sift.vue'
import TabBar from '../../components/TabBar.vue'
import Overlay from '../../components/Overlay.vue'
import methods from './src/methods'
export default {
  data() {
    return {
      SiftShow: false,
      TabActive: 1,
      eventLoading: false,
      eventFinished: false,
      overlayshow: false,
      currentPage: 1,
      pageSize: 20,
      type: 0, // 0 All， 1 Star， 2 Joined
      eventList: [],
      TabList: [
        {
          name: 'All',
          id: 1
        },
        {
          name: 'Star',
          id: 2
        },
        {
          name: 'Joined',
          id: 3
        },

      ]
    }
  },
  methods: methods,
  created() {
    this.getEventList()
  },
  components: {
    Sift,
    TabBar,
    Overlay
  }
}
</script>
<style lang="scss">
@import './sass/style.scss';
</style>