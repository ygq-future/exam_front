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
            <el-radio-group v-for="(option,index) in selects" class="form-item" :key="option.id" v-model="answer"
                @change="change">
                <el-input v-model="option.description" :disabled="option.disabled"
                    :placeholder="option.placeholder || '请输入选项描述'"></el-input>
                    <!-- 判断选项的Id是否存在,如果存在返回id(转为字符串),如果不存在则创建索引,并作为label -->
                <el-radio border :label="option.id ?  option.id+'' : Futils.createIndex(option,index)">{{option.itemId}}
                </el-radio>
                <el-button @click="richTextEdit(option)">富文本编辑</el-button>
                <el-button @click="editOption(option)"> {{option.disabled?'修改选项':'保存'}}<i
                        class="el-icon-edit-outline el-icon--right" />
                </el-button>
                <el-popconfirm @confirm="delOption(option,index)" title="确认要删除这个选项吗?" confirm-button-type="danger"
                    cancel-button-type="info">
                    <el-button slot="reference" type="danger">删除<i class="el-icon-delete el-icon--right" />
                    </el-button>
                </el-popconfirm>
            </el-radio-group>
        </el-form>
        <QuillDialog :visible="richTextStatus" @close="richTextClose" :opt="currentOpt" />
    </div>
</template>
<script>
import Futils from '@/util/formUtils'
import QuillDialog from '@/components/QuillDialog.vue'
import question from '@/api/question'
export default {
    name: 'SingleChoice',
    props: ['selects', 'content', 'questionId'],
    components: { QuillDialog },
    data: () => ({
        answer: null,
        timer: null,
        richTextStatus: false,
        currentOpt: {}
    }),

    computed: {
        Futils() {
            return Futils
        }
    },
    mounted() {
        this.answer = this.content
    },
    methods: {
        editOption(option) {
            //因为有两重逻辑,这一行有可能是新增的,也有可能是已经存在的
            option.disabled = !option.disabled
            Futils.saveOptionChange(this.timer, this.questionId, option, () => {
                this.$emit("update");
            })
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
        change(val) {
            this.$emit('update:content', val)
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
        },
        addOption() {
            Futils.addOption(this.timer, this.selects)
        }
    }
}
</script>
<style scoped lang='scss'>
.form {
    display: flex;
    flex-direction: column;
}

.form-item {
    .el-radio {
        margin: 0;
    }

    .el-button {
        margin: 0;
    }

    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.options {
    margin-bottom: 15px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .el-button {
        margin: 0;
    }
}
</style>