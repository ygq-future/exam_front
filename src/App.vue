<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family:Verdana, Geneva, Tahoma, sans-serif;
}
.el-dialog {
  border-radius: 15px !important;
  overflow: hidden;
}

.el-popconfirm__action {
  display: flex;
  justify-content: space-around;
}

.el-dialog__body {
  padding-bottom: 0 !important;
}
</style>
