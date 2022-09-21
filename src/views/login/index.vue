<template>
  <div class="content">
    <div class="box">
      <div class="left" ref="left">
        <i class="el-icon-user-solid login-icon"></i>
        <span class="login-text">LOGIN</span>
        <div class="form">
          <el-input prefix-icon="el-icon-user" v-model="form.username" class="login-input" placeholder="用户名"></el-input>
          <el-input
            prefix-icon="el-icon-unlock"
            v-model="form.password"
            show-password
            type="password"
            @keydown.native.enter="login"
            class="login-input"
            placeholder="密码"
          ></el-input>
          <el-checkbox v-model="form.rememberMe">记住我</el-checkbox>
        </div>
        <el-button-group class="btngrp">
          <el-button type="primary" @click="login">确认</el-button>
          <el-button type="info" @click="changeRegister">注册</el-button>
        </el-button-group>
      </div>

      <div class="right" ref="right">
        <i class="el-icon-user-solid register-icon"></i>
        <span class="register-text">REGISTER</span>
        <div class="form">
          <el-input prefix-icon="el-icon-user" v-model="form.name" class="login-input" placeholder="姓名"></el-input>
          <el-input prefix-icon="el-icon-edit" v-model="form.teacherNo" class="login-input" placeholder="工号"></el-input>
          <el-input
            prefix-icon="el-icon-unlock"
            type="password"
            v-model="form.password"
            class="login-input"
            show-password
            placeholder="密码"
          ></el-input>
        </div>
        <el-button-group class="btngrp">
          <el-button type="primary" @click="register">确认</el-button>
          <el-button type="info" @click="changeLogin">登录</el-button>
        </el-button-group>
      </div>

      <img ref="img" src="@/assets/img/login.jpg" alt="" />
    </div>
  </div>
</template>

<script>
import api from '@/api/user'
import { mapActions, mapGetters } from 'vuex'
import cookies from 'vue-cookies'

export default {
  data() {
    return {
      form: {
        rememberMe: false
      }
    }
  },
  mounted() {
    let userCookie = cookies.get('user')
    if (this.user || userCookie) {
      this.$router.replace('/')
    }
  },
  methods: {
    ...mapActions(['setUser']),
    login() {
      api.login(this.form).then(res => {
        let user = res.data

        if (user.type === 2) {
          this.$message.warning('你小子想法很危险!!!')
          api.logout()
          return
        }

        this.$message.success(res.message)
        delete user.roles
        this.setUser(user)
        cookies.set('user', JSON.stringify(user))
        this.$router.replace('/')
      })
    },
    register() {
      api.teacherRegister(this.form).then(res => {
        this.$message.success(res.message)
        this.changeLogin()
      })
    },
    changeLogin() {
      this.form = { rememberMe: false }
      this.$refs.right.style.opacity = 0
      this.$refs.img.style.transform = 'translateX(0)'
      this.$refs.left.style.opacity = 1
    },
    changeRegister() {
      this.form = {}
      this.$refs.left.style.opacity = 0
      this.$refs.img.style.transform = 'translateX(-100%)'
      this.$refs.right.style.opacity = 1
    }
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style lang="scss" scoped>
$boxTime: 0.3s;
$imgTime: 0.8s;

.btngrp {
  width: 300px;
  padding: 15px 0;
  display: flex;

  .el-button {
    flex: 1;
  }
}

.form {
  width: 300px;
  display: flex;
  flex-direction: column;

  .login-input {
    margin-bottom: 20px;
  }
}

.left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: $boxTime all;

  .login-icon {
    color: #55a0ff;
    font-size: 50px;
  }

  .login-text {
    font-size: 40px;
    color: #dedede;
    padding: 10px 0;
  }
}

.right {
  opacity: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: $boxTime all;

  .register-icon {
    color: #57efc4;
    font-size: 50px;
  }

  .register-text {
    font-size: 40px;
    color: #dedede;
    padding: 10px 0;
  }
}

.box {
  position: relative;
  display: flex;
  width: 900px;
  height: 550px;
  background-color: #ffffff;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.07);
  border-radius: 15px;
  overflow: hidden;

  img {
    right: 0;
    top: 0;
    position: absolute;
    width: 50%;
    height: 100%;
    z-index: 1000;
    transition: $imgTime all;
    opacity: 0.7;
  }
}

.content {
  background-color: #f8fafc;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
