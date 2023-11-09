const api = process.env.VUE_APP_BASE_API

export const website = api

export default {
    login: {
        login: `${api}pfp/api/admin/login/login`,
        checkSteamId: `${api}pfp/api/admin/login/checkSteamId`,
        setTwitterUserInfo: `${api}pfp/api/admin/login/setTwitterUserInfo`,
        twitterRedirect: `${api}pfp/api/admin/login/twitterRedirect`,
        cancelTwitterBind: `${api}pfp/api/admin/home/cancelTwitterBind`,
    },
    nft: {
        getNFTPage: `${api}pfp/api/admin/explor/getNFTPage`, //NFT paging
        getNFTDetail: `${api}pfp/api/admin/explor/getNFTDetail`, //NFT details
        getNFTLevel: `${api}pfp/api/admin/nft/getNFTLevel`, //NFT grade
        getMintPicture: `${api}pfp/api/admin/nft/getMintPicture`, //Get pictures of casting NFT (return 6 pictures)
        mintFreeNft: `${api}pfp/api/admin/nft/mintFreeNft`, //Launch
        collectNFT: `${api}pfp/api/admin/explor/collectNFT`, //Buy NFT
        listNFTApprove: `${api}pfp/api/admin/market/listNFT`, //Buy NFT
        cancelListNFT: `${api}pfp/api/admin/home/cancelListNFT`, //取消出售
        collectNFTOnline: `${api}pfp/api/admin/explor/collectNFTOnline`, //购买
        getNFTHistory: `${api}pfp/api/admin/explor/getNFTHistory`, //NFT History
        getNFTPickInfo: `${api}pfp/api/admin/pick/getNFTPickInfo`, //getNFTPickInfo
        pickNFT: `${api}pfp/api/admin/pick/pickNFT`, //getNFTPickInfo
        cutAndUpload: `${api}pfp/api/admin/AIGC/cutAndUpload`, //getNFTPickInfo
        getLastMintPictur: `${api}pfp/api/admin/nft/getLastMintPictur`, //getNFTPickInfo
        prePickNFT: `${api}pfp/api/admin/pick/prePickNFT`, //getNFTPickInfo
        getActivePage: `${api}pfp/api/admin/explor/getActivePage` // 获取平台动态分页
    },
    infor: {
        useInviteCode: `${api}pfp/api/admin/login/useInviteCode`,  // 使用邀请码
        getInviteCodeList: `${api}pfp/api/admin/home/getInviteCodes`,  //获取用户的邀请码列表
        pickByInviteCode: `${api}pfp/api/admin/home/pickByInviteCode`, // 使用邀请码pick
        addConnect: `${api}pfp/api/admin/connect/subConnect`, // 发起加好友请求
        getConnectList: `${api}pfp/api/admin/connect/list` , //获取好友请求列表
        fetchConfirmConnect: `${api}pfp/api/admin/connect/confirm` , //确认好友请求
        fetchCancelConnect: `${api}pfp/api/admin/connect/cancel` , //取消好友请求
        getUserInfo: `${api}pfp/api/admin/home/getUserInfo`, //Get user information
        getMintedNFTPage: `${api}pfp/api/admin/home/getMintedNFTPage`, //My Launch list
        getCollectNFTPage: `${api}pfp/api/admin/home/getCollectNFTPage`, //I bought a list.
        setUserStreamId: `${api}pfp/api/admin/home/setUserStreamId`, //setUserStreamId
        updateUserScore: `${api}pfp/api/admin/home/updateUserScore`, //setUserStreamId
        followUser: `${api}pfp/api/admin/home/followUser`, //setUserStreamId
        getFollowers: `${api}pfp/api/admin/home/getFollowers`, //被关注列表
        getFollowing: `${api}pfp/api/admin/home/getFollowing`, //关注列表
        setUserInfo: `${api}pfp/api/admin/home/setUserInfo`, //设置用户信息
        getTagsList: `${api}pfp/api/admin/home/getTagsList`, //获取用户标签选项list（Tags）
        setUserTags: `${api}pfp/api/admin/home/setUserTags`, //设置用户标签(1到12,多个用逗号隔开)
        getPicksNFTPage: `${api}pfp/api/admin/home/getPicksNFTPage`,
        addWallectHistory: `${api}pfp/api/admin/wallect/addWallectHistory`,
        getWallectHistory: `${api}pfp/api/admin/wallect/getWallectHistory`,
        getVSoulBalance: `${api}pfp/api/admin/wallect/getVSoulBalance`,
        getVSoulHistory: `${api}pfp/api/admin/wallect/getVSoulHistory`,
        getNFTMood: `${api}pfp/api/admin/nft/getNFTMood`, //Mood下拉
        getNFTColor: `${api}pfp/api/admin/nft/getNFTColor`, //Color下拉
        getNFTPersonality: `${api}pfp/api/admin/nft/getNFTPersonality`, //角色下拉
        getFansRank: `${api}pfp/api/admin/home/getFansRank`, //获取粉丝排行榜
        pictureUpload: `${api}pfp/api/admin/AIGC/pictureUpload`, //上传图片
        getSearchList: `${api}pfp/api/admin/explor/indexSearch`  // 首页搜索
    },
    chat: {
        getUserMessage: `${api}pfp/api/admin/message/getUserMessage`,
        getRewardInfo: `${api}pfp/api/admin/message/getRewardInfo`,
        getChatDetail: `${api}pfp/api/admin/message/chat/detail`,
        getChatList: `${api}pfp/api/admin/message/chat/list`,
        fetchUpload: `${api}/pfp/api/admin/message/chat/upload`,
    }
}