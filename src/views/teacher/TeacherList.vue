<template>
    <div>
        
    </div>
</template>
  
<script setup>
import { reactive, ref, provide } from "vue";
import major from "@/api/major";
import { Message as message } from 'element-ui';

//专业和班级的数据
const majorData = reactive({ data: [] });

//获取专业和班级数据
function getMajorData() {
    major.majorList().then(res => {
        majorData.data = res.data;
    });
}

//弹窗数据
//专业
const majorDS = reactive({
    statue: false,
    input: ''
})

//班级弹窗信息
const classDS = reactive({
    statue: false,
    data: {
        name: '',
        majorId: null,
        majorName: ''
    }
})


//修改班级信息弹窗
const classEdit = reactive({
    statue: false,
    id: null,
    data: {
        name: '',
        majorId: null,
        majorName: ''
    }
})


//修改专业信息弹窗
const majorEdit = reactive({
    statue: false,
    id: null,
    data: {
        name: '',
    }
})



//编辑专业或班级
function edit(row) {
    if (row?.majorId) {
        classEdit.id = row.id
        classEdit.data.name = row.name
        classEdit.data.majorId = row.majorId
        classEdit.data.majorName = row.majorName
        classEdit.statue = true
    }
    else {
        majorEdit.id = row.id
        majorEdit.data.name = row.name
        majorEdit.statue = true
    }
}
//修改班级名称
function editClass() {
    major.editClass(classEdit.id, classEdit.data).then(res => {
        classEdit.statue = false
        getMajorData()
    })
}
//编辑专业
function editMajor() {
    major.editMajor(majorEdit.id, majorEdit.data).then(res => {
        majorEdit.statue = false
        getMajorData()
    })
}

//添加专业
function addMajor() {
    major.addMajor(majorDS.input).then(res => {
        majorDS.statue = false
        getMajorData()
    }
    )
}



//添加班级
function addClass() {
    classDS.data.majorName = majorData.data.filter(e => e.id === classDS.data.majorId)[0].name
    major.addClass(classDS.data)
        .then(res => {
            getMajorData()
            classDS.statue = false
        })
}

//删除专业或班级
function del(row) {
    //通过majorId区分是班级还是专业
    if (row?.majorId) {
        major.delClass(row.id).then(res => {
            getMajorData();
        })
    }
    else {
        major.delMajor(row.id).then(res => {
            getMajorData();
        })
    }
}

//页面初始化事件
function init() {
    getMajorData();
}

init();
</script>
  
<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
}

.el-popconfirm__main {
    margin: 10px !important;
}

.el-popconfirm__action {
    margin-top: 10px !important;
    box-sizing: content-box;
    padding: 10px !important;
    background: #000 !important;
}
</style>