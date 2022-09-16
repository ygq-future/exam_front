<!-- 多选题表单 -->
<template>
  <div>
    <el-button @click="init">修改题目</el-button>
    <Matrix :visible="visible" @close="close" @submit="submit" title="判断题" :topVisible="false">
      <template #buttons>
        <el-input v-model="questionData.score" placeholder="题目分数"> </el-input>
      </template>
      <template #header>
        <div class="form">
          <h1>题目描述</h1>
          <el-input
            type="textarea"
            @focus="temporarySave(true)"
            :placeholder="questionData.tip || '请输入题目描述'"
            v-model="questionData.title"
          />
        </div>
        <div class="btns">
          <el-button
            size="medium"
            :type="questionData.answer === '0' ? 'primary' : ''"
            @click="questionData.answer = '0'"
            >错误</el-button
          >
          <el-button
            size="medium"
            :type="questionData.answer === '1' ? 'primary' : ''"
            @click="questionData.answer = '1'"
            >正确
          </el-button>
        </div>
      </template>
    </Matrix>
  </div>
</template>

<script>
import util from './util.js'
import Matrix from './Matrix.vue'
import question from '@/api/question'
import { Loading } from 'element-ui'
export default {
  props: ['id'],
  data: () => ({
    questionData: {
      selects: []
    },
    visible: false
  }),
  methods: {
    //初始化方法
    async init() {
      this.visible = true
      //拿到处理后的数据
      const res = await question.queryByID(this.id)
      this.questionData = res.data
    },
    createIndex(index, row) {
      return util.createIndex(index, row)
    },
    //单纯将index转为字母并返回
    createIndex(item, index) {
      return util.createIndex(index, item)
    },
    temporarySave(bool) {
      if (bool) {
        this.questionData.tip = this.questionData.title
      } else {
        this.questionData.tipAnswer = this.questionData.answer
      }
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
    },
    async submit() {
      let loadingInstance = Loading.service({ fullscreen: true })
      await question.changeQuestion({ ...this.questionData })
      loadingInstance.close()
      this.$message.success('修改成功')
      await this.init()
      this.close()
      this.$emit('update')
    }
  },
  components: { Matrix }
}
</script>

<style scoped lang="scss">
.btns {
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
