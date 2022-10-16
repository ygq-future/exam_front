<template>
    <el-dialog class="dialog" :visible="visible" :close-on-click-modal="false" :append-to-body="true" @close="close"
        @open="open">
        <template #title>
            <h3>富文本编辑器</h3>
        </template>
        <Quill :content.sync="opt.description">

        </Quill>
        <template #footer>
            <el-button round type="primary" @click="close">保存并关闭编辑器</el-button>
        </template>
    </el-dialog>
</template>
<script>
import Quill from './Quill.vue'
export default {
    name: 'QuillDialog',
    components: { Quill },
    props: ['visible', 'opt'],
    data: () => ({
        temp: ''
    }),
    methods: {
        open() {
            this.temp = this.opt.description
        },
        close() {
            if (this.temp === this.opt.description) {
                this.$emit('close')
            }
            else {
                this.$emit('close', this.opt)
            }

        }
    }
}
</script>
<style scope lang="scss">
.dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba($color: #000000, $alpha: .5);
    backdrop-filter: blur(10px);

    :deep(.el-dialog) {
        padding: 5px;
        width: 60vmin;
        transition: all .5s;
        box-shadow: 0 0 10px rgba($color: #fff, $alpha: .5);
    }

    :deep(.el-dialog__header) {
        h3 {
            margin: 0;
        }
    }

    :deep(.el-dialog__body) {
        padding: 0 10px;
    }
}
</style>