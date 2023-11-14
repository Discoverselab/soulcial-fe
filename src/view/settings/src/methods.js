/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "../../../http/http";
import { Toast } from "vant";
export default {
  setTwitterUserInfo(val) {
    let url = this.$api.login.setTwitterUserInfo;
    let data = {
      oauthVerifier: val,
    };
    post(url, data)
      .then((res) => {
        if (res.code === 200) {
          this.$toast("bind successfully");
          var clean_uri =
            location.protocol +
            "//" +
            location.host +
            location.pathname +
            location.hash;
          window.history.replaceState({}, document.title, clean_uri);
          this.getUserInfo();
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
        console.log(error);
      });
  },
  onInput(checked) {
    if (!checked) {
      // let url = this.$api.login.cancelTwitterBind;
      // post(url)
      //     .then((res) => {
      //         if (res.code === 200) {
      //             this.$toast("Unbind successfully");
      //         }
      //         this.overlayshow = false;
      //     })
      //     .catch((error) => {
      //         this.overlayshow = false;
      //         console.log(error);
      //     });
    } else {
      this.overlayshow = true;
      this.checked = checked;
      let url = this.$api.login.twitterRedirect + "?source=1";
      post(url)
        .then((res) => {
          if (res.code === 200) {
            if (window.localStorage.getItem("isPWA") == "true") {
              window.open(res.data, '_blank');
            } else {
              window.open(res.data, "_self");
            }
          }
          this.overlayshow = false;
        })
        .catch((error) => {
          this.overlayshow = false;
          console.log("🔥🔥🔥🚀 ~ file: methods.js:19 ~ error:", error);
        });
    }
  },
  getUserInfo() {
    this.overlayshow = true;
    let url = this.$api.infor.getUserInfo;
    get(url)
      .then((res) => {
        if (res.code === 200) {
          this.UserInfo = res.data;
          this.checked = Boolean(res.data.twitterStatus);
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
        console.log(error);
      });
  },
  quit() {
    this.$loginData.out();
    window.particle && window.particle.auth.logout();
    localStorage.removeItem("loginInfo");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("mintedNFTPage");
    localStorage.removeItem("isUseInviteCode");
    this.$router.replace({
      path: "/",
    });
  },
  afterRead(file) {
    this.overlayshow = true;
    let url = this.$api.infor.pictureUpload;
    const formData = new FormData();
    formData.append("file", file.file);
    let data = formData;
    post(url, data, true)
      .then((res) => {
        if (res.code === 200) {
          this.save(res.data);
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
        console.log(error);
      });
  },
  save(avatar) {
    this.overlayshow = true;
    let url = this.$api.infor.setUserInfo;
    let data = {
      avatar: avatar,
    };
    post(url, data, true)
      .then((res) => {
        if (res.code === 200) {
          this.getUserInfo();
        }
        this.overlayshow = false;
      })
      .catch((error) => {
        this.overlayshow = false;
        console.log(error);
      });
  },
  onOversize() {
    Toast("The size of image limited to 5M.");
  },
};
