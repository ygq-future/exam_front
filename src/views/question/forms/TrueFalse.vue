<template>
    <div>
        <el-radio-group class="group" v-model="answer" @change="change">
            <el-radio-button label="1">
                <i class="el-icon-check"></i>
                正确
            </el-radio-button>
            <el-radio-button label="0">
                <i class="el-icon-close"></i>
                错误
            </el-radio-button>
        </el-radio-group>
    </div>
</template>
<script>
export default {
    name: 'TrueFalse',
    props: ['content'],
    data: () => ({
        answer: null
    }),
    methods: {
        change(val) {
            this.$emit('update:content', val)
        }
    },
    mounted() {
        this.answer = this.content
    }
}
</script>
<style scoped lang="scss">
.group {
    display: flex;
    justify-content: center;
}
</style>