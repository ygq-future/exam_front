<template>
  <div class="content" v-loading="loading">
    <el-descriptions title="用户信息">
      <el-descriptions-item label="姓名">{{ user.userInfo.name }}</el-descriptions-item>
      <el-descriptions-item label="登录账户名">{{ user.username }}</el-descriptions-item>
      <el-descriptions-item label="身份类型">{{ user.type === 0 ? '管理员' : '教师' }}</el-descriptions-item>
      <el-descriptions-item label="账户状态">
        <el-tag type="success">正常</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="注册时间">{{ user.userInfo.gmtCreate }}</el-descriptions-item>
    </el-descriptions>
    <div class="box">
      <el-card class="top">
        <el-alert title="我管理的专业" type="info" show-icon center :closable="false" />
        <el-empty v-if="user.type === 0" description="拥有所有专业管理权">
          <template #image>
            <i style="font-size: 50px; color: #67c23a" class="el-icon-success"></i>
          </template>
        </el-empty>
        <div class="list" v-else>
          <div class="oper">
            <el-button type="primary" size="mini" @click="applyDialog = true">申请专业管理</el-button>
          </div>
          <el-divider></el-divider>
          <div class="content">
            <el-tag v-for="item in byMeMajors" :key="item.id">{{ item.majorName }}</el-tag>
          </div>
        </div>
      </el-card>

      <el-card class="bottom">
        <el-alert title="我管理的试卷" type="info" show-icon center :closable="false" />

        <el-table :data="papers" style="width: 100%" height="260">
          <el-table-column fixed align="center" type="index" width="100" label="编号" />
          <el-table-column align="center" prop="name" label="试卷名称" />
          <el-table-column align="center" prop="subjectName" label="专业名称" />
          <el-table-column align="center" prop="operatorName" label="操作人" />
          <el-table-column align="center" prop="totalScore" label="总分" />
          <el-table-column align="center" prop="duration" label="考试时间(分钟)" />
          <el-table-column align="center" fixed="right" width="300" label="操作">
            <template slot-scope="scope">
              <el-button type="success" @click="$router.push(`/paper-edit?id=${scope.row.id}`)">编辑</el-button>
              <el-popconfirm
                style="margin: 0 10px"
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
              <el-button type="primary" @click="openPush(scope.row.id)">推送</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog title="申请权限" center :visible.sync="applyDialog" width="300px">
      <el-select v-model="selected" clearable>
        <el-option v-for="item in majorList" :key="item.id" :value="item.id" :label="item.name" />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applyDialog = false">取 消</el-button>
        <el-button type="primary" @click="applyAuth">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="推送试卷" center :visible.sync="pushDialog" width="800px">
      <el-transfer
        @change="change"
        v-model="pushValue"
        :data="byMeMajors"
        :props="{
          key: 'majorId',
          label: 'majorName'
        }"
        :button-texts="['取消推送', '推送']"
        :titles="['未推送', '已推送']"
      ></el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pushDialog = false" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import teacher from '@/api/teacher'
import paper from '@/api/paper'
import major from '@/api/major'

export default {
  data() {
    return {
      selected: '',
      pushDialog: false,
      applyDialog: false,
      byMeMajors: [],
      papers: [],
      majorList: [],
      pushExamId: 0,
      pushValue: [],
      oldPushValue: [],
      isFirst: true,
      loading: false
    }
  },
  mounted() {
    this.getByMeMajor()
    this.getPapers()
    this.getMajorList()
  },
  methods: {
    resetData() {
      this.pushExamId = 0
    },
    openPush(id) {
      this.loading = true
      this.pushExamId = id
      this.isFirst = true
      this.findPushedMajor(this.pushExamId)
    },
    change() {
      this.isFirst = false
    },
    push(majorId) {
      if (!this.pushExamId || this.pushExamId === 0) {
        this.$message.warning('请先选择要推送的试卷')
        this.pushDialog = false
        return
      }

      paper
        .push({ examId: this.pushExamId, majorId })
        .then(res => {
          this.$message.success(res.message)
        })
        .catch(() => {
          for (let i = 0; i < this.pushValue.length; i++) {
            if (this.pushValue[i] === majorId) {
              this.pushValue.splice(i, 1)
            }
          }
        })
    },
    cancelPush(majorId) {
      if (!this.pushExamId || this.pushExamId === 0) {
        this.$message.warning('请先选择要推送的试卷')
        this.pushDialog = false
        return
      }

      paper
        .cancelPush({ examId: this.pushExamId, majorId })
        .then(res => {
          this.$message.success(res.message)
        })
        .catch(() => {
          this.pushValue.push(majorId)
        })
    },
    findPushedMajor(examId) {
      paper.findPushed(examId).then(res => {
        this.pushValue = res.data
        this.pushDialog = true
        this.loading = false
      })
    },
    applyAuth() {
      if (!this.selected || this.selected === '') {
        this.$message.warning('请先选择要申请的专业!')
        return
      }

      teacher.applyAuth(this.selected).then(res => {
        this.$message.success('申请成功, 等待管理员审核!')
        this.applyDialog = false
      })
    },
    getMajorList() {
      major.majorList().then(res => {
        this.majorList = res.data
      })
    },
    getByMeMajor() {
      teacher.byMe().then(res => {
        this.byMeMajors = res.data
      })
    },
    getPapers() {
      paper.paperList({ byMe: true, current: 1, size: 999 }).then(res => {
        this.papers = res.data.rows
      })
    },
    delExam(id) {
      paper.delExam(id).then(res => {
        this.$message.success(res.message)
        this.getPapers()
      })
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    pushValue(newVal, oldVal) {
      if (this.isFirst) return

      if (newVal.length > oldVal.length) {
        let values = newVal.filter(e => !oldVal.includes(e))
        values.forEach(val => {
          this.push(val)
        })
      } else {
        let values = oldVal.filter(e => !newVal.includes(e))
        values.forEach(val => {
          this.cancelPush(val)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.list {
  display: flex;
  flex-direction: column;

  .el-divider--horizontal {
    margin: 10px 0;
  }

  .oper {
    width: 100%;
    margin-top: 10px;
  }

  .content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    ::v-deep .el-tag {
      width: fit-content;
      margin-right: 10px;
    }
  }
}

.top {
  height: 200px;
  margin-bottom: 15px;
}

.right {
  flex: 1;
  height: 200px;
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .box {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.el-divider--vertical {
  height: auto !important;
  margin-right: 15px;
}

::v-deep .el-descriptions-item__label {
  display: flex;
  align-items: center;
}
</style>
