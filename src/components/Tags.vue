<template>
  <!-- tabBar -->
  <div class="Tags">
    <van-action-sheet @close="close" v-model="tagShow">
      <div class="content">
        <p class="headLin" @click="close"></p>
        <p class="title">edit tags</p>
        <div class="rule">
          <div class="rule_top">
            <span class="key">Selected</span>
            <span class="max3">Max 3</span>
          </div>
          <p class="rule_infor">
            Interest tags will help others to find you in web3.
          </p>
        </div>
        <div class="my_list" v-if="MyList.length">
          <div
            class="my_list_list"
            v-for="(item, index) in MyList"
            :key="index"
          >
            <svg-icon
              :className="`svgName${item}`"
              :iconClass="`tag${item}`"
            ></svg-icon>
            <img
              @click="delTag(item, index)"
              src="../assets/delTag.png"
              alt=""
            />
          </div>
        </div>
        <div class="AllList">
          <div
            class="AllList_list"
            v-for="(item, index) in AllList"
            :key="index"
          >
            <svg-icon
              :className="`svgName${item}`"
              :iconClass="`tag${item}`"
            ></svg-icon>
            <img @click="addTag(item)" src="../assets/addTag.png" alt="" />
          </div>
        </div>
        <div class="cudset_but">
          <button @click="save">SAVE</button>
          <button class="Cancel" @click="close()">CANCEL</button>
        </div>
      </div>
    </van-action-sheet>
    <Overlay :overlayshow="overlayshow"></Overlay>
  </div>
</template>
<script>
import { post, get } from "../http/http";
import Overlay from "../components/Overlay.vue";
export default {
  props: {
    tagShow: Boolean,
    userTags: String,
  },
  data: function () {
    let _clientH = document.documentElement.clientHeight;
    return {
      overlayshow: false,
      MyList: [],
      AllList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    };
  },
  computed: {},
  components: { Overlay },
  watch: {
    tagShow(value) {
      if (value) {
        this.MyList = this.userTags ? this.userTags.split(",") : [];
        this.AllList = this.AllList.filter(
          (item) => !this.MyList.some((ele) => Number(ele)  === item)
        );
      }
    },
  },
  methods: {
    close() {
      this.$emit("close", true);
    },
    save() {
      this.overlayshow = true;
      let url = this.$api.infor.setUserTags;
      let data = {
        userTags: this.MyList.toString(),
      };
      post(url, data, true)
        .then((res) => {
          if (res.code === 200) {
            this.$emit("close", true);
            this.$emit("save", true);
          }
          this.overlayshow = false;
        })
        .catch((error) => {
          this.overlayshow = false;
        });
    },
    delTag(item, index) {
      this.MyList.splice(index, 1);
      this.AllList.push(Number(item));
      this.AllList = this.AllList.sort(function (a, b) {
        return a - b;
      });
    },
    addTag(index) {
      if (this.MyList.length < 3) {
        this.MyList.push(index);
        this.AllList = this.AllList.filter(
          (item) => !this.MyList.some((ele) => Number(ele) === item)
        );
      } else {
        this.$toast("Selected Max3");
      }
    },
  },
  created() {},
  mounted: async function () {},
};
</script>
  <style lang="scss">
.Tags {
  @media screen and (min-width: 750px) {
    .van-action-sheet__content {
      padding: 0px 430px 0px 430px !important;
      border: 1px solid #000;
    }
    .van-action-sheet {
      max-height: 80% !important;
    }
  }
  .van-action-sheet {
    background-color: #f5f5ed;
    min-height: 60%;
    max-height: 100%;
  }
  .content {
    padding: 8px 25px 42px 25px;
    background-color: #f5f5ed;
    .headLin {
      width: 88px;
      height: 4px;
      background: #dfdfce;
      border-radius: 100px;
      margin: 0 auto 30px auto;
    }
    .title {
      color: #000;
      text-align: center;
      font-family: "Inter";
      font-size: 20px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      text-transform: uppercase;
      margin-bottom: 38px;
    }
    .rule {
      padding-bottom: 6px;
      border-bottom: 2px solid #dfdfce;
      .rule_top {
        margin-bottom: 10px;
        display: flex;
        .key {
          color: #000;
          font-family: "Inter";
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
        }
        .max3 {
          display: inline-block;
          width: 54px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 6px;
          border-radius: 100px;
          border: 1px solid #000;
          color: #000;
          font-family: "Inter";
          font-size: 10px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px;
          text-transform: capitalize;
        }
      }
      .rule_infor {
        color: #62625f;
        font-family: "Inter";
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
      }
    }
    .my_list {
      padding: 28px 0;
      border-bottom: 2px solid #dfdfce;
      display: flex;
      flex-wrap: wrap;
      .my_list_list {
        margin: 0 10px 0 0;
        display: flex;
        align-items: center;
        img {
          display: block;
          width: 20px;
          height: 20px;
          margin-left: 4px;
        }
      }
    }
    .AllList {
      padding: 26px 0 8px 0;
      border-bottom: 2px solid #dfdfce;
      display: flex;
      flex-wrap: wrap;
      .AllList_list {
        margin: 0 10px 25px 0;
        display: flex;
        align-items: center;
        img {
          display: block;
          width: 20px;
          height: 20px;
          margin-left: 4px;
        }
      }
    }
    .cudset_but {
      box-sizing: border-box;
      margin-top: 76px;

      button {
        position: relative;

        &:active {
          opacity: 0.8;
        }

        &.disabled {
          background-color: #f1f1e7;
          color: #c4c4be;
          border: 2px solid #c4c4be;
        }

        &.Cancel {
          border: 2px solid #000;
          background: #dfdece;
          color: #000;
        }
        display: block;
        width: 100%;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 26px;
        gap: 10px;
        width: 342px;
        height: 40px;
        background: #ffffff;
        text-transform: uppercase;
        border: 2px solid #000000;
        border-radius: 45px;
        font-family: "Inter";
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        color: #000;
      }

      .skip {
        color: #000;
        text-align: center;
        font-size: 12px;
        font-family: "Inter";
        font-style: normal;
        font-weight: 600;
        margin-top: 20px;

        span {
          color: #f3b228;
        }
      }
    }
  }
  .svgName1 {
    width: 78px !important;
    height: 24px !important;
  }
  .svgName2 {
    width: 75px !important;
    height: 24px !important;
  }
  .svgName3 {
    width: 50px !important;
    height: 24px !important;
  }
  .svgName4 {
    width: 94px !important;
    height: 24px !important;
  }
  .svgName5 {
    width: 54.5px !important;
    height: 24px !important;
  }
  .svgName6 {
    width: 52px !important;
    height: 24px !important;
  }
  .svgName7 {
    width: 53px !important;
    height: 24px !important;
  }
  .svgName8 {
    width: 40px !important;
    height: 24px !important;
  }
  .svgName9 {
    width: 96px !important;
    height: 24px !important;
  }
  .svgName10 {
    width: 40px !important;
    height: 24px !important;
  }
  .svgName11 {
    width: 68px !important;
    height: 24px !important;
  }
  .svgName12 {
    width: 88px !important;
    height: 24px !important;
  }
  .ovrlay {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .van-dialog__header {
    text-align: center;
    font-size: 20px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 900;
    text-transform: uppercase;
  }
}
</style>
    