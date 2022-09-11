import http from '@/util/http'

export default {
  paperList(params) {
    return http({
      method: 'get',
      url: '/exam',
      params
    })
  },
  addExam(data) {
    return http({
      method: 'post',
      url: '/exam',
      data
    })
  },
  delExam(id) {
    return http({
      method: 'delete',
      url: '/exam/' + id
    })
  },
  getById(id) {
    return http({
      method: 'get',
      url: '/exam/' + id
    })
  },
  editExam(data) {
    return http({
      method: 'put',
      url: '/exam/' + data.id,
      data
    })
  },
  relateQues(data) {
    return http({
      method: 'post',
      url: '/exam-question',
      data
    })
  },
  cancelQues(data) {
    return http({
      method: 'delete',
      url: '/exam-question',
      data
    })
  },
  findPushed(examId) {
    return http({
      method: 'get',
      url: '/major-exam/pushed/' + examId
    })
  },
  push(data) {
    return http({
      method: 'post',
      url: '/major-exam',
      data
    })
  },
  cancelPush(data) {
    return http({
      method: 'delete',
      url: '/major-exam',
      data
    })
  }
}
