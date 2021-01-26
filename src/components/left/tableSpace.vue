<template>
  <div class="com_container">
    <div>
      <div id="table_space"></div>
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
      data1: [],
      data2: [],
    };
  },
  async mounted() {
    memoryChart1 = echarts.init(document.getElementById("table_space"), "dark");
    let data = await this.$http.get("/index/space");
    this.data1 = data.map((v) => {
      return { value: v.usepct_inextend, color: v.inextend_is_alert, ...v };
    });
    this.data2 = data.map((v) => {
      return { value: v.usepct_noextend, color: v.noextend_is_alert, ...v };
    });
    this.list=data
    setInterval(async () => {
      data = await this.$http.get("/index/space");
      this.data1 = data.map((v) => {
        return { value: v.usepct_inextend, color: v.inextend_is_alert, ...v };
      });
      this.data2 = data.map((v) => {
        return { value: v.usepct_noextend, color: v.noextend_is_alert, ...v };
      });
      this.drawMemory();
    }, 10000);
    this.drawMemory();
  },
  methods: {
    drawMemory() {
      let color = [
        "#CC00FF",
        "#FFC0CB",
        "#FF69B4",
        "#DDA0DD",
        "#FF00FF",
        "#9400D3",
        "#8A2BE2",
      ];
      let data1 = [
        { value: 7.41, color: 0 },
        { value: 5, color: 0 },
        { value: 10, color: 0 },
        { value: 15.03, color: 0 },
        { value: 3.53, color: 0 },
      ];
      let data2 = [
        { value: 94, color: 3 },
        { value: 86, color: 2 },
        { value: 10, color: 0 },
        { value: 95, color: 3 },
        { value: 4, color: 0 },
      ];
      let option1 = {
        backgroundColor: "transparent",
        grid: {
          top: "20%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          data: [{name:"左边:考虑自动扩展使用率",icon:'none'},{name: "右边:不考虑自动扩展使用率",icon:'none'}],
        },
        tooltip: {
          formatter: "{a}<br />{b}:{c}%",
        },
        xAxis: {
          type: "category",
          axisLabel: {interval : 0},
          data: this.data1.map((v) => v.tabspace_name),
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%",
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
            barWidth: 20,
            name: "左边:考虑自动扩展使用率",
            data: this.data1.map((v) => {
              return {
                ...v,
                itemStyle: {
                  color:
                    v.color === 0
                      ? "green"
                      : v.color === 1
                      ? "yellow"
                      : v.color === 2
                      ? "orange"
                      : "red",
                },
              };
            }),
          },
          {
            type: "bar",
            name: "右边:不考虑自动扩展使用率",
            barWidth: 20,
            data: this.data2.map((v) => {
              return {
                ...v,

                itemStyle: {
                  color:
                    v.color === 0
                      ? "green"
                      : v.color === 1
                      ? "yellow"
                      : v.color === 2
                      ? "orange"
                      : "red",
                },
              };
            }),
          },
        ],
      };
      memoryChart1.setOption(option1, {
        notMerge: true,
      });
      window.addEventListener("resize", () => {
        // console.log("resize");
        requestAnimationFrame(() => {
          memoryChart1.resize();
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
    width: 100%;
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