/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import {
    get,
} from '../../../http/http'
export default {
    // getData() {
    //     this.overlayshow = true
    //     let url = this.$api.nft.getNFTDetail + `?id=${this.$route.query.id}`
    //     get(url)
    //         .then((res) => {
    //             if (res.code === 200) {
    //                 this.NFTDetail = res.data
                   
    //                 this.overlayshow = false
    //             }
    //         })
    //         .catch((error) => { });
    // },
    nuxt() {
        let me = this
        me.overlayshow = true
        setTimeout(() => {
            me.overlayshow = false
            this.$router.push({
                path: "/mint_soulcast",
                query: {
                    personality: this.PersonalityID,
                    mood: this.MoadID,
                    color: this.ColorID,
                    // weather: this.WeatherID,
                }
            })
        }, 2000)

    },
    getNFTMood() {
        let url = this.$api.infor.getNFTMood
        get(url).then((res) => {
            if (res.code === 200) {
                let item = res.data
                this.Moad = item
                this.MoadID = item[0].code
            }
        })
    },
    getNFTColor() {
        let url = this.$api.infor.getNFTColor
        get(url).then((res) => {
            if (res.code === 200) {
                let item = res.data
                this.Color = item
                this.ColorID = item[0].code
            }
        })
    },
    getNFTPersonality() {
        let url = this.$api.infor.getNFTPersonality
        get(url).then((res) => {
            if (res.code === 200) {
                let item = res.data
                this.Personality = item
                this.PersonalityID = item[0].code
            }
        })
    },
    getUserInfo() {
        this.overlayshow = true

        let url = this.$api.infor.getUserInfo
        get(url).then((res) => {
            if (res.code === 200) {
                this.UserInfo = res.data
                let item = res.data
                this.values.push(item.charisma)
                this.values.push(item.courage)
                this.values.push(item.art)
                this.values.push(item.wisdom)
                this.values.push(item.energy)
                this.values.push(item.extroversion)
            }
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
        this.overlayshow = false

        })
    },
    selects(type,code){
        if(type==0){
            this.MoadID = code
        }
        if(type==1){
            this.ColorID = code
        }
        if(type==2){
            this.PersonalityID = code
        }
    },
    returns(type){
        if(type==0){
            for(let item of this.Moad){
                if(item.code==this.MoadID){
                    return item.name
                }
            }   
        }
        if(type==1){
            for(let item of this.Color){
                if(item.code==this.ColorID){
                    return item.name
                }
            }   
        }
        if(type==2){
            for(let item of this.Personality){
                if(item.code==this.PersonalityID){
                    return item.name
                }
            }   
        }
    }
}