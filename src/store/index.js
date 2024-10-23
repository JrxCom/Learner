import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* 配置vuex数据 */
export default new Vuex.Store({
  state: {
    github: 'https://github.com/JrxCom/Learner/tree/main',
    stack: {
      front_end: 'Vue.js',
      preprocessor: 'Less',
      ui:'Element-ui',
      back_end: 'Node.js',
    },
  },
})
