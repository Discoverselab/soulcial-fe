<template>
  <div :class="{ hextype: type, 'hex-share': isShare, hex: !isShare }">
    <p
      v-for="(item, index) in SBTIList"
      :key="index"
      :class="`tags tags${index + 1} ${clickable ? 'clickable' : ''}`"
      @click="showDetail(item)"
    >
      <span>{{item}}</span>
      <span>{{ values[index] }}</span>
    </p>

    <div :class="`calculate ${clickable ? 'clickable' : ''}`" @click="showCenter(level)">
      <img :class="`calculateimg${level} }`" class="calculateimg" :src="levelImg[level]" alt />
      <p class="leve">{{ getNFTLevel[level] }}</p>
      <p class="leve_number">{{ levelScore }}</p>
    </div>

    <div id="main"></div>
    <!-- 展示分数的详细描述 -->
    <van-dialog
      v-model="scoreDetailShow"
      :close-on-click-overlay="false"
      confirmButtonText="BACK"
      :z-index="99999999999999999999"
    >
      <div class="title tu">{{ SBTIScoreInfo[3] }}</div>
      <div class="layout">
        <div class="fee_dint">{{ SBTIScoreInfo[0] }}</div>
      </div>
      <div class="layout" v-if="SBTIScoreInfo[1]">
        <div class="point"></div>
        <div class="fee_dint">{{ SBTIScoreInfo[1] }}</div>
      </div>
      <div class="layout" v-if="SBTIScoreInfo[2]">
        <div class="point"></div>
        <div class="fee_dint">{{ SBTIScoreInfo[2] }}</div>
      </div>
    </van-dialog>
    <!-- 展示等级 -->
    <van-dialog
      v-model="scoreLevelShow"
      :close-on-click-overlay="false"
      confirmButtonText="BACK"
      :z-index="99999999999999999999"
    >
      <div class="title level_desc">
        <span class="tu">{{ ` ${getNFTLevel[level]}! ` }}</span>
        <!-- style="text-transform: none;"防止和congr页面样式冲突 -->
        <span style="text-transform: none;">{{centerLevelDesc}}</span>
      </div>
      <div class="fee_dint">
        Your SBTI is
        <span class="fw7">{{ ` Lv ${level} ` }}</span>
        <span class="tu fw7">{{ `${getNFTLevel[level]} ` }}</span>currently.
      </div>
      <div
        class="fee_dint"
      >{{ `SBTI is Soulcial Behavior Trait Indicator, higher SBTI leading to higher SoulCast levels. ` }}</div>
    </van-dialog>
  </div>
</template>
  
