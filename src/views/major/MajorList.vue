<template>
  <div v-loading="loading">
    <!-- 提示框 -->
    <div>
      <!-- 添加专业选项框 -->
      <el-dialog
        custom-class="dialog"
        title="添加专业"
        :visible.sync="majorDS.statue"
        center
        width="50vmin"
        :close-on-click-modal="false"
      >
        <el-input v-model="majorDS.input" placeholder="请输入专业名称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="majorDS.statue = false">取 消</el-button>
          <el-button type="primary" @click="addMajor">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加班级按钮弹窗 -->
      <el-dialog
        custom-class="dialog"
        title="添加班级"
        :visible.sync="classDS.statue"
        width="50vmin"
        center
        :close-on-click-modal="false"
      >
        <el-row>
          <!-- 专业选择器 -->
          <el-select v-model="classDS.data.majorId" clearable placeholder="请选择专业" style="width: 100%">
            <el-option v-for="item in majorData.data" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-row>
        <el-row>
          <el-input v-model="classDS.data.name" placeholder="请输入班级名称"></el-input>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="classDS.statue = false">取 消</el-button>
          <el-button type="primary" @click="addClass">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改班级选项框 -->
      <el-dialog
        title="修改班级信息"
        :visible.sync="classEdit.statue"
        center
        width="50vmin"
        :close-on-click-modal="false"
        custom-class="dialog"
      >
        <el-input v-model="classEdit.data.name" placeholder="请输入要修改的名称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="classEdit.statue = false">取 消</el-button>
          <el-button type="primary" @click="editClass">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改专业选项框 -->
      <el-dialog
        title="修改专业信息"
        :visible.sync="majorEdit.statue"
        center
        width="50vmin"
        :close-on-click-modal="false"
        custom-class="dialog"
      >
        <el-input v-model="majorEdit.data.name" placeholder="请输入专业名称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="majorEdit.statue = false">取 消</el-button>
          <el-button type="primary" @click="editMajor">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <el-container>
      <!-- 表格上方按钮选项 -->
      <el-header height="50">
        <div style="display: flex">
          <el-button type="primary" @click="classDS.statue = true">添加班级</el-button>
          <el-button type="primary" @click="majorDS.statue = true">添加专业</el-button>
          <el-button type="primary" @click="getMajorData">刷新数据</el-button>
        </div>
      </el-header>

      <!-- 表格部分 -->
      <el-main>
        <el-table :data="majorData.data" row-key="name" border highlight-current-row>
          <el-table-column width="50" align="center" />
          <el-table-column prop="name" label="专业名称" />
          <!-- 操作列 -->
          <el-table-column label="操作" width="180" align="center">
            <template #default="scope">
              <el-row type="flex" justify="center" style="margin: 0">
                <el-col>
                  <el-button size="small" @click="edit(scope.row)">编辑</el-button>
                </el-col>
                <el-col>
                  <el-popconfirm title="确定删除吗?" @confirm="del(scope.row)" icon-color="red">
                    <el-button size="small" type="danger" slot="reference">删除</el-button>
                  </el-popconfirm>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { reactive, ref, provide } from 'vue'
import major from '@/api/major'

let loading = ref(false)

//专业和班级的数据
const majorData = reactive({ data: [] })

//获取专业和班级数据
function getMajorData() {
  loading.value = true
  major.majorList().then(res => {
    majorData.data = res.data
    loading.value = false
  })
}

//弹窗数据
//专业
const majorDS = reactive({
  statue: false,
  input: ''
})

//班级弹窗信息
const classDS = reactive({
  statue: false,
  data: {
    name: '',
    majorId: null,
    majorName: ''
  }
})

//修改班级信息弹窗
const classEdit = reactive({
  statue: false,
  id: null,
  data: {
    name: '',
    majorId: null,
    majorName: ''
  }
})

//修改专业信息弹窗
const majorEdit = reactive({
  statue: false,
  id: null,
  data: {
    name: ''
  }
})

//编辑专业或班级
function edit(row) {
  if (row?.majorId) {
    classEdit.id = row.id
    classEdit.data.name = row.name
    classEdit.data.majorId = row.majorId
    classEdit.data.majorName = row.majorName
    classEdit.statue = true
  } else {
    majorEdit.id = row.id
    majorEdit.data.name = row.name
    majorEdit.statue = true
  }
}
//修改班级名称
function editClass() {
  major.editClass(classEdit.id, classEdit.data).then(res => {
    classEdit.statue = false
    getMajorData()
  })
}
//编辑专业
function editMajor() {
  major.editMajor(majorEdit.id, majorEdit.data).then(res => {
    majorEdit.statue = false
    getMajorData()
  })
}

//添加专业
function addMajor() {
  major.addMajor(majorDS.input).then(res => {
    majorDS.statue = false
    getMajorData()
  })
}

//添加班级
function addClass() {
  classDS.data.majorName = majorData.data.filter(e => e.id === classDS.data.majorId)[0].name
  major.addClass(classDS.data).then(res => {
    getMajorData()
    classDS.statue = false
  })
}

//删除专业或班级
function del(row) {
  //通过majorId区分是班级还是专业
  if (row?.majorId) {
    major.delClass(row.id).then(res => {
      getMajorData()
    })
  } else {
    major.delMajor(row.id).then(res => {
      getMajorData()
    })
  }
}

//页面初始化事件
function init() {
  getMajorData()
}

init()
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-popconfirm__main {
  margin: 10px !important;
}
.el-popconfirm__action {
  margin-top: 10px !important;
  box-sizing: content-box;
  padding: 10px !important;
  background: #000 !important;
}
</style>
