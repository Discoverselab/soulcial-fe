import { get } from '@/http/http.js'

export default {
  // 获取活动列表
  getEventList() {
    if (this.currentPage < 2) {
      this.overlayshow = true
    }
    let url =
      this.$api.infor.getEventList +
      `?current=${this.currentPage}&size=${this.pageSize}&type=${this.type}`
    get(url)
      .then(res => {
        const { code, data } = res
        // 没有活动时展示默认图片
        if (code === 200 && data.total === 0) this.showNoEvent = true
        if (code === 200 && data.records && data.records.length > 0) {
          this.eventList = this.eventList.concat(data.records)
          this.eventLoading = false
          // 数据全部加载完成
          if (this.eventList.length >= data.total) {
            this.eventFinished = true
          }
        } else {
          // 加载状态结束
          this.eventLoading = false
        }
        this.overlayshow = false
      })
      .catch(error => {
        this.overlayshow = false
      })
  },
  changeTab(item) {
    this.showNoEvent = false
    this.TabActive = item.id
    this.eventList = []
    this.currentPage = 1
    this.eventFinished = false
    if (item.name === 'All') {
      this.type = 0
    } else if (item.name === 'Star') {
      this.type = 1
    } else {
      this.type = 2
    }
    this.getEventList()
  },
  jumpToEventDetail(id) {
    this.$router.push(`/event_details?eventId=${id}`)
  },
  eventOnLoad() {
    if (this.overlayshow) return
    this.currentPage++ // 更新页数
    this.getEventList()
  }
}
