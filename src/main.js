import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'vue-ydui/dist/ydui.base.css'
import './common/css/index.scss'
// import 'vue-ydui/dist/ydui.rem.css';

Vue.config.productionTip = false




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

