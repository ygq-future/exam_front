<template>
  <div class="content">
    <div class="left">
      <el-button icon="el-icon-back" class="back" type="info" @click="$router.push('/paper-list')">返回</el-button>
      <div class="info">
        <el-form>
          <el-input v-model="form.name" placeholder="试卷名称"></el-input>
          <el-input v-model="form.subjectName" placeholder="专业名称"></el-input>
          <el-input v-model.number="form.duration" type="number" placeholder="考试时长"></el-input>
          <div class="grp">
            <el-button type="primary" style="width: 100%" @click="updatePaper">确认</el-button>
          </div>
        </el-form>
      </div>
      <el-autocomplete
        v-model="selected"
        :fetch-suggestions="querySearch"
        placeholder="请输入账号"
        :trigger-on-focus="false"
        @select="select"
      ></el-autocomplete>
    </div>

    <el-divider direction="vertical"></el-divider>

    <div class="right">
      <el-card>
        <paper-show :questions="paper.questions || {}" :height="'100%'" />
      </el-card>
    </div>
  </div>
</template>

<script>
import api from '@/api/paper'
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
      selected: ''
    }
  },
  mounted() {
    this.id = Number(this.$route.query.id) || 0
    this.getById()
  },
  methods: {
    select(item) {
      console.log(item)
    },
    querySearch(queryString, cb) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        api.accounts().then((res) => {
          let data = res.data
          data.forEach((user) => {
            user.value = user.studentNo ? user.studentNo : user.teacherNo
            user.unique = user.value
            user.value = `${user.name}#${user.value}`
          })
          const result =
            data.filter((item) => {
              return item.value.indexOf(queryString) >= 0
            }) || []
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
        console.log(this.form)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
