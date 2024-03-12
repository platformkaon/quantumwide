<template>
  <el-table
    header-cell-class-name="my-header"
    :data="tableData.filter(id => !search || id.password.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="Password"
      prop="password">
    </el-table-column>
    <el-table-column
      label="Action"
      >
      <template slot-scope="scope">
        <button type="button" class="iconset icon-trash">{{ t('delete').cap }}</button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [
          {
            id: 'KAON12',
            password: 'ss'
          }, 
          {
            id: '2016-05-02',
            password: 'John',
          },
        ],
        search: '',
      }
    },
    methods: {
      handleDelete(index, row) {
        console.log(index, row);
      }
    },
  }
</script>

<style>
.my-header {
    font-weight: 400 !important;
    /* font-size: .875rem !important;
    padding: 1rem .5rem !important; */
    background-color: #f3f3f3 !important;
}
</style>