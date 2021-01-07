<template>
  <div class="com_container">
    <div class="data" v-for="item of 3" :key="item">
      <div class="table">
        <div>
          <div class="title"><span>状态</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <div class="ponit"><span>：</span></div>
          <div class="content">
            <span v-if="list[item - 1]"
              ><i
                :class="[
                  list[item - 1]['STATUS'] ? 'el-icon-close' : 'el-icon-check',
                ]"
              ></i
            ></span>
          </div>
        </div>
        <div>
          <div class="title"><span>名称</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <div class="ponit"><span>：</span></div>
          <div class="content">
            <span v-if="list[item - 1]">{{
              list[item - 1] ? list[item - 1]["network_name"] : ""
            }}</span>
          </div>
        </div>
        <div>
          <div class="title"><span>输入流量</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <div class="ponit"><span>：</span></div>
          <div class="content">
            <span v-if="list[item - 1]" 
            
              >{{
                list[item - 1] ? list[item - 1]["input_flow"] : ""
              }}Kbps</span>
              <el-progress
              style="flex: 1; width: 100%"
              v-if="list[item - 1]"
              :percentage="
                list[item - 1] ? list[item - 1]['input_ratio'] * 100 : 0
              "
              :color="
                customColor(
                  list[item - 1]
                    ? list[item - 1]['input_ratio_isalert'] 
                    : 0
                )
              "
            ></el-progress>
          </div>
        </div>
        <div>
          <div class="title"><span>输出流量</span>&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <div class="ponit"><span>：</span></div>
          <div class="content">
            <span v-if="list[item - 1]"
              >{{
                list[item - 1] ? list[item - 1]["output_flow"] : ""
              }}Kbps</span
            ><el-progress
              style="flex: 1; width: 100%"
              v-if="list[item - 1]"
              :percentage="
                list[item - 1] ? list[item - 1]['output_ratio'] * 100 : 0
              "
              :color="
                customColor(
                  list[item - 1]
                    ? list[item - 1]['output_ratio_isalert'] 
                    : 0
                )
              "
            ></el-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "internet",
  data() {
    return {
      list: [],
    };
  },
  async mounted() {
    let data1 = await this.$http.get("/index/internet");
    setInterval(async () => {
      data1 = await this.$http.get("/index/internet");
      this.list = data1;
    }, 10000);
    this.list = data1;
  },
  methods: {
    drawMemory() {},
    customColor(index) {
      return ["green", "yellow", "orange", "red"][index];
    },
  },
};
</script>
<style lang="less" scoped>
.com_container {
  flex: 1 1 auto;
  width: 100%;
  height: 0;
  // display: flex;
  // flex-direction: column;
  overflow: hidden;
  .data {
    // height: 3rem;
    // flex: 1 1 auto;
    height:33%;
    width: 100%;
    font-size: 12px;
    color: aqua;
    // display: block;
    .table {
      width: 100%;
      display: block;
      &>div {
        display: flex;
        flex-direction: row;
        span {
          transform: scale(0.8);
        }
        .title {
          width: 20%;
          padding-right: 1.5rem;
          text-align: right;

          border: 0.2px solid #00a7ff;
        }
        .ponit {
          text-align: right;
          width: 1rem;
          border: 0.2px solid #00a7ff;
        }
        .content {
          i.el-icon-check {
            background-color: green;
          }
          i.el-icon-close {
            background-color: red;
          }
          /deep/ .el-progress__text{
            color: aqua;
          }
          flex: 1;
          width: 100%;
          display: flex;
          border: 0.2px solid #00a7ff;
        }
      }
    }
  }
}
</style>