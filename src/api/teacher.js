import http from '@/util/http'
export default {
  getList(params) {
    return http({
      url: '/teacher',
      method: 'get',
      params
    })
  },
  lock(teacherId) {
    return http({
      method: 'patch',
      url: `/teacher/reverseLock/${teacherId}`
    })
  },
  byMe() {
    return http({
      method: 'get',
      url: '/teacher-major/byMe'
    })
  },
  applyAuth(majorId) {
    return http({
      method: 'post',
      url: `/teacher/applyAuthority/${majorId}`
    })
  }
}
