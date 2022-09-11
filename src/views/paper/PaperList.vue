<template>
  <div class="content">
    <div class="oper">
      <el-button type="primary" size="small" @click="addDialog = true">添加试卷</el-button>
      <el-input clearable v-model="query.keyword" style="width: 300px" @input="search">
        <template slot="prepend">关键字查询</template>
      </el-input>
      <el-select clearable v-model="query.majorId" placeholder="选择专业" @change="getPaperList">
        <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-switch @change="getPaperList" inactive-color="lightgray" v-model="query.byMe" active-text="查询我的试卷" />
      <el-switch
        inactive-color="lightgray"
        @change="getPaperList"
        v-model="query.byDate"
        active-text="查询最新的试卷"
        :active-value="1"
        :inactive-value="0"
      />
    </div>

    <el-card class="card">
      <el-table :data="papers" style="width: 100%" height="500">
        <el-table-column fixed align="center" type="index" width="100" label="编号" />
        <el-table-column align="center" prop="name" label="试卷名称" />
        <el-table-column align="center" prop="subjectName" label="专业名称" />
        <el-table-column align="center" prop="operatorName" label="操作人" />
        <el-table-column align="center" prop="totalScore" label="总分" />
        <el-table-column align="center" prop="duration" label="考试时间(分钟)" />
        <el-table-column align="center" fixed="right" width="300" label="操作">
          <template slot-scope="scope">
            <el-button @click="cat(scope.row)">查看</el-button>
            <el-button style="margin-right: 10px" type="success" @click="$router.push(`/paper-edit?id=${scope.row.id}`)"
              >编辑</el-button
            >
            <el-popconfirm
              @confirm="delExam(scope.row.id)"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="info"
              icon-color="red"
              title="确定删除吗？"
            >
              <el-button slot="reference" type="danger">删除</el-button>
            </el-popconfirm>
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

    <el-dialog center :close-on-click-modal="false" title="题目查看" :visible.sync="dialogVisible" width="600px">
      <paper-show :questions="questions"></paper-show>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog center :close-on-click-modal="false" title="添加试卷" :visible.sync="addDialog" width="300px">
      <el-form label-width="0">
        <el-form-item>
          <el-input v-model="form.name" placeholder="请输入试卷名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.subjectName" placeholder="请输入学科名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.duration" placeholder="请输入考试时长" type="number"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addPaper">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/paper'
import major from '@/api/major'
import PaperShow from '@/components/PaperShow'

export default {
  components: { PaperShow },
  data() {
    return {
      dialogVisible: false,
      query: {
        majorId: '',
        byMe: false,
        byDate: 0,
        keyword: ''
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      papers: [],
      questions: {},
      items: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      addDialog: false,
      form: {
        name: '',
        subjectName: '',
        duration: ''
      },
      majorList: [],
      isLoading: false,
      timer: 0
    }
  },
  mounted() {
    this.getPaperList()
    this.getMajorList()
  },
  methods: {
    search() {
      clearTimeout(this.timer)
      setTimeout(() => {
        this.page.current = 1
        this.getPaperList()
      }, 300)
    },
    delExam(id) {
      api.delExam(id).then(res => {
        this.$message.success(res.message)
        this.getPaperList()
      })
    },
    addPaper() {
      api.addExam(this.form).then(res => {
        this.$message.success(res.message)
        this.getPaperList()
        this.addDialog = false
      })
    },
    cat(item) {
      this.questions = item.questions || {}
      this.dialogVisible = true
    },
    getMajorList() {
      major.majorList().then(res => {
        this.majorList = res.data
      })
    },
    changePage(val) {
      this.page.current = val
      this.getPaperList()
    },
    changeSize(val) {
      this.page.size = val
      this.getPaperList()
    },
    getPaperList() {
      if (this.isLoading) return
      this.isLoading = true
      api.paperList({ ...this.query, ...this.page }).then(res => {
        this.papers = res.data.rows
        this.page.current = res.data.current
        this.page.size = res.data.size
        this.page.total = res.data.total
        this.isLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.oper {
  width: 100%;
  display: flex;
  align-items: center;

  .el-select {
    width: 150px;
  }

  * {
    margin-right: 15px;
  }
}

.card {
  margin: 15px 0;
}
</style>
