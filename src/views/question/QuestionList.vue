<template>
    <el-container>
        <el-header>
            <el-row :gutter="10">
                <el-col :span="5">
                    <!-- 题目类型选择器 -->
                    <el-select v-model='page.typeId' placeholder="请选择题目类型">
                        <el-option v-for="item in questionType" :key="item.id" :label="item.name" :value="item.id">

                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button>添加题目</el-button>
                </el-col>

                <el-col :span="8">
                    <el-input v-model="page.keyword" placeholder="根据关键字查询"></el-input>
                </el-col>



            </el-row>
        </el-header>
        <!-- 题目表格区域 -->
        <el-main>
            <!-- TODO: 目前正在做的功能 题库管理 -->
            <!-- 需求:
                -- 查询所有题目类型,根据题目类型查询题目
                -- 根据指定参数查询题目
                    -- 
            -->
            <el-table :data="dataList" border>
                <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                <el-table-column prop="typeName" label="题目类型" width="100" align="center"></el-table-column>
                <el-table-column prop="title" label="题目标题"></el-table-column>
                <el-table-column prop="answer" label="答案"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" @click="chooseTheForm(scope.row)">修改题目</el-button>
                        <el-button size="small" type="danger">删除题目</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
import question from '@/api/question';

export default {
    data: () => ({
        dataList: [],
        page: {
            current: 1,
            size: 5,
            typeId: 1,
            sortByDate: 1,
            sortType: "desc",
            keyword: "",
        },
        //题目类型
        questionType: [],
        //表单数据
        form: {
            //单选题
            choice: {
                visible: true,
                data: {}
            },
            //多选题
            mcq: {
                visible: false,
            },
            //填空题
            fillTheBlanks: {
                visible: false,
            },
            //简答题
            saq: {
                visible: false,
            },
            data: {}
        },
    }),
    methods: {
        //获取题目列表
        async getDataList() {
            //数据校验,防止传递空值
            const params = { ...this.page };
            for (let item in params) {
                if (params[item] === "" || params[item] === null || params[item] === undefined)
                    delete params[item];
            }
            //调用接口
            const res = await question.getList({ ...params });
            //设置数据
            this.dataList = res.data.rows;
        },

        // 获取全部题目类型
        async getType() {
            const res = await question.getType();
            this.questionType = res.data;
        },
        //根据Id查询题目
        async queryById(id, dataOrgin) {
            const res = await question.queryByID(id)
            dataOrgin = res.data
        },

        //选择打开哪个表单
        async chooseTheForm(data) {
            //点击的时候就会将题目的相关信息获取,之后判断打开哪个表单
            this.queryById(data.id)
            switch (data.typeId) {
                //
                case 1:
                    this.form.choice.visible = true
                    break;
                //多选题
                case 2:
                    console.log(123);
                    break;
                //填空题
                case 3:
                    console.log(123);
                    break;
            }
        },
    },
    created() {
        this.getType();
        this.getDataList();
    },
}
</script>