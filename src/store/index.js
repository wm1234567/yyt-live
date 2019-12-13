import Vue from 'vue'
import Vuex from 'vuex' // vuex 全局状态管理

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        sqCode: false,
        tel: true
    },
    mutations: {
        getCode(state){
            state.sqCode = true;
        },
        noTel(state){
            state.tel = false;
        },
        yesTel(state){
            state.tel = true;
        },
    }
})

export default store
