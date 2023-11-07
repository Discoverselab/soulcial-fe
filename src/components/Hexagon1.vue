<template>
  <div :class="{ hextype: type, 'hex-share': isShare, hex: !isShare }">
    <div class="calculate">
      <img :class="`calculateimg${level}`" class="calculateimg" :src="levelImg[level]" alt="" />
      <p class="leve">{{ getNFTLevel[level] }}</p>
      <p class="leve_number">{{ levelScore }}</p>
    </div>
    <div id="main"></div>
  </div>
</template>
    
<script>
import * as echarts from "echarts";
import { getNFTLevel, levelImg } from "../libs/target";
var chartDom;
var myChart;

export default {
  props: {
    levelScore: {
      type: Number,
    },
    level: {
      type: Number,
    },
    type: {
      type: Boolean,
    },
    values: {
      type: Array,
    },
    isShare: {
      type: Boolean,
    },

  },
  data() {
    return {
      levelImg: levelImg,
      getNFTLevel: getNFTLevel,
    };
  },
  computed: {},
  created() { },
  mounted() {
    chartDom = document.getElementById("main");
    myChart = echarts.init(chartDom);
    let me = this;
    setTimeout(() => {
      me.init();
    }, 50);
    window.addEventListener("resize", () => {
      setTimeout(() => {
        myChart.resize();
      }, 100);
    });
  },
  methods: {
    baseNumber(x) {
      let Number = 22.384 * (Math.log(x) / Math.log(1.8747)) - 64.208
      if (Number < 0) {
        return 5 // 为0时显示问题，所以定最小为5
        // return 0
      } else if (Number > 100) {
        return 100
      } else {
        return Number
      }
    },
    init() {
      let valueArr = []
      for (let item of this.values) {
        let X = item ? item : 5 // 为0时显示问题，所以定最小为5
        valueArr.push(this.baseNumber(X))
      }
      var option;
      option = {
        tooltip: {
          show: false,
        },
        legend: {
          enabled: false,
        },
        radar: [
          {
            indicator: [
              { max: 100 },
              { max: 100 },
              { max: 100 },
              { max: 100 },
              { max: 100 },
              { max: 100 },
            ],
            splitArea: {
              show: false,
              areaStyle: {
                color: "rgba(0,0,0,0)",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: "rgba(0,0,0,0)",
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(0,0,0,0)",
              },
            },
            radius: ["0%", "100%"],
            center: ["50%", "50%"],
          },
        ],
        series: [
          {
            type: "radar",
            tooltip: {
              trigger: "item",
            },
            data: [
              {
                value: valueArr,
                symbol: "none",
                areaStyle: {
                  color: "#F3B228",
                  opacity: 1,
                },
                lineStyle: {
                  color: "rgba(0,0,0,0)",
                },
                name: "",
              },
            ],
          },
        ],
      };

      option && myChart.setOption(option);
      myChart.resize();
    },
  },
};
</script>
    
<style lang="scss" scoped>
.hex-share {
  margin: 0 auto;
  width: 73px;
  height: 73px;
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
        width: 8.2px !important;
      }

      &.calculateimg2 {
        width: 7.6px !important;
      }

      &.calculateimg3 {
        width: 7.6px !important;
      }

      &.calculateimg4 {
        width: 7.6px !important;
      }

      &.calculateimg5 {
        width: 8.2px !important;
      }
    }

    .leve {
      color: #000;
      text-align: right;
      font-family: DINCond-Bold;
      font-size: 9.473px;
      font-style: normal;
      font-weight: 500;
      line-height: 100%;
      /* 9.473px */
      text-transform: uppercase;
    }

    .leve_number {
      text-align: center;
      color: #000;
      font-family: DINCond-Bold;
      font-size: 9.473px;
      font-style: normal;
      font-weight: 500;
      line-height: 100%;
      /* 9.473px */
      text-transform: uppercase;
    }
  }

  #main {
    position: absolute;
    left: 0;
    top: 0;
    width: 73px;
    height: 73px;
    // max-width: 88px;
    // max-height: 88px;
  }
}
</style>
    