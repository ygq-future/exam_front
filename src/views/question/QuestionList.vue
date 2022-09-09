<template>
  <el-container>
    <el-header>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-button>添加题目</el-button>
        </el-col>
        <el-col :span="5">
          <!-- 题目类型选择器 -->
          <el-select v-model="page.typeId" placeholder="请选择题目类型">
            <el-option v-for="item in questionType" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>

        <el-col :span="8">
          <el-input v-model="page.keyword" placeholder="根据关键字查询"></el-input>
        </el-col>
      </el-row>
    </el-header>
    <!-- 题目表格区域 -->
    <el-main>
      <el-table :data="dataList" border>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="typeName" label="题目类型" width="100" align="center"></el-table-column>
        <el-table-column prop="title" label="题目标题"></el-table-column>
        <!-- TODO:答案 -->
        <el-table-column prop="answer" label="答案">
          <!-- <template slot-scope=""></template> -->
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="chooseTheForm(scope.row)">修改题目</el-button>
            <el-button size="small" type="danger">删除题目</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
    </el-footer>
    <ChoiceForm></ChoiceForm>
  </el-container>
</template>

<script>
import question from "@/api/question";
import ChoiceForm from "./form/ChoiceForm.vue";

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
    //题目类型
    questionType: [],
    //题目ID
    //选择题类型的参数
    formData: {
      choiceState: false,
      topicState: false,
      id:0
    },
  }),
  provide(){
    return{
      formData: this.formData,
    }
  },
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
    //根据题目类型判断需要打开哪个表单
    async chooseTheForm(row) {
      //用typeId匹配对应的弹出框
      const choice = [1, 2];
      const topic = [3, 4];
      // 将ID传递给子组件
      this.formData.id = row.id
      // 点击的时候就会将题目的ID,之后判断打开哪个表单
      if (choice.some((e) => e == row.typeId)) this.formData.choiceState = true;
      else if (topic.some((e) => e == row.typeId)) this.formData.topicState = true;
    },
  },
  //页面初始化事件
  created() {
    this.getType();
    this.getDataList();
  },
  components: { ChoiceForm },
};
</script>
