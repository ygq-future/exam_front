import http from '@/util/http'

export default {
  getList(params) {
    return http({
      method: 'get',
      url: '/student',
      params
    })
  },
  lock(studentId) {
    return http({
      method: 'patch',
      url: `/student/reverseLock/${studentId}`
    })
  },
  batchImport(formData) {
    return http({
      method: 'post',
      url: `/student/batchImport`,
      data: formData
    })
  },
  downloadUri(token) {
    return `/student/downloadExcel/${token}`
  },
  delete(id) {
    return http({
      method: 'delete',
      url: `/student/${id}`
    })
  }
}
