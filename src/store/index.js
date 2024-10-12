import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* 配置vuex数据 */
export default new Vuex.Store({
  state: {
    github: 'https://github.com/JrxCom/Learner/tree/Learner_WEB',
    stack: {
      front_end: 'Vue.js',
      back_end: 'less',
      preprocessor: 'node.js'
    },
  },
})
