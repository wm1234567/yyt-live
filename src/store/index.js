import Vue from 'vue'
import Vuex from 'vuex' // vuex 全局状态管理

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        sqCodeFlg: true
    },
    mutations: {
        sqOut(state){
            state.sqCodeFlg = false;
        }
    }
})

export default store
