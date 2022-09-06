import axios from 'axios'
import router from '@/router'

const service = axios.create({
  timeout: 12000,
  baseURL: "/api"
})

service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf8'
  // config.headers["X-XSRF-TOKEN"] = cookie.getCookie("XSRF_TOKEN")
  return config
})

service.interceptors.response.use(res => {
  let data = res.data
  let code = data.code

  if (code >= 200 && code < 300) {
    return Promise.resolve(data)
  }

  if (code === 401) {
    message.warning('请先登录!')
    router.replace('/login')
    return Promise.reject(data)
  }

  message.warning(data.message)
  return Promise.reject
})

export default service
