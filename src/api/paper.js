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
      url: '/examination',
      data
    })
  },
  delExamination(id) {
    return http({
      method: 'delete',
      url: `/examination/${id}`
    })
  },
  //获取已经推送至专业的试卷列表
  getPushedPaper(params = {}) {
    return http({
      method: 'get',
      url: '/examination',
      params
    })
  },
  subjectiveList() {
    return http({
      method: 'get',
      url: '/examination/subjective'
    })
  },
  //修改状态
  changePushedPaperStatus(id, status) {
    return http({
      method: 'patch',
      url: `/examination/${id}/${status}`
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
  },
  //设置阅卷人
  setExaminer(data) {
    return http({
      method: 'put',
      url: '/examination/' + data.id,
      data
    })
  }
}
