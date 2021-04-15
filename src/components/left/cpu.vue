<template>
  <div class="cpu_container">
    <div id="cpu1"></div>
    <div id="cpu2"></div>
  </div>
</template>
<script>
let memoryChart1 = null,
  memoryChart2;
export default {
  name: "internet",
  data() {
    return {
      memoryData: {},
      healthData: {},
    };
  },
  async mounted() {
    memoryChart1 = echarts.init(document.getElementById("cpu1"), "dark");
    memoryChart2 = echarts.init(document.getElementById("cpu2"), "dark");
    let data1 = await this.$http.get("/index/cpu");
    let data2 = await this.$http.get("/index/session");
    setInterval(async () => {
      data1 = await this.$http.get("/index/cpu");
      data2 = await this.$http.get("/index/session");
      this.memoryData = Object.assign({}, { ...data1[0] });
      this.healthData = Object.assign({}, { ...data2[0] });
      this.drawMemory();
    }, 10000);
    this.memoryData = Object.assign(this.memoryData, { ...data1[0] });
    this.healthData = Object.assign(this.healthData, { ...data2[0] });
    this.drawMemory();
  },
  methods: {
    drawMemory() {
      let option1 = {
        title: [
          {
            text: "cpu",
            x: "center",
            y: "top",
            textAlign: "center",
            textStyle: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#00FBFF",
            },
          },
          {
            text: `负载  ${this.memoryData.load_avg} 分页 ${this.memoryData.pagination}`,
            left: "center",
            bottom: "4%",
            textAlign: "center",
            textStyle: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#00FBFF",
            },
          },
        ],
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/> {c}",
        },
        yAxis: [
          {
            type: "value",
            max: 100,
            axisLabel:{
            show:true,
            formatter:'{value}%'
            }
          },
        ],
        legend: {
          orient: "vertical",
          align: "right",
          left: "right",
          top: "middle",
          data: ["其他",this.memoryData.db_sidname, ],
        },
        xAxis: [
          {
            type: "category",
            data: ["周一"],
            show: false,
          },
        ],
        grid: {
          top: "20%",
          // left: "3%",
          right: "20%",
          bottom: "10%",
          containLabel: true,
        },

        series: [
          {
            name: this.memoryData.db_sidname,
            type: "bar",
            barWidth: 20,
            stack: "主机CPU",
            data: [this.memoryData.sid_cpu_ratio],
          },
          {
            name: "其他",
            type: "bar",
            stack: "主机CPU",
            data: [this.memoryData.else_cpu_ratio],
          },
        ],
      };
      let option2 = {
        title: [
          {
            text: "活跃会话",
            x: "center",
            y: "top",
            textAlign: "center",
            textStyle: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#00FBFF",
            },
          },
          {
            text: `活跃会话数  ${this.healthData.cpu_cores}`,
            left: "center",
            bottom: "4%",
            textAlign: "center",
            textStyle: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#00FBFF",
            },
          },
        ],
        legend: {
          orient: "vertical",
          align: "right",
          left: "right",
          top: "middle",
          data: [ "等待","CPU","用户I/O", ],
        },
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/> {c}",
        },
        yAxis: [
          {
            type: "value",
            max: "dataMax",
          },
        ],
        // legend: {
        //   data: ["搜索引擎", "百度", "谷歌", "必应"],
        // },
        xAxis: [
          {
            type: "category",
            data: ["周一"],
            show: false,
          },
        ],
        grid: {
          top: "20%",
          // left: "3%",
          right: "20%",
          bottom: "10%",
          containLabel: true,
        },

        series: [
          {
            name: "用户I/O",
            type: "bar",
            barWidth: 20,
            stack: "活跃会话",
            data: [this.healthData.user_io_nums],
          },
          {
            name: "CPU",
            type: "bar",
            stack: "活跃会话",
            data: [this.healthData.on_cpu_nums],
          },
          {
            name: "等待",
            type: "bar",
            stack: "活跃会话",
            data: [this.healthData.else_nums],
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
.cpu_container {
  flex: 1;
  height: calc(100% - 1.875rem - 0.9375rem);
  width: 100%;
  display: flex;
  #cpu1 {
    width: 50%;
    flex: 1;
    height: 100%;
    // margin: 1px;
    // overflow: hidden;
  }
  #cpu2 {
    width: 50%;
    flex: 1;
    height: 100%;
    // margin: 1px;
    // overflow: hidden;
  }
}
</style>
