/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "../../../http/http";
import { ImagePreview } from "vant";
import Clipboard from "clipboard";
import { connectWebsocket, closeWebsocket } from "../../../socket/socket";
export default {
  onPreview(file) {
    ImagePreview([file]);
  },
  gotoNewMessage() {
    let boxHeight = document.querySelector(".chatBox").scrollHeight;
    document.querySelector(".chatBox").scrollTop = boxHeight;
  },
  async getMessageList(messageId = "") {
    this.isGettingMessage = true;
    try {
      let url =
        this.$api.chat.getChatDetail +
        `?chatId=${this.$route.query?.id}&messageId=${messageId}`;
      const { code, data } = await get(url);
      if (code === 200) {
        this.messageList = data.detaillist.reverse().concat(this.messageList);
        this.chatDetailDto = data.chatDetailDto;
        this.isGettingMessage = false;
        this.$nextTick(() => {
          if (messageId) {
            let chatBox = document.querySelector(".chatBox");
            // 根据新的内容高度调整滚动位置
            chatBox.scrollTop = chatBox.scrollHeight - this.chatBoxOldHeight;
          }
          this.chatBoxOldHeight =
            document.querySelector(".chatBox").scrollHeight;
        });
      }
    } catch (error) {
      this.isGettingMessage = false;
      console.log("🔥🔥🔥🚀 ~ file: methods.js:22 ~ error:", error);
    }
  },
  substring(address) {
    if (!address) return;
    return (
      address.substring(0, 6) +
      "..." +
      address.substring(address.length - 5, address.length)
    ).toLocaleUpperCase();
  },
  afterRead(file) {
    const data = new FormData();
    data.append("file", file.file);

    let url = this.$api.chat.fetchUpload;
    post(url, data, true, "multipart/form-data")
      .then((res) => {
        if (res.code === 200) {
          let agentData = {
            type: 1, //图片类型
            content: res.data, //内容
          };
          this.connectWS(agentData);
        }
      })
      .catch((error) => {
        console.log("🔥🔥🔥🚀 ~ file: methods.js:69 ~ error:", error);
      });
  },
  connectWS(agentData) {
    let wsUrl = `ws://test2bsc.soulcial.network/pfp/websocket/${this.$route.query?.id}/${this.$loginData.userId}`;
    connectWebsocket(
      wsUrl,
      agentData,
      (res) => {
        console.log("🔥🔥🔥🚀 ~ file: methods.js:85 ~ res:", res);
        this.inputContent = '';
      },
      (err) => {
        console.log("err", err);
      }
    );
  },
  submit(e) {
    closeWebsocket();
    if (e.target.className === "text") {
      if (!this.inputContent) return;
      let agentData = {
        type: 0, //消息类型
        content: this.inputContent, //内容
      };
      this.connectWS(agentData);
    }
    if (e.target.className === "img") {
      console.log(
        "🔥🔥🔥🚀 ~ file: methods.js:67 ~ submit img:",
        this.inputContent
      );
    }
  },
  copy(val) {
    const clipboard = new Clipboard(".mycopy", {
      text: () => val,
    });
    clipboard.on("success", (e) => {
      this.$toast("Copy successfully");
    });
    clipboard.on("error", (e) => {
      this.$toast("No content");
    });
  },
};
