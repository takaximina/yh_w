<template>
  <el-table
    :data="list"
    class="com_table"
    height="200"
    border
    header-row-class-name="table_header"
    :header-cell-style="{ borderColor: ' #00a7ff', padding: 0 }"
    :header-row-style="{ lineHeight: '30px' }"
    :cell-style="{ borderColor: '#00a7ff!important;', padding: 0,backgroundColor: `transparent !important` }"
    :row-style="{ lineHeight: '30px' }"
    cell-class-name="t_cell"
    row-class-name="table_header"
  >
    <el-table-column
      label="实例描述"
      align="center"
      prop="ins_desc"
      width="280px"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        {{ scope.row.ins_desc }}
      </template>
    </el-table-column>
    <el-table-column
      label="时间"
      align="center"
      prop="alert_sys_date"
      width="200px"
    ></el-table-column>
    <el-table-column
      label="告警类别"
      align="center"
      prop="alert_category_name"
      show-overflow-tooltip
      width="160px"
    >
      <template slot-scope="scope">
        {{ scope.row.alert_category_name }}
      </template>
    </el-table-column>
    <el-table-column
      label="告警描述"
      align="center"
      prop="alert_type_name"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        {{ scope.row.alert_value }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Cookie from "js-cookie";
export default {
  data() {
    return {
      list: [{
        ins_desc:'dwadawdwa',
        alert_sys_date:'2021-07-11 16:34:45',
        alert_category_name:"模拟告警",
        alert_value:'报警模拟'
      }],
    };
  },
  async created() {
    let data = await this.$http.get("/index/alarm", {
      params: {
        real: Cookie.get("realshili") || "1",
        v: Cookie.get("v") || JSON.stringify([3]),
      },
    });
    setInterval(async () => {
      data = await this.$http.get("/index/alarm", {
        params: {
          real: Cookie.get("realshili") || "1",
          v: Cookie.get("v") || JSON.stringify([3]),
        },
      });
      this.list = data;
    }, 10000);
    this.list = data;
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return " border-color:#00a7ff!important;";
    },
  },
};
</script>

<style lang='less' scopped>
.com_table {
  border-color: #00a7ff !important;
  width: 100%;
  height: 100%;
  max-height: 12.5rem;
  flex: 1;
  background-color: transparent !important;
  table {
    border-color: #00a7ff !important;
    tr:hover > td {
      background-color: transparent !important;
    }
    td {
      border-color: #00a7ff !important;
      color: rgb(0,255,255);
    }
    th {
      color: rgb(0,255,255);
    }
  }
  /deep/ tr {
    background-color: transparent !important;
    th {
      background-color: transparent !important;
    }
  }
  /deep/ .el-table td,
  tr.el-table__header,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--border,
  .el-table--group,
  .el-table--group {
    border-color: #00a7ff !important;
  }
}
.table_header {
  border-color: #00a7ff !important;
  background-color: transparent !important;
  th {
    background-color:transparent !important;
    color: rgb(0,255,255);
  }
}
.t_cell{
  
}
</style>