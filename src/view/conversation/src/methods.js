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
  async getMessageList() {
    try {
      let url = this.$api.chat.getChatDetail + `?chatId=1`;
      const {code,data} = await get(url);
      if (code === 200) {
        this.messageList = data.detaillist;
      }
    } catch (error) {
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
