<template>
  <div v-loading="loading" class="content">
    <el-card class="card">
      <el-alert title="学院列表信息" type="info" show-icon center :closable="false" />
      <el-button type="primary" size="mini" style="margin: 15px 0" @click="add(null)">添加学院</el-button>
      <el-tree :data="collegeList" :props="{ label: 'name' }" node-key="id" default-expand-all :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" v-show="data.children" class="append" size="mini" @click="add(data)">添加</el-button>
            <el-button type="text" size="mini" @click="edit(data)">修改</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              @confirm="remove(data)"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="info"
              icon-color="red"
              title="确定删除此项吗?"
            >
              <el-button slot="reference" type="text" class="delete" size="mini">删除</el-button>
            </el-popconfirm>
          </span>
        </div>
      </el-tree>
    </el-card>

    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="addDialog" width="400px" center>
      <el-form class="mybox" inline>
        <el-form-item label="名称">
          <el-input placeholder="请输入名称" v-model="form.name" />
          <!-- 隐藏input框,防止回车提交表单 -->
          <input type="text" style="display: none" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import major from '@/api/major'

export default {
  data() {
    return {
      addDialog: false,
      loading: false,
      collegeList: [],
      form: {},
      title: ''
    }
  },
  mounted() {
    this.getCollegeList()
  },
  methods: {
    remove(data) {
      switch (data.type) {
        case 0:
          major.delCollege(data.id).then(res => this.reqDeal(res))
          break
        case 1:
          major.delMajor(data.id).then(res => this.reqDeal(res))
          break
        case 2:
          major.delClass(data.id).then(res => this.reqDeal(res))
      }
    },
    reqDeal(res) {
      this.$message.success(res.message)
      this.getCollegeList()
    },
    edit(data) {
      this.form = { id: data.id, name: data.name }

      switch (data.type) {
        case 0:
          this.title = '修改学院名'
          break
        case 1:
          this.title = '修改专业名'
          break
        case 2:
          this.title = '修改班级名'
      }

      this.addDialog = true
    },
    submit() {
      switch (this.title) {
        case '添加学院':
          major.addCollege(this.form).then(res => this.reqDeal(res))
          break
        case '添加专业':
          major.addMajor(this.form).then(res => this.reqDeal(res))
          break
        case '添加班级':
          major.addClass(this.form).then(res => this.reqDeal(res))
          break
        case '修改学院名':
          major.editCollege(this.form).then(res => this.reqDeal(res))
          break
        case '修改专业名':
          major.editMajor(this.form).then(res => this.reqDeal(res))
          break
        case '修改班级名':
          major.editClass(this.form).then(res => this.reqDeal(res))
          break
      }
      this.addDialog = false
    },
    add(data) {
      this.form = {}

      if (!data) {
        this.title = '添加学院'
        this.addDialog = true
        return
      }

      switch (data.type) {
        case 0:
          this.title = '添加专业'
          this.form.collegeId = data.id
          this.form.collegeName = data.name
          break
        case 1:
          this.title = '添加班级'
          this.form.majorId = data.id
          this.form.majorName = data.name
      }

      this.addDialog = true
    },
    getCollegeList() {
      this.loading = true
      major.collegeList().then(res => {
        this.collegeList = res.data
        this.loading = false

        this.collegeList.forEach(college => {
          college.type = 0
          college.children.forEach(major => {
            major.type = 1
            major.children.forEach(clazz => {
              clazz.type = 2
            })
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  // align-items: center;

  .card {
    width: 700px;
    height: 650px;
    overflow-y: auto;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .append {
    color: #67c23a;
  }

  .delete {
    color: #f56c6c;
  }
}

.mybox {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