<script>
import * as echarts from "echarts";
import { getNFTLevel, levelImg } from "../libs/target";
import { SBTIScoreDetail } from "@/libs/SBTIScoreDetail.js";
var chartDom;
var myChart;
export default {
  props: {
    levelScore: {
      type: Number
    },
    level: {
      type: Number
    },
    type: {
      type: Boolean
    },
    values: {
      type: Array
    },
    isShare: {
      type: Boolean
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      levelImg: levelImg,
      getNFTLevel: getNFTLevel,
      scoreDetailShow: false,
      scoreLevelShow: false,
      SBTIList: [
        "INFLUENCE",
        "COURAGE",
        "ART",
        "WISDOM",
        "ENERGY",
        "CONNECTION"
      ],
      centerLevelDesc: '',
      SBTIScoreDetail: SBTIScoreDetail, // SBTI六个维度的描述
      SBTIScoreInfo: [] // SBTI单个维度的描述
    };
  },
  computed: {},
  created() {},
  mounted() {
    chartDom = document.getElementById("main");
    myChart = echarts.init(chartDom);
    let me = this;
    setTimeout(() => {
      me.init();
    }, 0);
    window.addEventListener("resize", () => {
      setTimeout(() => {
        myChart.resize();
      }, 100);
    });
  },
  methods: {
    showDetail(detail) {
      if (!this.clickable) return;
      this.scoreDetailShow = true;
      this.SBTIScoreInfo = this.SBTIScoreDetail[detail];
    },
    showCenter(level) {
      if (!this.clickable) return;
      this.centerLevelDesc = SBTIScoreDetail.CenterLevelDescList[level - 1];
      this.scoreLevelShow = true;
    },
    baseNumber(x) {
      let Number = 22.384 * (Math.log(x) / Math.log(1.8747)) - 64.208;
      if (Number < 0) {
        return 5; // 为0时显示问题，所以定最小为5
        // return 0
      } else if (Number > 100) {
        return 100;
      } else {
        return Number;
      }
    },
    init() {
      let valueArr = [];
      for (let item of this.values) {
        let X = item ? item : 5; // 为0时显示问题，所以定最小为5
        valueArr.push(this.baseNumber(X));
      }
      var option;
      option = {
        tooltip: {
          show: false
        },
        legend: {
          enabled: false
        },
        radar: [
          {
            indicator: [
              { max: 100 },
              { max: 100 },
              { max: 100 },
              { max: 100 },
              { max: 100 },
              { max: 100 }
            ],
            splitArea: {
              show: false,
              areaStyle: {
                color: "rgba(0,0,0,0)"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: "rgba(0,0,0,0)"
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(0,0,0,0)"
              }
            },
            radius: ["0%", "100%"],
            center: ["50%", "50%"]
          }
        ],
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "item"
            },
            data: [
              {
                value: valueArr,
                symbol: "none",
                areaStyle: {
                  color: "#F3B228",
                  opacity: 1
                },
                lineStyle: {
                  color: "rgba(0,0,0,0)"
                },
                name: ""
              }
            ]
          }
        ]
      };

      option && myChart.setOption(option);
      myChart.resize();
    }
  }
};
</script>
  
<style lang="scss" scoped>
.hex {
  margin: 0 auto;
  width: 248px;
  height: 272px;
  background-image: url("../assets/hexBG.png");
  background-size: 100% 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep .van-dialog {
    width: 342px;
    padding: 40px 20px;
    box-sizing: border-box;
    background-color: #f5f5ed !important;

    .van-dialog__content {
      font-family: Inter;
      font-size: 16px;
      // font-weight: 600;
      line-height: 24px;
      letter-spacing: 0em;
      // text-align: center;
    }

    .van-dialog__footer {
      margin-top: 30px;
      padding: 0 24px 0 24px;

      button {
        border-radius: 45px !important;
        border: 2px solid #000 !important;
        background: #fff !important;

        .van-button__text {
          color: #000;
          text-align: center;
          font-size: 18px;
          font-family: "Inter";
          font-style: normal;
          font-weight: 700;
          text-transform: uppercase;
        }
      }
    }
  }
  .clickable {
    cursor: pointer;
  }
  .title {
    font-size: 22px;
    margin-bottom: 10px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 900;
    text-align: center;
    color: #000000;
    letter-spacing: 0;
  }
  .layout {
    display: flex;
    // align-items: center;
  }
  .point {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-top: 8px;
    margin-right: 8px;
    background-color: #000;
  }
  .mt10 {
    margin-bottom: 10px !important;
  }
  .fw7 {
    font-weight: 700 !important;
  }
  .tu {
    text-transform: uppercase;
  }
  .level_desc {
    line-height: 37px;
    margin-bottom: 27px;
    font-weight: 900;
    span {
      font: inherit;
    }
  }
  .fee_dint {
    flex: 1;
    color: #333;
    font-size: 16px;
    font-family: "Inter";
    // font-weight: 600;
    font-style: normal;
    span {
      font: inherit;
    }
    // margin-bottom: 20px;
  }

  &.hextype {
    background-image: url("../assets/hexBGs.png") !important;
  }

  .tags {
    position: absolute;
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 10px;
    text-transform: uppercase;
    color: #000;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    white-space: nowrap;
    z-index: 100;
    &.tags1 {
      left: 124px;
      top: 4px;
      transform: rotate(29deg);
    }

    &.tags2 {
      left: -7px;
      top: 43px;
      transform: rotate(-30deg);
    }

    &.tags3 {
      left: -20px;
      bottom: 74px;
      transform: rotate(-90deg);
    }

    &.tags4 {
      left: 70px;
      bottom: 2px;
      transform: rotate(28deg);
    }

    &.tags5 {
      right: -5px;
      bottom: 43px;
      transform: rotate(-30deg);
    }

    &.tags6 {
      right: -46px;
      top: 102px;
      transform: rotate(90deg);
    }
    span {
      font-family: "Inter";
      font-style: normal;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10px;
      &:nth-child(2) {
        color: #f3b228;
      }
    }
  }

  .calculate {
    position: relative;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    .calculateimg {
      display: block;
      margin: 0 auto;
      height: auto;
      object-fit: cover;

      &.calculateimg1 {
        width: 24px !important;
      }

      &.calculateimg2 {
        width: 22px !important;
      }

      &.calculateimg3 {
        width: 22px !important;
      }

      &.calculateimg4 {
        width: 22px !important;
      }

      &.calculateimg5 {
        width: 24px !important;
      }
    }

    .leve {
      font-family: "DINCond-Bold";
      font-style: normal;
      font-weight: 500;
      font-size: 32px;
      text-transform: uppercase;
      color: #000000;
      text-align: center;
      margin: 5px 0 0px 0;
    }

    .leve_number {
      font-family: "DINCond-Bold";
      font-style: normal;
      font-weight: 500;
      font-size: 32px;
      text-transform: uppercase;
      color: #000000;
      text-align: center;
    }
  }

  #main {
    position: absolute;
    left: 14px;
    top: 30px;
    width: 220px;
    height: 220px;
    max-width: 228px;
    max-height: 228px;
  }
}

