<template>
  <!-- tabBar -->
  <div class="Sift">
    <van-action-sheet @close="close" v-model="SiftShow">
      <div class="content">
        <p class="headLin" @click="close"></p>
        <p class="title">Arrangement</p>
        <div class="nft_infor">
          <div class="Sift_cont">
            <div v-for="(item, index) in SiftList" :key="index">
              <div v-if="item.show" class="SiftList_cont">
                <span :class="{active:activeID.indexOf(item.id)!=-1}">{{ item.name }}</span>
                <div class="cont_right">
                  <div v-for="(data, indexs) in item.sort" :key="indexs">
                    <img v-if="data" @click="SiftClick(item.id,1)" :src="activeID === item.id+'up'?up_sincere:up" alt="" />
                    <img v-else @click="SiftClick(item.id,0)" :src="activeID === item.id+'down'?down_sincere:down" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cudset_but">
          <button @click="close">BACK</button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
export default {
  props: {
    SiftShow: Boolean,
  },
  data: function () {
    let _clientH = document.documentElement.clientHeight;
    let Sift = window.localStorage.getItem('Sift')
    console.log(Sift)
    let SiftType = Sift?Sift:"4down"
    return {
      activeID:SiftType,
      SiftList: [
        {
          name: "SBTI",
          show: true,
          id: 0,
          sort: [true, false],
        },
        {
          name: "Price",
          show: true,
          id: 2,
          sort: [true, false],
        },
        {
          name: "Match",
          show: this.$loginData.Auth_Token ? true : false,
          id: 1,
          sort: [false],
        },
      ],
      down: require("../assets/down.png"),
      down_sincere: require("../assets/down_sincere.png"),
      up: require("../assets/up.png"),
      up_sincere: require("../assets/up_sincere.png"),
    };
  },
  computed: {},
  components: {},
  watch: {},
  methods: {
    close() {
      this.$emit("close", true);
    },
    SiftClick(id,type){
        let sift = type==1?'up':'down'
        if(this.activeID===id+sift){
            id = 4
            type = 0
            sift = "down"
        }
        let data = {
            orderColumn:id,
            orderType:type
        }
        window.localStorage.setItem('Sift',id+sift)
        this.activeID = id+sift
        console.log(this.activeID)
        this.$emit('pass',data)
    },
  },
  created() {},
  mounted: async function () {},
};
</script>
  <style lang="scss">
.Sift {
  @media screen and (min-width: 750px) {
    .van-action-sheet__content {
      padding: 0px 430px 0px 430px !important;
      border: 1px solid #000;
    }
    .van-action-sheet {
      max-height: 80% !important;
    }
  }
  .van-dialog {
    padding: 30px 24px 30px 24px !important;
  }
  .fee_dint {
    color: #333;
    font-size: 16px;
    font-family: "Inter";
    font-weight: 600;
    font-style: normal;
    margin-bottom: 20px;
  }
  .van-action-sheet {
    background-color: #f5f5ed;
    min-height: 75%;
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
    .nft_infor {
      .SiftList_cont {
        display: flex;
        align-content: center;
        justify-content: space-between;
        padding-bottom: 10px;
        margin-bottom: 26px;
        border-bottom: 2px solid #DFDFCE;
        span {
          color: rgba(0, 0, 0, 0.5);
          font-family: 'Inter';
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          &.active{
            color: #333;
          }
        }
        .cont_right{
            display: flex;
            align-items: center;

            img{
                display: block;
                cursor: pointer;
                width: 20px;
                height: 20px;
                margin-left: 8px;
            }
        }
      }
    }
    .cudset_but {
      box-sizing: border-box;
      margin-top: 130px;
      button {
        cursor: pointer;
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
          