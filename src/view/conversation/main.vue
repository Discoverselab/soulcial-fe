<template>
  <div class="conversation">
    <div class="navigate">
      <img @click="$router.go(-1)" class="back" src="../../assets/back.png" alt />
      <div class="info">
        <div @click="goPersonDetail(chatDetailDto)" class="left">
          <img @error="$handleErrorImg" :src="chatDetailDto.avatar" alt />
        </div>
        <div class="right">
          <div class="name" v-if="chatDetailDto.type == 1">
            <p v-if="!chatDetailDto.tokenId">{{ `${chatDetailDto.title} Group
                          (${chatDetailDto.memberNumber})` }}</p>
            <p v-else>
              {{ `SoulCast #${chatDetailDto.tokenId} Group
                            (${chatDetailDto.memberNumber})` }}
            </p>

          </div>
          <div class="name" v-else>{{ chatDetailDto.title }}</div>
          <!-- <div class="address">asdfasdfasdfasf
            <img @click="copy('asdfasdfasdfasf')" class="mycopy" round src="../../assets/copy1.png" alt />
          </div>-->
        </div>
      </div>
    </div>
    <div class="chatBox">
      <div v-if="isGettingMessage" class="loading">
        <van-loading color="#efa92c" />
      </div>
      <div class="item" v-for="(item, index) in messageList" :key="item.messageId">
        <div v-if="handleShowTime(item.time, index)" class="timeTip">{{ handleShowTime(item.time, index) }}</div>
        <div class="timeTip" v-if="item.type == 99">{{ `${item.userName} ${item.content}` }}</div>
        <template v-else>
          <div v-if="item.userId != $loginData.user_id" class="other">
            <div @click="goPersonDetail(item)" class="othersImg">
              <img @error="$handleErrorImg" :src="item.userAvatar" alt />
            </div>
            <div class="msg othersMsg">
              <span v-if="item.type == 0">{{ item.content }}</span>
              <van-image v-else @click="onPreview(item.content)" width="180" fit="cover" height="180"
                :src="`${item.content}?x-oss-process=image-resize,w_180`">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </div>
          </div>
          <div v-else class="me">
            <div class="msg meMsg">
              <span v-if="item.type == 0">{{ item.content }}</span>
              <van-image v-else @click="onPreview(item.content)" width="180" fit="cover" height="180"
                :src="`${item.content}?x-oss-process=image-resize,w_180`">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="footer">
      <van-search v-model="inputContent" placeholder="Tap a message..." :disabled="chatDetailDto.status != 1"
        background="transparent" :clearable="false" shape="round" left-icon>
        <template #right-icon>
          <div @click="submit" class="btn">
            <div class="searchImg">
              <van-uploader :disabled="chatDetailDto.status != 1" :after-read="afterRead">
                <img class="img" src="@/assets/icon_img.png" alt />
              </van-uploader>
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
import watch from './src/watch'
import methods from './src/methods'
import { linkOpen } from '@/libs/common.js'
import { closeWebsocket, sendMessage, changeMessageCallback } from '@/socket/socket.js'
import { formatTimeToDateMinuteSecond } from '@/utils/format.js'
import AOS from 'aos'
export default {
  name: 'conversation',
  data() {
    return {
      messageList: [],
      inputContent: '',
      chatDetailDto: {},
      chatBoxOldHeight: 0,
      isSubmiting: false,
      isGettingMessage: false,
      userId: this.$loginData.userId
    }
  },
  watch: watch,
  methods: methods,
  computed: {
    linkOpen() {
      return (type, has) => linkOpen(type, has)
    }
  },
  components: {},
  async created() {
    changeMessageCallback(this.onWsMessage)
    document.onkeydown = e => {
      let _key = window.event.keyCode
      if (_key === 13) {
        this.submit()
      }
    }
    let agentData = {
      type: 888,
      chatId: this.$route.query?.id, //聊天id
      userId: this.$loginData.user_id, //用户id
      startTime: formatTimeToDateMinuteSecond(+new Date() / 1000)
    }
    sendMessage(agentData)
    await this.getMessageList()
    this.gotoNewMessage()
  },
  async beforeDestroy() {
    // closeWebsocket();
  },
  mounted: async function () {
    console.log('this：', this)
    console.log('$route：', this.$route)

    let chatBox = document.querySelector('.chatBox')
    chatBox.addEventListener('scroll', e => {
      if (chatBox.scrollTop < 1) {
        // 获取更多记录
        this.isGettingMessage ? null : this.getMessageList(this.messageList[0].messageId)
      }
    })

    AOS.init({
      offset: 200,
      duration: 200, //duration
      easing: 'ease-in-sine',
      delay: 100
    })
    console.log(this.$loginData)
    window.addEventListener('scroll', this.scrollToTop)
  },
  beforeRouteLeave(to, form, next) {
    let agentData = {
      type: 888,
      userId: this.$loginData.user_id, //用户id
      chatId: this.$route.query?.id, //聊天id
      endTime: formatTimeToDateMinuteSecond(+new Date() / 1000)
    }
    sendMessage(agentData)
    // Leave the route to remove the scrolling event
    window.removeEventListener('scroll', this.scrollToTop)
    next()
  }
}
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
  border: 2px solid #dfdfce;
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
        box-sizing: border-box;
        border: 1px solid #000;
        flex-shrink: 0;

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
          max-width: 220px;
          white-space: nowrap;
          /* 让文本在一行中显示 */
          overflow: hidden;
          /* 隐藏超出容器的内容 */
          text-overflow: ellipsis;
          /* 当文本溢出时显示省略号 */
        }

        .address {
          display: flex;
          align-items: center;
          font-family: Inter;
          font-size: 12px;
          font-weight: 500;
          color: #62625f;

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
    position: relative;
    height: calc(100vh - 64px - 108px);
    box-sizing: border-box;
    overflow: auto;
    padding: 0px 24px 24px;
    border-top: 2px solid #dfdfce;
    background-color: #f3f4ea;

    .loading {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 20px;
      left: calc(50% - 15px);
    }

    .timeTip {
      margin: 10px 0 0;
      text-align: center;
      color: #575754;
    }

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
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .othersMsg {
        padding: 12px;
        border-radius: 10px;
        max-width: 275px;
        background: #dfdfce;
        overflow-wrap: break-word;
      }
    }

    .me {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;

      .msg {
        padding: 12px;
        max-width: 280px;
        border-radius: 10px;
        background: #f2b229;
        overflow-wrap: break-word;
      }
    }
  }

  .footer {
    position: fixed;
    width: 390px;
    bottom: 0;
    display: flex;
    align-items: center;
    text-align: center;
    height: 108px;
    padding: 0px 12px;
    box-sizing: border-box;
    border-top: 2px solid #dfdfce;
    background-color: #fff;

    .btn {
      display: flex;
      align-items: center;

      .searchImg {
        margin-left: 12px;
        width: 24px;
        height: 24px;

        img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
}
</style>
