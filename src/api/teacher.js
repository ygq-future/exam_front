import http from '@/util/http'
export default {
  getList(data) {
    return http({
      url: '/teacher',
      data
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
