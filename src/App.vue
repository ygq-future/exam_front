<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
body{
  font-family:Verdana, Geneva, Tahoma, sans-serif;
}
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.dialog {
  border-radius: 15px !important;
  overflow: hidden;
}

.el-dialog__body {
  padding-bottom: 0 !important;
}
</style>
