import { ParticleNetwork, WalletEntryPosition } from '@particle-network/auth'
import { ParticleProvider } from '@particle-network/provider'
import { customStyle } from './customstyle.js'
import router from '@/router'
import Web3 from 'web3'
import loginData from '@/libs/loginData'
import Clipboard from 'clipboard'
import { ethers } from 'ethers'
import { closeWebsocket } from '@/socket/socket'
export const isPROD = process.env.VUE_APP_BUILD === 'production'
export const browser = isPROD
  ? 'https://optimistic.etherscan.io/tx/'
  : 'https://goerli-optimism.etherscan.io/tx/'
// nft合约地址
export const nftAddress = isPROD
  ? '0xB39c5896A94287B9c0Bce736e505234b685c0E02'
  : '0x064cCfc36627c89eaAc61A4a9F4d18f1A4a38bdF'
// 用来判断是否是旧的交易所合约地址
const oldMarketAddress = isPROD
  ? []
  : ['0xA2a7DBD81B1935e14C3dFBed8D5446FDA815C291', '0x1aa7171e9add41f0313ce09308cef70c07a58c87']
// // 交易所合约地址
// export const marketAddress = isPROD
//   ? "0xE575480af98B522BAcac422c9516D64f7492BEE6"
//   : "0xA2a7DBD81B1935e14C3dFBed8D5446FDA815C291";

export const ABIAddress = '0x4200000000000000000000000000000000000006'

// particle Info
export const projectId = '07962ac6-fde2-4363-82af-9eacc9b6ada5'
export const clientKey = 'cT8A9u0bPUBmP7mKLPhy3lkhbWlv2hcbyFmsau4Z'
export const appId = '47102ab8-d9f6-41b4-87f8-7b5f07072963'
export const chainList = isPROD
  ? [
      { id: 10, name: 'optimism' },
      { id: 420, name: 'optimism' },
      { id: 1, name: 'Ethereum' },
      { id: 5, name: 'Ethereum' }
    ]
  : [
      { id: 420, name: 'optimism' },
      { id: 10, name: 'optimism' },
      { id: 1, name: 'Ethereum' },
      { id: 5, name: 'Ethereum' }
    ]

export const linkOpen = (type, has) => {
  window.open(`${browser}${has}`)
}

// addChain_Params
const _10to16 = num => '0x' + Number(num).toString(16)
const _16to10 = num => parseInt(num, 10)
const handleChainId = n => (n.includes('0x') ? n : _10to16(n))

const CHAINID = isPROD ? '0xa' : '0x1a4'

const CHAIN_NAME = isPROD ? 'Optimism' : 'Optimism Goerli'

const CHAIN_SYMBOL = 'ETH'

const RPC_URL = isPROD ? 'https://mainnet.optimism.io' : 'https://goerli.optimism.io'

const blockExplorerUrls = isPROD
  ? 'https://explorer.optimism.io'
  : 'https://goerli-explorer.optimism.io'

export const addChain_Params = {
  chainId: handleChainId(CHAINID),
  chainName: CHAIN_NAME,
  nativeCurrency: {
    name: CHAIN_NAME,
    symbol: CHAIN_SYMBOL,
    decimals: 18
  },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: [blockExplorerUrls],
  iconUrls: ['']
}

export const clearInfo = () => {
  // 清除登录信息
  loginData.out()
  window.localStorage.removeItem('loginInfo')
  localStorage.removeItem('isUseInviteCode')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('mintedNFTPage')
  localStorage.removeItem('NFT')
  router.replace('/')
  window.localStorage.setItem('Sift', '4down')
  closeWebsocket()
}

// particle 登录
export const onParticle = async (callback, preferredAuthType = 'google', errCallback) => {
  try {
    window.particle = new ParticleNetwork({
      projectId,
      clientKey,
      appId,
      chainName: chainList[0].name,
      chainId: chainList[0].id,
      wallet: {
        displayWalletEntry: true,
        defaultWalletEntryPosition: WalletEntryPosition.BR,
        uiMode: 'light',
        displayCloseButton: true,
        supportChains: chainList,
        customStyle
      }
    })
    const particleProvider = new ParticleProvider(window.particle.auth)
    window.web3 = new Web3(particleProvider)

    window.sessionStorage.setItem('particle', JSON.stringify(window.particle))

    let userInfo = null
    if (!window.particle.auth.isLogin()) {
      // support auth types: email,phone,facebook,google,apple,discord,github,twitch,microsoft,linkedin
      userInfo = await window.particle.auth.login({
        preferredAuthType: preferredAuthType,
        supportAuthTypes: 'email,phone,google', //need support social login types, split with ','. default value 'all'.
        socialLoginPrompt: 'consent' //social login prompt.  none | consent | select_account
      })
    } else {
      userInfo = await window.particle.auth.getUserInfo()
    }

    // listen connect event
    window.particle.auth.on('connect', userInfo => {
      console.log('particle userInfo', userInfo)
    })

    // listen disconnect event
    window.particle.auth.on('disconnect', () => {
      console.log('particle disconnect')
    })

    // listen chainChanged event
    window.particle.auth.on('chainChanged', chain => {
      console.log('particle chainChanged', chain)
    })

    callback && callback()
  } catch (error) {
    console.log('🔥🔥🔥🚀 ~ file: methods.js:43 ~ error:', error)
    errCallback && errCallback()
    clearInfo()
  }
}

