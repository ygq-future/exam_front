<!-- 多选题表单 -->
<template>
  <div>
    <el-button @click="init">修改题目</el-button>
    <Matrix :visible="visible" @close="close" @submit="submit" @addLine="addLine" title="编辑单选题">
      <template #options>
        <el-input v-model="questionData.score" placeholder="题目分数"> </el-input>
      </template>

      <el-form
        ref="form"
        label-width="80px"
        :model="questionData"
        label-position="top"
        class="form"
      >
        <el-form-item prop="title" label="题目">
          <el-input type="textarea" placeholder="请输入题目描述" v-model="questionData.title" />
        </el-form-item>
        <el-form-item v-for="(item, index) in questionData.selects" label-position="left">
          <div class="formWrap">
            <el-radio></el-radio>
          <el-input></el-input>
          </div>
        </el-form-item>
      </el-form>
    </Matrix>
  </div>
</template>

<script>
import util from "./util.js";
import Matrix from "./Matrix.vue";
import question from "@/api/question";
export default {
  props: ["id"],
  data: () => ({
    questionData: {
      selects: [],
    },
    visible: false,
  }),
  methods: {
    //初始化方法
    async init() {
      this.visible = true;
      //拿到处理后的数据
      const res = await util.queryById(this.id);
      this.questionData = res;
    },
    createIndex(index, row) {
      return util.createIndex(index, row);
    },
    async del(id) {
      await question.delQuestion(id);
      util.queryById(this.id);
      await this.init();
    },
    async edit(row) {
      if (!row.edit) {
        row.edit = true;
        // 临时记忆修改前的内容
        row.tip = row.description;
      } else {
        //以gmtCreate作为标识,判断表单是数据库取得的还是新加的
        //如果属性已经存在,则调用修改表单的方法
        if (row.gmtCreate) {
          //验证表单是否已经修改,如果没有修改,直接将状态改为编辑,之后直接返回
          if (row.tip === row.description) {
            this.$message({
              message: "未做任何更改",
            });
            row.edit = false;
            return;
          }
          //表单通过验证后,直接触发提交事件
          await question.editQuestion(row.id, { ...row });
        }
        //如果表单咩有时间属性,则走新加选项方法
        else {
          await question.addQuestion({ ...row });
        }
        //修改编辑状态
        row.edit = false;
      }
    },
    //表单新加行方法
    addLine() {
      if (this.questionData.selects.length > 6) {
        this.$message({
          message: "已经添加到最大选项了!不可再添加了",
          type: "warning",
        });
        return;
      }
      const params = {
        description: "",
        questionId: this.questionData.id,
        Answer: false,
        edit: true,
        // itemId:
      };
      this.questionData.selects.push(params);
    },
    close() {
      this.visible = false;
    },
    async submit() {
      await question.changeQuestion({ ...this.questionData });
      await this.init();
    },
    handleSelectionChange(val) {
      let ids = val.map((item) => item.id) || [];
      this.questionData.answer = ids.join(",");
    },
    lightLine({ row, rowIndex }) {
      const answer = this.parsingAnswer();
      if (answer.some((e) => e === row.id)) {
        return "warning-row";
      }
      return "";
    },
    parsingAnswer() {
      return this.questionData.answer.split(",").map(Number);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  components: { Matrix },
};
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}
</style>
<style scoped>
.form {
  text-align: left;
}
</style>
