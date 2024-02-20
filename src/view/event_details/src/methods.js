import { Loader } from '@googlemaps/js-api-loader' //引入
const loader = new Loader({
  apiKey: 'AIzaSyAgiV_tJwsbjj3twMIIQZ87f6Sz3SHWBg8', //之前的key
  version: 'weekly', //版本
  libraries: ['places']
})

export default {
  initMap() {
    let center = { lat: 40.7128, lng: -74.006 } //地图中心店
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
      })
      .catch(e => {
        // do something
        console.log(e)
      })
  },
  check() {
    // if () {
    // this.successCheckShow = true
    // } else {
    this.failCheckShow = true
    // }
  }
}
