<template>
  <div class="box" :style="{ height: height ? height : '450px' }">
    <el-empty description="题目为空,快去添加题目吧" v-if="Object.keys(questions).length === 0"></el-empty>

    <div class="type" v-for="type in types" :key="type.id" v-if="questions[type.name]">
      <div class="title">{{ type.name }}</div>
      <el-divider></el-divider>

      <div class="list">
        <div class="item" v-for="(item, idx) in questions[type.name]" :key="item.id">
          <!-- question title -->
          <div style="margin-bottom: 10px">
            {{ `${idx + 1}、 ${item.title}` }}
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
              <el-tag :type="item.answer.split(',').includes(select.id + '') ? 'success' : 'info'">{{
                select.description
              }}</el-tag>
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

export default {
  props: ['questions', 'height'],
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
    getTypes() {
      api.getType().then(res => {
        this.types = res.data
      })
      0
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  padding: 0 20px;

  .item {
    margin-bottom: 20px;
  }
}

.selects {
  padding-left: 20px;

  div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}

.box {
  width: 100%;
  height: 450px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 20px 0;

  .type {
    padding: 0 20px;
    margin-bottom: 15px;
    .title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
    }
  }
}
</style>
