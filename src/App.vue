<template>
  <div id="app">
    <div class="nav">
      <p>数据库监控系统</p>
      <el-popover width="200" trigger="click" class="select select_shili">
        <el-select v-model="select_shili" size="mini" @change="changeShili">
          <el-option
            v-for="item in list"
            :key="item.row_id"
            :value="item.row_id"
            :label="item.ins_desc"
          ></el-option>
        </el-select>
        <span slot="reference" class="titel_span">配置实例</span>
      </el-popover>
    </div>
    <div class="container">
      <div class="center">
        <div class="left" >
          <div class="memory_content" style="height:19.4vh">
            <div class="title">
              <p>内存使用和数据库健康</p>
            </div>
            <memory />
          </div>
          <div class="memory_content" style="min-height: 16rem;height:26.418vh">
            <div class="title">
              <p>网络流量分析</p>
            </div>
            <internet />
          </div>
          <div class="memory_content" style="height:19.4vh">
            <div class="title">
              <p>存储性能</p>
            </div>
            <store />
          </div>
        </div>
        <div class="right" >
          <div class="map_center">
            <div class="map">
              <div class="memory_content">
                <div class="title">
                  <p>两地三中心</p>
                </div>
                <gmap />
              </div>
            </div>
            <div class="other">
              <div class="memory_content" style="height:19.4vh">
                <div class="title">
                  <p>告警信息</p>
                </div>
                <alarm />
              </div>
              <div class="memory_content" style="min-height: 16rem;height:26.418vh">
                <div class="title">
                  <p>存储空间使用信息</p>
                </div>
                <storage />
              </div>
              <div class="memory_content" style="height:19.4vh">
                <div class="title">
                  <p>表空间信息</p>
                </div>
                <table-space />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom" >
        <div class="cpu">
          <div class="memory_content">
            <div class="title">
              <p>主机CPU&活跃会话</p>
            </div>
            <cpu />
          </div>
        </div>
        <div class="alarm">
          <div class="memory_content">
            <div class="title">
              <p>告警信息</p>
              <el-popover
                width="200"
                trigger="click"
                class="select select_shili"
              >
                <el-select
                  v-model="select_real_shili"
                  size="mini"
                  @change="changerealShili"
                >
                  <el-option value="1" label="当前实例"></el-option>
                  <el-option value="2" label="所有实例"></el-option>
                </el-select>
                <span slot="reference" class="titel_span">选择实例</span>
              </el-popover>
              <el-popover width="200" trigger="click" class="select">
                <el-select
                  multiple
                  v-model="select"
                  size="mini"
                  style=""
                  @change="chooseLevel"
                >
                  <el-option :value="1" label="一级绿色"></el-option>
                  <el-option :value="2" label="二级黄色"></el-option>
                  <el-option :value="3" label="三级橙色"></el-option>
                  <el-option :value="4" label="四级红色"></el-option>
                </el-select>
                <span slot="reference" class="titel_span">选择告警顶级</span>
              </el-popover>
            </div>
            <alarm-table />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import memory from "@/components/left/memory.vue";
