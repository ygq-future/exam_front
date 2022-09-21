import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

Vue.prototype.$baseUrl = 'http://localhost:80'
// Vue.prototype.$baseUrl = 'https://47.101.63.12/exam_api'

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(VueCookies)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
