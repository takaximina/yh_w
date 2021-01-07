<template>
  <div class="com_container">
    <div>
      <div id="memory1"></div>
    </div>
    <div>
      <div id="memory2"></div>
    </div>
  </div>
</template>
<script>
let memoryChart1,
  memoryChart2 = null;
export default {
  name: "memory",
  async mounted() {
    memoryChart1 = echarts.init(document.getElementById("memory1"), "dark");
    memoryChart2 = echarts.init(document.getElementById("memory2"), "dark");

    let data1 = await this.$http.get("/index/memory");
    let data2 = await this.$http.get("/index/health");
    this.memoryData = data1.map((v) => {
      return { name: v.MemName, value: v.UseSizeGB };
    });
    this.healthData = data2.map((v) => {
      return {
        name: v.health_type,
        value: v.weight,
        ...v,
        itemStyle: {
          color:
            v.is_alert === 0
              ? "green"
              : v.is_alert === 1
              ? "yellow"
              : v.is_alert === 2
              ? "orange"
              : "red",
        },
      };
    });
    setInterval(async () => {
      data1 = await this.$http.get("/index/memory");
      data2 = await this.$http.get("/index/health");
      this.memoryData = data1.map((v) => {
        return { name: v.MemName, value: v.UseSizeGB };
      });
      this.healthData = data2.map((v) => {
        return {
          name: v.health_type,
          value: v.weight,
          ...v,
          itemStyle: {
            color:
              v.is_alert === 0
                ? "green"
                : v.is_alert === 1
                ? "yellow"
                : v.is_alert === 2
                ? "orange"
                : "red",
          },
        };
      });
      this.drawMemory();
    }, 10000);
    this.drawMemory();
  },
  data() {
    return {
      memoryData: [],
      healthData: [],
    };
  },
  methods: {
    drawMemory() {
      let option1 = {
        title: {
          text: "内存使用",
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
          position: ["0%", "0%"],
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
            name: "内存使用",
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
              formatter: "{b}:\n{c}({d}%)",
              alignTo: "edge",
              // verticalAlign: "center",
              // formatter: "{b}:\n{c}%",
              position: "outer",
              margin: 10,
            },
            data: this.memoryData,
          },
        ],
      };
      let option2 = {
        title: {
          text: "数据库健康",
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
            name: "数据库健康",
            type: "pie",
            radius: ["30%", "50%"],
            center: ["50%", "50%"],
            label: {
              formatter: (params) => {
                return params.name + ":\n" + params.data.alert_desc;
              },
              alignTo: "edge",
              // verticalAlign: "center",
              // formatter: "{b}:\n{c}%",
              position: "outer",
              margin: 10,
            },
            data: this.healthData,
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