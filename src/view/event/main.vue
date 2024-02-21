<template>
  <div class="event">
    <!-- Tab -->
    <div class="TabCont">
      <div class="Tab_left">
        <div class="Tab_list" @click="changeTab(item.id)" :class="{
          Tab_list_Active: TabActive == item.id,
        }" v-for="(item, index) in TabList" :key="index">{{ item.name }}</div>
      </div>
      <div class="Tab_right">
        <img src="../../assets/sift.png" @click="SiftShow = true" alt />
        <img class="searchImg" src="@/assets/search.png" @click="$router.push('/search')" alt />
      </div>
    </div>
    <div>
      <!-- all下显示banner -->
      <div v-if="TabActive === 1">
        <img class="banner" src="@/assets/eventActive1.png" alt />
        <div class="detail">
          <h1 class="title">HongKong Web3 Festival</h1>
          <p class="time fw500">Apr 7 at 10:00 (UTC+8)</p>
          <p class="desc fw500">HKCEC HALL3FG</p>
        </div>
      </div>

      <!-- 活动列表 -->
      <van-list v-model="allLoading" offset="200" :finished="allFinished" loading-text="Loading" finished-text
        :immediate-check="true" @load="allOnLoad">
        <van-cell :center="true" v-for="item in allList" :key="item.id" @click="jumpToEventDetail">
          <template #title>
            <img class="img" src="@/assets/eventActive1.png" alt />
          </template>
          <template #default>
            <div class="title">{{ item.title }}</div>
            <div class="time fw500">{{ item.time }}</div>
            <div class="desc fw500">{{ item.desc }}</div>
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
      allLoading: false,
      allFinished: false,
      overlayshow: false,
      currentPage: 1,
      pageSize: 20,
      allList: [
        {
          id: 1,
          title: 'HongKong Web3 Festival',
          time: 'Apr 7 at 10:00 (UTC+8)',
          desc: 'Cyberport, HongKong'
        },
        {
          id: 2,
          title: 'HongKong Web3 Festival',
          time: 'Apr 7 at 10:00 (UTC+8)',
          desc: 'Cyberport, HongKong'
        },
        {
          id: 3,
          title: 'HongKong Web3 Festival',
          time: 'Apr 7 at 10:00 (UTC+8)',
          desc: 'Cyberport, HongKong'
        }
      ],
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