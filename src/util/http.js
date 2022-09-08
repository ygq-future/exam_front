import axios from 'axios'
import router from '@/router'
import cookies from 'vue-cookies'
import { Message } from 'element-ui'
import store from '@/store'

const retryCount = 2
let count = 0
let timer = 0

const service = axios.create({
  timeout: 12000,
  baseURL: '/api'
})

service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf8'
  config.headers['X-XSRF-TOKEN'] = cookies.get('XSRF-TOKEN')
  return config
})

service.interceptors.response.use(res => {
  let data = res.data
  let code = data.code

  if (code >= 200 && code < 300) {
    count = 0
    return Promise.resolve(data)
  }

  //没有X-XSRF-TOKEN
  if (code === 402 && count <= retryCount) {
    count++
    //获取当前请求重新发起
    return service(res.config).then(res => res)
  }

  if (code === 401) {
    //节流, 防止多次401请求
    clearTimeout(timer)
    timer = setTimeout(() => {
      Message({
        type: 'warning',
        message: '请先登录!'
      })
      store.commit('userCommit', null)
      cookies.remove('user')
      router.replace('/login')
      timer = 0
    }, 500)
    return Promise.reject(data)
  }

  if(code === 403) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      Message({
        type: 'warning',
        message: '没有权限!'
      })
      router.back()
      timer = 0
    }, 500)
    return Promise.reject(data)
  }

  Message({
    type: 'warning',
    message: data.message
  })
  return Promise.reject(data)
})

export default service
