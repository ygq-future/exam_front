<template>
    <el-dialog class="question-edit-form" :visible="visible" @close="close" @open="initForm"
        :close-on-click-modal="false" :show-close="false" :fullscreen="option.isFull">
        <!-- 顶部操作栏 -->
        <template #title>
            <div class="head-options">
                <div class="head-options-left">
                    <h3>题目类型:{{questionData.typeName}}</h3>
                </div>
                <div class="head-options-right">
                    <el-button icon="el-icon-full-screen" circle @click="isFullscreen"
                        :type="option.isFull ? 'success' : null"></el-button>
                    <el-button icon="el-icon-close" circle @click="close"></el-button>
                </div>
            </div>
        </template>

        <div class="main">
            <!-- 题目描述 -->
            <el-skeleton :rows="6" animated :loading="option.loading">
                <div class="question-option">
                    <h3>题目描述:</h3>
                    <div class="right">
                        <h3>分数:</h3>
                        <el-input-number v-model="questionData.score" :min="1" :max="100" label="描述文字">
                        </el-input-number>
                    </div>
                </div>
                <Quill :content.sync="questionData.title"> </Quill>
            </el-skeleton>
            <!-- 使用动态组件动态的切换表单 -->
            <el-skeleton :rows="6" animated :loading="option.loading" />
            <component :is="currentComponent" :content.sync="questionData.answer" :selects.sync="questionData.selects"
                :question-id="questionId" @update="initForm">
                <h3>答案/选项编辑:</h3>
            </component>
        </div>
        <template #footer>
            <el-button round @click="close">取消修改</el-button>
            <el-button round type="primary" @click="saveChange">保存修改</el-button>
        </template>
    </el-dialog>

</template>
<script>
// 引入不同的表单,进行切换
import Quill from '../../components/Quill.vue'
import question from '@/api/question'
import MultipleChoice from './forms/MultipleChoice.vue'
import TrueFalse from './forms/TrueFalse.vue'
import SingleChoice from './forms/SingleChoice.vue'
import { toRaw } from 'vue'
export default {
    name: 'QuestionEditForm',
    props: ['visible', 'questionId'],
    components: { Quill, MultipleChoice, TrueFalse, SingleChoice },
    data: () => ({
        option: {
            isFull: false,
            loading: true,

        },
        questionData: {},
        timer: null
    }),
    computed: {
        // 动态选择表单
        currentComponent() {
            switch (this.questionData.typeId) {
                case 1:
                    return SingleChoice
                    //单选题
                    break
                case 2:
                    //多选题
                    return toRaw(MultipleChoice)
                    break
                case 3:
                case 5:
                    // 填空题和填空题
                    return toRaw(Quill)
                    break
                case 4:
                    return TrueFalse
                    // 判断题
                    break
            }
            return null
        },
    },

    methods: {
        //初始化表单,请求数据
        async initForm() {
            if (this.questionId) {
                const res = await question.queryByID(this.questionId)
                if (res.code === 200) {
                    if (res.data.selects) {
                        res.data.selects.forEach(item => {
                            //默认将所有输入框禁用
                            item.disabled = true
                        });
                    }
                    this.option.loading = false
                    this.questionData = res.data
                }
            }

        },

        isFullscreen() {
            //是否全屏
            this.option.isFull = !this.option.isFull
        },
        close() {
            this.questionData = {}
            this.$emit('close', this.option.isCache)
            this.option.loading = true
        },
        changeDescribe(content) {
            //修改题目描述  
            this.questionData.title = content
        },
        saveChange() {
            clearTimeout(this.timer)
            this.timer = setTimeout(async () => {
                try {
                    const res = await question.changeQuestion(this.questionData.id, {
                        title: this.questionData.title,
                        score: this.questionData.score,
                        answer: this.questionData.answer
                    })
                    if (res.code === 200) {
                        this.close()
                        this.$emit('update')
                    }
                } catch (e) {
                    this.$message.warning('发生错误,请重新保存')
                }


            }, 200)


        }
    }
}
</script>
<style scoped lang="scss">
.head-options {
    display: flex;
    justify-content: space-between;
}

.el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.question-edit-form {
    :deep(.el-dialog) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        max-width: 80vw;
        // max-height: 80vh;
        padding: 10px;
        transition: all .5s;

    }

    :deep(.el-dialog__header) {
        padding: 10px 20px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin: 5px 0;
    }

    :deep(.el-dialog__body) {
        padding-top: 0px;
        flex: 1;
        min-height: 400px;
        display: flex;
        flex-direction: column;
    }

    :deep(.el-dialog__footer) {
        padding: 10px 20px;
    }

    :deep(.el-skeleton) {
        margin: 10px 0;
    }
}

:deep(.question-option) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .right {
        display: flex;
        gap: 10px;
    }
}
</style>