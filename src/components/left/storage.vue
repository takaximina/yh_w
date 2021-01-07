<template>
  <div class="com_container">
    <div class="data">
      <div class="table">
        <div>
          <div class="title" v-for="item of 5" :key="item">
            <span>{{ list[item - 1] ? list[item - 1].type_name : "" }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <div class="shuitong">
          <div class="title" v-for="item of 5" :key="item">
            <div :id="'liquid' + item"></div>
          </div>
        </div>
        <div>
          <div class="title" v-for="item of 5" :key="item">
            <span>{{ list[item - 1] ? list[item - 1].use_Pct+'%' : "" }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <div>
          <div class="title" v-for="item of 5" :key="item">
            <span>{{ list[item - 1] ? list[item - 1].total_Gb+'GB' : "" }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
function getOption(data, level, use) {
  // console.log(data, level, use);
  let color =
    level === 0
      ? "green"
      : level === 1
      ? "yellow"
      : level === 2
      ? "orange"
      : "red";
  return {
    backgroundColor: "transparent",
    title: {
      text: "已使用" + use + "Gb",
      textStyle: {
        fontWeight: "normal",
        fontSize: 12,
        color: "rgb(97, 142, 205)",
      },
    },
    series: [
      {
        type: "liquidFill",
        radius: "65%",
        center: ["50%", "50%"],
        data: [data / 100, data / 100, data / 100], // data个数代表波浪数
        color: [color, color, color],
        backgroundStyle: {
          borderWidth: 1,
          color: "rgb(255,0,255,0.1)",
        },
        label: {
          normal: {
            formatter: data.toFixed(2) + "%",
            textStyle: {
              fontSize: 12,
            },
          },
        },
        outline: {
          show: false,
        },
      },
      {
        type: "pie",
        center: ["50%", "50%"],
        radius: ["70%", "72%"],
        hoverAnimation: false,
        data: [
          {
            name: "",
            value: 500,
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#5886f0",
            },
            emphasis: {
              labelLine: {
                show: false,
              },
              itemStyle: {
                color: "#5886f0",
              },
            },
          },
          {
            //画中间的图标
            name: "",
            value: 0,
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#ffffff",
              normal: {
                color: "#5886f0",
                borderColor: "#5886f0",
                borderWidth: 4,
                // borderRadius: '100%'
              },
            },
            label: {
              borderRadius: "100%",
            },
            emphasis: {
              labelLine: {
                show: false,
              },
              itemStyle: {
                color: "#5886f0",
              },
            },
          },
          {
            // 解决圆点过大后续部分显示明显的问题
            name: "",
            value: 0,
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#5886f0",
            },
            emphasis: {
              labelLine: {
                show: false,
              },
              itemStyle: {
                color: "#5886f0",
              },
            },
          },
          {
            //画剩余的刻度圆环
            name: "",
            value: 0,
            itemStyle: {
              color: "#050038",
            },
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            emphasis: {
              labelLine: {
                show: false,
              },
              itemStyle: {
                color: "#050038",
              },
            },
          },
        ],
      },
    ],
  };
}
let liquid1, liquid2, liquid3, liquid4, liquid5;
export default {
  name: "internet",
  data() {
    return {
      list: [],
    };
  },
  async mounted() {
    liquid1 = echarts.init(document.getElementById("liquid1"), "dark");
    liquid2 = echarts.init(document.getElementById("liquid2"), "dark");
    liquid3 = echarts.init(document.getElementById("liquid3"), "dark");
    liquid4 = echarts.init(document.getElementById("liquid4"), "dark");
    liquid5 = echarts.init(document.getElementById("liquid5"), "dark");
    let data1 = await this.$http.get("/index/storage");
    this.list = data1;
    setInterval(async () => {
      data1 = await this.$http.get("/index/storage");
      this.list = data1;
      this.drawMemory();
    }, 10000);
    this.drawMemory();
  },
  methods: {
    drawMemory() {
      let option1 = getOption(
        this.list[0] ? this.list[0].use_Pct : 0,
        this.list[0] ? this.list[0].is_alert : 0,
        this.list[0] ? this.list[0].use_Gb : 0
      );
      liquid1.setOption(option1, {
        notMerge: true,
      });
      liquid2.setOption(
        getOption(
          this.list[1] ? this.list[1].use_Pct : 0,
          this.list[1] ? this.list[1].is_alert : 0,
          this.list[1] ? this.list[1].use_Gb : 0
        ),
        {
          notMerge: true,
        }
      );
      liquid3.setOption(
        getOption(
          this.list[2] ? this.list[2].use_Pct : 0,
          this.list[2] ? this.list[2].is_alert : 0,
          this.list[2] ? this.list[2].use_Gb : 0
        ),
        {
          notMerge: true,
        }
      );
      liquid4.setOption(
        getOption(
          this.list[3] ? this.list[3].use_Pct : 0,
          this.list[3] ? this.list[3].is_alert : 0,
          this.list[3] ? this.list[3].use_Gb : 0
        ),
        {
          notMerge: true,
        }
      );
      liquid5.setOption(
        getOption(
          this.list[4] ? this.list[4].use_Pct : 0,
          this.list[4] ? this.list[4].is_alert : 0,
          this.list[4] ? this.list[4].use_Gb : 0
        ),
        {
          notMerge: true,
        }
      );
      window.addEventListener("resize", () => {
        // console.log("resize");
        requestAnimationFrame(() => {
          liquid1.resize();
          liquid2.resize();
          liquid3.resize();
          liquid4.resize();
          liquid5.resize();
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.com_container {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .data {
    // height: 3rem;
    flex: 1;
    height: 100%;
    width: 100%;
    font-size: 12px;
    color: aqua;
    .table {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex:1;
      &>div {
        display: flex;
        flex-direction: row;
        &.shuitong {
          height: 100%;
          // max-height: 10rem;
          flex: 1 1 auto;
          .title {
            padding: 0;
            height: 100%;
          }
          div {
            width: 100%;
            height: 100%;
          }
        }
        .title {
          width: 20%;
          padding-right: 1rem;
          text-align: center;
          font-size: 0.75rem;
          height: 1.1rem;
          border: 0.5px solid #00a7ff;
        }
      }
    }
  }
}
</style>