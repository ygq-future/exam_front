<template>
  <div>
    <slot></slot>
    <quill-editor class="editor" v-model="myContent" ref="myQuillEditor" :options="editorOption"
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>

<script>

// 菜单选项
const toolbarOptions = [
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  ['bold', 'underline'], // 加粗 下划线  -----['bold', 'underline']
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ align: [] }], // 对齐方式
  ['clean'] // 清除文本格式
]
export default {
  name: 'Quill',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 富文本
      myContent: this.content,
      editorOption: {
        placeholder: '请输入文档内容~',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      }
    }
  },
  watch: {
    // 监听content值变化, 确保输入框中的数据刷新
    content() {
      this.myContent = this.content
    }
  },
  methods: {
    // 失去焦点事件
    onEditorBlur() {
      this.$emit('onEditorBlur', this.myContent)
    },
    // 获得焦点事件
    onEditorFocus() {
      this.$emit('onEditorFocus', this.myContent)
    },
    // 内容改变事件
    onEditorChange() {
      //内容过改变时会直接双向绑定到父元素的值
      this.$emit('update:content', this.myContent)
    }
  }
}
</script>

<style lang="scss" scoped>
.quill-editor {
  margin: 10px 0;

  :deep(.ql-container) {
    height: 20vmin;
    border-radius: 0 0 10px 10px;
  }

  :deep(.ql-toolbar) {
    border-radius: 10px 10px 0 0;
  }
}
</style>
