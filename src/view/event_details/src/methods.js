import { get } from '@/http/http.js'
import { Loader } from '@googlemaps/js-api-loader' //引入
import Clipboard from 'clipboard'
import { website } from '@/http/api.js'
import { Toast } from 'vant'
import dayjs from 'dayjs'
export default {
  back() {
    // 获取路由元信息
    const isShareEvent = this.$route.meta.isShareEvent
    if (isShareEvent) {
      this.$router.push('/')
    } else {
      this.$router.go(-1)
    }
  },
  walletClose() {
    this.walletShow = false
  },
  createLoader() {
    if (this.googleMapsKey) {
      this.loader = new Loader({
        apiKey: this.googleMapsKey,
        version: 'weekly',
        libraries: ['places'],
        language: 'en'
      })
    }
  },
  // 获取谷歌地图key
  async getGoogleMapsKey() {
    try {
      this.overlayshow = true
      let url = this.$api.infor.getGoogleMapsKey
      const res = await get(url)
      const { code, data } = res
      if (code === 200) {
        this.googleMapsKey = data
      }
      this.overlayshow = false
    } catch (error) {
      // 错误处理
      console.error(error)
      this.overlayshow = false
    }
  },
  jumpToChat(detail) {
    this.$router.push(`conversation?id=${detail.chatOverviewId}&&eventBanner=${detail.eventBanner}`)
  },
  getUserPos() {
    var _this = this
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        //locationSuccess 获取成功的话
        function (position) {
          _this.userLon = position.coords.longitude
          _this.userLat = position.coords.latitude
        },
        //locationError  获取失败的话
        function (error) {
          alert(error)
        }
      )
    }
    console.log('获取用户当前位置')
  },
  // 是否是活动时间
  isEventTime() {
    // 获取当前时间
    const currentTime = dayjs()
    // 活动开始时间
    const startTime = dayjs(this.eventDetail.startTime)
    // 活动结束时间
    const endTime = dayjs(this.eventDetail.endTime)
    // 活动结束的下一天的午夜
    const nextDayMidnight = endTime.add(1, 'day').startOf('day')
    startTime.startOf('day')
    // 如果当前时间晚于活动开始的当天的午夜，且早于活动结束的下一天的午夜，则设置 showCheck 为 true
    if (currentTime.isAfter(startTime.startOf('day')) && currentTime.isBefore(nextDayMidnight)) {
      this.showCheck = true
    } else {
      this.showCheck = false
    }
  },
  // 复制活动地址
  copyAddress() {
    const clipboard = new Clipboard('.copyAddress', {
      text: () => this.eventDetail.eventAddress
    })
    clipboard.on('success', e => {
      Toast('Copy successfully')
    })
    clipboard.on('error', e => {
      Toast('No content')
    })
  },
  //  获取活动详情
  async getEventDetail() {
    try {
      this.overlayshow = true
      let url = this.$api.infor.getEventDetail + `?eventId=${this.eventId}`
      const res = await get(url)
      const { code, data } = res
      if (code === 200) {
        this.eventDetail = data
        this.collectSuccess = this.eventDetail.isStar
      }
      this.overlayshow = false
    } catch (error) {
      // 错误处理
      console.error(error)
      this.overlayshow = false
    }
  },
  // 转发
  forward() {
    const inviteCode = window.sessionStorage.getItem('inviteCode')
    const clipboard = new Clipboard('.labelEvent', {
      text: () => `${website}/#/e/${inviteCode}/${this.eventId}`
    })
    clipboard.on('success', e => {
      Toast('Copy successfully')
    })
    clipboard.on('error', e => {
      Toast('No content')
    })
  },
  // 是否是手机类型
  _isPhoneMobile() {
    let flag = navigator.userAgent.match(
      /(phone|pod|iPhone|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
    return flag
  },
  initMap() {
    const lat = Number(this.eventDetail.latitude)
    const lng = Number(this.eventDetail.longitude)
    let center = { lat: lat, lng: lng } //地图中心点
    const mapOptions = {
      center: center,
      zoom: 12,
      disableDefaultUI: true
    }

    this.loader
      .load()
      .then(google => {
        const map = new google.maps.Map(document.getElementById('mapBox'), mapOptions)
        // 在地图上添加标记
        new google.maps.Marker({
          position: center,
          map: map
        })

        // 添加点击事件监听器
        map.addListener('click', function (event) {
          // 获取点击位置的经纬度
          const lat = event.latLng.lat()
          const lng = event.latLng.lng()

          // 构建 Google 地图 URL
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

          // 使用 <a> 标签在新标签页中打开 Google 地图
          const googleMapsLink = document.createElement('a')
          googleMapsLink.href = googleMapsUrl
          googleMapsLink.target = '_blank'
          document.body.appendChild(googleMapsLink)
          googleMapsLink.click()
        })
      })
      .catch(e => {
        // 处理加载地图失败的情况
        console.log(e)
      })
  },
  // 收藏
  collectToggle() {
    this.collectSuccess = !this.collectSuccess
    if (this.collectSuccess) {
      // 收藏活动
      let url = this.$api.infor.getCollect + `?eventId=${this.eventId}`
      get(url)
        .then(res => {
          Toast('collect successfully')
        })
        .catch(error => {
          Toast('something wrong')
        })
    } else {
      // 取消收藏
      let url = this.$api.infor.getUnCollect + `?eventId=${this.eventId}`
      get(url)
        .then(res => {
          Toast('unCollect successfully')
        })
        .catch(error => {
          Toast('something wrong')
        })
    }
  },
  // 签到
  check() {
    if (!this.$loginData.Auth_Token || (this.$loginData.loginType == 1 && !window?.web3?.eth)) {
      return (this.walletShow = true)
    }
    let url =
      this.$api.infor.getCheck +
      `?eventId=${this.eventId}&latitude=${Number(this.userLat)}&longitude=${Number(this.userLon)}`
    get(url)
      .then(res => {
        const { code, data } = res
        if (code === 200) {
          this.successCheckShow = true
        } else {
          this.failCheckShow = true
        }
      })
      .catch(error => {
        Toast('something wrong')
      })
  },
  // 跳往外部链接
  jumpToOutside() {
    window.open(this.eventDetail.link, '_blank')
  }
}
