<template>
    <el-dialog title="选择题" :visible.sync="form.choice.visible" center>
        <el-table border style="width: 100%">
            <el-table-column label="选项" width="180">
            </el-table-column>
            <el-table-column label="标题" width="180">
            </el-table-column>
            <el-table-column label="是否设置为答案">
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="form.choice.visible = false">取 消</el-button>
            <el-button type="primary" @click="form.choice.visible = false">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    
</script>