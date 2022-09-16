import http from '@/util/http'

export default {
  majorList() {
    return http({
      method: 'get',
      url: '/major'
    })
  },
  addMajor(data) {
    return http({
      method: 'post',
      url: '/major',
      data
    })
  },
  addClass(data) {
    return http({
      method: 'post',
      url: '/clazz',
      data
    })
  },
  delMajor(id) {
    return http({
      method: 'delete',
      url: `/major/${id}`
    })
  },
  delClass(id) {
    return http({
      method: 'delete',
      url: `/clazz/${id}`
    })
  },
  editClass(data) {
    return http({
      method: 'patch',
      url: `/clazz/${data.id}`,
      data
    })
  },
  editMajor(data) {
    return http({
      method: 'put',
      url: `/major/${data.id}`,
      data
    })
  },
  collegeList() {
    return http({
      method: 'get',
      url: `/college`
    })
  },
  delCollege(id) {
    return http({
      method: 'delete',
      url: `/college/${id}`
    })
  },
  editCollege(data) {
    return http({
      method: 'put',
      url: `/college/${data.id}`,
      data
    })
  },
  addCollege(data) {
    return http({
      method: 'post',
      url: `/college`,
      data
    })
  }
}
