<template>
  <div class="com_container">
    <div>
      <div id="alarm1"></div>
    </div>
    <div>
      <div id="alarm2"></div>
    </div>
  </div>
</template>
<script>
let memoryChart1,
  memoryChart2 = null;
export default {
  name: "memory",
  data() {
    return {
      memoryData: [],
      healthData: [],
    };
  },
  async mounted() {
    memoryChart1 = echarts.init(document.getElementById("alarm1"), "dark");
    memoryChart2 = echarts.init(document.getElementById("alarm2"), "dark");
    let data1 = await this.$http.get("/index/level");
    let data2 = await this.$http.get("/index/class");
    this.memoryData = data1.map((v) => {
      return {
        name: v.alert_level,
        value: v.alert_nums,
        itemStyle: {
          color:
            v.alert_level === 0
              ? "green"
              : v.alert_level === 1
              ? "yellow"
              : v.alert_level === 2
              ? "orange"
              : "red",
        },
      };
    });
    this.healthData = data2
      .sort((a, b) => a.alert_nums - b.alert_nums)
      .map((v) => {
        return {
          name: v.alert_class,
          value: v.alert_nums,
          ...v,
          // itemStyle: {
          //   color:
          //     v.alert_level === 0
          //       ? "green"
          //       : v.alert_level === 1
          //       ? "yellow"
          //       : v.alert_level === 2
          //       ? "orange"
          //       : "red",
          // },
        };
      });
    setInterval(async () => {
      data1 = await this.$http.get("/index/level");
      data2 = await this.$http.get("/index/class");
      this.memoryData = data1.map((v) => {
        return {
          name: v.alert_level,
          value: v.alert_nums,
          itemStyle: {
            color:
              v.alert_level === 0
                ? "green"
                : v.alert_level === 1
                ? "yellow"
                : v.alert_level === 2
                ? "orange"
                : "red",
          },
        };
      });
      this.healthData = data2
        .sort((a, b) => a.alert_nums - b.alert_nums)
        .map((v) => {
          return {
            name: v.alert_class,
            value: v.alert_nums,
            ...v,
            // itemStyle: {
            //   color:
            //     v.alert_level === 0
            //       ? "green"
            //       : v.alert_level === 1
            //       ? "yellow"
            //       : v.alert_level === 2
            //       ? "orange"
            //       : "red",
            // },
          };
        });
      this.drawMemory();
    }, 10000);
    this.drawMemory();
  },
  methods: {
    drawMemory() {
      let option1 = {
        title: {
          text: "不同告警等级的告警信息",
          x: "center",
          y: "top",
          textAlign: "center",
          textStyle: {
            fontSize: 12,
            fontWeight: "normal",
            color: "#00FBFF",
          },
        },
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          position: ["50%", "50%"],
        },
        grid: {
          top: "0%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        series: [
          {
            name: "告警级别",
            type: "pie",
            radius: ["30%", "50%"],
            center: ["50%", "50%"],
            // avoidLabelOverlap: false,
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: "14",
            //     // fontWeight: "bold",
            //   },
            // },
            label: {
              // position: "outer",
              alignTo: "edge",
              // verticalAlign: "center",
              // formatter: "{b}:\n{c}%",
              position: "outer",
              margin: 10,
              // position: "outside",
              // alignTo: "edge",
              // margin: "25%",
              formatter: "告警级别{b}:\n{c}",
            },
            data: this.memoryData,
          },
        ],
      };
      let option2 = {
        title: {
          text: "不同告警类别的告警信息",
          textStyle: {
            fontSize: 12,
            fontWeight: "normal",
            color: "#00FBFF",
          },
          x: "center",
          y: "top",
          textAlign: "center",
        },
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          position: ["0%", "0%"],
        },
        grid: {
          top: "4%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        series: [
          {
            name: "告警类别",
            type: "pie",
            radius: ["30%", "50%"],
            center: ["50%", "50%"],
            data: this.healthData,
            label: {
              alignTo: "edge",
              // verticalAlign: "center",
              // formatter: "{b}:\n{c}%",
              position: "outer",
              margin: 10,
              formatter: (params) => {
                // console.log(params);
                return params.name + ":\n" + params.value;
              },
            },
          },
        ],
      };
      memoryChart1.setOption(option1, {
        notMerge: true,
      });
      memoryChart2.setOption(option2, {
        notMerge: true,
      });
      window.addEventListener("resize", () => {
        // console.log("resize");
        requestAnimationFrame(() => {
          memoryChart1.resize();
          memoryChart2.resize();
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
  display: flex;
  flex-direction: row;
  & > div {
    width: 50%;
    height: 100%;
    // margin: 1px;
    overflow: hidden;
    div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>