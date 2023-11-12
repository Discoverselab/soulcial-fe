/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get } from "../../../http/http";
import { connectWebsocket } from "@/socket/socket";
export default {
  getData() {
    let me = this;
    me.overlayshow = true;
    let url = this.$api.chat.getChatList;
    get(url)
      .then((res) => {
        if (res.code === 200) {
          this.ChatList = res.data;
        } else {
          this.$toast(res.msg);
        }
        me.overlayshow = false;
      })
      .catch((error) => {
        me.overlayshow = false;
        this.$toast(error);
      });
  },
  connectWS() {
    let wsUrl = `ws://test2bsc.soulcial.network/pfp/websocket/${this.$loginData.userId}`;
    // let wsUrl = `ws://192.168.31.15:9005/pfp/websocket/${this.$loginData.userId}`;
    connectWebsocket(
      wsUrl,
      {},
      (res) => {
        let resData = JSON.parse(res);
        console.log("🔥🔥🔥🚀 ~ ws res:", resData);
        this.ChatList.forEach((item) => {
          if (item.id == resData.chatId) {
            item.relatedContent = resData.type == 0 ? resData.content : "[image]";
            item.time = resData.time;
            item.username = resData.userName;
            item.unreadNum = Number(item.unreadNum) + 1;
          }
        });
        this.ChatList.sort((a, b) => {
          return +new Date(b.time) - +new Date(a.time);
        });
      },
      (err) => {
        console.log("ws err", err);
      }
    );
  },
  links(item) {
    this.$router.push(`/conversation?id=${item.id}`);
  },
};
