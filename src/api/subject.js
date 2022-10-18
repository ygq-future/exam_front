import http from '@/util/http'

export default {
  add(data) {
    return http({
      method: 'post',
      url: `/subject`,
      data
    })
  },
  edit(data) {
    return http({
      method: 'put',
      url: `/subject/${data.id}`,
      data
    })
  },
  remove(id) {
    return http({
      method: 'delete',
      url: `/subject/${id}`
    })
  },
  subjectList(majorId) {
    return http({
      method: 'get',
      url: `/subject?majorId=${majorId}`
    })
  }
}
