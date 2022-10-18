<template>
  <div>
    <slot></slot>
    <quill-editor
      v-loading="loading"
      class="editor"
      v-model="myContent"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
    <el-upload
      class="avatar-uploader"
      :action="`http://10.20.35.159:9999/upload`"
      :show-file-list="false"
      :on-success="quillSuccess"
      :before-upload="beforeUpload"
    >
    </el-upload>
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
  ['image', 'video'],
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
      loading: false,
      myContent: this.content,
      editorOption: {
        placeholder: '请输入文档内容~',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
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
    beforeUpload() {
      this.loading = true
      return true
    },
    quillSuccess(res) {
      console.log(res)
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      // 获取光标所在位置
      let length = quill.getSelection().index
      // 插入图片  res.info为服务器返回的图片地址
      quill.insertEmbed(length, 'image', res)
      // 调整光标到最后
      quill.setSelection(length + 1)
      // loading动画消失
      this.loading = false
    },
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
.avatar-uploader {
  display: none;
}

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
