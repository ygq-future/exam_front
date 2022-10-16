<template>
    <el-dialog class="question-edit-form" :visible="visible" @close="close" @open="initForm"
        :close-on-click-modal="false" :show-close="false" :fullscreen="option.isFull">
        <!-- 顶部操作栏 -->
        <template #title>
            <div class="head-options">
                <div class="head-options-left">
                    <h3>题目类型:</h3>
                    <el-select placeholder="请选择题目类型" v-model='questionData.typeId' @change="changeSelect">
                        <el-option v-for="item in questionType" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
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
                        <el-input-number v-model="questionData.score" :min="1" :max="100" label="分数信息">
                        </el-input-number>
                    </div>
                </div>
                <Quill :content.sync="questionData.title"> </Quill>
            </el-skeleton>
            <!-- 使用动态组件动态的切换表单 -->
            <el-skeleton :rows="6" animated :loading="option.loading" />
            <component :is="currentComponent" :content.sync="questionData.answer"
                :selects.sync="questionData.selectQuestions" @update="initForm">
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
import Futil from '@/util/formUtils'
import { toRaw } from 'vue'
export default {
    name: 'AddQuestion',
    props: ['visible'],
    components: { Quill, MultipleChoice, TrueFalse, SingleChoice },
    data: () => ({
        option: {
            isFull: false,
            loading: true,

        },
        questionData: {
            typeId: null,
            typeName: '',
            title: '',
            score: 1,
            answer: 'A',
            selectQuestions: []
        },
        timer: null,
        questionType: []
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
            try {
                const res = await question.getType()
                if (res.code === 200) {
                    this.questionType = res.data
                    this.option.loading = false
                } else {
                    new Error('请求错误,请重试')
                }
            } catch (e) {
                this.$message.danger(e)
            }
        },

        isFullscreen() {
            //是否全屏
            this.option.isFull = !this.option.isFull
        },
        close() {
            this.option.loading = true
            this.$emit('close')
        },
        changeDescribe(content) {
            //修改题目描述  
            this.questionData.title = content
        },
        async saveChange() {
            if (this.questionData.title == '' || this.questionData.answer == '') {
                this.$message.warning('题目和答案不能为空!!!')
                return
            }
            const delSelect = [1, 2]
            const flag = delSelect.some(e => e === this.questionData.typeId)
            const params = { ...this.questionData }
            if (flag && this.questionData.selectQuestions.length == 0) {
                this.$message.warning('选项不能为空!!!')
                return
            }
            if (!flag) {
                delete params.selectQuestions
            }
            const res = await question.add(params)
            if (res.code === 200) {
                this.$message({
                    message: '添加成功!',
                    type: 'success'
                })
                this.cleanForm()
                this.close()
            }
        },
        changeSelect(val) {
            const res = this.questionType.find(e => e.id === val)
            this.questionData.typeName = res.name
        },
        cleanForm() {
            this.questionData = {
                typeId: null,
                typeName: '',
                title: '',
                score: 1,
                answer: 'A',
                selectQuestions: []
            }
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