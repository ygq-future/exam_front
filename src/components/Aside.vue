<template>
  <el-menu :default-openeds="openeds" :collapse-transition="false" router :collapse="isCollapse"
    :default-active="active" :class="[isCollapse ? 'auto' : 'normal']">
    <div class="collapse" @click="isCollapse = !isCollapse">
      <i class="el-icon-set-up"></i>
    </div>

    <!-- <el-menu-item index="/teacher-dashboard">
      <i class="el-icon-s-operation"></i>
      <span slot="title">仪表盘</span>
    </el-menu-item> -->

    <el-submenu index="person">
      <template slot="title">
        <i class="el-icon-user"></i>
        <span>人员管理</span>
      </template>
      <el-menu-item index="/teacher-list">教师列表</el-menu-item>
      <el-menu-item index="/student-list">学生列表</el-menu-item>
    </el-submenu>

    <el-menu-item index="/major-list">
      <i class="el-icon-date"></i>
      <span slot="title">专业学科</span>
    </el-menu-item>

    <el-menu-item index="/question-list">
      <i class="el-icon-edit"></i>
      <span slot="title">题目管理</span>
    </el-menu-item>

    <el-submenu index="paper">
      <template #title>
        <i class="el-icon-document"></i>
        <span>考试管理</span>
      </template>
      <el-menu-item index="/paper-list">试卷列表</el-menu-item>
      <el-menu-item index="/examing-paper">开考试卷</el-menu-item>
      <el-menu-item index="/scoring">主观评分</el-menu-item>
    </el-submenu>

    <el-submenu index="statistics">
      <template #title>
        <i class="el-icon-cpu"></i>
        <span>统计数据</span>
      </template>
      <el-menu-item index="/statistics-score">成绩汇总</el-menu-item>
    </el-submenu>

    <el-submenu index="system">
      <template #title>
        <i class="el-icon-thumb"></i>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/role-authority">角色授权</el-menu-item>
      <!-- <el-menu-item index="/admin-function">管理员功能</el-menu-item> -->
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      active: '',
      openeds: ['person', 'major', 'question', 'paper'],
      isCollapse: false
    }
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.active = newVal.path
      }
    }
  }
}
</script>

<style scoped>
.collapse {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 25px;
  transition: 0.5s all;
}

.collapse:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: white;
}

.el-menu {
  height: 100%;
  transition: 0.5s all;
}

.auto {
  width: auto;
}

.normal {
  width: 200px;
}

.el-menu--collapse,
.el-menu,
.el-submenu__title,
.el-submenu {
  transition: 0.5s all;
}
</style>
