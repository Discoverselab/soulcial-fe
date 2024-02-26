/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from '../../../http/http'
export default {
  handleShowModal() {
    const isSafari = window.navigator.vendor === 'Apple Computer, Inc.'
    if (this._isMobile()) {
      if (isSafari) {
        if (!window.navigator.standalone) {
          this.handleShowPWA()
        }
      } else {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          this.handleShowPWA()
        }
      }
    }
  },
  handleShowPWA() {
    // 今天的日期
    let pwa_today = +new Date().getDate()
    // 本地存储的日期
    let pwa_day = window.localStorage.getItem('pwa_day')

    if (pwa_day && pwa_day != pwa_today) {
      window.localStorage.setItem('pwa_isShow', 'false')
    }
    window.localStorage.setItem('pwa_day', pwa_today)
    // 今日是否看过弹窗
    let pwa_isShow = window.localStorage.getItem('pwa_isShow') || 'false'
    // 弹窗总次数
    let pwa_count = window.localStorage.getItem('pwa_count') || 0

    // 判断总次数是否小于3
    if (pwa_count >= 3) return
    if (pwa_isShow == 'true') return

    let curTime = new Date().getTime()
    // 时间差
    let timeDiff = curTime - window.localStorage.getItem('firstApptime')
    if (timeDiff < 1000 * 30) return

    window.localStorage.setItem('pwa_isShow', 'true')
    // 弹窗次数加1
    window.localStorage.setItem('pwa_count', Number(pwa_count) + 1)
    // 展示弹窗
    this.pwaModalShow = true
  },
  _isMobile() {
    let flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
    return flag
  },
  changeTab(id, refresh) {
    // refresh 当TabActive===1 从tabbar切换时刷新数据
    if (this.TabActive === id && refresh !== 'refresh') return
    this.TabActive = id
    this.showBackground = false
    if (this.TabActive === 1) {
      this.finished = false
      this.nftList = []
      this.currentPage = 1
      this.pageType = 0
      this.getData()
    } else if (this.TabActive === 2) {
      this.finished = false
      this.nftList = []
      this.currentPage = 1
      this.pageType = 1
      this.getData()
    } else if (this.TabActive === 3) {
      this.activityFinished = false
      this.activityList = []
      this.currentPage = 1
      this.getActivityData(this.pickStatus)
    }
  },

  getActivityData(type) {
    this.pickStatus = type
    if (this.currentPage < 2) {
      this.overlayshow = true
    }
    let url =
      this.$api.nft.getActivePage +
      `?current=${this.currentPage}&size=${this.pageSize}&pickStatus=${this.pickStatus}`
    get(url)
      .then(res => {
        const { code, data } = res
        if (code === 200 && data.records && data.records.length > 0) {
          this.activityList = this.activityList.concat(data.records)
          // 加载状态结束
          this.activityLoading = false
          // 数据全部加载完成
          if (this.activityList.length >= data.total) {
            this.activityFinished = true
          }
        } else {
          // 加载状态结束
          this.activityLoading = false
        }
      })
      .catch(error => {})
      .finally(() => {
        this.overlayshow = false
      })
  },
  linkNftDetail(item) {
    if (item.eventId) {
      this.$router.push(`/event_details?eventId=${item.eventId}`)
    } else {
      this.$router.push(`/explore_details?id=${item.tokenId}&path=`)
    }
  },
  urls() {
    var urls = [
      'Label_01',
      'Label_02',
      'Label_03',
      'Label_04',
      'Label_05',
      'Label_06',
      'Label_07',
      'Label_08',
      'Label_09',
      'Label_10'
    ]
    //Randomly get a value from the array
    return urls[Math.floor(Math.random() * urls.length)]
  },
  getNFTLevels() {
    let url = this.$api.nft.getNFTLevel
    get(url)
      .then(res => {
        if (res.code === 200) {
          this.getNFTLevelList = res.data.records
        }
      })
      .catch(error => {})
  },
  pass(data) {
    this.orderColumn = data.orderColumn
    this.orderType = data.orderType
    this.nftList = []
    this.currentPage = 1
    this.getData()
  },
  getData() {
    if (this.currentPage < 2) {
      this.overlayshow = true
    }
    let url = this.$api.nft.getNFTPage
    let data = {
      current: this.currentPage,
      size: this.pageSize,
      orderColumn: this.orderColumn,
      orderType: this.orderType,
      pickStatus: 1,
      pageType: this.pageType
      // level:0,
      // match:1,
      // price:2,
      // likes:3,
      // listTime:4
    }
    get(url, data)
      .then(res => {
        const { data, code } = res
        if (data?.total === 0 || code !== 200) {
          this.showBackground = true
        }
        if (code === 200 && data.records && data.records.length > 0) {
          if (this.orderColumn == 4) {
            let randomNftList = data.records
            if (this.pageType === 0) {
              // forYou页面每五个随机排序
              randomNftList = this.getFiveRandomData(randomNftList)
              localStorage.setItem('NFT', JSON.stringify(randomNftList[0]))
            }
            if (this.pageType === 1) {
              // connected页面随机排序
              this.shuffleArray(randomNftList)
            }
            this.nftList = this.nftList.concat(randomNftList)
          } else {
            this.nftList = this.nftList.concat(data.records)
          }
          // 加载状态结束
          this.loading = false
          // 数据全部加载完成
          if (this.nftList.length >= data.total) {
            this.finished = true
          }
        } else {
          // 加载状态结束
          this.loading = false
        }
      })
      .catch(error => {})
      .finally(() => {
        this.overlayshow = false
      })
  },
  shuffleArray(array) {
    // 数据随机排序数组
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  },
  // 按照1-5、6-10、11-15、16-20的规则拆分数组
  getFiveRandomData(data) {
    let FiveRandomList = []
    for (let i = 0; i < data.length; i += 5) {
      const chunk = data.slice(i, i + 5)
      // 数据随机排序切割的数组
      this.shuffleArray(chunk)
      FiveRandomList.push(...chunk)
    }
    return FiveRandomList
  },
  onLoad() {
    this.currentPage++ // 更新页数
    this.getData()
  },
  onActivityLoad() {
    if (this.overlayshow) return
    this.currentPage++ // 更新页数
    this.getActivityData(this.pickStatus)
  },
  getSoulSbtiStyle(soul) {
    const soulLength = String(soul).length
    const k = 0.0052
    return { fontSize: `${(375 / soulLength) * k}rem` }
  }
}
