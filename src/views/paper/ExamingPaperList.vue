<template>
  <div class="content" v-loading="loading">
    <div class="oper">
      <div class="item">
        <span>查询专业</span>
        <el-select clearable placeholder="选择专业" v-model="query.majorId" @change="getPushedPaperList">
          <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <div class="item">
        <span>查询类型</span>
        <el-select clearable v-model="query.status" @change="getPushedPaperList">
          <el-option v-for="(item, idx) in statuses" :key="idx" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>

    <el-card class="card">
      <el-table :data="paperList" style="width: 100%" height="500">
        <el-table-column fixed align="center" type="index" width="100" label="编号" />
        <el-table-column align="center" prop="examName" label="试卷名称" />
        <el-table-column align="center" prop="majorName" label="专业" />
        <el-table-column align="center" prop="operator" label="操作人" />
        <el-table-column align="center" prop="gmtCreate" label="推送时间" />
        <el-table-column align="center" prop="dueTime" label="期限时间" width="160">
          <template slot-scope="scope">
            <el-tag :type="getTagType(scope.row.status)">{{ getStatus(scope.row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" fixed="right" width="240">
          <template slot-scope="scope">
            <el-button @click="cat(scope.row.examId)">查看</el-button>

            <el-button
              v-show="scope.row.status === 1 || scope.row.status === 0"
              style="margin-right: 10px"
              type="primary"
              @click="openExamingDialog(scope.row.id)"
              >{{ scope.row.status === 0 ? '开考' : '编辑' }}</el-button
            >

            <el-popconfirm
              v-show="scope.row.status === 1"
              @confirm="finishedExaming(scope.row.id)"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="info"
              icon-color="red"
              title="确定结束考试吗?"
            >
              <el-button slot="reference" type="danger">结束考试</el-button>
            </el-popconfirm>

            <el-popconfirm
              v-show="scope.row.status === 0"
              @confirm="cancelPush(scope.row)"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="info"
              icon-color="red"
              title="确定取消此试卷的推送吗?"
            >
              <el-button slot="reference" type="danger">取消推送</el-button>
            </el-popconfirm>

            <el-popconfirm
              style="margin-left: 10px"
              v-show="scope.row.status === -1"
              @confirm="cancelPush(scope.row)"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="info"
              icon-color="red"
              title="确定删除此考试吗?"
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

    <el-dialog :close-on-click-modal="false" title="试卷开考" :visible.sync="examingDialog" width="400px" center>
      <el-form class="mybox" inline>
        <el-form-item label="开考有效时长(小时):">
          <el-input min="0" type="number" placeholder="请输入开考有效时间" v-model="form.dueHours" />
          <!-- 隐藏input框,防止回车提交表单 -->
          <input type="text" style="display: none" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examingDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmExaming">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog center :close-on-click-modal="false" title="试卷查看" :visible.sync="catDialog" width="600px">
      <paper-show :questions="questions"></paper-show>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="catDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import paper from '@/api/paper'
import major from '@/api/major'
import PaperShow from '@/components/PaperShow'

export default {
  components: { PaperShow },
  data() {
    return {
      catDialog: false,
      examingDialog: false,
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      query: {
        status: '',
        majorId: ''
      },
      paperList: [],
      statuses: [
        { value: 0, label: '准备开考' },
        { value: 1, label: '考试中' },
        { value: -1, label: '已结束' }
      ],
      majorList: [],
      form: {
        dueHours: ''
      },
      questions: {}
    }
  },
  mounted() {
    this.getPushedPaperList()
    this.getMajorList()
  },
  methods: {
    getTagType(status) {
      if (status === 0) {
        return 'primary'
      } else if (status === 1) {
        return 'success'
      } else if (status === -1) {
        return 'info'
      }
      return ''
    },
    cat(examId) {
      this.loading = true
      paper.getById(examId).then(res => {
        this.questions = res.data.questions || {}
        this.catDialog = true
        this.loading = false
      })
    },
    finishedExaming(id) {
      paper.changePushedPaperStatus({ id, status: -1 }).then(res => {
        this.$message.success(res.message)
        this.getPushedPaperList()
      })
    },
    confirmExaming() {
      paper.changePushedPaperStatus(this.form).then(res => {
        this.$message.success(res.message)
        this.getPushedPaperList()
        this.examingDialog = false
      })
    },
    openExamingDialog(id) {
      this.form.id = id
      this.form.status = 1
      this.examingDialog = true
    },
    getPushedPaperList() {
      this.loading = true
      paper.getPushedPaper({ ...this.page, ...this.query }).then(res => {
        this.paperList = res.data.rows
        this.page.total = res.data.total
        this.page.current = res.data.current
        this.page.size = res.data.size
        this.loading = false
      })
    },
    getMajorList() {
      major.majorList().then(res => {
        this.majorList = res.data
      })
    },
    changePage(val) {
      this.page.current = val
      this.getPushedPaperList()
    },
    changeSize(val) {
      this.page.size = val
      this.getPushedPaperList()
    },
    getStatus(item) {
      if (item.status === 1) {
        return item.dueTime
      } else if (item.status === 0) {
        return '未开考'
      } else if (item.status === -1) {
        return '已结束'
      }
      return ''
    },
    cancelPush(item) {
      paper.cancelPush(item.examUnique).then(res => {
        this.$message.success(res.message)
        this.getPushedPaperList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mybox {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  margin: 15px 0;
}
:deep(.oper) {
  width: 100%;
  display: flex;
  align-items: center;

  .item {
    span {
      font-size: 14px;
      color: gray;
    }

    .el-select {
      margin-left: 15px;
      width: 150px;
    }

    margin-right: 15px;
    display: flex;
    align-items: center;
  }
}
</style>
