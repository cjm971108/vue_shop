// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://api.xiaomadagege.cn:8800/api/private/v1/'
Vue.config.productionTip = false
Vue.use(ZkTable)

// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 当进入request拦截器，表示请求已经结束了，我们就结束进度条
  NProgress.start()
  NProgress.set(0.4) // 设置百分比
  NProgress.inc() // 稍微增加
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  // 当进入response拦截器，表示请求已经结束了，我们就结束进度条
  NProgress.done()
  return config
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
