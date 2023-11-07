/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import {
    get,
} from '../../../http/http'
import { Toast } from 'vant';
export default {
    getLastMintPictur() {
        this.overlayshow = true
        let url = this.$api.nft.getLastMintPictur
        get(url)
            .then((res) => {
                if (res.code === 200) {
                    this.NftList = res.data
                } else if (res.code === 400) {
                    let me = this
                    me.getData()
                }
                this.overlayshow = false
            })
            .catch((error) => {
                let me = this
                this.overlayshow = false
                me.getData()
                // this.$toast("Sorry, something went wrong. Please try again.");
                // setTimeout(() => {
                // }, 2000)
            });
    },
    getData() {
        this.overlayshow = true
        let data = this.$route.query
        let url = this.$api.nft.getMintPicture
        get(url, data)
            .then((res) => {
                if (res.code === 200) {
                    this.NftList = res.data
                } else if (res.code === 400) {
                    let me = this
                    this.$toast("Sorry, something went wrong. Please try again.");
                    setTimeout(() => {
                        me.$router.go(-1)
                    }, 2000)
                }
                this.overlayshow = false
            })
            .catch((error) => {
                let me = this
                this.overlayshow = false
                this.$toast("Sorry, something went wrong. Please try again.");
                setTimeout(() => {
                    me.$router.go(-1)
                }, 2000)
            });
    },
    ticks(item, index) {
        this.pictureUrl = item.pictureUrl
        this.squarePictureUrl = item.squarePictureUrl
        this.colorAttribute = item.colorAttribute
        this.mood = item.mood
        this.color = item.color
        this.active = index
    },
    nuxt() {
        if (this.active === 99) {
            Toast('Please choose what you like.')
            return
        }
        let data = this.$route.query
        data.pictureUrl = this.pictureUrl
        data.squarePictureUrl = this.squarePictureUrl
        data.colorAttribute = this.colorAttribute
        data.mood = this.mood
        data.color = this.color
        this.$router.push({
            path: "/mint_shaping",
            query: data
        })
    }
}