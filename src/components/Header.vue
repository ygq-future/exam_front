<template>
  <div class="content">
    <div class="logo" @click="$router.push('/')">
      <i class="el-icon-monitor" style="font-size: 35px"></i>
      <h1>考试后台管理系统</h1>
    </div>
    <div class="user">
      <el-avatar style="background-color: #1c6b48">{{
        userInfo?.name[0]
      }}</el-avatar>
      <el-dropdown>
        <span class="el-dropdown-link">
          <span>{{ userInfo?.name }}</span>
          <i class="el-icon-arrow-down"></i>
        </span>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              ><span class="full" @click="getUserInfo"
                >用户信息</span
              ></el-dropdown-item
            >
            <el-dropdown-item
              ><span class="full" @click="logout"
                >退出登录</span
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog
      center
      custom-class="dialog"
      title="用户信息"
      :visible.sync="showDialog"
      width="400px"
      :close-on-click-modal="false"
    >

    <el-form label-width="60px">
      <el-form-item label="名称">
        <el-input :value="user.userInfo.name" disabled/>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input :value="user.username" disabled/>
      </el-form-item>
      <el-form-item label="工号" v-if="user.type == 1">
        <el-input :value="user.userInfo.teacherNo" disabled/>
      </el-form-item>
      <el-form-item label="身份">
        <el-input :value="user.type == 0 ? '管理员' : '教师'" disabled/>
      </el-form-item>
    </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/user'
import { mapGetters, mapActions } from 'vuex'
import cookies from 'vue-cookies'

export default {
  data() {
    return {
      showDialog: false,
      info: {},
    }
  },
  methods: {
    ...mapActions(['setUser']),
    logout() {
      this.$confirm('确认注销登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api.logout().then((res) => {
            this.$message.success(res.message)
            this.$router.replace('/login')
            this.setUser(null)
            cookies.remove('user')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作',
          })
        })
    },
    getUserInfo() {
      this.showDialog = true
      api.userInfo().then((res) => {
        this.info = res.data
      })
    },
  },
  computed: {
    ...mapGetters(['userInfo', 'user']),
  },
}
</script>

<style scoped lang="scss">
.full {
  display: inline-block;
  width: 100%;
  height: 100%;
}

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

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;

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
