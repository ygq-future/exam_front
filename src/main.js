import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookies from 'vue-cookies'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

Vue.prototype.$baseUrl = 'http://localhost:80'
// Vue.prototype.$baseUrl = 'http://10.20.35.159/exam_api'

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(VueQuillEditor /* { default global options } */)
Vue.use(VueCookies)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
