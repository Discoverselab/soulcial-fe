import { get } from '../../../http/http'
import html2canvas from 'html2canvas'
import QRCode from 'qrcodejs2'
import Clipboard from 'clipboard'
import { Toast } from 'vant'
import { website } from '@/http/api.js'
export default {
  goBack() {
    let path = this.$route.query.path || ''
    if (path) {
      this.$router.push('/')
    } else {
      this.$router.go(-1)
    }
  },
  captureAndSave() {
    this.overlayshow = true
    this.$nextTick(() => {
      setTimeout(() => {
        // 使用HTML2Canvas捕捉元素
        html2canvas(document.querySelector('#elementToCapture'), {
          backgroundColor: '#ffffff',
          allowTaint: true,
          useCORS: true,
          scale: 4
        }).then(canvas => {
          var base64ToBlob = function (code) {
            let parts = code.split(';base64,')
            let contentType = parts[0].split(':')[1]
            let raw = window.atob(parts[1])
            let rawLength = raw.length
            let uInt8Array = new Uint8Array(rawLength)
            for (let i = 0; i < rawLength; ++i) {
              uInt8Array[i] = raw.charCodeAt(i)
            }
            return new Blob([uInt8Array], {
              type: contentType
            })
          }
          const res = canvas.toDataURL('image/png')
          let blob = base64ToBlob(res)
          let a = document.createElement('a')
          let event = new MouseEvent('click')
          a.download = 'soulcial.png'
          a.href = URL.createObjectURL(blob)
          a.dispatchEvent(event)
          this.overlayshow = false
        })
      }, 50)
    })
  },

  shareTiwtter() {
    const url = `${website}/#/t/${this.code}\n`
    const text = `My SOUL in Web3 is ${this.UserInfo.personality} ${this.UserInfo.chracter}\n\nCome and Connect to me on @SoulcialGlobal\n${url}\n`
    const hashtags = 'Soulcial #SocialFi #Web3'
    const intentUrl =
      'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent(text) +
      '&hashtags=' +
      encodeURIComponent(hashtags)
    window.open(intentUrl, '_blank', 'width=550,height=420')
  },
  copy() {
    const clipboard = new Clipboard('.copy', {
      text: () => `${website}/#/t/${this.code}`
    })
    clipboard.on('success', e => {
      Toast('Copy successfully')
    })
    clipboard.on('error', e => {
      Toast('No content')
    })
  }
}
