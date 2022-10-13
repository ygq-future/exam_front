import http from '@/util/http'

export default {
  finishedPaperList() {
    return http({
      method: 'get',
      url: '/statistics/finishedPaper'
    })
  },
  scoreList(params = {}) {
    return http({
      method: 'get',
      url: '/statistics/score',
      params
    })
  },
  scoreToExcel(examUnique) {
    return http({
      method: 'get',
      url: `/statistics/scoreToExcel/${examUnique}`
    })
  }
}
