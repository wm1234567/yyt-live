import Vue from 'vue'
import App from './App'
import VueVideoPlayer from 'vue-video-player';
import store from './store'; // 导入 vuex 全局状态管理
import onfire from 'onfire.js';//全局通知 用于下级页面携参传值到上级页面

Vue.prototype.$store = store;
Vue.use(VueVideoPlayer);
Vue.config.productionTip = false;
Vue.prototype.$fire = new onfire();
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()