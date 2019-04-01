import Vue from 'vue'
import App from './App.vue'

// 导入全局样式
import './assets/base.scss'

// 导入饿了么ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios'
// 设置基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
Vue.prototype.$axios = axios //设置到Vue原型上
// axios官网复制下来的拦截器代码, 拦截器也是钩子函数
axios.interceptors.request.use(function (config) {
  // 通过拦截器在发请求时统一设置请求头, 将token发给后台验证, 这样不必每次请求都手动添加
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config;
}, function (error) {
  // 错误的返回
  return Promise.reject(error);
});

// 响应拦截器, 会拦截每次响应的内容, 可在这里处理数据或添加一些操作
axios.interceptors.response.use(function (response) {
  // 这里无法通过this调用饿了么ui的弹框方法, 但是饿了么ui底层已经将方法添加到vue原型上, 可以通过原型调用
  // 原型调用注意饿了么ui一定要在调用之前导入, 通过状态码判断弹框内容
  // 如果响应的状态码中不包含200,201,204, 也就是失败的响应码
  if ([200,201,204].indexOf(response.data.meta.status) != -1) {
    Vue.prototype.$message.success(response.data.meta.msg)
  } else {
    Vue.prototype.$message.warning(response.data.meta.msg)
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

Vue.config.productionTip = false

// 导入路由
import router from './router.js'
new Vue({
  render: h => h(App),
  router //将路由挂载到vue实例上
}).$mount('#app')
