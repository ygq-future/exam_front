<template>
  <el-container class="question">
    <el-header height="30">
      <div class="input-menu">
        <el-input placeholder="根据关键字查询题目" v-model="page.keyword" class="input-with-select" @change="getDataList">
          <el-select slot="prepend" v-model="page.typeId" placeholder="请选择题目类型" @change="getDataList">
            <el-option label="全部" :value="null" />
            <el-option v-for="item in questionType" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="menu">
        <el-button type="primary">添加题目</el-button>
      </div>
    </el-header>
    <!-- 题目表格区域 -->
    <el-main>
      <el-table :data="dataList" border height="70vh">
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="typeName" label="题目类型" width="100" align="center"></el-table-column>
        <el-table-column prop="title" label="题目标题"></el-table-column>
        <el-table-column label="答案">
          <template slot-scope="scope">
            {{ scope.row.answer }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <!-- 通过题目类型决定打开哪一个表单 -->
            <div class="buttons">
              <!-- 表单按钮 -->
              <SingleChoice :id='scope.row.id' v-show="scope.row.typeId === 1" />
              <MultipleChoice :id="scope.row.id" v-show="scope.row.typeId === 2" />
              <el-button size="small" type="danger">删除题目</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer> </el-footer>
  </el-container>
</template>

<script>
import question from "@/api/question";
import MultipleChoice from "./form/MultipleChoice.vue";
import SingleChoice from "./form/SingleChoice.vue";
export default {
  data: () => ({
    dataList: [],
    page: {
      current: 1,
      size: 5,
      typeId: 1,
      sortByDate: 1,
      sortType: "desc",
      keyword: "",
    },
    questionType: [],
  }),
  methods: {
    //获取题目列表
    async getDataList() {
      //数据校验,防止传递空值
      const params = { ...this.page };
      for (let item in params) {
        if (params[item] === "" || params[item] === null || params[item] === undefined) delete params[item];
      }
      //调用接口
      const res = await question.getList({ ...params });
      //设置数据
      this.dataList = res.data.rows;
    },
    // 获取全部题目类型
    async getType() {
      const res = await question.getType();
      this.questionType = res.data;
    },
  },
  //页面初始化事件
  created() {
    this.getType();
    this.getDataList();
  },
  components: { MultipleChoice, SingleChoice },
};
</script>
<style scoped lang="scss">
.buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
.question {
  .el-header {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    .menu {
      display: flex;
      gap: 10px;
    }
  }
}
.input-menu {
  width: 70vmin;
  .el-select{
    width: 15vmin;
  }
}
</style>
