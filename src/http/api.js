// export const website = process.env.VUE_APP_BASE_API

export const website =
  process.env.VUE_APP_BUILD === 'production'
    ? 'https://app.soulcial.network'
    : 'https://api-test.soulcial.network'
const pwaWebsite = process.env.VUE_APP_BASE_API
const commonApi = process.env.VUE_APP_BASE_API + '/pfp/api/admin'

export default {
  login: {
    login: `${commonApi}/login/login`,
    checkSteamId: `${commonApi}/login/checkSteamId`,
    setTwitterUserInfo: `${commonApi}/login/setTwitterUserInfo`,
    twitterRedirect: `${commonApi}/login/twitterRedirect`,
    cancelTwitterBind: `${commonApi}/home/cancelTwitterBind`
  },
  nft: {
    getNFTPage: `${commonApi}/explor/getNFTPage`, //NFT paging
    getNFTDetail: `${commonApi}/explor/getNFTDetail`, //NFT details
    getNFTLevel: `${commonApi}/nft/getNFTLevel`, //NFT grade
    getMintPicture: `${commonApi}/nft/getMintPicture`, //Get pictures of casting NFT (return 6 pictures)
    mintFreeNft: `${commonApi}/nft/mintFreeNft`, //Launch
    collectNFT: `${commonApi}/explor/collectNFT`, //Buy NFT
    listNFTApprove: `${commonApi}/market/listNFT`, //Buy NFT
    cancelListNFT: `${commonApi}/home/cancelListNFT`, //取消出售
    collectNFTOnline: `${commonApi}/explor/collectNFTOnline`, //购买
    getNFTHistory: `${commonApi}/explor/getNFTHistory`, //NFT History
    getNFTPickInfo: `${commonApi}/pick/getNFTPickInfo`, //getNFTPickInfo
    pickNFT: `${commonApi}/pick/pickNFT`, //getNFTPickInfo
    cutAndUpload: `${commonApi}/AIGC/cutAndUpload`, //getNFTPickInfo
    getLastMintPictur: `${commonApi}/nft/getLastMintPictur`, //getNFTPickInfo
    prePickNFT: `${commonApi}/pick/prePickNFT`, //getNFTPickInfo
    getActivePage: `${commonApi}/explor/getActivePage` // 获取平台动态分页
  },
  infor: {
    useInviteCode: `${commonApi}/login/useInviteCode`, // 使用邀请码
    getInviteCodeList: `${commonApi}/home/getInviteCodes`, //获取用户的邀请码列表
    pickByInviteCode: `${commonApi}/home/pickByInviteCode`, // 使用邀请码pick
    addConnect: `${commonApi}/connect/subConnect`, // 发起加好友请求
    getConnectList: `${commonApi}/connect/list`, //获取好友请求列表
    fetchConfirmConnect: `${commonApi}/connect/confirm`, //确认好友请求
    fetchCancelConnect: `${commonApi}/connect/cancel`, //取消好友请求
    getUserInfo: `${commonApi}/home/getUserInfo`, //Get user information
    getMintedNFTPage: `${commonApi}/home/getMintedNFTPage`, //My Launch list
    getCollectNFTPage: `${commonApi}/home/getCollectNFTPage`, //I bought a list.
    setUserStreamId: `${commonApi}/home/setUserStreamId`, //setUserStreamId
    updateUserScore: `${commonApi}/home/updateUserScore`, //setUserStreamId
    followUser: `${commonApi}/home/followUser`, //setUserStreamId
    getFollowers: `${commonApi}/home/getFollowers`, //被关注列表
    getFollowing: `${commonApi}/home/getFollowing`, //关注列表
    setUserInfo: `${commonApi}/home/setUserInfo`, //设置用户信息
    getTagsList: `${commonApi}/home/getTagsList`, //获取用户标签选项list（Tags）
    setUserTags: `${commonApi}/home/setUserTags`, //设置用户标签(1到12,多个用逗号隔开)
    getPicksNFTPage: `${commonApi}/home/getPicksNFTPage`,
    addWallectHistory: `${commonApi}/wallect/addWallectHistory`,
    getWallectHistory: `${commonApi}/wallect/getWallectHistory`,
    getVSoulBalance: `${commonApi}/wallect/getVSoulBalance`,
    getVSoulHistory: `${commonApi}/wallect/getVSoulHistory`,
    getNFTMood: `${commonApi}/nft/getNFTMood`, //Mood下拉
    getNFTColor: `${commonApi}/nft/getNFTColor`, //Color下拉
    getNFTPersonality: `${commonApi}/nft/getNFTPersonality`, //角色下拉
    getFansRank: `${commonApi}/home/getFansRank`, //获取粉丝排行榜
    pictureUpload: `${commonApi}/AIGC/pictureUpload`, //上传图片
    getSearchList: `${commonApi}/explor/indexSearch`, // 首页搜索
    getVSoulRank: `${commonApi}/wallect/getVSoulRank` //vSOUL排行榜
  },
  chat: {
    getUserMessage: `${commonApi}/message/getUserMessage`,
    getRewardInfo: `${commonApi}/message/getRewardInfo`,
    getChatDetail: `${commonApi}/message/chat/detail`,
    getChatList: `${commonApi}/message/chat/list`,
    fetchUpload: `${commonApi}/message/chat/upload`
  },
  pwa: {
    fetchSubscribe: `${pwaWebsite}/pfp/api/notification/subscribe`
  }
}
