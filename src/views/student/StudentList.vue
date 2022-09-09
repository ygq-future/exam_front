<template>
  <el-container>
    <el-header height="60">
      <el-row :gutter="10">
        <el-col :span="4">
          <!--两个选项框 -->
          <el-select v-model="query.majorId" placeholder="请选择专业" filterable clearable @change="majorChange">
            <el-option v-for="item in majorData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-col>
        <!-- 班级选项卡 -->
        <el-col :span="4">
          <el-select v-model="query.clazzId" placeholder="请选择班级" filterable clearable @change="getStudent">
            <el-option v-for="item in children" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-col>

        <el-col :span="7">
          <el-input clearable placeholder="请输入关键字" v-model="query.keyword" @input="searchStudent">
            <template slot="prepend">关键字查找</template>
          </el-input>
        </el-col>
      </el-row>
    </el-header>

    <!-- 页面表格区域 -->
    <el-main height="100%">
      <el-table :data="studentList" style="width: 100%" border stripe height="550">
        <el-table-column prop="studentNo" label="学号" width="180" align="center" style="boder: none">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180" align="center"> </el-table-column>
        <el-table-column prop="clazzName" label="班级" width="200" align="center"> </el-table-column>
        <el-table-column prop="majorName" label="专业" align="center" width="180"> </el-table-column>
        <el-table-column label="账号状态" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-show="scope.row.locked !== 0">已锁定</el-tag>
            <el-tag v-show="scope.row.locked === 0">未锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="small" v-show="scope.row.locked === 0" @click="lock(scope.row.id)"
              >锁定账户</el-button
            >

            <el-button type="success" size="small" v-show="scope.row.locked !== 0" @click="lock(scope.row.id)"
              >解锁账户</el-button
            >
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
  </el-container>
</template>
<script>
import student from '@/api/student'
import major from '@/api/major'
export default {
  data: () => ({
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
      if (query.majorId === '') return
      if (this.query.clazzId === '') delete query.clazzId
      if (this.query.keyword === '') delete query.keyword

      //处理返回的数据
      student.getList(query).then(res => {
        this.studentList = res.data.rows
        this.page.total = res.data.total
        this.page.pages = res.data.pages
        this.page.current = res.data.current
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
.el-button {
  margin: 0;
}
</style>
