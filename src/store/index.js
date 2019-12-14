import Vue from 'vue'
import Vuex from 'vuex' // vuex 全局状态管理

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        sqCode: false,
    },
    mutations: {
        getCode(state) {
            state.sqCode = true;
        },
        // this.$store.commit('yescode')
        // this.$store.commit('changecode',{code:'哈哈'})
        // console.log(this.$store.state.sqCode)
    }
})

export default store