/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get } from '../../../http/http'
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
    //Randomly get a value from the array
    return urls[Math.floor(Math.random() * urls.length)]
  },
  toShare() {
    this.$router.push('/share')
  },
  getUserInfo() {
    let url = this.$api.infor.getUserInfo
    get(url)
      .then(res => {
        if (res.code === 200) {
          this.UserInfo = res.data
          let item = res.data
          this.values.push(item.charisma)
          this.values.push(item.courage)
          this.values.push(item.art)
          this.values.push(item.wisdom)
          this.values.push(item.energy)
          this.values.push(item.extroversion)
          localStorage.setItem('isUseInviteCode', res.data.isUseInviteCode)
          localStorage.setItem('userInfo', JSON.stringify(res.data))
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  toExplore() {
    this.$router.push('/')
  },
  getSoulSbtiStyle(soul) {
    const soulLength = String(soul).length
    const k = 0.0052
    return { fontSize: `${32 * k}rem` }
    // if (soulLength < 20) {
    //     const k = 0.0052;
    //     return { fontSize: `${(480 / soulLength) * k}rem` };
    // } else {
    //     const k = 0.0082;
    //     return { fontSize: `${(480 / soulLength) * k}rem` };
    // }
  }
}
