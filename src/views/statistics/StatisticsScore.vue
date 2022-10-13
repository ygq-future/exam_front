<template>
  <div class="content" v-loading="loading">
    <el-card class="top">
      <el-select v-model="page.examUnique" placeholder="考试选择" clearable @change="scoreList">
        <el-option v-for="item in paperList" :key="item.id" :value="item.examUnique" :label="item.desc" />
      </el-select>
      <div class="right">
        <div class="success">
          <i class="el-icon-success"></i>
          <span>及格人数:</span>
          <span>1</span>
        </div>

        <div class="error">
          <i class="el-icon-error"></i>
          <span>不及格人数:</span>
          <span>1</span>
        </div>

        <el-button type="primary" @click="exportData">导出数据</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table :data="tableData" style="width: 100%" height="500">
        <el-table-column fixed align="center" type="index" width="100" label="编号" />
        <el-table-column align="center" prop="collegeName" label="学院" />
        <el-table-column align="center" prop="majorName" label="专业" />
        <el-table-column align="center" prop="clazzName" label="班级" />
        <el-table-column align="center" prop="studentNo" label="学号" />
        <el-table-column align="center" prop="studentName" label="名称" />
        <el-table-column align="center" prop="score" label="得分" />
        <el-table-column align="center" prop="ranking" label="排名" />
        <el-table-column align="center" prop="expenseMinute" label="花费时间(分)" />
      </el-table>
    </el-card>

    <el-pagination
      style="text-align: center"
      background
      @current-change="changePage"
      @size-change="changeSize"
      :current-page="page.current"
      :page-sizes="[7, 10, 15, 20]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import statistics from '@/api/statistics'

export default {
  data() {
    return {
      paperList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
        examUnique: ''
      },
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.finishedPaperList()
  },
  methods: {
    exportData() {
      if (!this.page.examUnique || this.page.examUnique === '') {
        this.$message.warning('请选择要导出的考试场次')
        return
      }

      statistics.scoreToExcel(this.page.examUnique)
    },
    scoreList() {
      this.loading = true
      statistics.scoreList(this.page).then(res => {
        this.page.total = res.data.total
        this.tableData = res.data.rows
        this.loading = false
      })
    },
    finishedPaperList() {
      statistics.finishedPaperList().then(res => {
        this.paperList = res.data
        if (this.paperList.length > 0) {
          this.page.examUnique = this.paperList[0].examUnique
          this.scoreList()
        }
        this.paperList.forEach(item => {
          item.desc = item.examName + '#' + item.majorName + '#' + item.gmtCreate
        })
      })
    },
    changePage(val) {
      this.page.current = val
    },
    changeSize(val) {
      this.page.size = val
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
}

.top {
  .right {
    display: flex;
    align-items: center;
  }

  .success {
    display: flex;
    margin-right: 15px;
    align-items: center;
    padding: 5px 10px;
    background-color: #f0f9eb;
    border-radius: 10px;

    i {
      margin-right: 5px;
      color: green;
      font-size: 25px;
    }

    span {
      color: #67c23a;
    }
  }

  .error {
    display: flex;
    margin-right: 15px;
    align-items: center;
    background-color: #fef0f0;
    padding: 5px 10px;
    border-radius: 10px;

    i {
      color: red;
      font-size: 25px;
      margin-right: 5px;
    }

    span {
      color: #f56c6c;
    }
  }
}

:deep(.top > .el-card__body) {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-select {
    width: 300px;
    margin-right: 15px;
  }
}
</style>
