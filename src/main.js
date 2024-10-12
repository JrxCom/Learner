import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/font/font.css'

Vue.config.productionTip = false
// // 屏蔽错误信息
// Vue.config.errorHandler = () => { }
// // 屏蔽警告信息
// Vue.config.warnHandler = () => { }

Vue.use(ElementUI)
new Vue({
  router,//路由
  store,//VueX
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this	//安装全局事件总线
  }
}).$mount('#app')
