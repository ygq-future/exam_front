<template>
  <div class="box" :style="{ height: height ? height : '450px' }">
    <el-empty description="题目为空,快去添加题目吧" v-if="Object.keys(questions).length === 0"></el-empty>

    <div class="type" v-for="type in types" :key="type.id" v-show="questions[type.name]">
      <div class="title">{{ type.name }}</div>
      <el-divider></el-divider>

      <div class="list">
        <div class="item" v-for="(item, idx) in questions[type.name]" :key="item.id">
          <!-- question title -->
          <div style="margin-bottom: 10px">
            <span>{{ `${idx + 1}、 ${item.title}` }}</span>
            <span style="padding: 0 10px; color: gray; font-size: 14px">({{ item.score }}分)</span>
            <el-popconfirm title="确定删除此题目的关联吗?" @confirm="cancelQues(item.id)" cancel-button-type="info">
              <i slot="reference" v-if="enableExam" class="el-icon-delete delete"></i>
            </el-popconfirm>
          </div>

          <!-- singleton select -->
          <div class="selects" v-if="item.typeId === 1">
            <div v-for="(select, sidx) in item.selects" :key="sidx">
              {{ `${items[sidx]}、` }}
              <el-tag :type="item.answer == select.id ? 'success' : 'info'">{{ select.description }}</el-tag>
            </div>
          </div>

          <!-- more select -->
          <div class="selects" v-if="item.typeId === 2">
            <div v-for="(select, sidx) in item.selects" :key="sidx">
              {{ `${items[sidx]}、` }}
              <el-tag :type="item.answer.split(',').includes(select.id + '') ? 'success' : 'info'">{{ select.description }}</el-tag>
            </div>
          </div>

          <!-- fill question -->
          <div v-if="item.typeId === 3">
            答案: <el-tag type="success">{{ item.answer }}</el-tag>
          </div>

          <!-- if question -->
          <div v-if="item.typeId === 4">
            答案: <el-tag type="success">{{ item.answer == '1' ? '正确' : '错误' }}</el-tag>
          </div>

          <!-- answer question -->
          <div v-if="item.typeId === 5">
            示例答案: <el-tag type="success">{{ item.answer }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/question'
import paper from '@/api/paper'

export default {
  props: {
    questions: Object,
    height: String,
    enableExam: {
      type: Boolean,
      defualt: false
    }
  },
  data() {
    return {
      items: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      types: []
    }
  },
  mounted() {
    this.getTypes()
  },
  methods: {
    cancelQues(questionId) {
      let params = { questionId, examId: this.$parent.id }
      paper.cancelQues(params).then(res => {
        this.$message.success(res.message)
        this.$parent.getById()
      })
    },
    getTypes() {
      api.getType().then(res => {
        this.types = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.delete {
  margin-left: 15px !important;
  color: red !important;
  cursor: pointer !important;
}

.list {
  padding: 0 20px !important;

  .item {
    margin-bottom: 20px !important;
  }
}

.selects {
  padding-left: 20px !important;

  div {
    display: flex !important;
    align-items: center !important;
    margin-bottom: 10px !important;
  }
}

.box {
  width: 100% !important;
  overflow-x: auto !important;
  overflow-y: scroll !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 20px 0 !important;

  .type {
    padding: 0 20px !important;
    margin-bottom: 15px !important;
    .title {
      font-size: 18px !important;
      font-weight: 700 !important;
      margin-bottom: 10px !important;
    }
  }
}
</style>
