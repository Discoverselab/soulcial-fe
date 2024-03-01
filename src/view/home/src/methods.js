/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get } from '../../../http/http'
import Clipboard from 'clipboard'
import { Toast } from 'vant'

import { ethers } from 'ethers'

import IStorageProvider from '../../../libs/LocalStorageProvider'

const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null
//
export default {
  goTwitter(info) {
    if (info?.twitterStatus == 1) {
      window.open(`https://twitter.com/${this.UserInfo.twitterUserName}`)
    }
  },
  getNFTDetailSoul() {
    this.overlayshow = true

    let url = this.$api.nft.getNFTDetail + `?id=${this.UserInfoId}`
    get(url)
      .then(res => {
        if (res.code === 200) {
          console.log(res, 'res')
        }
        this.overlayshow = false
      })
      .catch(error => {
        this.overlayshow = false
      })
  },

  isUser() {
    return this.UserInfo.address.toLocaleUpperCase() === this.address.toLocaleUpperCase()
  },

  async contect() {
    //连接钱包
    const account = await window.ethereum.send('eth_requestAccounts')
    if (account.result.length) {
      this.address = account.result[0]
      this.myFollow()
    }
  },

  async checkLink() {
    //检查是否连接
    const accounts = await provider.listAccounts()
    console.log(accounts)
    if (accounts.length) {
      this.address = accounts[0]
      this.myFollow()
    } else {
      this.contect()
    }
  },

  FollList(type) {
    if (type == 1) {
      if (this.UserInfo.followers <= 0 || !this.UserInfo.followers) {
        this.$toast('No Followers at the moment')
        return
      } else {
        this.$router.push('/followers')
      }
    }
    if (type == 2) {
      if (this.UserInfo.following <= 0 || !this.UserInfo.following) {
        this.$toast('No following for the time being')
        return
      } else {
        this.$router.push('/following')
      }
    }
  },
  copy() {
    const clipboard = new Clipboard('.address', {
      text: () => this.$loginData.Auth_Token
    })
    clipboard.on('success', e => {
      Toast('Copy successfully')
    })
    clipboard.on('error', e => {
      Toast('No content')
    })
  },
  goPump() {
    this.$router.push('/')
  },
  goLaunch() {
    this.$router.push('/mint_select')
  },
  showLaunch() {
    if (this.UserInfo.twitterStatus === 0) {
      this.bindTwitterShow = true
    } else if (this.UserInfo.twitterStatus === 1) {
      if (this.UserInfo.mintStatus === 2) {
        this.$router.push('/mint_select')
      } else if (this.UserInfo.mintStatus === 1) {
        this.launchShow = true
      }
    }
  },
  substring(address) {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)
  },
  close() {
    this.$router.push('/')
  },
  save() {
    this.getUserInfo()
  },
  ConnectList() {
    this.$router.push(`/followers?id=${this.UserInfo.id}`)
  },
  getUserInfo() {
    let url = this.$api.infor.getUserInfo
    get(url)
      .then(res => {
        if (res.code === 200) {
          this.UserInfo = res.data
          let userTags = res.data.userTags
          this.TagsList = userTags ? userTags.split(',') : []
          let item = res.data
          this.values = []
          if (!item.levelScore) {
            // 没有分数默认雷达图
            this.noScore = true
            this.values.push(86)
            this.values.push(25)
            this.values.push(88)
            this.values.push(54)
            this.values.push(34)
            this.values.push(65)
            this.UserInfo = { ...this.UserInfo, level: 5, personality: 'Modest', chracter: 'ninja' }
          } else {
            this.values.push(item.charisma)
            this.values.push(item.courage)
            this.values.push(item.art)
            this.values.push(item.wisdom)
            this.values.push(item.energy)
            this.values.push(item.extroversion)
            setTimeout(() => {
              this.$refs.radar.init()
            }, 0)
          }
          localStorage.setItem('userInfo', JSON.stringify(this.UserInfo))
          // else {
          //   this.$router.push("/welcome");
          // }
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  tagShow() {
    this.$refs.taber.tagshos()
  },
  TabClick(id) {
    this.TabActive = id
    this.getMintedNFTPage(id)
  },
  getMintedNFTPage(type) {
    this.overlayshow = true
    let data = {
      current: 1,
      size: 99
    }
    let url =
      type == 1
        ? this.$api.infor.getMintedNFTPage
        : type == 2
          ? this.$api.infor.getCollectNFTPage
          : this.$api.infor.getPicksNFTPage
    this.NftList = []
    get(url, data)
      .then(res => {
        if (res.code === 200) {
          // this.NftList = res.data.records.filter(item => item.pickStatus !== 1) // 没有挂单的nft
          this.NftList = res.data.records // 全部nft
          if (type === 1) {
            localStorage.setItem('mintedNFTPage', JSON.stringify(this.NftList))
          }
        }
        this.overlayshow = false
      })
      .catch(error => {
        this.overlayshow = false
      })
  },
  Update() {
    let me = this
    me.overlayshow = true
    let url = this.$api.infor.updateUserScore
    get(url)
      .then(res => {
        if (res.code === 200) {
          this.getUserInfo()
        } else {
          this.$toast(res.msg)
        }
        me.overlayshow = false
      })
      .catch(error => {
        me.overlayshow = false
        this.$toast(error)
      })
  },
  getSoulSbtiStyle(soul) {
    const soulLength = String(soul).length
    const k = 0.0052
    return { fontSize: `${(500 / soulLength) * k}rem` }
  },
  showCenter() {
    this.$refs.radar.scoreLevelShow = true
  },
  jumpSettingBio(val) {
    if (!val) {
      this.$router.push(`/settingsBio?value=`)
    } else {
      return
    }
  }
}
