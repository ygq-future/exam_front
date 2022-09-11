<template>
  <el-container class="container">
    <!-- <el-header></el-header> -->
    <el-main>
      <el-table :data="dataList" border row-key="teacherNo" height="600">
        <el-table-column prop="teacherNo" label="教师ID" width="180" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column label="管理专业" align="center">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.majors" :key="item.id">{{ item.name }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="账号状态" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-show="scope.row.locked !== 0">已锁定</el-tag>
            <el-tag v-show="scope.row.locked === 0">未锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="small" v-show="scope.row.locked === 0" @click="lock(scope.row.id)"
              >锁定账户</el-button
            >

            <el-button type="success" size="small" v-show="scope.row.locked !== 0" @click="lock(scope.row.id)"
              >解锁账户</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="50">
      <el-pagination
          style="text-align: center"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          :current-page="page.current"
          :page-size="page.size"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
          <!-- @current-change="getData" @size-change="getData" -->
        </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import teacher from "@/api/teacher";
export default {
  data: () => ({
    dataList:[],
    page: {
      current: 1,
      size: 10,
      pages: 0,
      total: 0,
    },
  }),
  methods: {
    //请求数据
    async getData() {
      delete this.page.rows
      const res = await teacher.getList({ ...this.page });
      this.dataList = res.data.rows;
      this.page.current = res.data.current
      this.page.size = res.data.size
      this.page.total = res.data.total
    },
    async lock(id) {
      await teacher.lock(id);
      this.getData();
    },
    async sizeChange(size){
      this.page.size = size
      await this.getData()
    },
    async currentChange(current){
      this.page.current = current
      await this.getData()
    }
  },
  created() {
    this.getData();
  },
};
</script>
<style scoped>
.container {
  height: 100%;
}

.el-button {
  margin: 0;
}
</style>
