<template>
  <div class="com_container">
    <div id="map"></div>
  </div>
</template>
<script>
import { transtomap, transtodata } from "./mapOption";
let memoryChart = null;
export default {
  name: "internet",
  data() {
    return {
      local: {},
      noLocal: {},
      oldlocal: {},
      oldnoLocal: {},
      neadclear: false,
    };
  },
  async mounted() {
    memoryChart = echarts.init(document.getElementById("map"), "dark");
    let data = await this.$http.get("/index/adg");
    this.local = data.find((v) => v.is_local === 0) || {};
    this.noLocal = data.find((v) => v.is_local === 1) || {};
    this.oldlocal = this.local;
    this.oldnoLocal = this.noLocal;
    setInterval(async () => {
      data = await this.$http.get("/index/adg");
      this.local = data.find((v) => v.is_local === 0) || {};
      this.noLocal = data.find((v) => v.is_local === 1) || {};
      this.neadclear = !(
        this.local?.stabydb_isalert === this.oldlocal?.stabydb_isalert &&
        this.oldnoLocal?.stabydb_isalert === this.noLocal?.stabydb_isalert
      );
      this.oldlocal=this.local;
      this.oldnoLocal=this.noLocal;
      this.$nextTick(() => {
        this.drawMemory();
      });
    }, 10000);
    this.drawMemory();
  },
  methods: {
    drawMemory() {
      if(this.neadclear){
        memoryChart.clear();
      }
      
      let points1 = [
        {
          value: [121.45, 31.22],
          name: `${this.local.staby_desc?this.local.staby_desc+'同城':'同城'}`,
          symbolSize: 20, //this.local.stabydb_isalert == 0 ? 1 : 50,
          itemStyle: { color: "blue" },
        },
        {
          value: [104.07, 30.67],
          name: `${this.noLocal.staby_desc?this.noLocal.staby_desc+'异地':'异地'}`,
          symbolSize: 20,
          label: {
            offset: [0, -0],
          },
          itemStyle: { color: "#4fb6d2" },
        },
        {
          value: [116.44, 39.73],
          symbolSize: 20, //this.local.primarydb_isalert == 0 ? 1 : 50,
          name: `${this.local.primary_desc?this.local.primary_desc+'主库':'主库'}`,
        },
      ];
      let points = [
        {
          value: [121.45 + 4, 31.22],
          name: `${this.local.staby_desc?this.local.staby_desc+'同城':'同城'}`,
          symbolSize: this.local.stabydb_isalert == 1 ? 50 : 1,
          itemStyle: { color: "blue" },
        },
        {
          value: [104.07 + 4, 30.67],
          name: `${this.noLocal.staby_desc ?this.noLocal.staby_desc+'异地':'异地'}`,
          symbolSize: this.noLocal.stabydb_isalert === 1 ? 50 : 1,
          label: {
            position: this.noLocal.stabydb_isalert === 1 ? [0, 40] : [0, 20],
          },
          itemStyle: { color: "#4fb6d2" },
        },
        {
          value: [116.44 + 4, 39.73],
          symbolSize: this.local.primarydb_isalert == 1 ? 50 : 1,
          name: `${this.local.primary_desc?+this.local.primary_desc+'主库':'主库'}`,
        },
      ];
      let centerPoints = [
        {
          value: [(116.44 + 121.45) / 2, (39.73 + 31.22) / 2],
          name: "A(秒)",
          delay: this.local.apply_delay,
          symbolSize: this.local.apply_isalert === 1 ? 50 : 1,
          symbolOffset: [-30, 0],
          label: {
            position: this.local.apply_isalert === 1 ? [-20, 25] : [-40, 0],
            // offset: [-40, 0],
          },
          itemStyle: { color: "blue" },
        },
        {
          value: [(116.44 + 121.45) / 2, (39.73 + 31.22) / 2],
          name: "T(秒)",
          delay: this.local.trans_delay,
          symbolSize: this.local.trans_isalert === 1 ? 50 : 1,
          symbolOffset: [30, 0],
          label: {
            position: this.local.trans_isalert === 1 ? [20, 20] : [0, 0],
          },
          itemStyle: { color: "blue" },
        },
        {
          value: [(116.44 + 104.07) / 2, (39.73 + 30.67) / 2],
          name: "A(秒)",
          delay: this.noLocal.apply_delay,
          symbolSize: this.noLocal.apply_isalert === 1 ? 50 : 1,
          symbolOffset: [-30, 0],
          label: {
            position: this.noLocal.apply_isalert === 1 ? [-60, 0] : [-80, -30],
            // offset: [-40, 0],
          },
          itemStyle: { color: "red" },
        },
        {
          value: [(116.44 + 104.07) / 2, (39.73 + 30.67) / 2],
          delay: this.noLocal.trans_delay,
          symbolSize: this.noLocal.trans_isalert == 1 ? 50 : 1,
          name: "T(秒)",
          symbolOffset: [0, 20],
          label: {
            position: this.noLocal.trans_isalert === 1 ? [0, 30] : [-20, 0],
          },
          itemStyle: { color: "red" },
        },
      ];
      memoryChart.showLoading();
      let index = -1;
      let appendData1 = transtodata(
        transtomap(
          [
            [116.44, 39.73],
            [121.45, 31.22],
          ],
          4
        ),
        120,
        [
          this.local.apply_isalert,
          this.local.trans_isalert,
          this.local.stabydb_isalert,
        ]
      );
      let appendData2 = transtodata(
        transtomap(
          [
            [116.44, 39.73],
            [104.07, 30.67],
          ],
          5
        ),
        20,
        [
          this.noLocal.apply_isalert,
          this.noLocal.trans_isalert,
          this.noLocal.stabydb_isalert,
        ]
      );
      memoryChart.hideLoading();
      let option = {
        backgroundColor: "transparent",
        title: {
          left: 20,
          bottom: 20,
          text: "A:应用延时\nT:传输延时",
        },
        geo: {
          map: "china",
          aspectScale: 0.75, //长宽比
          // zoom: 1.1,
          roam: true,
          itemStyle: {
            normal: {
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "#09132c", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#274d68", // 100% 处的颜色
                  },
                ],
                globalCoord: true, // 缺省为 false
              },
              shadowColor: "rgb(58,115,192)",
              shadowOffsetX: 1,
              shadowOffsetY: 1,
            },
            // emphasis:{
            //   label:{
            //     show:true,

            //   }

            // }
          },
        },
        series: [
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            showEffectOn: "render",
            zlevel: 6,
            rippleEffect: {
              period: 4,
              scale: 4,
              brushType: "fill",
            },
            effectType: "ripple",
            hoverAnimation: true,
            label: {
              normal: {
                formatter: (params) => {
                  return (
                    params.name +
                    ":\n" +
                    (params.data.delay === undefined
                      ? "无"
                      : params.data.delay)
                  );
                },
                position: "left",
                offset: [20, 10],
                color: "#1DE9B6",
                fontSize: 10,
                show: true,
              },
            },
            itemStyle: {
              normal: {
                color: "#1DE9B6",
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            symbol: "image:///alerm.png",
            symbolSize: 50,
            data: centerPoints,
          },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            showEffectOn: "render",
            zlevel: 3,
            rippleEffect: {
              period: 15,
              scale: 4,
              brushType: "stroke",
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                offset: [0, 0],
                color: "#1DE9B6",
                fontSize: 12,
                show: true,
              },
            },
            itemStyle: {
              normal: {
                color: "#1DE9B6",
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            symbol: "image:///alerm.png",
            symbolSize: 50,
            data: points,
          },
          {
            type: "scatter",
            coordinateSystem: "geo",
            showEffectOn: "render",
            zlevel: 3,
            rippleEffect: {
              period: 15,
              scale: 4,
              brushType: "stroke",
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                offset: [0, 0],
                color: "#1DE9B6",
                fontSize: 12,
                show: false,
              },
            },
            itemStyle: {
              normal: {
                color: "#1DE9B6",
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            symbol: "image:///server.png",
            symbolSize: 20,
            data: points1,
          },
          ...appendData1,
          ...appendData2,
        ],
        // blendMode:"destination-over"
      };
      // console.log(option);
      memoryChart.setOption(option, {
        notMerge: true,
      });
      //  option.series.push(appendData);
      //  console.log(option);
      //  memoryChart.setOption(option,{ notMerge: true,});
      //memoryChart.appendData({data:[appendData]});
      window.addEventListener("resize", () => {
        requestAnimationFrame(() => {
          memoryChart.resize();
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.com_container {
  flex: 1;
  width: 100%;
  #map {
    width: 100%;
    height: 100%;
    margin: 1px;
    overflow: hidden;
  }
}
</style>