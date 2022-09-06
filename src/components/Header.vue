<template>
  <div class="content">
    <div class="log">
      <i class="el-icon-monitor" style="font-size: 35px"></i>
      <h1>考试后台管理系统</h1>
    </div>
    <div class="user">
      <el-avatar style="background-color: #1c6b48">于</el-avatar>
      <el-dropdown>
        <span class="el-dropdown-link">
          <span>小黑</span>
          <i class="el-icon-arrow-down"></i>
        </span>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>用户信息</el-dropdown-item>
            <el-dropdown-item
              ><span @click="logout">退出登录</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      this.$confirm('确认注销登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$router.replace('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style scoped lang="scss">
.el-dropdown-link {
  display: flex;
  align-items: center;
}

.user {
  display: flex;
  align-items: center;

  span {
    margin-right: 15px;
    font-size: 16px;
  }
}

.log {
  display: flex;
  align-items: center;

  h1 {
    font-size: 20px;
    font-weight: bold;
    padding: 0 10px;
  }
}

.content {
  height: 100%;
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid lightgray;
}
</style>
