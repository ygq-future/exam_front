import http from '@/util/http'

export default {
  roles() {
    return http({
      method: 'get',
      url: '/role'
    })
  },
  auths() {
    return http({
      method: 'get',
      url: '/authority'
    })
  },
  addAuth(data) {
    return http({
      method: 'post',
      url: '/role-authority',
      data
    })
  },
  cancelAuth(data) {
    return http({
      method: 'delete',
      url: '/role-authority',
      data
    })
  },
  refreshAuth() {
    return http({
      method: 'post',
      url: '/authority/refreshUri'
    })
  },
  accounts() {
    return http({
      method: 'get',
      url: '/user/accounts'
    })
  },
  offline(login) {
    return http({
      method: 'post',
      url: '/admin/offline/' + login
    })
  },
  applyList() {
    return http({
      method: "get",
      url: "/teacher-major"
    })
  },
  reverseStatus(id) {
    return http({
      method: "patch",
      url: "/teacher-major/reverseStatus/" + id
    })
  }
}
