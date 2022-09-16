<!-- 多选题表单 -->
<template>
  <div>
    <el-button @click="init">修改题目</el-button>
    <Matrix :visible="visible" @close="close" @submit="submit" @addLine="addLine" title="编辑单选题">
      <template #options>
        <el-input v-model="questionData.score" placeholder="题目分数"> </el-input>
      </template>

      <el-form ref="form" label-width="80px" :model="questionData" label-position="top" class="form">
        <el-form-item prop="title">
          <el-input type="textarea" placeholder="请输入题目描述" v-model="questionData.title" />
        </el-form-item>

        <el-form-item v-for="(item, index) in questionData.selects" label-position="left" :key="index">
          <div class="form-wrap">
            <el-input
              v-model="item.description"
              @change="edit(item)"
              @focus="temporarySave(item)"
              :placeholder="item.tip || '请输入选项描述'"
            >
              <template slot="prepend">
                <el-radio :label="item.id + ''" v-model="questionData.answer">{{ createIndex(item, index) }}</el-radio>
              </template>
              <template #append>
                <el-button>修改选项</el-button>
                <el-button @click="del(item.id)">删除选项</el-button>
              </template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
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
      const res = await util.queryById(this.id)
      this.questionData = res
    },
    createIndex(index, row) {
      return util.createIndex(index, row)
    },
    async del(id) {
      await question.delQuestion(id)
      util.queryById(this.id)
      await this.init()
    },
    //单纯将index转为字母并返回
    createIndex(item, index) {
      return util.createIndex(index, item)
    },
    temporarySave(item) {
      item.tip = item.description
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
        const data = {
          description: item.description
        }
        await question.editQuestion(item.id, data)
      }
      //如果表单咩有时间属性,则走新加选项方法
      else {
        await question.addQuestion({ ...item })
      }
    },
    //表单新加行方法
    addLine() {
      if (this.questionData.selects.length > 6) {
        this.$message({
          message: '已经添加到最大选项了!不可再添加了',
          type: 'warning'
        })
        return
      }
      const params = {
        description: '',
        questionId: this.questionData.id,
        Answer: false,
        edit: true
        // itemId:
      }

      this.questionData.selects.push(params)
    },
    close() {
      this.visible = false
    },
    async submit() {
      const params = {
        id: this.questionData.id,
        title: this.questionData.title,
        typeId: this.questionData.typeId,
        typeName: this.questionData.typeName,
        score: this.questionData.score,
        answer: this.questionData.answer
      }
      let loadingInstance = Loading.service({ fullscreen: true })
      await question.changeQuestion(params)
      loadingInstance.close()
      this.$message.success('修改成功')
      await this.init()
      this.close()
      this.$emit('update')
    },

    parsingAnswer() {
      return this.questionData.answer.split(',').map(Number)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
  },
  components: { Matrix }
}
</script>
<style scoped lang="scss">
.form {
  text-align: left;
}
.form-wrap {
  display: flex;
  align-items: center;
}
</style>
