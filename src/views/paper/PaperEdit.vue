<template>
  <div class="content">
    <div class="left">
      <el-button icon="el-icon-back" class="back" type="info" @click="$router.push('/paper-list')">返回</el-button>

      <el-card class="info">
        <el-alert title="修改试卷信息" type="info" show-icon center :closable="false" />
        <el-form>
          <el-input v-model="form.name" placeholder="试卷名称"></el-input>
          <el-input v-model="form.subjectName" placeholder="专业名称"></el-input>
          <el-input v-model.number="form.duration" type="number" placeholder="考试时长"></el-input>
          <el-button type="primary" style="width: 100%" @click="updatePaper">确认</el-button>
        </el-form>
      </el-card>

      <el-card class="info">
        <el-alert title="添加试卷题目" type="info" show-icon center :closable="false" />
        <el-autocomplete
          style="width: 100%; margin-bottom: 15px"
          v-model="selected"
          :fetch-suggestions="querySearch"
          placeholder="题目名称"
          :trigger-on-focus="false"
          @select="select"
        />

        <el-button style="width: 100%" type="primary" @click="relateQues">添加</el-button>
      </el-card>

      <el-card class="info">
        <el-alert title="批量导入题目" type="info" show-icon center :closable="false" />
        <el-button style="width: 100%" type="primary">点击导入</el-button>
      </el-card>
    </div>

    <el-divider direction="vertical"></el-divider>

    <div class="right">
        <paper-show :questions="paper.questions || {}" :height="'650px'" />
    </div>
  </div>
</template>

<script>
import api from '@/api/paper'
import question from '@/api/question'
import PaperShow from '@/components/PaperShow'

export default {
  components: { PaperShow },
  data() {
    return {
      id: 0,
      paper: {},
      form: {
        name: '',
        subjectName: '',
        duration: 0
      },
      selected: '',
      selectObj: null
    }
  },
  mounted() {
    this.id = Number(this.$route.query.id) || 0
    this.getById()
  },
  methods: {
    relateQues() {
      if(!this.selectObj) {
        this.$message.warning("请先选择要添加的题目")
        return
      }
      api.relateQues({questionId: this.selectObj.id, examId: this.id}).then(res => {
        this.$message.success(res.message)
        this.selected = ''
        this.selectObj = null
        this.getById()
      })
    },
    select(item) {
      this.selectObj = item
    },
    querySearch(queryString, cb) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        question.getList({ current: 1, size: 100, keyword: queryString }).then(res => {
          let data = res.data.rows

          data.forEach(ques => {
            ques.value = ques.typeName + ' - ' + ques.title
          })
          
          let result = data.filter(e => e.value.indexOf(queryString) >= 0)
          cb(result)
        })
        // 调用 callback 返回建议列表的数据
      }, 400)
    },
    updatePaper() {
      api.editExam({ ...this.form, id: this.id }).then(res => {
        this.$message.success(res.message)
        this.getById()
      })
    },
    getById() {
      api.getById(this.id).then(res => {
        this.paper = res.data
        let { name, subjectName, duration } = this.paper
        this.form = { name, subjectName, duration }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-alert {
  padding: 5px;
  margin-bottom: 15px;
}

.el-divider--vertical {
  height: auto !important;
  margin-right: 15px;
}

.content {
  display: flex;

  .left {
    margin-right: 15px;
  }

  .right {
    flex: 1;
    display: flex;
    align-items: center;
  }
}

.back {
  margin-bottom: 15px;
}

.info {
  width: 250px;
  margin-bottom: 15px;

  .el-input {
    margin-bottom: 15px;
  }
}
</style>
