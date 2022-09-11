<template>
  <el-container class="question">
    <el-header height="30">
      <div class="input-menu">
        <el-input placeholder="根据关键字查询题目" v-model="page.keyword" class="input-with-select" @input="search">
          <el-select slot="prepend" v-model="page.typeId" placeholder="请选择题目类型" @change="getDataList">
            <el-option label="全部" :value="null" />
            <el-option v-for="item in questionType" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          
          <el-select slot="append" v-model="page.sortByDate" placeholder="时间排序" @change="getDataList">
            <el-option label="日期排序" :value="1" />
            <el-option label="不按日期排序" :value="0" />
          </el-select>
          <el-select slot="append" v-model="page.sortType" placeholder="排序方式" @change="getDataList" class="left">
            <el-option label="升序" value="asc" />
            <el-option label="降序" value="desc" />
          </el-select>
        </el-input>
      </div>
      <div class="menu">
        <AddQuestion />
        <!-- <el-button type="primary">添加题目</el-button> -->
      </div>
    </el-header>
    <!-- 题目表格区域 -->
    <el-main>
      <el-table :data="dataList" height="530px">
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
              <ShortAnswerQuestion :id="scope.row.id" v-show="scope.row.typeId === 5" />
              <TrueOrFalse :id="scope.row.id" v-show="scope.row.typeId === 4" />
              <GapFilling :id="scope.row.id" v-show="scope.row.typeId === 3" />
              <SingleChoice :id="scope.row.id" v-show="scope.row.typeId === 1" />
              <MultipleChoice :id="scope.row.id" v-show="scope.row.typeId === 2" />
              <el-button size="small" type="danger" @click="del(scope.row.id)">删除题目</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-footer height="50">
        <el-pagination
          style="text-align: center"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          :current-page="page.current"
          :page-size="page.size"
          :page-sizes="[10, 20, 30, 40]"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
          <!-- @current-change="getData" @size-change="getData" -->
        </el-pagination>
      </el-footer>
    </el-footer>
  </el-container>
</template>

<script>
import question from "@/api/question";
import MultipleChoice from "./form/MultipleChoice.vue";
import SingleChoice from "./form/SingleChoice.vue";
import GapFilling from "./form/GapFilling.vue";
import TrueOrFalse from "./form/TrueOrFalse.vue";
import ShortAnswerQuestion from "./form/ShortAnswerQuestion.vue";
import AddQuestion from "./form/CreateQuestion.vue";
export default {
  data: () => ({
    dataList: [],
    page: {
      current: 1,
      size: 10,
      typeId: null,
      sortByDate: 1,
      sortType: "desc",
      keyword: "",
      total: 0,
    },
    questionType: [],
    timer: 0,
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
      this.page.total = res.data.total;
      this.page.current = res.data.current;
    },
    // 获取全部题目类型
    async getType() {
      const res = await question.getType();
      this.questionType = res.data;
    },
    async del(id) {
      await question.del(id);
      this.getDataList();
    },
    async currentChange(current) {
      this.page.current = current;
      this.getDataList();
    },
    async search() {
      clearTimeout(this.timer);
      setTimeout(() => {
        this.page.current = 1;
        this.getDataList();
      }, 300);
    },
    async sizeChange(size){
      this.page.size = size
      await this.getDataList()
    }
  },
  //页面初始化事件
  created() {
    this.getType();
    this.getDataList();
  },
  components: { MultipleChoice, SingleChoice, GapFilling, TrueOrFalse, ShortAnswerQuestion, AddQuestion },
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
  .el-select {
    width: 16vmin;
  }
  .left{
    margin-left: 20px;
    padding-right: 0px;
  }
}
</style>
