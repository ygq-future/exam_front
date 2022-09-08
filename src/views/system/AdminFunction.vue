<template>
  <div class="content">
    <el-card class="offline">
      <el-autocomplete
        v-model="selected"
        :fetch-suggestions="querySearch"
        placeholder="请输入账号"
        :trigger-on-focus="false"
        @select="select"
      ></el-autocomplete>
      <el-button type="danger" size="small" @click="offline">下线</el-button>
    </el-card>

    <el-card class="message">
      <el-empty
        v-if="applyList.length === 0"
        description="还没有消息"
      ></el-empty>
      <el-table :data="applyList" style="width: 100%" height="500">
        <el-table-column
          fixed
          align="center"
          type="index"
          width="100"
          label="编号"
        />
        <el-table-column align="center" prop="teacherName" label="教师名称" />
        <el-table-column align="center" prop="majorName" label="专业名称" />
        <el-table-column align="center" prop="enable" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enable === 1" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" width="100" label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              :type="scope.row.enable ? 'danger' : 'success'"
              @click="reverseStatus(scope.row)"
              >{{ scope.row.enable ? '禁用' : '启用' }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import api from '@/api/admin'

export default {
  data() {
    return {
      selected: '',
      timer: 0,
      selectObj: null,
      applyList: [],
    }
  },
  mounted() {
    this.getApplyList()
  },
  methods: {
    reverseStatus(item) {
      api.reverseStatus(item.id).then((res) => {
        this.$message.success(res.message)
        this.getApplyList()
      })
    },
    getApplyList() {
      api.applyList().then((res) => {
        this.applyList = res.data
      })
    },
    offline() {
      if (this.selectObj) {
        api.offline(this.selectObj.unique).then((res) => {
          this.$message.success(res.message)
          this.selected = ''
        })
      }
    },
    select(value) {
      this.selectObj = value
    },
    querySearch(queryString, cb) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        api.accounts().then((res) => {
          let data = res.data
          data.forEach((user) => {
            user.value = user.studentNo ? user.studentNo : user.teacherNo
            user.unique = user.value
            user.value = `${user.name}#${user.value}`
          })
          const result =
            data.filter((item) => {
              return item.value.indexOf(queryString) >= 0
            }) || []
          cb(result)
        })
        // 调用 callback 返回建议列表的数据
      }, 400)
    },
  },
}
</script>

<style lang="scss" scoped>
.message {
  height: 500px;
}

.offline {
  width: 300px;
  margin-bottom: 15px;
  .el-button {
    margin-top: 15px;
    width: 100%;
  }
  .el-autocomplete {
    width: 100%;
  }
}
</style>