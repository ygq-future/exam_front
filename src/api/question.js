import http from '@/util/http'

export default {
  getList(params) {
    return http({
      url: '/question',
      method: 'get',
      params
    })
  },
  //获取类型
  getType() {
    return http.get('/question-type')
  },
  //根据ID查询
  queryByID: id =>
    http({
      url: `/question/${id}`
    }),
  //修改选择题选项
  editQuestion(id, data) {
    return http({
      url: `select-question/${id}`,
      method: 'patch',
      data
    })
  },
  //删除选项
  delQuestion(id) {
    return http({
      url: `select-question/${id}`,
      method: 'delete'
    })
  },
  //添加选择性
  addQuestion(data) {
    return http({
      url: '/select-question',
      method: 'post',
      data
    })
  },
  changeQuestion(data) {
    console.log(data)
    return http({
      url: `question/${data.id}`,
      method: 'put',
      data
    })
  },
  //批量导入题目到试卷
  batchImport(data) {
    return http({
      method: 'post',
      url: '/question/batchImport',
      data
    })
  }
}