.hex-share {
  margin: 0 auto;
  width: 220px;
  height: 220px;
  background-image: url("../assets/hexBG.png");
  background-size: 86% 100%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &.hextype {
    background-image: url("../assets/hexBGs.png") !important;
  }

  .tags {
    position: absolute;
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 10px;
    text-transform: uppercase;
    color: #000;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    white-space: nowrap;

    &.tags1 {
      left: 109px;
      top: 3px;
      transform: rotate(32deg);
    }

    &.tags2 {
      left: 9px;
      top: 30px;
      transform: rotate(-30deg);
    }

    &.tags3 {
      left: -2px;
      bottom: 64px;
      transform: rotate(-90deg);
    }

    &.tags4 {
      bottom: 3px;
      left: 58px;
      transform: rotate(30deg);
    }

    &.tags5 {
      right: 13px;
      bottom: 31px;
      transform: rotate(-30deg);
    }

    &.tags6 {
      right: -27px;
      top: 86px;
      transform: rotate(90deg);
    }

    span {
      font-family: "Inter";
      font-style: normal;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10px;
      &:nth-child(2) {
        color: #f3b228;
      }
    }
  }

  .calculate {
    position: relative;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;

    .calculateimg {
      display: block;
      margin: 0 auto;
      height: auto;
      object-fit: cover;

      &.calculateimg1 {
        width: 24px !important;
      }

      &.calculateimg2 {
        width: 22px !important;
      }

      &.calculateimg3 {
        width: 22px !important;
      }

      &.calculateimg4 {
        width: 22px !important;
      }

      &.calculateimg5 {
        width: 24px !important;
      }
    }

    .leve {
      font-family: "DINCond-Bold";
      font-style: normal;
      font-weight: 500;
      font-size: 32px;
      text-transform: uppercase;
      color: #000000;
      text-align: center;
      margin: 5px 0 0px 0;
    }

    .leve_number {
      font-family: "DINCond-Bold";
      font-style: normal;
      font-weight: 500;
      font-size: 32px;
      text-transform: uppercase;
      color: #000000;
      text-align: center;
    }
  }

  #main {
    position: absolute;
    left: 0;
    top: 0;
    width: 220px;
    height: 220px;
    max-width: 228px;
    max-height: 228px;
  }
}
</style>
  