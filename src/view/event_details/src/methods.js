import { get } from '@/http/http.js'
import { Loader } from '@googlemaps/js-api-loader' //引入
import Clipboard from 'clipboard'
import { website } from '@/http/api.js'
import { Toast } from 'vant'
const loader = new Loader({
  apiKey: 'AIzaSyAgiV_tJwsbjj3twMIIQZ87f6Sz3SHWBg8', //之前的key
  version: 'weekly', //版本
  libraries: ['places'],
  language: 'en' // 设置地图显示的语言为英文
})

export default {
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
    const clipboard = new Clipboard('.label', {
      text: () => `${website}/#/e/${this.eventId}`
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

    loader
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
    let url =
      this.$api.infor.getCheck +
      `?eventId=${this.eventId}&latitude=${Number(this.eventDetail.latitude)}&longitude=${Number(
        this.eventDetail.longitude
      )}`
    get(url)
      .then(res => {
        const { code, data } = res
        console.log(res, 'res')
      })
      .catch(error => {})
    // if () {
    // this.successCheckShow = true
    // } else {
    // this.failCheckShow = true
    // }
  }
}
