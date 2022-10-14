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
  delete(id) {
    return http({
      method: 'delete',
      url: `/teacher/${id}`
    })
  }
}
