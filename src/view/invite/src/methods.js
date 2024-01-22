import Clipboard from 'clipboard'
import { Toast } from 'vant'
import { get } from '../../../http/http'
export default {
  // 去往earn页面
  jumpToEarn() {
    this.$router.push('/earn')
  },
  getInviteCodeList() {
    this.overlayshow = true
    let url = this.$api.infor.getInviteCodeList
    get(url)
      .then(res => {
        if (res.code === 200) {
          this.inviteCodeList = res.data
          this.overlayshow = false
        }
      })
      .catch(error => {
        this.overlayshow = false
        // this.$toast(error)
      })
  },
  copy(code, vv) {
    const clipboard = new Clipboard(vv, {
      text: () => code
    })
    clipboard.on('success', e => {
      Toast('Copy successfully')
    })
    clipboard.on('error', e => {
      Toast('No content')
    })
  },
  jumpEarn() {
    this.$router.push('/earn')
  }
}
