<template>
  <div class="conversation">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt="" />
      <div class="info">
        <div class="left">
          <img src="../../assets/logo_app.png" alt="">
        </div>
        <div class="right">
          <div class="name">Lasdf</div>
          <div class="address">asdfasdfasdfasf
            <img @click="copy('asdfasdfasdfasf')" class="mycopy" round src="../../assets/copy1.png" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="chatBox">
      <div class="item" v-for="(item, index) in messageList" :key="index">
        <div v-if="item.userId != userId" class="other">
          <div class="othersImg">
            <img :src="item.userAvatar || '../../assets/logo_black.png'" alt="">
          </div>
          <div class="msg othersMsg">
            <span>{{ item.content }}</span>
            <!-- <van-image @click="onPreview('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')" width="180" fit="cover" height="180" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image> -->
          </div>
        </div>
        <div v-else class="me">
          <div class="msg meMsg">
            <span>{{ item.content }}</span>
            <!-- <van-image @click="onPreview('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg')" width="180" fit="cover" height="180" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image> -->
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <van-search v-model="inputContent" placeholder="Tap a message..." background="transparent" :clearable="false"
        shape="round" left-icon>
        <template #right-icon>
          <div @click="submit" class="btn">
            <div class="searchImg">
              <img class="img" src="@/assets/icon_img.png" alt />
            </div>
            <div class="searchImg">
              <img class="text" src="@/assets/icon_send.png" alt />
            </div>
          </div>
        </template>
      </van-search>
    </div>
  </div>
</template>
<script>
import watch from "./src/watch";
import methods from "./src/methods";
import { linkOpen } from "@/libs/common.js"
import AOS from "aos";
export default {
  name: "conversation",
  data() {
    return {
      messageList: [],
      inputContent: "",
      userId: this.$loginData.userId
    };
  },
  watch: watch,
  methods: methods,
  computed: {
    linkOpen() {
      return (type, has) => linkOpen(type, has);
    },
  },
  components: {},
  async created() {
    this.getMessageList();
  },
  mounted: async function () {
    console.log("this：", this);
    console.log("$route：", this.$route);
    AOS.init({
      offset: 200,
      duration: 200, //duration
      easing: "ease-in-sine",
      delay: 100,
    });
    console.log(this.$loginData);
    window.addEventListener("scroll", this.scrollToTop);
  },
  beforeRouteLeave(to, form, next) {
    // Leave the route to remove the scrolling event
    window.removeEventListener("scroll", this.scrollToTop);
    next();
  },
  destroyed() { },
};
</script>

<style lang="scss" scoped>
>>>.van-cell__value {
  display: flex;
  align-items: center;

  .van-field__body {
    flex: 1;
  }
}

>>>.van-search__content {
  border: 2px solid #DFDFCE;
  background-color: #fff;
}

>>>.van-field__control {
  color: rgba($color: #000000, $alpha: 0.6);

  &::placeholder {
    color: rgba($color: #000000, $alpha: 0.6);
  }
}

>>>.van-search {
  flex: 1;
}

>>>.van-search__content {
  height: 44px;
}

.conversation {

  .navigate {
    display: flex;
    align-items: center;
    height: 64px;
    box-sizing: border-box;
    padding: 0px 24px;
    background-color: #f5f5ed;

    .back {
      display: block;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .info {
      display: flex;
      align-items: center;
      margin-left: 20px;

      .left {
        border-radius: 20px;
        overflow: hidden;
        width: 40px;
        height: 40px;
        margin-right: 10px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        .name {
          font-size: 16px;
          color: #000;
          font-weight: 600;
          margin-bottom: 3px;
        }

        .address {
          display: flex;
          align-items: center;
          font-family: Inter;
          font-size: 12px;
          font-weight: 500;
          color: #62625F;

          img {
            margin-left: 8px;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
        }
      }
    }

  }

  .chatBox {
    height: calc(100vh - 64px - 108px);
    box-sizing: border-box;
    overflow: auto;
    padding: 0px 24px 24px;
    border-top: 2px solid #DFDFCE;
    border-bottom: 2px solid #DFDFCE;
    background-color: #f3f4ea;

    .other {
      display: flex;
      align-items: flex-start;
      margin-top: 20px;

      .othersImg {
        width: 40px;
        height: 40px;
        border: 1px solid #000;
        box-sizing: border-box;
        border-radius: 20px;
        overflow: hidden;
        margin-right: 17px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .othersMsg {
        padding: 12px;
        border-radius: 10px;
        max-width: 285px;
        background: #DFDFCE;
      }
    }

    .me {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;

      .msg {
        padding: 12px;
        max-width: 285px;
        border-radius: 10px;
        background: #F2B229;
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    text-align: center;
    height: 108px;
    padding: 0px 12px;
    box-sizing: border-box;
    background-color: #fff;

    .btn {
      display: flex;
      align-items: center;

      .searchImg {
        margin-left: 12px;
        width: 24px;
        height: 24px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }


  }
}
</style>
