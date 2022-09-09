<template>
  <div class="box" :style="{'height': height ? height : '450px'}">
    <el-empty description="题目为空,快去添加题目吧" v-if="Object.keys(questions).length === 0"></el-empty>
    <div class="type" v-for="(item, index) in questions" :key="index">
      <div class="title">{{ index }}</div>
      <el-divider></el-divider>

      <div class="list">
        <div class="item" v-for="(child, cidx) in item" :key="child.id">
          <!-- question title -->
          <div style="margin-bottom: 10px">
            {{ `${cidx + 1}、 ${child.title}` }}
          </div>

          <!-- singleton select -->
          <div class="selects" v-if="child.typeId === 1">
            <div v-for="(select, sidx) in child.selects" :key="sidx">
              {{ `${items[sidx]}、` }}
              <el-tag :type="child.answer == select.id ? 'success' : 'info'">{{ select.description }}</el-tag>
            </div>
          </div>

          <!-- more select -->
          <div class="selects" v-if="child.typeId === 2">
            <div v-for="(select, sidx) in child.selects" :key="sidx">
              {{ `${items[sidx]}、` }}
              <el-tag :type="child.answer.split(',').includes(select.id + '') ? 'success' : 'info'">{{
                select.description
              }}</el-tag>
            </div>
          </div>

          <!-- fill question -->
          <div v-if="child.typeId === 3">
            答案: <el-tag type="success">{{ child.answer }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["questions", "height"],
  data() {
    return {
      items: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    }
  }
}
</script>

<style lang="scss" scoped>
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
  overflow: scroll;
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
