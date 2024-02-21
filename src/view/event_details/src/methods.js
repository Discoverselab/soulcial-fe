import { Loader } from '@googlemaps/js-api-loader' //引入
const loader = new Loader({
  apiKey: 'AIzaSyAgiV_tJwsbjj3twMIIQZ87f6Sz3SHWBg8', //之前的key
  version: 'weekly', //版本
  libraries: ['places'],
  language: 'en' // 设置地图显示的语言为英文
})

export default {
  // 是否是手机类型
  _isPhoneMobile() {
    let flag = navigator.userAgent.match(
      /(phone|pod|iPhone|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
    return flag
  },
  initMap() {
    let center = { lat: 40.7128, lng: -74.006 } //地图中心点
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
  },
  // 签到
  check() {
    // if () {
    // this.successCheckShow = true
    // } else {
    this.failCheckShow = true
    // }
  }
}