import internet from "@/components/left/internet.vue";
import store from "@/components/left/store.vue";
import cpu from "@/components/left/cpu.vue";
import gmap from "@/components/right/map.vue";
import alarm from "@/components/right/alarm.vue";
import storage from "@/components/left/storage.vue";
import tableSpace from "@/components/left/tableSpace.vue";
import alarmTable from "@/components/left/alarmTable.vue";
import Cookie from "js-cookie";
export default {
  name: "App",
  components: {
    memory,
    internet,
    store,
    cpu,
    gmap,
    alarm,
    tableSpace,
    storage,
    alarmTable,
  },
  data() {
    return {
      select: Cookie.get("v") ? JSON.parse(Cookie.get("v")) : [4],
      list: [],
      select_shili: Cookie.get("shili")
        ? JSON.parse(Cookie.get("shili")).row_id
        : "",
      select_real_shili: Cookie.get("realshili")
        ? Cookie.get("realshili")
        : '1',
      obj: {
        position: "absolute",
        right: ".25rem",
        right: "3px",
        top: "-11px",
        backgroundColor: "rgba(1, 239, 220, 0.08)",
      },
    };
  },
  async created() {
    let data = await this.$http.get("/", {
      params: {real:this.select_real_shili, v: JSON.stringify(this.select) },
    });
    let displayData=await this.$http.get('/index/choose');
     Cookie.set("shili", JSON.stringify(displayData),{expires:365});
    let index=data.findIndex(v=>{
      let {ohm_ip,ohm_port,ins_id,ins_desc}=v;
       return JSON.stringify({ohm_ip,ohm_port,ins_id,ins_desc})==JSON.stringify(displayData)
      });
    console.log(index);
    this.select_shili=index>=0?data[index].row_id:'';
    this.list = data;
    window.addEventListener('resize',()=>{
      this.$forceUpdate();
    })
  },
  methods: {
    changeShili(v) {
      let data = this.list.find((vi) => vi.row_id == v);
      this.$http.post("/index/choose", data).then(() => {
        Cookie.set("shili", JSON.stringify(data),{expires:365});
        console.log(Cookie.get('shili'))
      });
    },
    chooseLevel(v) {
      Cookie.set("v", JSON.stringify(v),{expires:365});
    },
    changerealShili(v) {
      Cookie.set("realshili", v,{expires:365});
    },
  },
};
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body,
#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
}
</style>
<style lang="less" scoped>
.memory_content_basic {
  flex: 1;
  .title {
    width: 100%;
    font-size: 1.25rem;
    text-align: center;
    font-family: PingFangSC;
    font-weight: bold;
    color: #00f6ff;
    height: 1.875rem;
    margin-top: 0.9375rem;
    background-image: url(~@/assets/titlebg.png);
    background-size: 80% 200%;
    background-repeat: no-repeat;
    background-position: 50% 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    p {
      height: 1.1875rem;
      line-height: 1.25rem;
    }
  }
  margin-bottom: 1rem;
  background: rgba(1, 239, 220, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  //align-items: center;
  border-radius: 6px;
  border: 1px solid #01efdc;
  width: 100%;
  height: 25%;
  background-image: url(~@/assets/line1.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // flex: 1;
}
#app {
  display: flex;
  padding: 1.375rem;
  background-image: url(~@/assets/bigbg.png);
  display: flex;
  flex-direction: column;
  .nav {
    height: 3.625rem;
    width: 100%;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    background-image: url(~@/assets/bdbg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-bottom: 0.625rem;
    .select {
      background-color: rgba(0, 0, 0, 0) !important;
      color: #00f6ff;
      /deep/ .el-popover__reference-wrapper {
        background-color: transparent;
      }
      position: absolute;
      right: 3px;
      top: -11px;
      width: 5rem;
      &_shili {
        right: 103px;
      }
      .titel_span {
        font-size: 0.75rem;
        &:focus {
          outline: none;
        }
      }
    }
    p {
      font-size: 2.6875rem;
      font-family: PingFangSC;
      font-weight: 600;
      color: #ffffff;
      line-height: 2.1875rem;
      background: linear-gradient(
        90deg,
        rgba(3, 99, 198, 0.6) 0%,
        rgba(4, 106, 213, 0) 100%
      );
    }
  }

  .container {
    width: 100%;
    height: 0;
    display: flex;
    flex-direction: column;
    // overflow: hidden;
    flex: 1 1 auto;
    position: relative;
    .center {
      flex: 3 3 auto;
      height: 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      .left {
        width: 33.75rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        .memory_content {
          .memory_content_basic;
        }
      }
      .right {
        width: 68.85vw;
        height: 100%;
        flex: 1;
        margin-left: 1rem;

        display: flex;
        flex-direction: column;
        .map_center {
          width: calc(100% - 1px);
          height: 100%;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          // padding: 0 0 0 0.875rem;
          .map {
            width: 100%;
            flex: 1;
            height: 100%;
            margin-right: 1rem;
            padding-bottom: 1rem;
            // padding-right:1rem ;

            .memory_content {
              .memory_content_basic;
              height: 100%;
            }
          }
          .other {
            width: 33.75rem;
            height: 100%;

            display: flex;
            flex-direction: column;
            .memory_content {
              .memory_content_basic;
            }
          }
        }
      }
    }
    .bottom {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 0;
      flex: 1 1 auto;
      .cpu {
        width: 33.75rem;
        height: 100%;
        .memory_content {
          .memory_content_basic;
          height: 100%;
        }
      }
      .alarm {
        width: 68.85vw;
        flex: 1;
        margin-left: 0.875rem;
        .memory_content {
          .memory_content_basic;
          height: 100%;
          .title {
            background-size: 30% 200%;
            position: relative;
            .select {
              background-color: transparent !important;
              /deep/ .el-popover__reference-wrapper {
                background-color: transparent;
              }
              position: absolute;
              right: 3px;
              top: -11px;
              width: 5rem;
              &_shili {
                right: 103px;
              }
              .titel_span {
                font-size: 0.75rem;
                &:focus {
                  outline: none;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
