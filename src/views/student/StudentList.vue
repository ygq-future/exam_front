<template>
  <el-container v-loading="loading">
    <el-header class="header">
      <div class="item">
        <el-button type="primary" @click="dialogVisible = true">批量导入</el-button>
        <el-button type="success" @click="downloadExample">下载导入模板</el-button>
      </div>

      <div class="item">
        <!--两个选项框 -->
        <el-select v-model="query.majorId" placeholder="请选择专业" filterable clearable @change="majorChange">
          <el-option v-for="item in majorData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>

        <!-- 班级选项卡 -->
        <el-select v-model="query.clazzId" placeholder="请选择班级" filterable clearable @change="getStudent">
          <el-option v-for="item in children" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>

        <el-input clearable placeholder="请输入关键字" v-model="query.keyword" @input="searchStudent">
          <template slot="prepend">关键字查找</template>
        </el-input>
      </div>
    </el-header>

    <!-- 页面表格区域 -->
    <el-main>
      <el-table :data="studentList" style="width: 100%" stripe height="500">
        <el-table-column prop="studentNo" label="学号" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="collegeName" label="学院" align="center" />
        <el-table-column prop="clazzName" label="班级" align="center" />
        <el-table-column prop="majorName" label="专业" align="center" />
        <el-table-column label="账号状态" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-show="scope.row.locked !== 0">已锁定</el-tag>
            <el-tag v-show="scope.row.locked === 0">未锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="small" v-show="scope.row.locked === 0" @click="lock(scope.row.id)">锁定账户</el-button>

            <el-button type="success" size="small" v-show="scope.row.locked !== 0" @click="lock(scope.row.id)">解锁账户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 页脚分页区域 -->
    <el-footer height="50">
      <el-pagination
        style="text-align: center"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        :current-page="page.current"
        :page-size="page.size"
        @current-change="pageNumberChange"
        @size-change="changeSize"
      >
      </el-pagination>
    </el-footer>

    <el-dialog
      center
      title="上传文件"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
      @close="$refs.importRef.clearFiles()"
    >
      <el-upload
        ref="importRef"
        :before-upload="beforeUpload"
        drag
        :limit="1"
        :multiple="false"
        :auto-upload="false"
        :http-request="importStudent"
        action="https://jsonplaceholder.typicode.com/posts/"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$refs.importRef.submit()">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import student from '@/api/student'
import major from '@/api/major'
import user from '@/api/user'
import { Loading } from 'element-ui'
export default {
  data: () => ({
    dialogVisible: false,
    loading: false,
    majorData: [],
    studentList: [],
    page: {
      current: 1,
      size: 10,
      pages: 0,
      total: 0
    },
    query: {
      majorId: '',
      clazzId: '',
      keyword: ''
    },
    timer: 0
  }),
  computed: {
    // 班级选项器菜单
    children() {
      //如果专业ID为空,那么直接返回空
      if (this.query.majorId === '') return []
      //如果专业 ID 不为空则返回对应的数据
      return this.majorData.filter(e => e.id === this.query.majorId)[0].children
    }
  },
  methods: {
    beforeUpload(file) {
      const type = file.type
      if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || type === 'application/vnd.ms-excel') {
        return true
      }
      this.$message.warning('只能上传excel文件!')
      return false
    },
    importStudent(file) {
      let formData = new FormData()
      formData.append('file', file.file)
      let loadingInstance = Loading.service({ fullscreen: true })
      student.batchImport(formData).then(res => {
        if (res.data) {
          this.$notify({
            title: '异常提示',
            message: res.data,
            type: 'warning',
            duration: 0
          })
        } else {
          this.$message.success(res.message)
        }

        this.$refs.importRef.clearFiles()
        this.dialogVisible = false
        this.getStudent()
        loadingInstance.close()
      })
    },
    async downloadExample() {
      let { data } = await user.createToken()
      let uri = student.downloadUri(data)
      window.open(this.$baseUrl + uri)
    },
    searchStudent() {
      clearTimeout(this.timer)
      setTimeout(() => {
        this.page.current = 1
        this.getStudent()
      }, 300)
    },
    //获取专业和班级信息
    getMajorData() {
      major.majorList().then(res => {
        //当页面还没有数据的时候会执行一次init
        if (this.majorData.length == 0) this.init(res.data)
        this.majorData = res.data
      })
    },
    //初始化事件,页面第一次获取完数据后触发
    init(res) {
      //初始化后获取学生信息(默认获取第一个专业的所有学生信息)
      this.query.majorId = res[0].id
      this.getStudent()
    },
    // * 获取学生信息
    getStudent() {
      //验证参数,如果个别删除没有则直接删除参数
      const query = { ...this.query, ...this.page }

      this.loading = true
      //处理返回的数据
      student.getList(query).then(res => {
        this.studentList = res.data.rows
        this.page.total = res.data.total
        this.page.pages = res.data.pages
        this.page.current = res.data.current
        this.loading = false
      })
    },

    //专业选择器点击事件
    majorChange() {
      this.query.clazzId = ''
      this.getStudent()
    },
    pageNumberChange(pageNumber) {
      this.page.current = pageNumber
      this.getStudent()
    },
    changeSize(size) {
      this.page.size = size
      this.getStudent()
    },
    //锁定和解锁状态
    lock(id) {
      student.lock(id).then(() => {
        this.getStudent()
      })
    }
  },
  created() {
    //初始化数据
    this.getMajorData()
  }
}
</script>
<style scoped lang="scss">
.header {
  height: fit-content;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  .item {
    display: flex;
    margin-bottom: 10px;

    * {
      margin-right: 10px;
    }

    .el-input {
      width: fit-content;
    }
  }
}

.el-button {
  margin: 0;
}
</style>
