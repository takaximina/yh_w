<template>
  <div class="com_container">
    <div>
      <div id="store1"></div>
    </div>
    <div>
      <div id="store2"></div>
    </div>
  </div>
</template>
<script>
let memoryChart1,
  memoryChart2 = null;
export default {
  name: "memory",
  async mounted() {
    memoryChart1 = echarts.init(document.getElementById("store1"), "dark");
    memoryChart2 = echarts.init(document.getElementById("store2"), "dark");
    let data1 = await this.$http.get("/index/io");
    this.memoryData = data1.map((v) => {
      return [v.physical_reads, v.physical_rtime];
    });
    this.healthData = data1.map((v) => {
      return [v.physical_writes, v.physical_wtime];
    });
    this.date = data1.map((v) => {
      return v.sys_date.substring(10, 16);
    });
    setInterval(async () => {
      data1 = await this.$http.get("/index/io");
      this.memoryData = data1.map((v) => {
        return [v.physical_reads, v.physical_rtime];
      });
      this.healthData = data1.map((v) => {
        return [v.physical_writes, v.physical_wtime];
      });
      this.date = data1.map((v) => {
        return v.sys_date.substring(10, 16);
      });
      this.drawMemory();
    }, 10000);
    this.drawMemory();
  },
  data() {
    return {
      memoryData: [],
      healthData: [],
      date: [],
    };
  },
  methods: {
    drawMemory() {
      let colors = ["#5470C6", "#EE6666"];
      let option1 = {
        color: colors,
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          confine: true,
          // position:[0,0]
          // axisPointer: {
          //   type: "cross",
          // },
        },
        legend: {
          data: ["物理读响应时间(微秒/次)", "物理读（秒/次）"],
        },
        grid: {
          top: "20%",
          bottom: "25%",
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1],
              },
            },

            data: this.date,
          },
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 50,
            axisPointer: {
              label: {
                formatter: function (params) {
                  return "物理读响应时间  " + params.value + "(微秒/次)";
                },
              },
            },
          },
          {
            type: "value",
            minInterval: 30,
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              label: {
                formatter: function (params) {
                  return "物理读  " + params.value + "（秒/次）";
                },
              },
            },
          },
        ],
        series: [
          {
            name: "物理读响应时间(微秒/次)",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.memoryData.map((v) => v[1]),
          },
          {
            name: "物理读（秒/次）",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.memoryData.map((v) => v[0]),
          },
        ],
      };
      let option2 = {
        color: colors,
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          confine: true,
          appendToBody: true,
          // position:[0,0]
          // axisPointer: {
          //   type: "cross",
          // },
        },
        legend: {
          data: ["物理写响应时间(微秒/次)", "物理写（秒/次）"],
        },
        grid: {
          top: "20%",
          bottom: "25%",
        },
        xAxis: [
          {
            type: "category",
            minInterval: 50,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[1],
              },
            },

            data: this.date,
          },
        ],
        yAxis: [
          {
            type: "value",
            min: "dataMin",
            max: "dataMax",

            axisPointer: {
              label: {
                formatter: function (params) {
                  return "物理写响应时间  " + params.value + "(微秒/次)";
                },
              },
            },
          },
          {
            type: "value",
            minInterval: 30,
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              label: {
                formatter: function (params) {
                  return "物理写  " + params.value + "（秒/次）";
                },
              },
            },
          },
        ],
        series: [
          {
            name: "物理写响应时间(微秒/次)",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.healthData.map((v) => v[1]),
          },
          {
            name: "物理写（秒/次）",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.healthData.map((v) => v[0]),
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
        console.log("resize");
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
  flex-direction: column;
  & > div {
    width: 100%;
    height: 50%;
    // margin: 1px;
    overflow: hidden;
    div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>