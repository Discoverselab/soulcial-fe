/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { valueFromAST } from "graphql";
import { get } from "../../../http/http";
import { ImagePreview } from "vant";
import Clipboard from "clipboard";
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
        this.messageList = data.detaillist.concat(this.messageList);
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
  submit(e) {
    e.preventDefault();
    if (e.target.className === "text") {
      if (!this.inputContent) return;
      console.log(
        "🔥🔥🔥🚀 ~ file: methods.js:67 ~ submit:",
        this.inputContent
      );
    }
    if (e.target.className === "img") {
      //
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
