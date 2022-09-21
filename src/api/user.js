import http from '@/util/http'

export default {
  login(data) {
    return http({
      method: 'post',
      url: '/login',
      data
    })
  },
  logout() {
    return http({
      method: 'get',
      url: '/logout'
    })
  },
  teacherRegister(data) {
    return http({
      method: 'post',
      url: '/teacher',
      data
    })
  },
  userInfo() {
    return http({
      method: 'get',
      url: '/user/info'
    })
  },
  createToken() {
    return http({
      method: 'get',
      url: '/user/createToken'
    })
  }
}
