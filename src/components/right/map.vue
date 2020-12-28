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
    };
  },
  async mounted() {
    memoryChart = echarts.init(document.getElementById("map"), "dark");
    let data = await this.$http.get("/index/adg");
    this.local = Object.assign(
      this.local,
      data.find((v) => v.is_local == 0)
    );
    this.noLocal = Object.assign(
      this.noLocal,
      data.find((v) => v.is_local == 1)
    );
    setInterval(async () => {
      data = await this.$http.get("/index/adg");
      this.local = Object.assign(
        this.local,
        data.find((v) => v.is_local == 0)
      );
      this.noLocal = Object.assign(
        this.noLocal,
        data.find((v) => v.is_local == 1)
      );
      this.drawMemory();
    }, 10000);
    this.drawMemory();
  },
  methods: {
    drawMemory() {
      let points = [
        {
          value: [120.374402 + 0.3, 36.168923],
          name: `${this.local.staby_desc}同城`,
          symbolSize: this.local.stabydb_isalert == 0 ? 1 : 50,
          itemStyle: { color: "blue" },
        },
        {
          value: [118.66471 + 0.3, 37.434564],
          name: `${this.noLocal.staby_desc||'无'}异地`,
          symbolSize: this.noLocal.stabydb_isalert == 0 ? 1 : 50,
          label: {
            offset: [0, -0],
          },
          itemStyle: { color: "#4fb6d2" },
        },
        {
          value: [120.525121 + 0.3, 36.866232],
          symbolSize: this.local.primarydb_isalert == 0 ? 1 : 50,
          name: `${this.local.primary_desc}主库`,
        },
      ];
      let centerPoints = [
        {
          value: [
            (120.374402 + 120.525121) / 2 - 0.3,
            (36.168923 + 36.866232) / 2,
          ],
          name: "A(秒)",
          delay: this.local.apply_delay,
          symbolSize: this.local.apply_isalert == 0 ? 1 : 50,
          label: {
            position: "left",
            offset: [0, -5],
          },
          itemStyle: { color: "blue" },
        },
        {
          value: [
            (120.374402 + 120.525121) / 2 + 0.3,
            (36.168923 + 36.866232) / 2,
          ],
          name: "T(秒)",
          delay: this.local.trans_delay,
          symbolSize: this.local.trans_isalert == 0 ? 1 : 50,
          label: {
            position: "right",
            offset: [0, -5],
          },
          itemStyle: { color: "blue" },
        },
        {
          value: [
            (120.525121 + 118.66471) / 2 - 0.4,
            (37.434564 + 36.866232) / 2,
          ],
          name: "A(秒)",
          delay: this.noLocal.apply_delay,
          symbolSize: this.noLocal.apply_isalert == 0 ? 1 : 50,
          label: {
            offset: [0, 5],
          },
          itemStyle: { color: "red" },
        },
        {
          value: [
            (120.525121 + 118.66471) / 2 + 0.4,
            (37.434564 + 36.866232) / 2,
          ],
          delay: this.noLocal.trans_delay,
          symbolSize: this.noLocal.trans_isalert == 0 ? 1 : 50,
          name: "T(秒)",
          label: {
            position: "right",
            offset: [0, -5],
          },
          itemStyle: { color: "red" },
        },
      ];
      memoryChart.showLoading();
      let index = -1;
      let appendData1 = transtodata(
        transtomap(
          [
            [120.525121, 36.866232],
            [120.374402, 36.168923],
          ],
          4
        ),
        55,
        [this.local.apply_isalert, this.local.trans_isalert,this.local.stabydb_isalert]
      );
      let appendData2 = transtodata(
        transtomap(
          [
            [120.525121, 36.866232],
            [118.66471, 37.434564],
          ],
          5
        ),
        -80,
        [this.noLocal.apply_isalert, this.noLocal.trans_isalert,this.noLocal.stabydb_isalert]
      );
      console.log(appendData2);
      memoryChart.hideLoading();
      let option = {
        backgroundColor: "transparent",
        title: {
          left: 20,
          bottom: 20,
          text: "A:应用延时；T:传输延时",
        },
        geo: {
          map: "山东",
          aspectScale: 0.75, //长宽比
          // zoom: 1.1,
          roam: false,
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
            type: "scatter",
            coordinateSystem: "geo",
            showEffectOn: "render",
            zlevel: 6,
            rippleEffect: {
              period: 4,
              scale: 4,
              brushType: "stroke",
            },
            effectType: "ripple",
            hoverAnimation: true,
            label: {
              normal: {
                formatter: (params) => {
                  console.log(typeof params.data.delay);
                  return params.name + ":\n" + (params.data.delay||'无法连接');
                },
                position: "left",
                offset: [20, 10],
                color: "#1DE9B6",
                fontSize: 15,
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
            symbol: "image:///报警闪烁光点@3x.png",
            symbolSize: 50,
            data: centerPoints,
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
                fontSize: 15,
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
            symbol: "image:///报警闪烁光点@3x.png",
            symbolSize: 50,
            data: points,
          },
          ...appendData1,
          ...appendData2,
        ],
      };
      memoryChart.setOption(option, {
        notMerge: true,
      });

      //  option.series.push(appendData);
      //  console.log(option);
      //  memoryChart.setOption(option,{ notMerge: true,});
      //memoryChart.appendData({data:[appendData]});
      window.addEventListener("resize", () => {
        console.log("resize");
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