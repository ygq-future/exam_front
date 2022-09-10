//表单处理工具文件

import question from "@/api/question";

//创建字母索引,并绑定到当前对象身上
export default {
  // 根据Id查找题目
  async queryById(id) {
    //获取资源
    const res = await question.queryByID(id);
    //获取答案索引
    //给查询到的答案加上勾
    for (let item of res.data.selects) {
      //标识编辑状态,默认全部为false
      item.edit = false;
    }
    //返回处理后的数据
    return res.data
  },

  createIndex(index, row) {
    row.itemId = String.fromCharCode(index + 65);
    return row.itemId;
  },

  
};
