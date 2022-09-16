<!-- 创建题目表单 -->
<template>
  <div>
    <el-button @click="init" type="primary">添加题目</el-button>
    <Matrix
      :visible="visible"
      @close="close"
      title="添加题目"
      :topVisible="false"
      :hide-add-button="hideAddBtn"
      submit-text="确认添加"
      @addLine="addOpt"
      @submit="submit"
    >
      <template #options>
        <el-select placeholder="请选择题形" v-model="params.typeId">
          <el-option v-for="item in questionType" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
        <el-input v-model="params.score" type="number" placeholder="分数"></el-input>
      </template>

      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="params.title" placeholder="请输入题目描述"></el-input>
        </el-form-item>

        <!-- 单选题表单 -->
        <div v-if="params.typeId === 1">
          <el-form-item v-for="(item, index) in params.selectQuestions" :key="index">
            <el-input v-model="item.description">
              <template slot="prepend">
                <el-radio v-model="params.answer" :label="createIndex(item, index)" />
              </template>
              <template slot="append">
                <el-button @click="delOpt(item)">删除</el-button>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <!-- 多选表单 -->
        <div v-if="params.typeId === 2">
          <el-form-item v-for="(item, index) in params.selectQuestions" :key="index">
            <el-input v-model="item.description">
              <template #prepend>
                <el-checkbox :label="createIndex(item, index)" v-model="checkData"></el-checkbox>
              </template>
              <template slot="append">
                <el-button @click="delOpt(item)">删除</el-button>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <!-- 简答表单 -->
        <el-form-item>
          <el-input
            type="textarea"
            v-model="params.answer"
            placeholder="请输入答案"
            v-show="params.typeId != 1 && params.typeId != 2 && params.typeId != 4"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="params.typeId === 4">
          <el-radio-group v-model="params.answer" class="form">
            <el-radio-button border label="0">错误</el-radio-button>
            <el-radio-button border label="1">正确</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </Matrix>
  </div>
</template>

<script>
import util from './util'
import Matrix from './Matrix.vue'
import question from '@/api/question'
import { Loading } from 'element-ui'
export default {
  data: () => ({
    questionData: {
      selects: []
    },
    checkData: [],
    params: {
      typeId: 1,
      title: '',
      score: '',
      answer: '',
      selectQuestions: [
        {
          description: ''
        }
      ]
    },
    questionType: [],
    visible: false
  }),
  computed: {
    hideAddBtn() {
      if (this.params.typeId === 1 || this.params.typeId === 2) return false
      return true
    },
    typeName() {
      return this.questionType.filter(e => e.id === this.params.typeId)[0].name
    }
  },

  methods: {
    //初始化方法
    async init() {
      this.visible = true
      //拿到处理后的数据
      await this.getType()
    },
    createIndex(index, row) {
      return util.createIndex(index, row)
    },
    //单纯将index转为字母并返回
    createIndex(item, index) {
      return util.createIndex(index, item)
    },
    async edit(item) {
      //以gmtCreate作为标识,判断表单是数据库取得的还是新加的
      //如果属性已经存在,则调用修改表单的方法
      if (item.gmtCreate) {
        //验证表单是否已经修改,如果没有修改,直接将状态改为编辑,之后直接返回
        if (item.tip === item.description) {
          this.$message({
            message: '未做任何更改'
          })
          return
        }
        //表单通过验证后,直接触发提交事件
        await question.editQuestion(item.id, { ...item })
      }
      //如果表单咩有时间属性,则走新加选项方法
      else {
        await question.addQuestion({ ...item })
      }
    },
    close() {
      this.visible = false
      this.$emit('update')
    },
    // 获取全部题目类型
    async getType() {
      const res = await question.getType()
      this.questionType = res.data
    },
    delOpt(item) {
      this.params.selectQuestions.splice(this.params.selectQuestions.indexOf(item), 1)
    },
    addOpt() {
      if (this.params.selectQuestions.length > 6) {
        this.$message({
          message: '已经添加到最大选项了!不可再添加了',
          type: 'warning'
        })
        return
      }
      this.params.selectQuestions.push({
        description: ''
      })
    },
    submit() {
      if (this.params.typeId === 2) {
        this.params.answer = this.checkData.toString()
      }
      let loadingInstance = Loading.service({ fullscreen: true })
      question
        .add({ ...this.params, typeName: this.typeName })
        .then(res => {
          this.$message({
            message: res.message
          })

          const params = {
            typeId: this.params.typeId,
            title: '',
            score: '',
            answer: '',
            selectQuestions: [
              {
                description: ''
              }
            ]
          }

          this.params = { ...params }

          loadingInstance.close()
        })
        .catch(() => {
          loadingInstance.close()
        })
    }
  },
  components: { Matrix }
}
</script>
<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: center;
}
</style>
