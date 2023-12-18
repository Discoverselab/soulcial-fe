<template>
  <div class="vsoul_lastweek">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" />
      <div class="nav_name">
        <p class="name">Last Week Leaderboard</p>
      </div>
      <div class="back"></div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Prize</th>
          <th>Name</th>
          <th>vSOUL</th>
        </tr>
        <tr style="backgroundColor: #51d27bb3;">
          <td>{{ vSoulRank.rank }}</td>
          <td>{{ vSoulPriceMap[vSoulRank.rank] || 0 }}</td>
          <td>{{ "You" }}</td>
          <td>{{ vSoulRank.vsoul ? +vSoulRank.vsoul : 0 }}</td>
        </tr>
        <tr v-for="item in vSoulRankList" :key="item.rank">
          <td>{{ item.rank }}</td>
          <td>{{ vSoulPriceMap[item.rank] }}</td>
          <td class="ellipsis username">{{ item.userName }}</td>
          <td>{{ item.vsoul ? +item.vsoul : 0 }}</td>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import { getLastWeekTime } from '@/utils/convertTime.js'
import { get } from '@/http/http'
import Overlay from '@/components/Overlay.vue'
export default {
  data() {
    return {
      vSoulPriceMap: {
        1: '$50',
        2: '$30',
        3: '$20',
        4: '$10',
        5: '$10',
        6: '$10',
        7: '$10',
        8: '$10',
        9: '$10',
        10: '$10'
      },
      vSoulRank: {},
      vSoulRankList: [],
      overlayshow: false
    }
  },
  methods: {
    getTime() {
      const { lastWeek, currentWeek } = getLastWeekTime()
      const formatLastWeek = lastWeek.format('YYYY-MM-DD hh:mm:ss')
      const formatCurrentWeek = currentWeek.format('YYYY-MM-DD hh:mm:ss')
      this.getVSoulRank(formatLastWeek, formatCurrentWeek)
    },
    // 获取排行榜
    getVSoulRank(formatLastWeek, formatCurrentWeek) {
      this.overlayshow = true
      let url = this.$api.infor.getVSoulRank
      if (formatLastWeek) {
        url = `${this.$api.infor.getVSoulRank}?requestThisMonday=${formatLastWeek}&&requestNextMonday=${formatCurrentWeek}`
      }
      get(url)
        .then(res => {
          if (res.code === 200) {
            this.vSoulRankList = res.data.rankList
            this.vSoulRank = res.data
          }
        })
        .catch(error => {})
        .finally(() => {
          this.overlayshow = false
        })
    }
  },
  created() {
    this.getTime()
  },
  comments: {
    Overlay
  }
}
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.vsoul_lastweek {
  padding: 20px 24px 0 24px;

  .back {
    display: block;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .navigate {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    top: 0px;
    z-index: 9;
    margin-bottom: 18px;

    .label {
      display: block;
      width: 16px;
      height: 16px;
    }

    .nav_name {
      display: flex;
      align-items: center;

      .userportrait {
        display: block;
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }

      .name {
        // text-transform: uppercase;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        color: #000;
      }

      .label {
        display: block;
        width: 16px;
        height: 16px;
      }
    }
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
    th,
    td {
      border: 1px solid #dddddd;
      text-align: center;
      padding: 8px 4px;
      font-size: 12px;
      .username {
        max-width: 150px;
      }
      .ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    th {
      font-weight: 700;
      text-align: center;
    }
  }
}
</style>