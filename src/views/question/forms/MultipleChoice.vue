<template>
    <div>
        <div class="options">
            <slot></slot>
            <div>
                <el-button round plain type="primary" @click="addOption">添加选项 <i class="el-icon-plus el-icon--right" />
                </el-button>
            </div>
        </div>
        <el-form class="form">
            <el-checkbox-group v-model="answer" v-for="(option,index) in selects" class="selects" :key="option.id"
                @change="clickOption">
                <el-input v-model="option.description" :disabled="option.disabled"
                    :placeholder="option.placeholder || '请输入选项描述'"></el-input>
                <el-checkbox :label="option.id ? option.id +'' : createIndex(option,index)" border>{{option.itemId}}
                </el-checkbox>
                <el-button @click="richTextEdit(option)">富文本编辑</el-button>
                <el-button @click="editOption(option)"> {{option.disabled?'修改选项':'保存'}}<i
                        class="el-icon-edit-outline el-icon--right" />
                </el-button>
                <el-popconfirm @confirm="delOption(option,index)" title="确认要删除这个选项吗?" confirm-button-type="danger"
                    cancel-button-type="info">
                    <el-button slot="reference" type="danger">删除<i class="el-icon-delete el-icon--right" />
                    </el-button>
                </el-popconfirm>
            </el-checkbox-group>
        </el-form>
        <QuillDialog :visible="richTextStatus" @close="richTextClose" :opt="currentOpt" />
    </div>
</template>
<script>
import QuillDialog from '@/components/QuillDialog.vue'
import Futils from "@/util/formUtils";
import question from '@/api/question'
export default {
    name: 'MultipleChoice',
    props: ['selects', 'content', 'questionId'],
    data: () => ({
        answer: [],
        timer: null,
        richTextStatus: false,
        currentOpt: {}
    }),
    components: { QuillDialog },
    methods: {
        changeValue() {
            this.$emit('update:selects',)
        },
        async delOption(option, index) {
            //判断选项是否已经包含id,如果没有包含id,则直接从数组内删除,如果包含id则表示在数据库中,则调用方法
            //id不存在的情况
            if (!option.id) {
                this.selects.splice(index, 1)
                return
            }
            await question.delQuestion(option.id)
            this.$emit('update')
        },
        splitAnswer() {
            // 逗号分割将答案取出
            this.answer = this.content.split(',')
        },
        clickOption(val) {
            //检测是否有未提交的选项,有的话将会提示,并不提交答案
            if (!this.questionId) {
                this.$emit('update:content', val.toString())
                return
            }
            let flag = val.some(e => isNaN(parseInt(e)))
            if (flag) {
                this.$message('有未提交的选项,暂时不可将它设置为答案')
                return
            }
            this.$emit('update:content', val.toString())
        },
        createIndex(option, index) {
            option.itemId = String.fromCharCode(index + 65)
            return option.itemId
        },
        //编辑选项
        editOption(option) {
            //因为有两重逻辑,这一行有可能是新增的,也有可能是已经存在的
            option.disabled = !option.disabled
            Futils.saveOptionChange(this.timer, this.questionId, option, () => {
                this.$emit('update')
            })

        },
        addOption() {
            Futils.addOption(this.timer, this.selects)

        },

        richTextEdit(option) {
            //富文本编辑器
            this.currentOpt = option
            this.richTextStatus = true
        },
        richTextClose(option) {
            if (option) {
                Futils.saveOptionChange(this.timer, this.questionId, option, () => {
                    this.$emit("update");
                })
            }
            this.richTextStatus = false
        }
    },


    mounted() {
        this.splitAnswer()
    }
}
</script>
<style scoped lang="scss">
.selects {
    width: 100%;

    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 15px;
}

.options {
    margin-bottom: 15px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.selects,
.options {
    .el-button {
        margin: 0;
    }
}

.form {
    height: 20vh;
    overflow-y: auto;
}
</style>