<template>
  <div class="content" v-loading="loading">
    <div class="oper">
      <el-select v-model="page.examUnique" placeholder="考试选择" clearable @change="findSubjectivePaper">
        <el-option v-for="item in paperList" :key="item.id" :value="item.examUnique" :label="item.desc" />
      </el-select>
    </div>

    <el-card class="card">
      <el-table :data="recordList" style="width: 100%" height="500">
        <el-table-column fixed align="center" type="index" width="100" label="编号" />
        <el-table-column align="center" prop="examObj.name" label="试卷名称" />
        <el-table-column align="center" prop="examObj.subjectName" label="科目" />
        <el-table-column align="center" prop="studentName" label="学生" />
        <el-table-column align="center" prop="gmtModified" label="提交时间" />
        <el-table-column align="center" label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="openScoring(scope.row)">打分</el-button>
          </template>
        </el-table-column>
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

    <el-dialog :close-on-click-modal="false" title="主观题打分" :visible.sync="dialogVisible" width="400" center>
      <div class="box">
        <div class="item" v-for="item in scoringQues" :key="item.id">
          <span class="title">{{ item.title }} 分数:{{ item.score }}</span>

          <div class="formitem">
            <span>学生回答</span>
            <el-input type="textarea" :value="item.answer || '空白'" resize="none" :rows="5" />
          </div>

          <div class="formitem">
            <span>分数</span>
            <el-input style="width: 100px" type="number" min="0" v-model.number="item.givenScore" placeholder="请输入评分" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitScoring">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import paper from '@/api/paper'

export default {
  data() {
    return {
      dialogVisible: false,
      page: {
        current: 1,
        size: 10,
        total: 0,
        examUnique: ''
      },
      paperList: [],
      recordList: [],
      scoringQues: [],
      scoringItem: {},
      loading: false
    }
  },
  mounted() {
    this.findSubjectivePaper()
    this.getSubjectiveList()
  },
  methods: {
    submitScoring() {
      let data = { id: this.scoringItem.id, exam: JSON.stringify(this.scoringItem.examObj) }
      console.log(data)
      paper.scoringSubjective(data).then(res => {
        this.$message.success(res.message)
        this.dialogVisible = false
        this.findSubjectivePaper()
      })
    },
    openScoring(item) {
      this.scoringItem = item
      this.scoringQues = item.examObj.questions['简答题']
      this.scoringQues.forEach(e => {
        this.$set(e, 'givenScore', 0)
      })
      this.dialogVisible = true
    },
    findSubjectivePaper() {
      this.loading = true
      paper.findSubjectivePaper(this.page).then(res => {
        this.recordList = res.data.rows
        this.page.total = res.data.total
        this.page.current = res.data.current
        this.page.size = res.data.size

        this.recordList.forEach(item => {
          item.examObj = JSON.parse(item.exam)
        })
        this.loading = false
      })
    },
    getSubjectiveList() {
      this.loading = true
      paper.subjectiveList().then(res => {
        this.paperList = res.data
        this.paperList.forEach(item => {
          item.desc = item.examName + '#' + item.majorName + '#' + item.gmtCreate
        })
        this.loading = false
      })
    },
    changePage(val) {
      this.page.current = val
      this.findSubjectivePaper()
    },
    changeSize(val) {
      this.page.size = val
      this.findSubjectivePaper()
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .item {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .formitem {
      display: flex;
      align-items: center;
      margin: 10px 0;

      span {
        display: inline-block;
        width: 100px;
        margin-right: 15px;
        text-align: right;
        font-size: 15px;
      }
    }

    .title {
      font-size: 17px;
      font-weight: 700;
    }
  }
}

.card {
  margin: 15px 0;
}
</style>
