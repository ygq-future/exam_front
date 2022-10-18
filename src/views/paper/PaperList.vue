<template>
  <div class="content" v-loading="loading">
    <div class="oper">
      <el-button type="primary" size="small" @click="addDialog = true">添加试卷</el-button>
      <el-input clearable v-model="query.keyword" style="width: 300px" @input="search">
        <template slot="prepend">关键字查询</template>
      </el-input>
      <el-select v-model="query.majorId" placeholder="专业" @change="getSubjectList">
        <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select clearable v-model="query.subjectId" placeholder="学科查询" @change="search">
        <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-switch @change="getPaperList" inactive-color="lightgray" v-model="query.byMe" active-text="查询我的试卷" />
    </div>

    <el-card class="card">
      <el-table
        :data="papers"
        style="width: 100%"
        height="500"
        row-key="id"
        :tree-props="{ children: 'exams', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column align="center" prop="name" label="试卷名称" width="200" />
        <el-table-column align="center" label="考试科目" width="170">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.id < 0" type="success">{{ scope.row.subjectName }}</el-tag>
            <span v-else>{{ scope.row.subjectName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operatorName" label="操作人" />
        <el-table-column align="center" prop="totalScore" label="总分" />
        <el-table-column align="center" prop="duration" label="考试时间(分钟)" width="130" />
        <el-table-column align="center" prop="gmtCreate" label="创建时间" width="160" />
        <el-table-column align="center" fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <template v-if="scope.row.id > 0">
              <el-button @click="cat(scope.row)" type="text">查看</el-button>
              <el-button style="margin-right: 10px" type="text" @click="$router.push(`/paper-edit?id=${scope.row.id}`)">
                编辑</el-button
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
                <el-button slot="reference" type="text">删除</el-button>
              </el-popconfirm>
            </template>
            <template v-else>
              <el-button type="text" @click="openPush(scope.row)">推送</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- <el-pagination
      style="text-align: center"
      background
      @current-change="changePage"
      @size-change="changeSize"
      :current-page="page.current"
      :page-sizes="[3, 5]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination> -->

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
          <el-select v-model="query.majorId" placeholder="选择专业" @change="getSubjectList">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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

    <el-dialog
      custom-class="push"
      title="推送试卷"
      center
      :visible.sync="pushDialog"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="pushItem">
        <el-input v-model="pushForm.name" placeholder="请输入考试名称" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="push" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import paper from '@/api/paper'
import PaperShow from '@/components/PaperShow'
import subject from '@/api/subject'
import major from '@/api/major'

export default {
  components: { PaperShow },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      pushForm: {
        name: '',
        subjectId: 0
      },
      pushDialog: false,
      subjectList: [],
      query: {
        subjectId: '',
        majorId: '',
        byMe: false,
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
      timer: 0,
      majorList: []
    }
  },
  mounted() {
    this.getPaperList()
    this.getMajorList()
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
    openPush(item) {
      this.pushForm.name = ''
      this.pushForm.subjectId = item.subjectId
      this.pushDialog = true
    },
    push() {
      if (!this.pushForm.subjectId || this.pushForm.subjectId === 0) {
        this.$message.warning('请先选择要推送的学科')
        this.pushDialog = false
        return
      }

      paper.push(this.pushForm).then(res => {
        this.$message.success(res.message)
        this.pushDialog = false
      })
    },
    delExam(id) {
      paper.delExam(id).then(res => {
        this.$message.success(res.message)
        this.getPaperList()
      })
    },
    addPaper() {
      paper.addExam(this.form).then(res => {
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
    getMajorList() {
      major.majorList().then(res => {
        this.majorList = res.data
        if (this.majorList.length > 0) {
          this.query.majorId = this.majorList[0].id
          this.getSubjectList()
        }
      })
    },
    getSubjectList() {
      this.getPaperList()
      subject.subjectList(this.query.majorId).then(res => {
        this.subjectList = res.data
      })
    },
    getPaperList() {
      this.loading = true
      if (this.isLoading) return
      this.isLoading = true
      paper.paperList({ ...this.query, ...this.page }).then(res => {
        /* this.papers = res.data.rows
        this.page.total = res.data.total */
        this.papers = res.data
        this.isLoading = false
        this.loading = false
        let count = -1
        this.papers.forEach(item => {
          item.id = count--
        })
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
    width: 200px;
  }

  * {
    margin-right: 15px;
  }
}

.card {
  margin: 15px 0;
}
</style>
