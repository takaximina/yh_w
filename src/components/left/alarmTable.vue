<template>
  <el-table
    :data="list"
    class="com_table"
    height="200"
    border
    header-row-class-name="table_header"
    :header-cell-style="{ borderColor: ' #00a7ff' }"
    :cell-style="cellStyle"
  >
    <el-table-column
      label="告警等级"
      align="center"
      prop="alert_level"
    ></el-table-column>
    <el-table-column
      label="时间"
      align="center"
      prop="alert_sys_date"
    ></el-table-column>
    <el-table-column label="告警类别" align="center" prop="alert_category_name" show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.alert_category_name }}
      </template>
    </el-table-column>
    <el-table-column label="告警描述" align="center" prop="alert_type_name" show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.alert_type_name }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Cookie from 'js-cookie';
export default {
  data() {
    return {
      list: [],
    };
  },
  async created() {
    let data = await this.$http.get("/index/alarm",{params:{real: Cookie.get("realshili")||'1',v:Cookie.get('v')||JSON.stringify([4])}});
    setInterval(async ()=>{
      data=await this.$http.get("/index/alarm",{params:{real: Cookie.get("realshili")||'1',v:Cookie.get('v')||JSON.stringify([4])}});
      this.list=data
    },10000)
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
  width: 100%;
  height: 100%;
  max-height: 12.5rem;
  flex: 1;
  background-color: transparent !important;
  /deep/ tr {
  background-color: rgba(1, 239, 220, 0.08) !important;
  th {
    background-color: rgba(1, 239, 220, 0.08) !important;
  }
}
/deep/ .el-table td,
tr.el-table__header,
.el-table th.is-leaf,
.el-table--border,
.el-table--border, .el-table--group,
.el-table--group {
  border-color: #00a7ff !important;
}
}
.table_header{
  border-color: #00a7ff !important;
}

</style>