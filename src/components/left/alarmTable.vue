<template>
  <el-table
    :data="list"
    class="com_table"
    height="200"
    border
    header-row-class-name="table_header"
  >
    <el-table-column label="告警等级" align="center"  prop="alert_level"></el-table-column>
    <el-table-column label="时间" align="center" prop="alert_sys_date"></el-table-column>
    <el-table-column label="告警类别" align="center" prop="alert_type_name">
      <template slot-scope="scope">
        {{scope.row.alert_type_name.substring(0,20)}}
      </template>
    </el-table-column>
    <el-table-column label="告警描述" align="center" prop="alert_value">
      <template slot-scope="scope">
        {{scope.row.alert_value.substring(0,20)}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data(){
    return {
      list:[]
    }
  },
  async created(){
    let data=await this.$http.get('/index/alarm');
    this.list=data
  }
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
}
</style>