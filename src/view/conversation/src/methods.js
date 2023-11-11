/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "../../../http/http";
import { ImagePreview } from "vant";
import Clipboard from "clipboard";
import { connectWebsocket, sendMessage } from "../../../socket/socket";
import { getTimeDiffText } from "@/utils/convertTime.js";
import { formatTimeToDateMinuteSecond } from "@/utils/format.js";
export default {
  onPreview(file) {
    ImagePreview({ images: [file], showIndex: false });
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
            chatId: this.$route.query?.id, //聊天id
            content: res.data, //内容
          };
          sendMessage(agentData);
        }
      })
      .catch((error) => {
        console.log("🔥🔥🔥🚀 ~ file: methods.js:69 ~ error:", error);
      });
  },
  connectWS() {
    let wsUrl = `ws://test2bsc.soulcial.network/pfp/websocket/${this.$loginData.userId}`;
    // let wsUrl = `ws://192.168.31.15:9005/pfp/websocket/80595c0b-7597-4850-a29b-b56921ea515c`;
    let agentData = {
      type: 888,
      chatId: this.$route.query?.id, //聊天id
      userId: this.$loginData.user_id, //用户id
      startTime: formatTimeToDateMinuteSecond(+new Date() / 1000),
    };
    connectWebsocket(
      wsUrl,
      agentData,
      (res) => {
        console.log(
          "🔥🔥🔥🚀 ~ file: methods.js:85 ~ message res:",
          JSON.parse(res)
        );
        if (JSON.parse(res).type < 9) {
          this.messageList.push(JSON.parse(res));
          this.inputContent = "";
          let me = this;
          this.$nextTick(() => {
            me.gotoNewMessage();
          });
        }
      },
      (err) => {
        console.log("err", err);
      }
    );
  },
  handleShowTime(time, index) {
    if (index == 0) return false;
    return getTimeDiffText(
      new Date(time),
      new Date(this.messageList[index - 1]?.time)
    );
  },
  submit(e) {
    if (e === "text" || e.target?.className === "text") {
      if (!this.inputContent) return;
      let agentData = {
        type: 0, //消息类型
        chatId: this.$route.query?.id, //聊天id
        content: this.inputContent, //内容
      };
      sendMessage(agentData);
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
