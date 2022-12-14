<template>
  <div class="content" v-loading="loading">
    <div class="oper">
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
        <el-table-column align="center" prop="name" label="考试名称" />
        <el-table-column align="center" prop="subjectName" label="科目名称" />
        <el-table-column align="center" prop="operator" label="操作人" />
        <el-table-column align="center" prop="examiner" label="阅卷人" />
        <el-table-column align="center" prop="gmtCreate" label="推送时间" />
        <el-table-column align="center" prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getTagType(scope.row.status)">{{ getStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" width="240" label="操作">
          <template slot-scope="scope">
            <el-popconfirm
              v-show="scope.row.status === 0"
              @confirm="confirmExaming(scope.row.id)"
              style="margin-right: 10px"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="info"
              icon-color="red"
              title="确认开始此考试吗?"
            >
              <el-button slot="reference" type="text">开考</el-button>
            </el-popconfirm>

            <el-popconfirm
              v-show="scope.row.status === 1"
              @confirm="finishedExaming(scope.row.id)"
              style="margin-right: 10px"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="info"
              icon-color="red"
              title="确定结束考试吗?"
            >
              <el-button slot="reference" type="text">结束考试</el-button>
            </el-popconfirm>

            <el-popconfirm
              @confirm="cancelPush(scope.row)"
              style="margin-right: 10px"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="info"
              icon-color="red"
              title="确定删除此考试吗?"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>

            <el-button type="text" @click="openDialog(scope.row.id)">设置阅卷人</el-button>
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

    <el-dialog :close-on-click-modal="false" title="设置阅卷人" center :visible.sync="dialogVisible" width="300px">
      <div class="box">
        <el-select clearable v-model="form.teacherId" placeholder="请选择阅卷教师">
          <el-option v-for="item in teacherList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import paper from '@/api/paper'
import PaperShow from '@/components/PaperShow'
import teacher from '@/api/teacher'

export default {
  components: { PaperShow },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      query: {
        status: ''
      },
      paperList: [],
      statuses: [
        { value: 0, label: '准备开考' },
        { value: 1, label: '考试中' },
        { value: -1, label: '已结束' }
      ],
      teacherList: [],
      form: {
        teacherId: 0,
        examiner: ''
      }
    }
  },
  mounted() {
    this.getPushedPaperList()
    this.getTeacherList()
  },
  methods: {
    openDialog(id) {
      this.form.teacherId = this.teacherList[0]?.id
      this.form.examiner = this.teacherList[0]?.name
      this.form.id = id
      this.dialogVisible = true
    },
    submit() {
      paper.setExaminer(this.form).then(res => {
        this.$message.success(res.message)
        this.dialogVisible = false
        this.getPushedPaperList()
      })
    },
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
    finishedExaming(id) {
      paper.changePushedPaperStatus(id, -1).then(res => {
        this.$message.success(res.message)
        this.getPushedPaperList()
      })
    },
    confirmExaming(id) {
      paper.changePushedPaperStatus(id, 1).then(res => {
        this.$message.success(res.message)
        this.getPushedPaperList()
      })
    },
    getTeacherList() {
      teacher.getList({ current: 1, size: 100 }).then(res => {
        this.teacherList = res.data.rows
      })
    },
    getPushedPaperList() {
      this.loading = true
      paper.getPushedPaper({ ...this.page, ...this.query }).then(res => {
        this.paperList = res.data.rows
        this.page.total = res.data.total
        this.loading = false
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
    getStatus(status) {
      if (status === 1) {
        return '正在考试'
      } else if (status === 0) {
        return '未开考'
      } else if (status === -1) {
        return '已结束'
      }
      return ''
    },
    cancelPush(item) {
      paper.delExamination(item.id).then(res => {
        this.$message.success(res.message)
        this.getPushedPaperList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
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
