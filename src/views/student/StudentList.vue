<template>
    <div>
        <el-container>
            <el-header>
                <!--两个选项框 -->
                <el-select v-model="params.majorId" placeholder="请选择" filterable clearable>
                    <el-option v-for="item in majorData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>

                <el-select v-model="params.clazzId" placeholder="请选择" filterable clearable>
                    <el-option v-for="item in children" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-header>

            <!-- 页面表格区域 -->
            <el-main>
                <!-- <template>
                    <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
                        <el-table-column prop="date" label="日期" width="180">
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" width="180">
                        </el-table-column>
                        <el-table-column prop="address" label="地址">
                        </el-table-column>
                    </el-table>
                </template> -->
            </el-main>

            <!-- 页脚分页区域 -->
            <el-footer>
                <el-pagination background layout="prev, pager, next" :total="tableData.total">
                </el-pagination>
            </el-footer>
        </el-container>


        <el-button @click="getStudent">demo</el-button>
    </div>

</template>
<script>
import student from '@/api/student';
import major from '@/api/major';
export default {
    data: () => ({
        majorData: [],
        tableData: {
            total: 1,
            studentList:[],
        },
        //查询学生参数数据
        params:{
            current:1,
            size:10,
            majorId:'',
            clazzId:''
        }
    }),
    computed: {
        // 班级菜单
        children() {
            //如果专业ID为空,那么直接返回空
            if (this.params.majorId === '') return []
            //如果专业 ID 不为空则返回对应的数据
            return this.majorData.filter(e => e.id === this.params.majorId)[0].children
        }
    },
    methods: {
        query() {
            console.log(this.majorData);
        },
        //获取专业和班级信息
        getMajorData() {
            major.majorList().then(res => {
                //当页面还没有数据的时候会执行一次init
                if (this.majorData.length == 0) this.init(res.data)
                this.majorData = res.data;

            });
        },
        //初始化事件,页面第一次获取完数据后触发
        init(res) {
            this.params.majorId = res[0].id
            //初始化后获取学生信息(默认获取第一个专业的所有学生信息)
        },
        //获取学生信息
        getStudent(){
            //验证参数
            const params = {...this.params}
            if(this.params.clazzId === "") console.log(1234);
            // student.getList()
        }
    },
    created() {
        //初始化数据
        this.getMajorData()
    }
}
</script>