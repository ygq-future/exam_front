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
  push(data) {
    return http({
      method: 'post',
      url: '/major-exam',
      data
    })
  },
  cancelPush(examUnique) {
    return http({
      method: 'delete',
      url: '/major-exam/' + examUnique
    })
  },
  //获取已经推送至专业的试卷列表
  getPushedPaper(params = {}) {
    return http({
      method: 'get',
      url: '/major-exam',
      params
    })
  },
  //修改状态
  changePushedPaperStatus(data) {
    return http({
      method: 'patch',
      url: '/major-exam/' + data.id,
      data
    })
  },
  //获取所有待打分的主观题试卷
  findSubjectivePaper(params) {
    return http({
      method: 'get',
      url: '/exam-record',
      params
    })
  },
  //主观题给分
  scoringSubjective(data) {
    return http({
      method: 'patch',
      url: '/exam-record/subjective/' + data.id,
      data
    })
  }
}
