<template>
  <el-container class="my">
    <el-header class="header">
      <Header/>
    </el-header>
    <el-container>
      <el-aside>
        <Aside/>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from "./Header.vue"
import Aside from "./Aside.vue"

export default {
  components: {Header, Aside}
}
</script>

<style scoped>
.my {
  width: 100vw;
}

.header {
  width: 100%;
  height: 60px;
  padding: 0;
  background-color: white;
}

.el-aside {
  height: calc(100vh - 60px);
  width: auto !important;
}
</style>
