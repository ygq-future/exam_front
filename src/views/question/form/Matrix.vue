<!-- 表格母体 -->
<template>
  <!-- 表结构母体 -->
  <el-dialog
    :visible="visible"
    width="90vmin"
    @close="handleClose"
    :fullscreen="fullscreen"
    class="matrix"
    :show-close="false"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <!-- 顶部操作按钮 -->
    <template #title>
      <el-button circle icon="el-icon-full-screen" @click="switchFull" />
      <el-button circle icon="el-icon-close" @click="handleClose" />
    </template>

    <el-container>
      <el-header height="30">
        <div class="el-header-menus">
          <h1>{{ title || "编辑题目" }}</h1>
          <!-- 默认操作列表,触发父元素的添加表单方法 -->

          <div class="optionsMenu">
            <slot name="options"></slot>
            <slot name="buttons">
              <el-button type="primary" round size="small" @click="addLine" v-show="!hideAddButton">
                添加选项
                <i class="el-icon-plus el-icon--right"></i>
              </el-button>
            </slot>
          </div>
        </div>
        <slot name="header"></slot>
      </el-header>

      <!-- 默认插槽 -->
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
    <template #footer class="dialog-footer">
      <el-button round @click="handleClose">取消</el-button>
      <el-button round type="primary" @click="commitChange">{{ submitText || "确认修改" }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  inheritAttrs: false,
  data: () => ({
    fullscreen: false,
  }),
  props: ["title", "visible", "topVisible", "hideAddButton", "submitText"],
  methods: {
    handleClose() {
      this.$emit("close");
    },
    commitChange() {
      this.$emit("submit");
    },
    switchFull() {
      this.fullscreen = !this.fullscreen;
    },
    addLine() {
      this.$emit("addLine");
    },
  },
};
</script>
<style lang="scss">
.matrix {
  overflow: hidden;
  .el-dialog {
    max-width: 60vw;
    top: 5%;
    max-height: 90vh;
    transition: all 0.7s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .el-dialog__body {
    height: 100%;
    padding-top: 10px;

    textarea {
      height: 10vh;
      max-height: 20vh;
      font-size: 1rem;
    }
    .el-main {
      padding-top: 10px;
      padding-bottom: 0;
    }
    .el-header {
      margin: 0;
      &-menus {
        display: flex;
        flex-direction: column;
        margin: 10px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        h1 {
          margin: 0;
          font-size: 1.5em;
        }
      }
      .optionsMenu {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }
    }
  }
  .el-dialog__header {
    text-align: right;
    i {
      font-size: 0.8rem;
      font-weight: 800;
      text-align: center;
    }
  }
}
.optionsMenu {
  .el-input__inner {
    width: 100%;
    min-width: 150px;
    max-width: 200px;
  }
}
</style>
