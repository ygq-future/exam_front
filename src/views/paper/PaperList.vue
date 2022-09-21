<template>
  <div class="content" v-loading="loading">
    <div class="oper">
      <el-button type="primary" size="small" @click="addDialog = true">添加试卷</el-button>
      <el-input clearable v-model="query.keyword" style="width: 300px" @input="search">
        <template slot="prepend">关键字查询</template>
      </el-input>
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
        <el-table-column align="center" prop="subjectName" label="考试科目" />
        <el-table-column align="center" prop="operatorName" label="操作人" />
        <el-table-column align="center" prop="totalScore" label="总分" />
        <el-table-column align="center" prop="duration" label="考试时间(分钟)" />
        <el-table-column align="center" prop="gmtCreate" label="创建时间" width="160" />
        <el-table-column align="center" fixed="right" width="300" label="操作">
          <template slot-scope="scope">
            <el-button @click="cat(scope.row)">查看</el-button>
            <el-button type="success" @click="$router.push(`/paper-edit?id=${scope.row.id}`)">编辑</el-button>
            <el-button style="margin-right: 10px" type="primary" @click="openPush(scope.row.id)">推送</el-button>
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
          <el-select clearable @change="onChange" style="width: 100%" v-model="form.subjectId" placeholder="选择学科">
            <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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

    <el-dialog custom-class="push" title="推送试卷" center :visible.sync="pushDialog" width="400px">
      <div class="pushItem">
        <el-select clearable v-model="pushForm.majorId">
          <el-option v-for="(item, idx) in byMeMajors" :key="idx" :label="item.name" :value="item.id" />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="push" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/paper'
import teacher from '@/api/teacher'
import PaperShow from '@/components/PaperShow'
import subject from '@/api/subject'

export default {
  components: { PaperShow },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      pushForm: {
        majorId: '',
        examId: 0
      },
      pushDialog: false,
      byMeMajors: [],
      subjectList: [],
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
        duration: '',
        subjectId: ''
      },
      isLoading: false,
      timer: 0
    }
  },
  mounted() {
    this.getByMeMajor()
    this.getPaperList()
  },
  methods: {
    onChange(id) {
      this.subjectList.forEach(item => {
        if (item.id === id) {
          this.form.subjectName = item.name
        }
      })
    },
    search() {
      clearTimeout(this.timer)
      setTimeout(() => {
        this.page.current = 1
        this.getPaperList()
      }, 300)
    },
    openPush(id) {
      this.pushForm.examId = id
      this.pushDialog = true
    },
    push() {
      if (!this.pushForm.examId || this.pushForm.examId === 0) {
        this.$message.warning('请先选择要推送的试卷')
        this.pushDialog = false
        return
      }

      if (!this.pushForm.majorId || this.pushForm.majorId === '') {
        this.$message.warning('请先选择要推送的专业')
        return
      }

      api.push(this.pushForm).then(res => {
        this.$message.success(res.message)
        this.pushForm.majorId = ''
      })
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
    changePage(val) {
      this.page.current = val
      this.getPaperList()
    },
    changeSize(val) {
      this.page.size = val
      this.getPaperList()
    },
    getSubjectList() {
      subject.subjectList().then(res => {
        this.subjectList = res.data
      })
    },
    getByMeMajor() {
      teacher.byMe().then(res => {
        this.byMeMajors = res.data
        let temp = []
        this.byMeMajors.forEach(item => {
          temp.push(JSON.stringify({ id: item.majorId, name: item.majorName }))
        })
        //去重
        temp = Array.from(new Set(temp))
        this.byMeMajors = []
        temp.forEach(item => {
          this.byMeMajors.push(JSON.parse(item))
        })
      })
    },
    getPaperList() {
      this.loading = true
      if (this.isLoading) return
      this.isLoading = true
      api.paperList({ ...this.query, ...this.page }).then(res => {
        this.papers = res.data.rows
        this.page.current = res.data.current
        this.page.size = res.data.size
        this.page.total = res.data.total
        this.isLoading = false
        this.loading = false
        this.getSubjectList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.push .el-dialog__body) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

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
