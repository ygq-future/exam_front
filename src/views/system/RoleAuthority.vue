<template>
  <div class="content">
    <el-button type="primary" size="small" style="margin-bottom: 15px"
       @click="refreshAuth">刷新权限</el-button
    >
    <el-tabs type="border-card" @tab-click="getAuths">
      <el-tab-pane
        v-for="item in roles"
        :key="item.id"
        :label="item.nameZh"
        :value="item.id"
      >
        <div class="box" v-if="item.name !== 'ROLE_ADMIN'">
          <el-tag
            @click="reverseAuth(item.id, auth.id)"
            :type="hasAuth(item.id, auth.id) ? 'success' : 'danger'"
            v-for="auth in auths"
            :key="auth.id"
            >{{ auth.name }}</el-tag
          >
        </div>
        <div v-else>
          <el-alert
            title="管理员拥有所有权限"
            type="success"
            center
            show-icon
            :closable="false"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from '@/api/admin'

export default {
  data() {
    return {
      roles: [],
      auths: [],
    }
  },
  mounted() {
    this.getRoles()
    this.getAuths()
  },
  methods: {
    reverseAuth(roleId, authorityId) {
      let data = { roleId, authorityId }

      if (this.hasAuth(roleId, authorityId)) {
        api.cancelAuth(data).then((res) => {
          this.$message.success(res.message)
          this.getRoles()
        })
      } else {
        api.addAuth(data).then((res) => {
          this.$message.success(res.message)
          this.getRoles()
        })
      }
    },
    refreshAuth() {
      api.refreshAuth().then((res) => {
        this.$message.success(res.message)
        this.getAuths()
      })
    },
    getRoles() {
      api.roles().then((res) => {
        this.roles = res.data
      })
    },
    getAuths() {
      api.auths().then((res) => {
        this.auths = res.data
      })
    },
    hasAuth(roleId, authId) {
      let flag = false

      this.roles.forEach((item) => {
        if (item.id === roleId) {
          item.authorities.forEach((auth) => {
            if (auth.id === authId) {
              return (flag = true)
            }
          })
        }
      })

      return flag
    },
  },
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  .el-tag {
    margin-right: 15px;
    margin-bottom: 15px;
    cursor: pointer;
  }
}

.el-tab-pane {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
