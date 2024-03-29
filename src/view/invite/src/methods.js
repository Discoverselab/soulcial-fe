import Clipboard from 'clipboard';
import { Toast } from 'vant';
import {
    get,
} from '../../../http/http'
export default {
    getInviteCodeList(){
        this.overlayshow = true
        let url = this.$api.infor.getInviteCodeList
        get(url)
            .then((res) => {
                if (res.code === 200) {
                    this.inviteCodeList = res.data
                    this.overlayshow = false
                } 
            })
            .catch((error) => {
                this.overlayshow = false
                // this.$toast(error)
            });
    },
    copy(code) {
        const clipboard = new Clipboard('.copy-button', {
            text: () => code
        });
        clipboard.on('success', e => {
            Toast('Copy successfully')
        });
        clipboard.on('error', e => {
            Toast('No content');
        })
    },
    jumpEarn(){
        this.$router.push("/earn")
    }
}