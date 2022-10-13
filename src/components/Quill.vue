<template>
  <quill-editor
    class="editor"
    v-model="myContent"
    ref="myQuillEditor"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @change="onEditorChange($event)"
  >
  </quill-editor>
</template>

<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
  [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ font: [] }], // 字体种类-----[{ font: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  ['clean'] // 清除文本格式-----['clean']
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
      this.$emit('onEditorChange', this.myContent)
    }
  }
}
</script>

<style lang="scss" scoped></style>
