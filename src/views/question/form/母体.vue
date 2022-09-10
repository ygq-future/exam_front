<!-- 表单模版(失败但经验) -->
<template>
  <el-dialog
    :visible="formState.choiceState"
    :close-on-click-modal="false"
    center
    width="90vmin"
    @open="init"
    @close="clean"
  >
    <el-container>
      <!-- 顶部操作 -->
      <el-header height="30">
        <div class="operation">
          <!-- 顶部按钮区域 -->
          <div class="operation-buttons">
            <h1>题目类型:{{ questionData.typeName }}</h1>
            <el-button type="primary" round size="small" @click="addQuestionOption">
              添加选项
              <i class="el-icon-plus el-icon--right"></i>
            </el-button>
          </div>
          <!-- 题目编辑区域 -->
          <el-input type="textarea" placeholder="请输入题目描述" v-model="questionData.title" />
        </div>
      </el-header>
      <!-- 表单区域 -->
      <el-main>
        <el-table
          border
          style="width: 100%"
          :data="questionData.selects"
          height="40vmin"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          :row-class-name="ifLight"
        >
          <el-table-column width="50" align="center" type="selection" />
          <el-table-column label="选项" width="50" align="center">
            <template slot-scope="scope">
              {{ createIndex(scope.$index, scope.row) }}
            </template>
          </el-table-column>

          <el-table-column prop="description" label="描述">
            <template slot-scope="scope">
              <span v-show="scope.row.edit == false">{{ scope.row.description }}</span>
              <el-input
                v-show="scope.row.edit == true"
                :placeholder="scope.row.tip || '请输入选项描述'"
                v-model="scope.row.description"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">
                {{ scope.row.edit ? "保存" : "编辑" }}
              </el-button>
              <el-button type="text" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <el-button @click="formState.choiceState = false">取消修改</el-button>
      <el-button type="primary" @click="put">确认修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
import question from "@/api/question";

export default {
  data: () => ({
    state: false,
    checkList: [],
    questionData: {
      selects: [],
      answer: [],
    },
  }),
  inject: ["formState"],
  methods: {
    handleSelectionChange(val) {
      let ids = val.map((item) => item.id) || [];
      this.questionData.answer = ids.join(",");
    },
    //提交
    put() {
      console.log(this.questionData);
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
    //
    //根据ID查找题目
    async queryById() {
      const res = await question.queryByID(this.formState.id);
      //答案
      const answer = res.data.answer.split(",").map(Number);
      console.log(answer);
      //给查询到的答案加上勾
      for (let item of res.data.selects) {
        //判断是否是答案,是答案加上一个高亮标识
        if (answer.some((e) => e === item.id)) {
          item.light = true;
        }
        //标识是否在编辑状态
        item.edit = false;
      }
      //返回处理后的数据
      this.questionData = res.data;
      //   this.toggleSelection(answers)
    },
    ifLight({ row }) {
      if (row.light) {
        return "success-row";
      }
      return "";
    },
    async init() {
      await this.queryById();
    },
    //修改题目信息
    async edit(row) {
      // 临时记忆修改前的内容
      row.tip = row.description;
      row.edit = !row.edit;
      //保存信息,从数据中拿出所有的 description 和题目id一起提交
      if (!row.edit) {
        //判断时间是否存在,如果存在则走修改题目的Api,如果没有时间属性那么则走添加选项的Api
        if (row.gmtCreate) {
          if (row.tip === row.description) return;
          await question.editQuestion(row.id, { ...row });
        } else {
          //如果传入的数据是错误的,直接提示
          if (row.description.trim() === "") return;
          await question.addQuestion({ ...row });
        }
        //刷新数据
        if (row.tip === row.description) return;
        this.queryById();
      }
    },
    async del(id) {
      await question.delQuestion(id);
      this.queryById();
    },
    //添加选项
    addQuestionOption() {
      const params = {
        description: "",
        questionId: this.questionData.id,
        Answer: false,
        edit: true,
        // itemId:
      };
      this.questionData.selects.push(params);
    },
    //将索引转为字母并绑定到当前选项身上
    createIndex(index, row) {
      row.itemId = String.fromCharCode(index + 65);
      return row.itemId;
    },
    //弹窗消失后清除数据
    clean() {
      this.formState.choiceState = false;
      this.questionData = {
        selects: [],
      };
    },
  },
};
//根据Id查询题目
</script>
<style lang="scss">
.operation {
  display: flex;
  flex-direction: column;
  &-buttons {
    height: 40px;
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    h1 {
      margin: 0;
      font-size: 1.5em;
    }
  }
  textarea {
    // height: 10vmin;
    max-height: 10vmin;
    font-size: 1rem;
  }
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>