//  打开particle钱包
export const goParticle = function () {
  if (!loginData.loginType) return
  if (loginData.Auth_Token && !window.particle) {
    onParticle(goParticle)
    return
  }
  try {
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f5f5ee')
    const url = window.particle.buildWalletUrl({
      topMenuType: 'close',
      mode: 'iframe'
    })
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.position = 'fixed'
    iframe.style.top = '0'
    iframe.style.left = '0'
    iframe.style.zIndex = '999999999'
    iframe.style.border = 'none'

    let barCont = document.getElementById('barCont')
    // iframe插入页面
    document.body.appendChild(iframe)
    if (barCont) {
      barCont.style.display = 'none'
    }

    // //if topMenuType is "close"
    window.addEventListener('message', event => {
      if (event.data === 'PARTICLE_WALLET_CLOSE_IFRAME') {
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#fff')
        iframe && document.body.removeChild(iframe)
        if (barCont) {
          barCont.style.display = 'flex'
        }
      }
    })
  } catch (error) {
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#fff')
    console.log('🔥🔥🔥🚀 ~ file: common.js:150 ~ error:', error)
    clearInfo()
  }
}
export const getHeight = function (vm) {
  vm.$nextTick(() => {
    let clientWidth = document.documentElement.clientWidth
    let k = 1
    if (clientWidth <= 750) {
      k = clientWidth / (390 / 340)
    } else if (clientWidth > 750) {
      k = clientWidth / (1000 / 265)
    }
    const imageDom = document.getElementById('pfpNft')
    imageDom.onload = () => {
      console.log('imageDom', imageDom.offsetHeight, k)
      vm.height = imageDom.offsetHeight
      vm.flippedShow = vm.height < k
    }
    vm.flippedShow = vm.height < k
  })
}

export const copy = function (data) {
  const clipboard = new Clipboard('.copy-button', {
    text: () => `${data}`
  })
  clipboard.on('success', e => {
    this.$toast('Copy successfully')
  })
  clipboard.on('error', e => {
    this.$toast('No content')
  })
}

export const formatNumber = number => {
  if (Number.isInteger(number)) {
    return number.toString() // 如果是整数，直接返回
  } else {
    const roundedNumber = Math.round(number * 1000000) / 1000000 // 四舍五入到4位小数
    const decimalPlaces = roundedNumber.toString().split('.')[1] // 获取小数部分
    if (decimalPlaces && decimalPlaces.length > 6) {
      return roundedNumber.toFixed(6) // 如果小数位超过4位，保留4位小数
    } else {
      return roundedNumber.toString() // 如果小数位不超过4位，展示实际位数
    }
  }
}

const handleBalance = balance => {
  let etherString = formatNumber(ethers.utils.formatEther(balance))
  return String(parseFloat(etherString).toFixed(5)) || 0
}
// 获取主链币钱包余额
export const fetchBalance = async () => {
  let address = loginData.Auth_Token
  let provider = null
  let balanceRemain = 0
  if (loginData.loginType == 0) {
    provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null
    await provider.getBalance(address).then(balance => {
      balanceRemain = handleBalance(balance)
    })
  } else {
    if (window.web3.eth) {
      await window.web3.eth?.getBalance(address, (err, balance) => {
        if (!err) {
          balanceRemain = handleBalance(balance)
        }
      })
    } else {
      const curParticle = JSON.parse(window.sessionStorage.getItem('particle'))
      if (curParticle) {
        await onParticle()
        await window.web3.eth?.getBalance(address, (err, balance) => {
          if (!err) {
            balanceRemain = handleBalance(balance)
          }
        })
      } else {
        clearInfo()
      }
    }
  }
  return balanceRemain
}
// 是否是旧的交易所合约地址
export const isOldMarketAddress = marketAddress => {
  const upperOldMarketAddress = oldMarketAddress.map(item => item.toLocaleUpperCase())
  const num = upperOldMarketAddress.indexOf(marketAddress.toLocaleUpperCase())
  if (num > -1) {
    return true
  } else {
    return false
  }
}
