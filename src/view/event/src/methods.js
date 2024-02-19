import { get, post } from '../../../http/http'
export default {
  changeTab(id) {
    this.TabActive = id
  },
  jumpToEventDetail() {},
  onActivityLoad() {
    if (this.overlayshow) return
    this.currentPage++ // 更新页数
  }
}
