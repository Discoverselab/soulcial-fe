/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, put, post } from '@/http/http'

let version = true
export default {
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
    return urls[Math.floor(Math.random() * urls.length)]
  },
  isUser() {
    return this.UserInfo.address.toLocaleUpperCase() === this.address.toLocaleUpperCase()
  },
  getUserInfo() {
    let url = this.$api.infor.getUserInfo
    get(url)
      .then(res => {
        if (res.code === 200) {
          this.UserInfo = res.data
          this.address = res.data.address
          window.localStorage.setItem('address', res.data.address)
          this.isUseInviteCode = res.data.isUseInviteCode
          const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
          this.usedInviteCode = loginInfo.usedInviteCode
          this.whiteUser = loginInfo.whiteUser

          if (this.inviteCode) {
            this.nuxt()
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  substring(address) {
    return address.substring(0, 6) + '...' + address.substring(address.length - 5, address.length)
  },

  // 查询是否已生成steam_id
  async checkSteamId(address) {
    this.overlayshow = true
    this.address = address
    let data = {
      loginType: this.loginType,
      address: address,
      particleType: this.preferredAuthType,
      refreshScore: version ? 1 : 0
    }
    let url = this.$api.login.checkSteamId
    get(url, data)
      .then(res => {
        if (res.code === 200) {
          this.$router.push('/congr')
        } else if (res.code === 400) {
          this.$router.push('/welcome')
        }
        this.overlayshow = false
      })
      .catch(error => {
        this.getUserInfo()
        this.inviteShow = error.msg
        this.overlayshow = false
      })
  },
  async nuxt() {
    let me = this
    me.overlayshow = true
    if (this.whiteUser || this.usedInviteCode || this.isUseInviteCode) {
      this.$router.push(`/twitterAuth`)
      return
    }
    let url = me.$api.infor.useInviteCode + '/' + me.inviteCode
    put(url)
      .then(res => {
        if (res.code === 200) {
          // 从活动分享页进入跳过绑推页
          if (this.$route.meta.specialFlag) {
            const code = this.$route.params.code
            const eventId = this.$route.params.id
            this.$router.push(`/e/${code}/${eventId}`)
          } else {
            // 进入绑推页面
            this.$router.push(`/twitterAuth`)
          }
        }
        me.overlayshow = false
      })
      .catch(error => {
        this.inviteShow = true
        this.errmsg = error.msg
        me.overlayshow = false
        return
      })
  }
}
